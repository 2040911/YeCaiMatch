// 海绵钛价格监控 - 期货市场折线图
// 使用ECharts实现类似股市的价格走势图

// 初始化图表
function initTitaniumPriceChart() {
    const chartContainer = document.getElementById('gdMap');
    if (!chartContainer) {
        console.error('Chart container not found');
        return;
    }

    // 初始化ECharts实例
    const chart = echarts.init(chartContainer);

    // 模拟海绵钛价格数据（最近30天）
    const dates = [];
    const priceData = [];
    const volumeData = [];
    
    // 生成日期和价格数据
    const today = new Date();
    let basePrice = 75000; // 基础价格7.5万元/吨
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
        
        // 模拟价格波动
        const volatility = (Math.random() - 0.5) * 5000; // ±2500元波动
        basePrice += volatility;
        basePrice = Math.max(60000, Math.min(90000, basePrice)); // 价格范围6-9万
        priceData.push(Math.round(basePrice));
        
        // 模拟交易量
        volumeData.push(Math.round(Math.random() * 1000 + 200));
    }

    // 图表配置
    const option = {
        backgroundColor: 'transparent',
        title: {
            text: '海绵钛期货价格走势',
            left: 'center',
            textStyle: {
                color: '#ffffff',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#00d4ff',
            textStyle: {
                color: '#ffffff'
            },
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(function(item) {
                    if (item.seriesName === '价格') {
                        result += item.marker + item.seriesName + ': ' + 
                                 (item.value / 10000).toFixed(1) + '万元/吨<br/>';
                    } else {
                        result += item.marker + item.seriesName + ': ' + item.value + '吨<br/>';
                    }
                });
                return result;
            }
        },
        legend: {
            data: ['价格', '交易量'],
            textStyle: {
                color: '#ffffff'
            },
            top: 30
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: {
                lineStyle: {
                    color: '#00d4ff'
                }
            },
            axisLabel: {
                color: '#ffffff',
                rotate: 45
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '价格(元/吨)',
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#00d4ff'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    formatter: function(value) {
                        return (value / 10000).toFixed(1) + '万';
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 212, 255, 0.2)'
                    }
                }
            },
            {
                type: 'value',
                name: '交易量(吨)',
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: '#ff6b6b'
                    }
                },
                axisLabel: {
                    color: '#ffffff'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '价格',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    color: '#00d4ff',
                    width: 3
                },
                itemStyle: {
                    color: '#00d4ff',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0, 212, 255, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 212, 255, 0.05)'
                            }
                        ]
                    }
                },
                data: priceData
            },
            {
                name: '交易量',
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(255, 107, 107, 0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(255, 107, 107, 0.3)'
                            }
                        ]
                    }
                },
                data: volumeData
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#00d4ff'
                },
                textStyle: {
                    color: '#ffffff'
                },
                borderColor: '#00d4ff'
            }
        ]
    };

    // 设置图表配置
    chart.setOption(option);

    // 响应式调整
    window.addEventListener('resize', function() {
        chart.resize();
    });

    // 定时更新数据（模拟实时数据）
    setInterval(function() {
        updatePriceData(chart, dates, priceData, volumeData);
    }, 30000); // 每30秒更新一次

    return chart;
}

// 更新价格数据
function updatePriceData(chart, dates, priceData, volumeData) {
    // 添加新的数据点
    const now = new Date();
    const newDate = now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    
    // 移除第一个数据点，添加新的数据点
    dates.shift();
    dates.push(newDate);
    
    const lastPrice = priceData[priceData.length - 1];
    const volatility = (Math.random() - 0.5) * 3000;
    const newPrice = Math.max(60000, Math.min(90000, lastPrice + volatility));
    
    priceData.shift();
    priceData.push(Math.round(newPrice));
    
    const newVolume = Math.round(Math.random() * 1000 + 200);
    volumeData.shift();
    volumeData.push(newVolume);
    
    // 更新图表
    chart.setOption({
        xAxis: {
            data: dates
        },
        series: [
            {
                data: priceData
            },
            {
                data: volumeData
            }
        ]
    });
}

// 筛选器事件处理
function handleFilterChange() {
    // 处理市场类型筛选
    const marketFilters = document.querySelectorAll('[data-type="3"] .select-ul li');
    marketFilters.forEach(function(filter) {
        filter.addEventListener('click', function() {
            // 移除其他active状态
            filter.parentNode.querySelectorAll('li').forEach(function(item) {
                item.classList.remove('active');
            });
            // 添加当前active状态
            filter.classList.add('active');
            
            // 更新显示文本
            const selectDiv = filter.closest('.select').querySelector('.select-div');
            selectDiv.textContent = filter.textContent;
            
            // 这里可以根据选择的市场类型更新图表数据
            console.log('Market type changed:', filter.textContent);
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保ECharts已加载
    if (typeof echarts !== 'undefined') {
        initTitaniumPriceChart();
        handleFilterChange();
    } else {
        console.error('ECharts library not loaded');
    }
});