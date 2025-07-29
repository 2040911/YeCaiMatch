#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
服务器部署脚本
用于将新制作的页面和功能上传到服务器
"""

import os
import shutil
import zipfile
from datetime import datetime

def create_deployment_package():
    """
    创建部署包，包含所有新页面和资源文件
    """
    print("开始创建部署包...")
    
    # 创建部署目录
    deploy_dir = "deployment_package"
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    os.makedirs(deploy_dir)
    
    # 需要部署的HTML页面
    html_files = [
        "10WL.html",
        "11SH.html",  # 审核系统（已集成局域网功能）
        "12LAN_AUDIT.html",  # 新增：局域网审核系统
        "13SZLS.html",
        "14HMT.html",
        "6fundZJ.html",
        "7budgetYS.html",
        "8fileWJGL.html",
        "9loginDL.html",
        "all-pages.html",
        "index.html",
        "index-2.html",
        "index-3.html",
        "index-4.html",
        "index-5.html"
    ]
    
    # 复制HTML文件
    print("复制HTML页面...")
    for html_file in html_files:
        if os.path.exists(html_file):
            shutil.copy2(html_file, deploy_dir)
            print(f"  ✓ {html_file}")
        else:
            print(f"  ✗ {html_file} (文件不存在)")
    
    # 复制assets目录
    print("复制资源文件...")
    if os.path.exists("assets"):
        shutil.copytree("assets", os.path.join(deploy_dir, "assets"))
        print("  ✓ assets目录")
    
    # 复制venobox目录
    if os.path.exists("venobox"):
        shutil.copytree("venobox", os.path.join(deploy_dir, "venobox"))
        print("  ✓ venobox目录")
    
    # 复制其他必要文件
    other_files = ["composer.json"]
    for file in other_files:
        if os.path.exists(file):
            shutil.copy2(file, deploy_dir)
            print(f"  ✓ {file}")
    
    return deploy_dir

def create_server_config():
    """
    创建服务器配置文件
    """
    config_content = """
# 服务器部署配置说明

## 新增功能页面
1. 12LAN_AUDIT.html - 局域网审核系统
2. 11SH.html - 审核系统（已集成局域网同步功能）

## Python服务器文件
1. assets/python/lan_audit_server.py - 局域网审核服务器
2. assets/python/server.py - 文件上传服务器

## 部署要求
1. Python 3.7+
2. Flask框架
3. 端口配置：
   - 主Web服务器：80/443
   - 文件上传服务：5000
   - 局域网审核服务：5001

## 启动命令
```bash
# 启动文件上传服务器
python assets/python/server.py

# 启动局域网审核服务器
python assets/python/lan_audit_server.py
```

## 新功能特性
- 局域网文件同步
- 多节点协同审核
- 操作日志记录
- 网络节点自动发现
"""
    
    with open("deployment_package/SERVER_CONFIG.md", "w", encoding="utf-8") as f:
        f.write(config_content)
    print("  ✓ 服务器配置文件")

def create_zip_package(deploy_dir):
    """
    创建ZIP压缩包
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_filename = f"western_titanium_deployment_{timestamp}.zip"
    
    print(f"创建压缩包: {zip_filename}")
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(deploy_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, deploy_dir)
                zipf.write(file_path, arc_name)
                print(f"  添加: {arc_name}")
    
    return zip_filename

def main():
    """
    主函数
    """
    print("=" * 50)
    print("西部钛业数字化系统 - 服务器部署工具")
    print("=" * 50)
    
    try:
        # 创建部署包
        deploy_dir = create_deployment_package()
        
        # 创建配置文件
        create_server_config()
        
        # 创建ZIP包
        zip_file = create_zip_package(deploy_dir)
        
        # 清理临时目录
        shutil.rmtree(deploy_dir)
        
        print("\n" + "=" * 50)
        print("部署包创建完成！")
        print(f"文件名: {zip_file}")
        print(f"文件大小: {os.path.getsize(zip_file) / 1024 / 1024:.2f} MB")
        print("\n请将此文件上传到您的服务器并解压部署。")
        print("=" * 50)
        
    except Exception as e:
        print(f"错误: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()