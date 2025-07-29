import os
import subprocess

def resize_image_with_powershell(input_path, output_path, width, height):
    """使用PowerShell和.NET来缩放图片"""
    powershell_script = f"""
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('{input_path}')
$newImg = New-Object System.Drawing.Bitmap({width}, {height})
$graphics = [System.Drawing.Graphics]::FromImage($newImg)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($img, 0, 0, {width}, {height})
$newImg.Save('{output_path}')
$img.Dispose()
$newImg.Dispose()
$graphics.Dispose()
"""
    
    try:
        result = subprocess.run(['powershell', '-Command', powershell_script], 
                               capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"错误: {e}")
        return False

def main():
    # 检查原始图片是否存在
    logo1_path = 'assets/images/logo.png'
    logo2_path = 'assets/images/logo2.png'
    
    if not os.path.exists(logo1_path):
        print(f"文件不存在: {logo1_path}")
        return
    
    if not os.path.exists(logo2_path):
        print(f"文件不存在: {logo2_path}")
        return
    
    # 创建备份
    backup1 = 'assets/images/logo_original.png'
    backup2 = 'assets/images/logo2_original.png'
    
    if not os.path.exists(backup1):
        subprocess.run(['copy', logo1_path, backup1], shell=True)
        print(f"已创建备份: {backup1}")
    
    if not os.path.exists(backup2):
        subprocess.run(['copy', logo2_path, backup2], shell=True)
        print(f"已创建备份: {backup2}")
    
    # 缩放图片 (假设原尺寸较大，缩小到合适的logo尺寸)
    new_width = 150  # 可以根据需要调整
    new_height = 50  # 可以根据需要调整
    
    print(f"正在缩放 {logo1_path} 到 {new_width}x{new_height}...")
    if resize_image_with_powershell(os.path.abspath(logo1_path), 
                                   os.path.abspath(logo1_path), 
                                   new_width, new_height):
        print(f"成功缩放 {logo1_path}")
    else:
        print(f"缩放失败 {logo1_path}")
    
    print(f"正在缩放 {logo2_path} 到 {new_width}x{new_height}...")
    if resize_image_with_powershell(os.path.abspath(logo2_path), 
                                   os.path.abspath(logo2_path), 
                                   new_width, new_height):
        print(f"成功缩放 {logo2_path}")
    else:
        print(f"缩放失败 {logo2_path}")

if __name__ == "__main__":
    main()