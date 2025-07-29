// assets/js/WL/海绵钛.js
document.addEventListener('DOMContentLoaded', function() {
    // 海绵钛价格走势图
    const priceTrendCtx = document.getElementById('priceTrendChart').getContext('2d');
    const priceTrendChart = new Chart(priceTrendCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [
                {
                    label: '海绵钛价格 (万元/吨)',
                    data: [5.2, 5.3, 5.35, 5.4, 5.45, 5.5, 4.65],
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#4fc3f7',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: '钛精矿价格 (千元/吨)',
                    data: [2.15, 2.1, 2.05, 1.95, 1.85, 1.75, 1.72],
                    borderColor: '#66ff99',
                    backgroundColor: 'rgba(102, 255, 153, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#66ff99',
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '2024年海绵钛价格先扬后抑，7月大幅回落',
                    font: { size: 16 },
                    color: '#e0f0ff'
                },
                legend: {
                    labels: { color: '#90caf9' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { color: '#90caf9' },
                    title: {
                        display: true,
                        text: '海绵钛价格 (万元/吨)',
                        color: '#90caf9'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: false,
                    grid: { display: false },
                    ticks: { color: '#66ff99' },
                    title: {
                        display: true,
                        text: '钛精矿价格 (千元/吨)',
                        color: '#66ff99'
                    }
                },
                x: {
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { color: '#90caf9' }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // 期货与现货价格对比图
    const futuresSpotCtx = document.getElementById('futuresSpotChart').getContext('2d');
    const futuresSpotChart = new Chart(futuresSpotCtx, {
        type: 'bar',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [
                {
                    label: '现货价格',
                    data: [5.2, 5.3, 5.35, 5.4, 5.45, 5.5, 4.65],
                    backgroundColor: 'rgba(79, 195, 247, 0.7)',
                    borderColor: '#4fc3f7',
                    borderWidth: 1
                },
                {
                    label: '期货价格',
                    data: [5.25, 5.32, 5.4, 5.45, 5.5, 5.55, 4.68],
                    backgroundColor: 'rgba(102, 255, 153, 0.7)',
                    borderColor: '#66ff99',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '期货价格持续高于现货，7月升水收窄',
                    font: { size: 16 },
                    color: '#e0f0ff'
                },
                legend: {
                    labels: { color: '#90caf9' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { 
                        color: '#90caf9',
                        callback: function(value) {
                            return value + '万';
                        }
                    },
                    title: {
                        display: true,
                        text: '价格 (万元/吨)',
                        color: '#90caf9'
                    }
                },
                x: {
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { color: '#90caf9' }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // 相关股票表现图
    const stocksCtx = document.getElementById('stocksChart').getContext('2d');
    const stocksChart = new Chart(stocksCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [
                {
                    label: '宝钛股份',
                    data: [100, 105, 112, 108, 115, 120, 98],
                    borderColor: '#ff9966',
                    backgroundColor: 'rgba(255, 153, 102, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#ff9966',
                    tension: 0.3
                },
                {
                    label: '西部材料',
                    data: [100, 102, 108, 105, 110, 115, 95],
                    borderColor: '#cc66ff',
                    backgroundColor: 'rgba(204, 102, 255, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#cc66ff',
                    tension: 0.3
                },
                {
                    label: '钛行业指数',
                    data: [100, 101, 103, 102, 105, 108, 92],
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#4fc3f7',
                    borderDash: [5, 5],
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '钛业股票上半年走强，7月随市场回调',
                    font: { size: 16 },
                    color: '#e0f0ff'
                },
                legend: {
                    labels: { color: '#90caf9' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { 
                        color: '#90caf9',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: '相对涨幅 (%)',
                        color: '#90caf9'
                    }
                },
                x: {
                    grid: { color: 'rgba(144, 202, 249, 0.1)' },
                    ticks: { color: '#90caf9' }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // 添加动态数据更新效果
    function updatePrice() {
        const priceElement = document.querySelector('.price-value');
        const changeElement = document.querySelector('.price-change');
        
        // 模拟价格波动
        const currentPrice = parseFloat(priceElement.textContent.replace(/,/g, ''));
        const change = (Math.random() - 0.5) * 100;
        const newPrice = currentPrice + change;
        
        priceElement.textContent = newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        if (change > 0) {
            changeElement.textContent = `↑${change.toFixed(2)}`;
            changeElement.className = 'price-change positive';
        } else {
            changeElement.textContent = `↓${Math.abs(change).toFixed(2)}`;
            changeElement.className = 'price-change negative';
        }
    }
    
    // 每10秒更新一次价格
    setInterval(updatePrice, 10000);
    
    // 添加悬停动画效果
    const strategyBox = document.querySelector('.strategy-box');
    strategyBox.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 12px 30px rgba(0, 100, 200, 0.6)';
        this.style.borderColor = 'rgba(79, 195, 247, 0.5)';
    });
    
    strategyBox.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 8px 24px rgba(0, 40, 80, 0.4)';
        this.style.borderColor = 'rgba(64, 144, 255, 0.2)';
    });
});