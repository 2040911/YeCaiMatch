// assets/js/预算.js
document.addEventListener('DOMContentLoaded', function() {
    // 初始化预算对比图表
    const budgetComparisonChart = echarts.init(document.getElementById('budgetComparisonChart'));
    const budgetComparisonOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['2023年实际', '2024年预算'],
            textStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['生产预算', '采购预算', '销售预算'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            name: '金额（万元）',
            nameTextStyle: {
                color: '#fff',
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                color: '#fff',
                fontWeight: 'bold'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '2023年实际',
                type: 'bar',
                data: [1520, 2850, 3680],
                itemStyle: {
                    color: '#1a5fb4'
                }
            },
            {
                name: '2024年预算',
                type: 'bar',
                data: [1890, 2450, 3120],
                itemStyle: {
                    color: '#26a269'
                }
            }
        ]
    };
    budgetComparisonChart.setOption(budgetComparisonOption);

    // 初始化指标雷达图
    const metricsRadarChart = echarts.init(document.getElementById('metricsRadarChart'));
    const metricsRadarOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['2024年', '2025年'],
            textStyle: {
                color: '#fff',
                fontWeight: 'bold'
            },
            bottom: 10
        },
        radar: {
            indicator: [
                { name: '盈利能力', max: 97 },
                { name: '营运能力', max: 98 },
                { name: '偿债能力', max: 98 },
                { name: '可持续发展', max: 98 },
                { name: '综合水平', max: 98 }
            ],
            axisName: {
                color: '#fff',
                fontWeight: 'bold'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            }
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: [72, 68, 75, 65, 70],
                        name: '2024年',
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            width: 2,
                            color: '#1a5fb4'
                        },
                        areaStyle: {
                            color: 'rgba(26, 95, 180, 0.3)'
                        }
                    },
                    {
                        value: [85, 82, 88, 92, 87],
                        name: '2025年',
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            width: 2,
                            color: '#26a269'
                        },
                        areaStyle: {
                            color: 'rgba(38, 162, 105, 0.3)'
                        }
                    }
                ]
            }
        ]
    };
    metricsRadarChart.setOption(metricsRadarOption);

    // 初始化部门预算分配图
    const departmentAllocationChart = echarts.init(document.getElementById('departmentAllocationChart'));
    const departmentAllocationOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}万元 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: '部门预算分配',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#001a33',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1798, name: '研发部', itemStyle: { color: '#26a299' } },
                    { value: 2560, name: '生产部', itemStyle: { color: '#1a5fb4' } },
                    { value: 1760, name: '销售部', itemStyle: { color: '#c64600' } },
                    { value: 961, name: '行政部', itemStyle: { color: '#613583' } },
                    { value: 760, name: '财务部', itemStyle: { color: '#ff7800' } }
                ]
            }
        ]
    };
    departmentAllocationChart.setOption(departmentAllocationOption);

    // 初始化预算趋势图
    const budgetTrendChart = echarts.init(document.getElementById('budgetTrendChart'));
    const budgetTrendOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['研发预算', '生产预算', '采购预算'],
            textStyle: {
                color: '#fff',
                fontWeight: 'bold'
            },
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                color: '#fff',
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            name: '金额（万元）',
            nameTextStyle: {
                color: '#fff',
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                color: '#fff',
                fontWeight: 'bold'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '研发预算',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 145, 158, 165, 172, 178, 182, 185, 188, 189, 189],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#26a269'
                },
                symbol: 'circle',
                symbolSize: 8,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(38, 162, 105, 0.5)' },
                        { offset: 1, color: 'rgba(38, 162, 105, 0.1)' }
                    ])
                }
            },
            {
                name: '生产预算',
                type: 'line',
                stack: 'Total',
                data: [220, 232, 245, 258, 265, 272, 278, 282, 285, 288, 289, 245],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#1a5fb4'
                },
                symbol: 'circle',
                symbolSize: 8,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(26, 95, 180, 0.5)' },
                        { offset: 1, color: 'rgba(26, 95, 180, 0.1)' }
                    ])
                }
            },
            {
                name: '采购预算',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 345, 358, 365, 372, 378, 382, 385, 388, 389, 312],
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#c64600'
                },
                symbol: 'circle',
                symbolSize: 8,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(198, 70, 0, 0.5)' },
                        { offset: 1, color: 'rgba(198, 70, 0, 0.1)' }
                    ])
                }
            }
        ]
    };
    budgetTrendChart.setOption(budgetTrendOption);

    // 初始化预算明细图表
    const budgetDetailsChart = echarts.init(document.getElementById('budgetDetailsChart'));
    const budgetDetailsOption = {
      title: {
        text: '预算明细分析',
        textStyle: {
          color: '#ffffff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '金额（元）',
        axisLabel: {
          color: '#ffffff'
        }
      },
      yAxis: {
        type: 'category',
        data: [
          '钛材销售收入回款',
          '军工/航天航空订单',
          '民营工业订单',
          '加工费收入',
          '废钛回收变现收入',
          '无形资产摊销',
          '能源动力支出',
          '生产人工成本',
          '设备维护与环保支出',
          '原材料采购支出'
        ],
        axisLabel: {
          color: '#ffffff'
        }
      },
      series: [
        {
          name: '预算金额',
          type: 'bar',
          data: [
            58212,
            78254,
            41032,
            12755,
            20145,
            16409,
            91852,
            10185,
            20112,
            18500
          ],
          itemStyle: {
            color: function(params) {
              const scores = [89.3, 57.1, 74.4, 50.1, 89.7, 68.1, 19.6, 10.6, 32.7, 45.2];
              const score = scores[params.dataIndex];
              if (score >= 70) return '#65B581';
              if (score >= 40) return '#FFCE34';
              return '#FD665F';
            }
          }
        }
      ]
    };
    budgetDetailsChart.setOption(budgetDetailsOption);

    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        budgetComparisonChart.resize();
        metricsRadarChart.resize();
        departmentAllocationChart.resize();
        budgetTrendChart.resize();
        budgetDetailsChart.resize();
    });
});