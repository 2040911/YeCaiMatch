$(document).ready(function() { 
    console.log('DOM加载完成，开始检查按钮元素...');
    
    // 使用jQuery检查按钮
    const $button = $('#立即处理');
    console.log('jQuery选择器找到按钮数量:', $button.length);
    
    // 使用原生JavaScript检查按钮
    const vanillaButton = document.getElementById('立即处理');
    console.log('原生JS找到按钮:', vanillaButton ? '是' : '否');
    
    if (vanillaButton) {
        console.log('按钮状态:', {
            disabled: vanillaButton.disabled,
            hidden: vanillaButton.hidden,
            offsetWidth: vanillaButton.offsetWidth,
            offsetHeight: vanillaButton.offsetHeight
        });
    }
    
    // jQuery事件委托
    $(document).on('click', '#立即处理', function(){
        console.log('jQuery点击事件触发');
        alert("增值税进销项异常");
        $(this).closest('.warning-card').hide();
        // 更新高风险计数为0并改变样式
        $('.level-high').text('高风险: 0').css('background', 'rgba(46, 204, 113, 0.25)').css('color', '#2ecc71');
    });
    
    // 高风险指示器与预警卡片关联交互
    const $highRiskIndicator = $('.level-high');
    const $highRiskCard = $('.warning-card.high');
});