#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
局域网审核文件和操作互传服务器
支持文件传输、操作记录同步、审核状态同步等功能
"""

import os
import json
import uuid
import time
import socket
import threading
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import hashlib
import zipfile
import tempfile

app = Flask(__name__)
CORS(app)

# 配置
LAN_PORT = 5001
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
            sock.bind(('', BROADCAST_PORT))
            
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
        
        # 异步同步到其他节点
        threading.Thread(target=self.sync_operation_to_nodes, 
                        args=(operation_id,), daemon=True).start()
        
        return operation_id
    
    def sync_operation_to_nodes(self, operation_id):
        """同步操作记录到其他节点"""
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM audit_operations WHERE id = ?', (operation_id,))
        operation = cursor.fetchone()
        conn.close()
        
        if not operation:
            return
        
        operation_data = {
            'id': operation[0],
            'node_id': operation[1],
            'node_name': operation[2],
            'operation_type': operation[3],
            'file_id': operation[4],
            'file_name': operation[5],
            'operation_data': operation[6],
            'timestamp': operation[7]
        }
        
        for node_id, node_info in self.discovered_nodes.items():
            try:
                import requests
                response = requests.post(
                    f"http://{node_info['ip']}:{node_info['port']}/sync_operation",
                    json=operation_data,
                    timeout=5
                )
                if response.status_code == 200:
                    print(f"操作同步到节点 {node_info['name']} 成功")
            except Exception as e:
                print(f"同步到节点 {node_info['name']} 失败: {e}")

# 创建服务器实例
lan_server = LANAuditServer()

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
        'nodes': active_nodes
    })

@app.route('/api/sync_file', methods=['POST'])
def sync_file_to_node():
    """同步文件到指定节点"""
    try:
        target_node_id = request.json.get('target_node_id')
        file_id = request.json.get('file_id')
        file_path = request.json.get('file_path')
        
        if not all([target_node_id, file_id, file_path]):
            return jsonify({'success': False, 'error': '缺少必要参数'}), 400
        
        if target_node_id not in lan_server.discovered_nodes:
            return jsonify({'success': False, 'error': '目标节点不存在'}), 404
        
        if not os.path.exists(file_path):
            return jsonify({'success': False, 'error': '文件不存在'}), 404
        
        # 计算文件哈希
        with open(file_path, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        
        # 发送文件到目标节点
        target_node = lan_server.discovered_nodes[target_node_id]
        
        import requests
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {
                'file_id': file_id,
                'file_hash': file_hash,
                'source_node': lan_server.node_id
            }
            
            response = requests.post(
                f"http://{target_node['ip']}:{target_node['port']}/api/receive_file",
                files=files,
                data=data,
                timeout=30
            )
        
        if response.status_code == 200:
            # 记录同步操作
            lan_server.log_operation(
                'file_sync',
                file_id=file_id,
                file_name=os.path.basename(file_path),
                operation_data={
                    'target_node': target_node_id,
                    'file_hash': file_hash
                }
            )
            
            return jsonify({'success': True, 'message': '文件同步成功'})
        else:
            return jsonify({'success': False, 'error': '文件同步失败'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/receive_file', methods=['POST'])
def receive_file():
    """接收来自其他节点的文件"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': '没有文件'}), 400
        
        file = request.files['file']
        file_id = request.form.get('file_id')
        file_hash = request.form.get('file_hash')
        source_node = request.form.get('source_node')
        
        if not all([file_id, file_hash, source_node]):
            return jsonify({'success': False, 'error': '缺少必要参数'}), 400
        
        # 保存文件
        filename = f"{file_id}_{file.filename}"
        file_path = os.path.join(FILE_SYNC_DIR, filename)
        file.save(file_path)
        
        # 验证文件哈希
        with open(file_path, 'rb') as f:
            received_hash = hashlib.md5(f.read()).hexdigest()
        
        if received_hash != file_hash:
            os.remove(file_path)
            return jsonify({'success': False, 'error': '文件哈希验证失败'}), 400
        
        # 记录文件同步
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO file_sync_records 
            (id, file_id, file_name, file_hash, source_node, sync_timestamp, file_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (str(uuid.uuid4()), file_id, file.filename, file_hash, 
              source_node, time.time(), file_path))
        
        conn.commit()
        conn.close()
        
        # 记录接收操作
        lan_server.log_operation(
            'file_received',
            file_id=file_id,
            file_name=file.filename,
            operation_data={
                'source_node': source_node,
                'file_hash': file_hash
            }
        )
        
        return jsonify({'success': True, 'message': '文件接收成功'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/sync_operation', methods=['POST'])
def sync_operation():
    """接收来自其他节点的操作同步"""
    try:
        operation_data = request.json
        
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        # 检查操作是否已存在
        cursor.execute('SELECT id FROM audit_operations WHERE id = ?', (operation_data['id'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': True, 'message': '操作已存在'})
        
        # 插入操作记录
        cursor.execute('''
            INSERT INTO audit_operations 
            (id, node_id, node_name, operation_type, file_id, file_name, operation_data, timestamp, sync_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        ''', (operation_data['id'], operation_data['node_id'], operation_data['node_name'],
              operation_data['operation_type'], operation_data['file_id'], 
              operation_data['file_name'], operation_data['operation_data'], 
              operation_data['timestamp']))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': '操作同步成功'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/operations', methods=['GET'])
def get_operations():
    """获取所有审核操作记录"""
    try:
        conn = sqlite3.connect(AUDIT_DB)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM audit_operations 
            ORDER BY timestamp DESC 
            LIMIT 100
        ''')
        
        operations = []
        for row in cursor.fetchall():
            operations.append({
                'id': row[0],
                'node_id': row[1],
                'node_name': row[2],
                'operation_type': row[3],
                'file_id': row[4],
                'file_name': row[5],
                'operation_data': json.loads(row[6]) if row[6] else None,
                'timestamp': row[7],
                'sync_status': row[8],
                'formatted_time': datetime.fromtimestamp(row[7]).strftime('%Y-%m-%d %H:%M:%S')
            })
        
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
        
        # 统计操作记录
        cursor.execute('SELECT COUNT(*) FROM audit_operations')
        total_operations = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM audit_operations WHERE sync_status = "synced"')
        synced_operations = cursor.fetchone()[0]
        
        # 统计文件同步记录
        cursor.execute('SELECT COUNT(*) FROM file_sync_records')
        synced_files = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'status': {
                'total_operations': total_operations,
                'synced_operations': synced_operations,
                'pending_operations': total_operations - synced_operations,
                'synced_files': synced_files,
                'active_nodes': len([n for n in lan_server.discovered_nodes.values() 
                                   if time.time() - n['last_seen'] < 120])
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print(f"启动局域网审核服务器...")
    print(f"节点ID: {lan_server.node_id}")
    print(f"节点名称: {lan_server.node_name}")
    print(f"服务端口: {LAN_PORT}")
    print(f"广播端口: {BROADCAST_PORT}")
    
    app.run(
        host='0.0.0.0',
        port=LAN_PORT,
        debug=False,
        threaded=True
    )