// 由页面统一初始化图表
// 添加动画效果
animateMetrics();


function initReceivablesChart() {
    console.log('开始初始化应收账款图表');
    const ctx = document.getElementById('receivablesChart');
    console.log('应收账款图表容器元素:', ctx);
    if (!ctx) {
        console.error('错误: 未找到ID为receivablesChart的canvas元素');
        return;
    }
    const context = ctx.getContext('2d');
    console.log('图表2D上下文:', context);
    if (!context) {
        console.error('错误: 无法获取canvas 2D上下文');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('错误: Chart.js未加载或未定义');
        return;
    }
    
    new Chart(context, {
        type: 'bar',
        data: {
            labels: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2024 Q1', '2024 Q2'],
            datasets: [
                {
                    label: '本公司',
                    data: [110, 115, 118, 122, 125, 120],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: '行业平均',
                    data: [70, 72, 73, 74, 75, 75],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    type: 'line',
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '应收账款周转天数 (天)',
                    color: '#e0e0ff',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    labels: {
                        color: '#e0e0ff',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 60, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#e0e0ff',
                    borderColor: '#4f8cc9',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(100, 100, 150, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0ff',
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: '天数',
                        color: '#a0a0ff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0a0ff',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initAssetTurnoverChart() {
    console.log('开始初始化总资产周转率图表');
    const ctx = document.getElementById('assetTurnoverChart');
    console.log('总资产周转率图表容器元素:', ctx);
    if (!ctx) {
        console.error('错误: 未找到ID为assetTurnoverChart的canvas元素');
        return;
    }
    const context = ctx.getContext('2d');
    console.log('图表2D上下文:', context);
    if (!context) {
        console.error('错误: 无法获取canvas 2D上下文');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('错误: Chart.js未加载或未定义');
        return;
    }

    new Chart(context, {
        type: 'bar',
        data: {
            labels: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2024 Q1', '2024 Q2'],
            datasets: [
                {
                    label: '本公司',
                    data: [0.68, 0.65, 0.63, 0.60, 0.62, 0.62],
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: '行业平均',
                    data: [0.95, 0.97, 0.98, 0.99, 1.00, 1.00],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    type: 'line',
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '总资产周转率 (次)',
                    color: '#e0e0ff',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    labels: {
                        color: '#e0e0ff',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 60, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#e0e0ff',
                    borderColor: '#4f8cc9',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(100, 100, 150, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0ff',
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: '周转次数',
                        color: '#a0a0ff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0a0ff',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initTrendChart() {
    console.log('开始初始化趋势分析图表');
    const ctx = document.getElementById('trendChart');
    console.log('趋势分析图表容器元素:', ctx);
    if (!ctx) {
        console.error('错误: 未找到ID为trendChart的canvas元素');
        return;
    }
    const context = ctx.getContext('2d');
    console.log('图表2D上下文:', context);
    if (!context) {
        console.error('错误: 无法获取canvas 2D上下文');
        return;
    }
    if (typeof Chart === 'undefined') {
        console.error('错误: Chart.js未加载或未定义');
        return;
    }

    new Chart(context, {
        type: 'line',
        data: {
            labels: ['2022', '2023', '2024', '2025(预测)'],
            datasets: [
                {
                    label: '应收账款周转天数',
                    data: [90, 100, 118, 105],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '总资产周转率',
                    data: [0.75, 0.70, 0.62, 0.68],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    yAxisID: 'y1',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '资金效率历史趋势与预测',
                    color: '#e0e0ff',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    labels: {
                        color: '#e0e0ff',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 60, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#e0e0ff',
                    borderColor: '#4f8cc9',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '周转天数',
                        color: '#ff6384'
                    },
                    grid: {
                        color: 'rgba(100, 100, 150, 0.1)'
                    },
                    ticks: {
                        color: '#ff6384'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '周转率',
                        color: '#ff9f40'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#ff9f40'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(100, 100, 150, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0ff'
                    }
                }
            }
        }
    });
}

function animateMetrics() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });
    
    setTimeout(() => {
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }, 300);
}