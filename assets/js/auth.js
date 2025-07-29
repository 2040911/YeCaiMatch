// 检查用户是否已登录的脚本
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在登录页面
    const isLoginPage = window.location.href.includes('9loginDL.html') || 
                        window.location.href.includes('login.html');
    
    // 如果不是登录页面，则检查登录状态
    if (!isLoginPage) {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const username = sessionStorage.getItem('username');
        
        // 如果未登录，重定向到登录页面
        if (isLoggedIn !== 'true' || !username) {
            console.log('用户未登录，重定向到登录页面');
            window.location.href = '9loginDL.html';
        } else {
            console.log('用户已登录:', username);
            // 显示用户名和用户菜单（PC端）
            const userMenu = document.getElementById('userMenu');
            const usernameDisplay = document.getElementById('usernameDisplay');
            
            if (userMenu && usernameDisplay) {
                userMenu.style.display = 'block';
                usernameDisplay.textContent = username;
            }
            
            // 显示用户名和用户菜单（移动端）
            const userMenuMobile = document.getElementById('userMenuMobile');
            const usernameDisplayMobile = document.getElementById('usernameDisplayMobile');
            
            if (userMenuMobile && usernameDisplayMobile) {
                userMenuMobile.style.display = 'block';
                usernameDisplayMobile.textContent = username;
            }
            
            // 隐藏所有登录按钮
            const loginButtons = document.querySelectorAll('a[href="login.html"], a[href="9loginDL.html"]');
            loginButtons.forEach(button => {
                button.style.display = 'none';
            });
            
            // 隐藏其他可能的登录按钮（包括没有明确href的按钮）
            const allButtons = document.querySelectorAll('a.witr_btn');
            allButtons.forEach(button => {
                if(button.textContent.includes('登录')) {
                    button.style.display = 'none';
                }
            });
        }
    }
});

// 添加登出功能
function logout() {
    // 清除会话存储中的登录信息
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    
    // 重定向到登录页面
    window.location.href = '9loginDL.html';
}