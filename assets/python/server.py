from flask import Flask, request, jsonify, send_from_directory
import os
import uuid
import json
import logging
from werkzeug.exceptions import RequestEntityTooLarge
try:
    from flask_cors import CORS
except ImportError:
    print("无法导入 flask_cors 库，请确保已使用 'pip install flask-cors' 安装该库。")
    raise
import uuid

app = Flask(__name__, static_folder='../../assets', static_url_path='/assets')

# 配置应用
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # 1年缓存

# 配置日志记录
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

# 添加请求日志中间件
@app.before_request
def log_request_info():
    app.logger.info('Request: %s %s', request.method, request.url)
    print(f"Received {request.method} request to {request.path}")
    if request.method == 'POST':
        print(f'Request Headers: {dict(request.headers)}')
        if 'multipart/form-data' in request.content_type:
            print(f'Form Data Keys: {list(request.files.keys())}')

if 'CORS' in globals():
    CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "OPTIONS"], "allow_headers": "*", "supports_credentials": True}})

@app.route('/数据存储.html')
def serve_data_storage():
    return send_from_directory(os.getcwd(), '数据存储.html')

@app.route('/index.html')
def serve_index_html():
    return send_from_directory(os.getcwd(), 'index.html')

# 错误处理
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

# 配置上传文件夹
import os
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'}
# 限制上传文件大小为16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传文件夹存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 检查文件扩展名是否允许
def allowed_file(filename):
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

# 获取文件类型
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

# 文件上传接口
# 文件上传接口
@app.route('/upload', methods=['POST'])
def upload_file():
    print('Processing upload request')
    print(f'Request method: {request.method}')
    print(f'Content type: {request.content_type}')
    print('Received upload request')
    print('Request files:', request.files)
    print('Processing upload request')
    print('Request method:', request.method)
    print('Request content type:', request.content_type)
    print('Files in request:', list(request.files.keys()))
    if 'files' not in request.files:
        print('No files part in request')
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
        print(f'Error saving filename mapping: {str(e)}')
    
    if not uploaded_files and len(files) > 0:
        return jsonify({'success': False, 'error': '所有文件都不允许上传'}), 400
    
    return jsonify({'success': True, 'files': uploaded_files})

# 测试接口
@app.route('/test', methods=['GET'])
def test_endpoint():
    print('Test endpoint accessed')
    return jsonify({'status': 'ok', 'message': 'Server is running'})

# 健康检查接口
@app.route('/health', methods=['GET'])
def health_check():
    try:
        # 检查上传目录是否可访问
        upload_dir_exists = os.path.exists(app.config['UPLOAD_FOLDER'])
        upload_dir_writable = os.access(app.config['UPLOAD_FOLDER'], os.W_OK)
        
        health_status = {
            'status': 'healthy',
            'upload_directory': {
                'exists': upload_dir_exists,
                'writable': upload_dir_writable
            },
            'server_time': os.path.getctime(__file__)
        }
        
        if not upload_dir_exists or not upload_dir_writable:
            health_status['status'] = 'degraded'
            
        return jsonify(health_status)
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

# 获取文件列表接口
@app.route('/files', methods=['GET'])
def get_files():
    files = []
    
    # 加载文件名映射
    mapping_file = os.path.join(app.config['UPLOAD_FOLDER'], 'filename_mapping.json')
    try:
        with open(mapping_file, 'r', encoding='utf-8') as f:
            filename_mapping = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        filename_mapping = {}
    
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename == 'filename_mapping.json':
            continue
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(filepath):
            # 获取原始文件名
            original_name = filename_mapping.get(filename, filename)
            
            file_info = {
                'id': filename.split('.')[0],
                'name': original_name,
                'type': get_file_type(original_name),
                'size': os.path.getsize(filepath),
                'date': os.path.getctime(filepath),
                'url': f'/download/{filename}',
                'unique_filename': filename
            }
            files.append(file_info)
    
    # 按上传时间排序（最新的在前）
    files.sort(key=lambda x: x['date'], reverse=True)
    
    return jsonify(files)

# 文件下载接口
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    # 获取原始文件名
    mapping_file = os.path.join(app.config['UPLOAD_FOLDER'], 'filename_mapping.json')
    original_filename = filename
    try:
        with open(mapping_file, 'r', encoding='utf-8') as f:
            filename_mapping = json.load(f)
        if filename in filename_mapping:
            original_filename = filename_mapping[filename]
    except Exception as e:
        print(f'Error getting original filename: {str(e)}')
    
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True, download_name=original_filename)

# 删除文件接口
@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            # 删除文件
            os.remove(file_path)
            
            # 更新文件名映射
            mapping_file = os.path.join(app.config['UPLOAD_FOLDER'], 'filename_mapping.json')
            try:
                with open(mapping_file, 'r', encoding='utf-8') as f:
                    filename_mapping = json.load(f)
                # 从映射中删除文件记录
                if filename in filename_mapping:
                    del filename_mapping[filename]
                # 保存更新后的映射
                with open(mapping_file, 'w', encoding='utf-8') as f:
                    json.dump(filename_mapping, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f'Error updating filename mapping: {str(e)}')
            
            return jsonify({'success': True, 'message': '文件已删除'})
        else:
            return jsonify({'success': False, 'error': '文件不存在'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': f'删除文件失败: {str(e)}'}), 500

# 静态文件路由
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'assets'), filename)

# 添加所有HTML页面的路由
@app.route('/<path:filename>')
def serve_html(filename):
    if filename.endswith('.html') or filename == '':
        return send_from_directory(os.getcwd(), filename if filename else 'index.html')
    return send_from_directory(os.getcwd(), filename)

if __name__ == '__main__':
    # 生产环境配置
    app.run(
        host='0.0.0.0', 
        port=5000, 
        debug=False,
        threaded=True,  # 启用多线程处理
        use_reloader=False  # 禁用自动重载
    )