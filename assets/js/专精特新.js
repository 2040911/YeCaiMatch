document.addEventListener('DOMContentLoaded', function() {
    // 错误日志记录函数
    function logError(message) {
        const errorLog = document.getElementById('error-log');
        if (errorLog) {
            const errorItem = document.createElement('div');
            errorItem.style.margin = '5px 0';
            errorItem.style.padding = '5px';
            errorItem.style.borderLeft = '3px solid #ff4444';
            errorItem.style.backgroundColor = '#ffebee';
            errorItem.textContent = `[${new Date().toLocaleTimeString()}] 错误: ${message}`;
            errorLog.appendChild(errorItem);
            errorLog.scrollTop = errorLog.scrollHeight;
        }
        console.error(message);
    }

    // 检查DOM元素是否存在
    function checkElementExists(id) {
        const element = document.getElementById(id);
        if (!element) {
            logError(`图表容器不存在: ${id}`);
            return false;
        }
        return element;
    }

    // 检查ECharts库是否加载
    if (typeof echarts === 'undefined') {
        logError('ECharts库未加载，请检查CDN链接或网络连接');
        return;
    }
    // 声明图表实例变量
    let strategyChart, costChart, fundChart;

    // 初始化战略目标进度图表
    const strategyOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            data: ['创新型中小企业', '专精特新企业', '专精特新小巨人', '单项冠军'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '战略目标进度',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#0c1b33',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    color: '#e6f7ff'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [
                    {value: 100, name: '创新型中小企业', itemStyle: {color: '#4facfe'}},
                    {value: 85, name: '专精特新企业', itemStyle: {color: '#00cdac'}},
                    {value: 0, name: '专精特新小巨人', itemStyle: {color: '#7c4dff'}},
                    {value: 0, name: '单项冠军', itemStyle: {color: '#ff9a9e'}}
                ]
            }
        ]
    };
    const strategyContainer = checkElementExists('strategy-progress');
    if (strategyContainer) {
        try {
            strategyChart = echarts.init(strategyContainer);
            strategyChart.setOption(strategyOption);
        } catch (e) {
            logError(`战略目标进度图表初始化失败: ${e.message}`);
        }
    }

    // 初始化生产成本图表
    const costOption = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: '生产成本',
                type: 'gauge',
                radius: '90%',
                center: ['50%', '60%'],
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 5,
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [0.3, '#ff6b6b'],
                            [0.7, '#feca57'],
                            [1, '#1dd1a1']
                        ]
                    }
                },
                progress: {
                    show: true,
                    width: 15
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 10,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: '#c8d6e5'
                    }
                },
                axisTick: {
                    length: 8,
                    lineStyle: {
                        color: 'auto',
                        width: 2
                    }
                },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        color: 'auto',
                        width: 3
                    }
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    distance: -35
                },
                title: {
                    offsetCenter: [0, '-20%'],
                    fontSize: 16,
                    color: '#c8d6e5'
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 28,
                    offsetCenter: [0, '10%'],
                    formatter: '{value}%',
                    color: '#fff'
                },
                data: [
                    {
                        value: 65,
                        name: '成本控制率'
                    }
                ]
            }
        ]
    };
    const costContainer = checkElementExists('production-cost');
    if (costContainer) {
        try {
            costChart = echarts.init(costContainer);
            costChart.setOption(costOption);
        } catch (e) {
            logError(`生产成本图表初始化失败: ${e.message}`);
        }
    }

    // 初始化资金效率图表
    const fundOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['公司资金利用效率', '行业平均'],
            textStyle: {
                color: '#fff'
            },
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            axisLine: {
                lineStyle: {
                    color: '#c8d6e5'
                }
            },
            axisLabel: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'value',
            name: '效率指数',
            nameTextStyle: {
                color: '#c8d6e5'
            },
            axisLine: {
                lineStyle: {
                    color: '#c8d6e5'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(200, 214, 229, 0.2)'
                }
            },
            axisLabel: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '公司资金利用效率',
                type: 'line',
                data: [62, 65, 64, 67, 63, 66, 65],
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#ff9a9e'
                },
                itemStyle: {
                    color: '#ff6b6b',
                    borderWidth: 2,
                    borderColor: '#ffd8d8'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(255, 154, 158, 0.5)'},
                        {offset: 1, color: 'rgba(255, 154, 158, 0.1)'}
                    ])
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#ff6b6b',
                        type: 'dashed'
                    },
                    data: [
                        {yAxis: 65, name: '公司平均'}
                    ]
                }
            },
            {
                name: '行业平均',
                type: 'line',
                data: [72, 75, 74, 77, 76, 78, 77],
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#4facfe'
                },
                itemStyle: {
                    color: '#00f2fe',
                    borderWidth: 2,
                    borderColor: '#dbf9ff'
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#00f2fe',
                        type: 'dashed'
                    },
                    data: [
                        {yAxis: 75, name: '行业平均'}
                    ]
                }
            }
        ]
    };
    const fundContainer = checkElementExists('fund-efficiency');
    if (fundContainer) {
        try {
            fundChart = echarts.init(fundContainer);
            fundChart.setOption(fundOption);
        } catch (e) {
            logError(`资金效率图表初始化失败: ${e.message}`);
        }
    }

    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        if (strategyChart) strategyChart.resize();
        if (costChart) costChart.resize();
        if (fundChart) fundChart.resize();
    });
});