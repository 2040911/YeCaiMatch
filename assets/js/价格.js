// 海绵钛价格分析页面JavaScript

// 模拟海绵钛价格数据
const priceData = {
    // 价格数据 (2012-2025)
    prices: [
        { date: '2012-01', price: 120.5 },
        { date: '2012-06', price: 115.2 },
        { date: '2013-01', price: 108.7 },
        { date: '2013-06', price: 95.3 },
        { date: '2014-01', price: 88.9 },
        { date: '2014-06', price: 82.1 },
        { date: '2015-01', price: 75.6 },
        { date: '2015-06', price: 68.4 },
        { date: '2016-01', price: 62.8 },
        { date: '2016-06', price: 58.9 },
        { date: '2017-01', price: 65.2 },
        { date: '2017-06', price: 72.1 },
        { date: '2018-01', price: 78.5 },
        { date: '2018-06', price: 85.3 },
        { date: '2019-01', price: 92.7 },
        { date: '2019-06', price: 98.4 },
        { date: '2020-01', price: 105.2 },
        { date: '2020-06', price: 112.8 },
        { date: '2021-01', price: 125.6 },
        { date: '2021-06', price: 138.9 },
        { date: '2022-01', price: 152.3 },
        { date: '2022-06', price: 165.7 },
        { date: '2023-01', price: 178.4 },
        { date: '2023-06', price: 185.2 },
        { date: '2024-01', price: 192.8 },
        { date: '2024-06', price: 198.5 },
        { date: '2025-01', price: 205.3 },
        { date: '2025-07', price: 100.87 } // 当前价格点
    ],
    
    // 成交量数据
    volumes: [
        { date: '2012-01', volume: 1200 },
        { date: '2012-06', volume: 1150 },
        { date: '2013-01', volume: 1080 },
        { date: '2013-06', volume: 950 },
        { date: '2014-01', volume: 890 },
        { date: '2014-06', volume: 820 },
        { date: '2015-01', volume: 750 },
        { date: '2015-06', volume: 680 },
        { date: '2016-01', volume: 620 },
        { date: '2016-06', volume: 580 },
        { date: '2017-01', volume: 650 },
        { date: '2017-06', volume: 720 },
        { date: '2018-01', volume: 780 },
        { date: '2018-06', volume: 850 },
        { date: '2019-01', volume: 920 },
        { date: '2019-06', volume: 980 },
        { date: '2020-01', volume: 1050 },
        { date: '2020-06', volume: 1120 },
        { date: '2021-01', volume: 1250 },
        { date: '2021-06', volume: 1380 },
        { date: '2022-01', volume: 1520 },
        { date: '2022-06', volume: 1650 },
        { date: '2023-01', volume: 1780 },
        { date: '2023-06', volume: 1850 },
        { date: '2024-01', volume: 1920 },
        { date: '2024-06', volume: 1980 },
        { date: '2025-01', volume: 2050 },
        { date: '2025-07', volume: 1850 }
    ]
};

