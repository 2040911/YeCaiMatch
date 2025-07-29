document.addEventListener('DOMContentLoaded', function() {
    // 获取所有阶段元素
    const stages = document.querySelectorAll('.stage');
    
    // 为每个阶段添加点击事件
    stages.forEach(stage => {
        stage.addEventListener('click', function() {
            // 隐藏所有阶段内容
            document.querySelectorAll('.stage-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // 重置所有阶段标题背景色
            document.querySelectorAll('.stage-header').forEach(header => {
                header.style.backgroundColor = '#3498db';
            });
            
            // 显示当前点击阶段的内容
            const content = this.querySelector('.stage-content');
            content.style.display = 'block';
            
            // 改变当前阶段标题背景色
            const header = this.querySelector('.stage-header');
            header.style.backgroundColor = '#2980b9';
        });
    });
    
    // 默认显示第二级内容
    document.querySelector('#stage2 .stage-content').style.display = 'block';
    document.querySelector('#stage2 .stage-header').style.backgroundColor = '#2980b9';
    
    // 进度条动画效果
    const progressBar = document.querySelector('.progress');
    let width = 0;
    const targetWidth = 52;
    const interval = setInterval(() => {
        if (width >= targetWidth) {
            clearInterval(interval);
        } else {
            width++;
            progressBar.style.width = width + '%';
        }
    }, 20);
});