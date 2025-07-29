document.addEventListener('DOMContentLoaded', () => {
    const taxElement = document.getElementById('taxAmount');
    
    fetch('http://localhost:3000/api/tax')
        .then(response => response.json())
        .then(data => {
            taxElement.textContent = `¥${data.taxAmount.toLocaleString()}`;
        })
        .catch(error => {
            console.error("API请求失败:", error);
            taxElement.textContent = "数据加载失败";
        });
});