// 历史数据表格数据
const tableData = [
    {
        date: '2025-07-28',
        current: 100.87,
        previous: 100.97,
        dailyChange: -0.11,
        lastWeek: 100.87,
        weeklyChange: 0.00,
        lastMonth: 102.71,
        monthlyChange: -1.79,
        lastYear: 116.82,
        yearlyChange: -13.66
    },
    {
        date: '2025-07-25',
        current: 100.97,
        previous: 100.97,
        dailyChange: 0.00,
        lastWeek: 100.93,
        weeklyChange: 0.04,
        lastMonth: 103.14,
        monthlyChange: -2.10,
        lastYear: 116.82,
        yearlyChange: -13.57
    },
    {
        date: '2025-07-24',
        current: 100.97,
        previous: 100.97,
        dailyChange: 0.00,
        lastWeek: 100.93,
        weeklyChange: 0.04,
        lastMonth: 103.14,
        monthlyChange: -2.10,
        lastYear: 116.82,
        yearlyChange: -13.57
    },
    {
        date: '2025-07-23',
        current: 100.97,
        previous: 100.97,
        dailyChange: 0.00,
        lastWeek: 100.93,
        weeklyChange: 0.04,
        lastMonth: 103.50,
        monthlyChange: -2.44,
        lastYear: 116.82,
        yearlyChange: -13.57
    },
    {
        date: '2025-07-22',
        current: 100.97,
        previous: 100.87,
        dailyChange: 0.11,
        lastWeek: 101.51,
        weeklyChange: -0.53,
        lastMonth: 104.30,
        monthlyChange: -3.19,
        lastYear: 116.82,
        yearlyChange: -13.57
    },
    {
        date: '2025-07-21',
        current: 100.87,
        previous: 100.93,
        dailyChange: -0.07,
        lastWeek: 101.51,
        weeklyChange: -0.63,
        lastMonth: 104.30,
        monthlyChange: -3.29,
        lastYear: 116.76,
        yearlyChange: -13.61
    },
    {
        date: '2025-07-18',
        current: 100.93,
        previous: 100.93,
        dailyChange: 0.00,
        lastWeek: 101.51,
        weeklyChange: -0.57,
        lastMonth: 104.41,
        monthlyChange: -3.33,
        lastYear: 116.76,
        yearlyChange: -13.56
    },
    {
        date: '2025-07-17',
        current: 100.93,
        previous: 100.93,
        dailyChange: 0.00,
        lastWeek: 102.46,
        weeklyChange: -1.49,
        lastMonth: 104.41,
        monthlyChange: -3.33,
        lastYear: 116.64,
        yearlyChange: -13.47
    },
    {
        date: '2025-07-16',
        current: 100.93,
        previous: 101.51,
        dailyChange: -0.57,
        lastWeek: 102.48,
        weeklyChange: -1.51,
        lastMonth: 104.44,
        monthlyChange: -3.36,
        lastYear: 116.64,
        yearlyChange: -13.47
    },
    {
        date: '2025-07-15',
        current: 101.51,
        previous: 101.51,
        dailyChange: 0.00,
        lastWeek: 102.48,
        weeklyChange: -0.94,
        lastMonth: 104.72,
        monthlyChange: -3.07,
        lastYear: 116.64,
        yearlyChange: -12.98
    }
];

let priceChart, volumeChart;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    populateDataTable();
    bindEventListeners();
});

// 初始化图表
function initializeCharts() {
    initializePriceChart();
    initializeVolumeChart();
}

// 初始化价格图表
function initializePriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const labels = priceData.prices.map(item => item.date);
    const prices = priceData.prices.map(item => item.price);
    
    // 找到最低点
    const minPrice = Math.min(...prices);
    const minIndex = prices.indexOf(minPrice);
    const currentIndex = prices.length - 1;
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '海绵钛价格指数',
                data: prices,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: function(context) {
                    const index = context.dataIndex;
                    if (index === currentIndex) {
                        return '#ff4757'; // 当前点为红色
                    } else if (index === minIndex) {
                        return '#28a745'; // 最低点为绿色
                    }
                    return '#007bff';
                },
                pointBorderColor: function(context) {
                    const index = context.dataIndex;
                    if (index === currentIndex) {
                        return '#ff4757';
                    } else if (index === minIndex) {
                        return '#28a745';
                    }
                    return '#007bff';
                },
                pointRadius: function(context) {
                    const index = context.dataIndex;
                    if (index === currentIndex || index === minIndex) {
                        return 6;
                    }
                    return 3;
                },
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            let label = `价格: ${context.parsed.y.toFixed(2)}`;
                            if (index === currentIndex) {
                                label += ' (当前购买点 - 非历史最低)';
                            } else if (index === minIndex) {
                                label += ' (历史最低点)';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '时间'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '价格指数'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    beginAtZero: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// 初始化成交量图表
function initializeVolumeChart() {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    
    const labels = priceData.volumes.map(item => item.date);
    const volumes = priceData.volumes.map(item => item.volume);
    
    volumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '成交量',
                data: volumes,
                backgroundColor: 'rgba(108, 117, 125, 0.6)',
                borderColor: 'rgba(108, 117, 125, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// 填充数据表格
function populateDataTable() {
    const tbody = document.querySelector('#priceDataTable tbody');
    tbody.innerHTML = '';
    
    tableData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.date}</td>
            <td>${row.current.toFixed(2)}</td>
            <td>${row.previous.toFixed(2)}</td>
            <td class="${getChangeClass(row.dailyChange)}">${formatChange(row.dailyChange)}</td>
            <td>${row.lastWeek.toFixed(2)}</td>
            <td class="${getChangeClass(row.weeklyChange)}">${formatChange(row.weeklyChange)}</td>
            <td>${row.lastMonth.toFixed(2)}</td>
            <td class="${getChangeClass(row.monthlyChange)}">${formatChange(row.monthlyChange)}</td>
            <td>${row.lastYear.toFixed(2)}</td>
            <td class="${getChangeClass(row.yearlyChange)}">${formatChange(row.yearlyChange)}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// 获取变化值的CSS类
function getChangeClass(value) {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
}

// 格式化变化值
function formatChange(value) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

// 绑定事件监听器
function bindEventListeners() {
    // 时间范围按钮
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateChartTimeRange(this.textContent);
        });
    });
    
    // 侧边栏指数项
    const indexItems = document.querySelectorAll('.index-item');
    indexItems.forEach(item => {
        item.addEventListener('click', function() {
            indexItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 搜索按钮
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            filterTableData(startDate, endDate);
        });
    }
    
    // 分页按钮
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.textContent.includes('下一页') && !this.textContent.includes('上一页')) {
                pageButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 跳转按钮
    const goBtn = document.querySelector('.go-btn');
    if (goBtn) {
        goBtn.addEventListener('click', function() {
            const pageInput = document.querySelector('.page-input');
            const pageNum = parseInt(pageInput.value);
            if (pageNum >= 1 && pageNum <= 334) {
                // 这里可以实现页面跳转逻辑
                console.log(`跳转到第${pageNum}页`);
            }
        });
    }
}

