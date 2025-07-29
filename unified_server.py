#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一服务器 - 集成所有服务到单一端口
包含：主要Web服务器、静态文件服务器、局域网审计服务器
"""

from flask import Flask, request, jsonify, send_from_directory, send_file
import os
import uuid
import json
import logging
import time
import socket
import threading
import sqlite3
import hashlib
import zipfile
import tempfile
from datetime import datetime
from werkzeug.exceptions import RequestEntityTooLarge

try:
    from flask_cors import CORS
except ImportError:
    print("无法导入 flask_cors 库，请确保已使用 'pip install flask-cors' 安装该库。")
    raise

# 创建Flask应用
app = Flask(__name__, static_folder='assets', static_url_path='/assets')

# 配置应用
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # 1年缓存

# 配置日志记录
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

# 启用CORS
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "OPTIONS"], "allow_headers": "*", "supports_credentials": True}})

# 局域网审计配置
LAN_PORT = 5000  # 统一端口
BROADCAST_PORT = 5002
AUDIT_DB = 'audit_operations.db'
FILE_SYNC_DIR = 'lan_sync_files'
OPERATION_LOG_FILE = 'operation_logs.json'

# 确保目录存在
os.makedirs(FILE_SYNC_DIR, exist_ok=True)

class LANAuditServer:
    def __init__(self):
        self.node_id = str(uuid.uuid4())
        self.node_name = socket.gethostname()
        self.discovered_nodes = {}
        self.init_database()
        self.start_discovery_service()
    
    def init_database(self):
        """初始化审核操作数据库"""
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        # 创建操作记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_operations (
                id TEXT PRIMARY KEY,
                node_id TEXT NOT NULL,
                node_name TEXT NOT NULL,
                operation_type TEXT NOT NULL,
                file_id TEXT,
                file_name TEXT,
                operation_data TEXT,
                timestamp REAL NOT NULL,
                sync_status TEXT DEFAULT 'pending'
            )
        ''')
        
        # 创建文件同步记录表
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS file_sync_records (
                id TEXT PRIMARY KEY,
                file_id TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_hash TEXT NOT NULL,
                source_node TEXT NOT NULL,
                sync_timestamp REAL NOT NULL,
                file_path TEXT NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def start_discovery_service(self):
        """启动局域网节点发现服务"""
        def broadcast_presence():
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            
            while True:
                try:
                    message = json.dumps({
                        'node_id': self.node_id,
                        'node_name': self.node_name,
                        'service_port': LAN_PORT,
                        'timestamp': time.time()
                    })
                    sock.sendto(message.encode(), ('<broadcast>', BROADCAST_PORT))
                    time.sleep(30)  # 每30秒广播一次
                except Exception as e:
                    print(f"广播错误: {e}")
                    time.sleep(5)
        
        def listen_for_nodes():
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            try:
                sock.bind(('', BROADCAST_PORT))
            except OSError:
                print("广播端口已被占用，跳过节点发现功能")
                return
            
            while True:
                try:
                    data, addr = sock.recvfrom(1024)
                    node_info = json.loads(data.decode())
                    
                    if node_info['node_id'] != self.node_id:
                        self.discovered_nodes[node_info['node_id']] = {
                            'name': node_info['node_name'],
                            'ip': addr[0],
                            'port': node_info['service_port'],
                            'last_seen': time.time()
                        }
                except Exception as e:
                    print(f"节点发现错误: {e}")
        
        # 启动广播和监听线程
        threading.Thread(target=broadcast_presence, daemon=True).start()
        threading.Thread(target=listen_for_nodes, daemon=True).start()
    
    def log_operation(self, operation_type, file_id=None, file_name=None, operation_data=None):
        """记录审核操作"""
        operation_id = str(uuid.uuid4())
        timestamp = time.time()
        
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO audit_operations 
            (id, node_id, node_name, operation_type, file_id, file_name, operation_data, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (operation_id, self.node_id, self.node_name, operation_type, 
              file_id, file_name, json.dumps(operation_data) if operation_data else None, timestamp))
        
        conn.commit()
        conn.close()
        
        return operation_id

# 创建局域网审计服务器实例
lan_server = LANAuditServer()

# 配置上传文件夹
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'python', 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传文件夹存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 添加请求日志中间件
@app.before_request
def log_request_info():
    app.logger.info('Request: %s %s', request.method, request.url)
    if request.method == 'POST':
        if 'multipart/form-data' in str(request.content_type):
            app.logger.info(f'Form Data Keys: {list(request.files.keys())}')

# ==================== 静态文件服务 ====================

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/<path:filename>')
def serve_static_files(filename):
    """提供静态文件服务"""
    try:
        # 首先尝试从根目录提供文件
        if os.path.exists(os.path.join(os.getcwd(), filename)):
            return send_from_directory(os.getcwd(), filename)
        # 如果不存在，返回404
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        app.logger.error(f'静态文件服务错误: {str(e)}')
        return jsonify({'error': 'Server error'}), 500

# ==================== 主要Web服务器功能 ====================

def allowed_file(filename):
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def get_file_type(filename):
    filename_parts = filename.rsplit('.', 1)
    if len(filename_parts) > 1:
        ext = filename_parts[1].lower()
    else:
        ext = ''
    if ext in ['pdf']: return 'pdf'
    if ext in ['xls', 'xlsx']: return 'excel'
    if ext in ['doc', 'docx']: return 'word'
    if ext in ['jpg', 'jpeg', 'png', 'gif']: return 'image'
    return 'other'

@app.route('/upload', methods=['POST'])
def upload_file():
    """文件上传接口"""
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': '没有文件部分'}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    
    # 加载文件名映射
    mapping_file = os.path.join(app.config['UPLOAD_FOLDER'], 'filename_mapping.json')
    try:
        with open(mapping_file, 'r', encoding='utf-8') as f:
            filename_mapping = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        filename_mapping = {}
    
    for file in files:
        if file.filename == '':
            continue
        if file and allowed_file(file.filename):
            # 生成唯一文件名
            filename_parts = file.filename.rsplit('.', 1) if file.filename else ['']
            if len(filename_parts) > 1:
                ext = filename_parts[1].lower()
                unique_filename = str(uuid.uuid4()) + '.' + ext
            else:
                unique_filename = str(uuid.uuid4())
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            try:
                file.save(filepath)
                
                # 更新文件名映射
                filename_mapping[unique_filename] = file.filename
                
                # 记录审计操作
                lan_server.log_operation('file_upload', unique_filename, file.filename, {
                    'file_size': os.path.getsize(filepath),
                    'upload_time': time.time()
                })
                
                # 获取文件信息
                file_info = {
                    'id': unique_filename.split('.')[0],
                    'name': file.filename,
                    'type': get_file_type(file.filename),
                    'size': os.path.getsize(filepath),
                    'date': os.path.getctime(filepath),
                    'url': f'/download/{unique_filename}',
                    'unique_filename': unique_filename
                }
                uploaded_files.append(file_info)
            except Exception as e:
                return jsonify({'success': False, 'error': f'文件保存失败: {str(e)}'}), 500
    
    # 保存更新后的文件名映射
    try:
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(filename_mapping, f, ensure_ascii=False, indent=2)
    except Exception as e:
        app.logger.error(f'Error saving filename mapping: {str(e)}')
    
    if not uploaded_files and len(files) > 0:
        return jsonify({'success': False, 'error': '所有文件都不允许上传'}), 400
    
    return jsonify({'success': True, 'files': uploaded_files})

@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({'status': 'ok', 'message': 'Unified server is running'})

@app.route('/health', methods=['GET'])
def health_check():
    try:
        upload_dir_exists = os.path.exists(app.config['UPLOAD_FOLDER'])
        upload_dir_writable = os.access(app.config['UPLOAD_FOLDER'], os.W_OK)
        
        health_status = {
            'status': 'healthy',
            'services': {
                'web_server': 'running',
                'static_files': 'running',
                'lan_audit': 'running'
            },
            'upload_directory': {
                'exists': upload_dir_exists,
                'writable': upload_dir_writable
            },
            'discovered_nodes': len(lan_server.discovered_nodes)
        }
        
        return jsonify(health_status)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ==================== 局域网审计API ====================

@app.route('/api/nodes', methods=['GET'])
def get_discovered_nodes():
    """获取发现的局域网节点"""
    current_time = time.time()
    active_nodes = {}
    
    for node_id, node_info in lan_server.discovered_nodes.items():
        if current_time - node_info['last_seen'] < 120:  # 2分钟内活跃
            active_nodes[node_id] = node_info
    
    return jsonify({
        'success': True,
        'current_node': {
            'id': lan_server.node_id,
            'name': lan_server.node_name
        },
        'discovered_nodes': active_nodes
    })

@app.route('/api/operations', methods=['GET'])
def get_operations():
    """获取审计操作记录"""
    try:
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, node_id, node_name, operation_type, file_id, file_name, 
                   operation_data, timestamp, sync_status
            FROM audit_operations 
            ORDER BY timestamp DESC 
            LIMIT 100
        ''')
        
        operations = []
        for row in cursor.fetchall():
            operation = {
                'id': row[0],
                'node_id': row[1],
                'node_name': row[2],
                'operation_type': row[3],
                'file_id': row[4],
                'file_name': row[5],
                'operation_data': json.loads(row[6]) if row[6] else None,
                'timestamp': row[7],
                'sync_status': row[8]
            }
            operations.append(operation)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'operations': operations
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sync_status', methods=['GET'])
def get_sync_status():
    """获取同步状态"""
    try:
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM audit_operations WHERE sync_status = "pending"')
        pending_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM audit_operations')
        total_count = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'sync_status': {
                'pending_operations': pending_count,
                'total_operations': total_count,
                'active_nodes': len(lan_server.discovered_nodes)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== 错误处理 ====================

@app.errorhandler(404)
def not_found(error):
    app.logger.warning(f'404 错误: {request.url}')
    return jsonify({'success': False, 'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    app.logger.error(f'服务器错误: {str(error)}')
    return jsonify({'success': False, 'error': 'Server error'}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    app.logger.warning('文件大小超过限制')
    return jsonify({'success': False, 'error': '文件大小超过限制'}), 413

@app.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(error):
    return jsonify({'success': False, 'error': '上传文件过大，请选择小于16MB的文件'}), 413

@app.errorhandler(Exception)
def handle_exception(error):
    app.logger.error(f'未处理的异常: {str(error)}')
    return jsonify({'success': False, 'error': '服务器内部错误'}), 500

if __name__ == '__main__':
    print("="*50)
    print("统一服务器启动中...")
    print(f"服务端口: {LAN_PORT}")
    print("集成服务:")
    print("  - 主要Web服务器")
    print("  - 静态文件服务器")
    print("  - 局域网审计服务器")
    print("="*50)
    
    app.run(host='0.0.0.0', port=LAN_PORT, debug=False, threaded=True)