document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    
    // 获取用户名和密码
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // 简单的验证逻辑
    if (!username || !password) {
        errorMessage.textContent = '用户名和密码不能为空';
        errorMessage.style.display = 'block';
        return;
    }
    
    // 这里应该是实际的验证逻辑
    // 示例中我们使用硬编码的用户名和密码
    const validUsers = {
        'admin': 'admin123',
        'user': 'user123',
        'test': 'test123'
    };
    
    if (validUsers[username] && validUsers[username] === password) {
        // 登录成功，保存用户信息到sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        // 跳转到index.html
        window.location.href = 'index.html';
    } else {
        errorMessage.textContent = '用户名或密码错误';
        errorMessage.style.display = 'block';
    }
});