// 更新图表时间范围
function updateChartTimeRange(range) {
    let filteredData;
    
    switch(range) {
        case '1个月':
            filteredData = priceData.prices.slice(-2);
            break;
        case '3个月':
            filteredData = priceData.prices.slice(-6);
            break;
        case '6个月':
            filteredData = priceData.prices.slice(-12);
            break;
        case '今年':
            filteredData = priceData.prices.filter(item => item.date.startsWith('2025'));
            break;
        case '1年':
            filteredData = priceData.prices.slice(-24);
            break;
        case '全部':
        default:
            filteredData = priceData.prices;
            break;
    }
    
    // 更新图表数据
    priceChart.data.labels = filteredData.map(item => item.date);
    priceChart.data.datasets[0].data = filteredData.map(item => item.price);
    priceChart.update();
    
    // 更新成交量图表
    const volumeFiltered = priceData.volumes.slice(0, filteredData.length);
    volumeChart.data.labels = volumeFiltered.map(item => item.date);
    volumeChart.data.datasets[0].data = volumeFiltered.map(item => item.volume);
    volumeChart.update();
}

// 过滤表格数据
function filterTableData(startDate, endDate) {
    let filteredData = tableData;
    
    if (startDate) {
        filteredData = filteredData.filter(row => row.date >= startDate);
    }
    
    if (endDate) {
        filteredData = filteredData.filter(row => row.date <= endDate);
    }
    
    // 重新填充表格
    const tbody = document.querySelector('#priceDataTable tbody');
    tbody.innerHTML = '';
    
    filteredData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.date}</td>
            <td>${row.current.toFixed(2)}</td>
            <td>${row.previous.toFixed(2)}</td>
            <td class="${getChangeClass(row.dailyChange)}">${formatChange(row.dailyChange)}</td>
            <td>${row.lastWeek.toFixed(2)}</td>
            <td class="${getChangeClass(row.weeklyChange)}">${formatChange(row.weeklyChange)}</td>
            <td>${row.lastMonth.toFixed(2)}</td>
            <td class="${getChangeClass(row.monthlyChange)}">${formatChange(row.monthlyChange)}</td>
            <td>${row.lastYear.toFixed(2)}</td>
            <td class="${getChangeClass(row.yearlyChange)}">${formatChange(row.yearlyChange)}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// 窗口大小改变时重新调整图表
window.addEventListener('resize', function() {
    if (priceChart) {
        priceChart.resize();
    }
    if (volumeChart) {
        volumeChart.resize();
    }
});

// 导出功能（可选）
function exportData(format) {
    if (format === 'csv') {
        exportToCSV();
    } else if (format === 'excel') {
        exportToExcel();
    }
}

// 导出为CSV
function exportToCSV() {
    const headers = ['日期', '当日', '上日', '日环比', '上周', '周环比', '上月', '月环比', '上年', '年同比'];
    const csvContent = [headers.join(',')];
    
    tableData.forEach(row => {
        const rowData = [
            row.date,
            row.current.toFixed(2),
            row.previous.toFixed(2),
            row.dailyChange.toFixed(2) + '%',
            row.lastWeek.toFixed(2),
            row.weeklyChange.toFixed(2) + '%',
            row.lastMonth.toFixed(2),
            row.monthlyChange.toFixed(2) + '%',
            row.lastYear.toFixed(2),
            row.yearlyChange.toFixed(2) + '%'
        ];
        csvContent.push(rowData.join(','));
    });
    
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '海绵钛价格数据.csv';
    link.click();
}

// 打印功能
function printChart() {
    window.print();
}