// 初始化所有图表
function initCharts() {
    // 更新当前时间
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 初始化图表
    initSupplierLevelChart();
    initSupplierRegionChart();
    initSupplierYearsChart();
    initSupplierQualityChart();
    initSupplierDeliveryChart();
    initSupplierTop10Chart();
    
    // 窗口大小改变时重新调整图表大小
    window.addEventListener('resize', function() {
        resizeAllCharts();
    });
}

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = timeString;
}

// 调整所有图表大小
function resizeAllCharts() {
    const chartInstances = [
        supplierLevelChart,
        supplierRegionChart,
        supplierYearsChart,
        supplierQualityChart,
        supplierDeliveryChart,
        supplierTop10Chart
    ];
    
    chartInstances.forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// 供应商等级分布地图
let supplierLevelChart;
function initSupplierLevelChart() {
    supplierLevelChart = echarts.init(document.getElementById('supplier-level-chart'));
    
    // 模拟各省份供应商等级数据 - 钛材主要产区
    const mapData = [
        {name: '北京', value: 89, level: 'A级', isTitanium: false},
        {name: '天津', value: 67, level: 'B级', isTitanium: false},
        {name: '上海', value: 95, level: 'A级', isTitanium: false},
        {name: '重庆', value: 45, level: 'C级', isTitanium: false},
        {name: '河北', value: 78, level: 'B级', isTitanium: false},
        {name: '河南', value: 56, level: 'C级', isTitanium: false},
        {name: '云南', value: 34, level: 'D级', isTitanium: false},
        {name: '辽宁', value: 72, level: 'B级', isTitanium: true},
        {name: '黑龙江', value: 23, level: 'D级', isTitanium: false},
        {name: '湖南', value: 83, level: 'A级', isTitanium: false},
        {name: '安徽', value: 61, level: 'B级', isTitanium: false},
        {name: '山东', value: 91, level: 'A级', isTitanium: true},
        {name: '新疆', value: 18, level: 'E级', isTitanium: false},
        {name: '江苏', value: 87, level: 'A级', isTitanium: false},
        {name: '浙江', value: 79, level: 'B级', isTitanium: true},
        {name: '江西', value: 52, level: 'C级', isTitanium: false},
        {name: '湖北', value: 68, level: 'B级', isTitanium: false},
        {name: '广西', value: 41, level: 'C级', isTitanium: false},
        {name: '甘肃', value: 29, level: 'D级', isTitanium: false},
        {name: '山西', value: 58, level: 'C级', isTitanium: true},
        {name: '内蒙古', value: 35, level: 'D级', isTitanium: false},
        {name: '陕西', value: 64, level: 'B级', isTitanium: true},
        {name: '吉林', value: 47, level: 'C级', isTitanium: false},
        {name: '福建', value: 73, level: 'B级', isTitanium: false},
        {name: '贵州', value: 31, level: 'D级', isTitanium: false},
        {name: '广东', value: 92, level: 'A级', isTitanium: false},
        {name: '青海', value: 15, level: 'E级', isTitanium: false},
        {name: '西藏', value: 12, level: 'E级', isTitanium: false},
        {name: '四川', value: 69, level: 'B级', isTitanium: true},
        {name: '宁夏', value: 26, level: 'D级', isTitanium: false},
        {name: '海南', value: 38, level: 'C级', isTitanium: false},
        {name: '台湾', value: 0, level: '无数据', isTitanium: false},
        {name: '香港', value: 0, level: '无数据', isTitanium: false},
        {name: '澳门', value: 0, level: '无数据', isTitanium: false}
    ];
    
    const option = {
        title: {
            text: '供应商等级地域分布',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#333',
                fontSize: 18
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.data) {
                    return params.name + '<br/>供应商数量: ' + params.data.value + '<br/>等级: ' + params.data.level;
                }
                return params.name + '<br/>暂无数据';
            }
        },
        visualMap: {
              min: 0,
              max: 100,
              left: 'left',
              top: 'bottom',
              text: ['高', '低'],
              calculable: true,
              inRange: {
                  color: ['#f5f5f5', '#e8f4fd', '#d1e9f6', '#b3d9f2', '#7cc7e8', '#42a5cc', '#1e88a8']
              },
              textStyle: {
                  color: '#666'
              },
              itemWidth: 15,
              itemHeight: 140
          },
        geo: {
               map: 'china',
               roam: true,
               zoom: 1.6,
               center: [104.0, 37.5],
               aspectScale: 0.85,
               label: {
                   show: true,
                   fontSize: '8',
                   color: '#666',
                   fontFamily: 'Arial, sans-serif'
               },
               itemStyle: {
                   areaColor: '#f5f5f5',
                   borderColor: '#d4d4d4',
                   borderWidth: 0.8,
                   shadowColor: 'rgba(0, 0, 0, 0.1)',
                   shadowOffsetX: 1,
                   shadowOffsetY: 1,
                   shadowBlur: 3
               },
               emphasis: {
                   itemStyle: {
                       areaColor: '#e6f7ff',
                       borderColor: '#40a9ff',
                       borderWidth: 1.5,
                       shadowColor: 'rgba(64, 169, 255, 0.3)',
                       shadowOffsetX: 0,
                       shadowOffsetY: 0,
                       shadowBlur: 8
                   },
                   label: {
                       show: true,
                       fontSize: '9',
                       fontWeight: '500',
                       color: '#1890ff'
                   }
               }
           },
        series: [
              {
                  name: '供应商分布',
                  type: 'map',
                  geoIndex: 0,
                  data: mapData.map(item => ({
                      ...item,
                      itemStyle: item.isTitanium ? {
                          areaColor: '#1890ff',
                          borderColor: '#d4d4d4',
                          borderWidth: 0.8,
                          shadowColor: 'rgba(24, 144, 255, 0.2)',
                          shadowOffsetX: 1,
                          shadowOffsetY: 1,
                          shadowBlur: 4
                      } : {
                          areaColor: '#fafafa',
                          borderColor: '#d4d4d4',
                          borderWidth: 0.8
                      }
                  }))
              }
          ]
    };
    
    // 使用备用的柱状图显示供应商等级分布
    const fallbackOption = {
        title: {
            text: '供应商等级分布',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#333',
                fontSize: 18
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['A级', 'B级', 'C级', 'D级', 'E级'],
            top: 50,
            textStyle: {
                color: '#333'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['华东', '华北', '华南', '华中', '西南', '东北', '西北'],
            axisLabel: {
                color: '#333'
            },
            axisLine: {
                lineStyle: {
                    color: '#333'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '供应商数量',
            nameTextStyle: {
                color: '#333'
            },
            axisLabel: {
                color: '#333'
            },
            axisLine: {
                lineStyle: {
                    color: '#333'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        series: [
            {
                name: 'A级',
                type: 'bar',
                stack: 'total',
                data: [, 32, 28, 18, 12, 8, 5],
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: 'B级',
                type: 'bar',
                stack: 'total',
                data: [13, 10, 7, 3, 9, 10, 5],
                itemStyle: {
                    color: '#52c41a'
                }
            },
            {
                name: 'C级',
                type: 'bar',
                stack: 'total',
                data: [25, 18, 15, 12, 8, 5, 3],
                itemStyle: {
                    color: '#faad14'
                }
            },
            {
                name: 'D级',
                type: 'bar',
                stack: 'total',
                data: [12, 8, 6, 5, 4, 3, 2],
                itemStyle: {
                    color: '#ff7875'
                }
            },
            {
                name: 'E级',
                type: 'bar',
                stack: 'total',
                data: [5, 3, 2, 2, 1, 1, 1],
                itemStyle: {
                    color: '#d9d9d9'
                }
            }
        ]
    };
    
    supplierLevelChart.setOption(fallbackOption);
}

// 供应商地域分布图
let supplierRegionChart;
function initSupplierRegionChart() {
    supplierRegionChart = echarts.init(document.getElementById('supplier-region-chart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        series: [
            {
                name: '地域分布',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: [
                    { value: 235, name: '华东地区' },
                    { value: 187, name: '华北地区' },
                    { value: 149, name: '华南地区' },
                    { value: 98, name: '华中地区' },
                    { value: 76, name: '西南地区' },
                    { value: 65, name: '东北地区' },
                    { value: 43, name: '西北地区' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }
        ]
    };
    
    supplierRegionChart.setOption(option);
}

// 供应商合作年限分布图
let supplierYearsChart;
function initSupplierYearsChart() {
    supplierYearsChart = echarts.init(document.getElementById('supplier-years-chart'));
    
    const option = {
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
            boundaryGap: [0, 0.01],
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['10年以上', '5-10年', '3-5年', '1-3年', '1年以内'],
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            }
        },
        series: [
            {
                name: '供应商数量',
                type: 'bar',
                data: [78, 145, 203, 267, 189],
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#1a3a8f', '#2a56c6', '#5fa8d3', '#8ecae6', '#c1e0f7'];
                        return colorList[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    color: '#ffffff'
                }
            }
        ]
    };
    
    supplierYearsChart.setOption(option);
}

// 供应商质量评级图
let supplierQualityChart;
function initSupplierQualityChart() {
    supplierQualityChart = echarts.init(document.getElementById('supplier-quality-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['合格率', '退货率', '投诉次数'],
            textStyle: {
                color: '#ffffff'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    color: '#ffffff'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '百分比',
                min: 0,
                max: 100,
                interval: 20,
                nameTextStyle: {
                    color: '#ffffff'
                },
                axisLabel: {
                    formatter: '{value}%',
                    color: '#ffffff'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            {
                type: 'value',
                name: '次数',
                min: 0,
                max: 50,
                interval: 10,
                nameTextStyle: {
                    color: '#ffffff'
                },
                axisLabel: {
                    color: '#ffffff'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        ],
        series: [
            {
                name: '合格率',
                type: 'line',
                data: [98.5, 98.2, 98.7, 99.1, 98.9, 99.3, 99.0, 98.8, 99.2, 99.5, 99.3, 99.6],
                itemStyle: {
                    color: '#2f9e44'
                }
            },
            {
                name: '退货率',
                type: 'line',
                data: [1.2, 1.5, 1.1, 0.8, 0.9, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.3],
                itemStyle: {
                    color: '#fa5252'
                }
            },
            {
                name: '投诉次数',
                type: 'bar',
                yAxisIndex: 1,
                data: [12, 15, 11, 8, 9, 6, 8, 10, 7, 4, 6, 3],
                itemStyle: {
                    color: '#ff922b'
                }
            }
        ]
    };
    
    supplierQualityChart.setOption(option);
}

// 供应商交货准时率图
let supplierDeliveryChart;
function initSupplierDeliveryChart() {
    supplierDeliveryChart = echarts.init(document.getElementById('supplier-delivery-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        radar: {
            indicator: [
                { name: 'A级供应商', max: 100 },
                { name: 'B级供应商', max: 100 },
                { name: 'C级供应商', max: 100 },
                { name: 'D级供应商', max: 100 },
                { name: 'E级供应商', max: 100 }
            ],
            radius: '65%',
            name: {
                textStyle: {
                    color: '#ffffff'
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
                }
            }
        },
        series: [
            {
                name: '交货准时率',
                type: 'radar',
                data: [
                    {
                        value: [99.5, 97.8, 95.2, 89.7, 82.3],
                        name: '准时率',
                        areaStyle: {
                            color: 'rgba(42, 86, 198, 0.4)'
                        },
                        itemStyle: {
                            color: '#2a56c6'
                        }
                    }
                ]
            }
        ]
    };
    
    supplierDeliveryChart.setOption(option);
}

// TOP 10供应商综合评分图
let supplierTop10Chart;
function initSupplierTop10Chart() {
    supplierTop10Chart = echarts.init(document.getElementById('supplier-top10-chart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['质量评分', '交付评分', '服务评分', '价格评分', '综合评分'],
            textStyle: {
                color: '#ffffff'
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
            boundaryGap: [0, 0.01],
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['宝钛集团', '西部材料', '湖南金天', '云南钛业', '攀钢钛业', 
                  '朝阳金达', '洛阳双瑞', '上海宝钢', '广东东方', '江苏天工'],
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            }
        },
        series: [
            {
                name: '质量评分',
                type: 'bar',
                stack: 'total',
                data: [98, 97, 96, 95, 94, 93, 92, 91, 90, 89],
                itemStyle: {
                    color: '#2f9e44'
                }
            },
            {
                name: '交付评分',
                type: 'bar',
                stack: 'total',
                data: [97, 96, 95, 94, 93, 92, 91, 90, 89, 88],
                itemStyle: {
                    color: '#5fa8d3'
                }
            },
            {
                name: '服务评分',
                type: 'bar',
                stack: 'total',
                data: [96, 95, 94, 93, 92, 91, 90, 89, 88, 87],
                itemStyle: {
                    color: '#fcc419'
                }
            },
            {
                name: '价格评分',
                type: 'bar',
                stack: 'total',
                data: [95, 94, 93, 92, 91, 90, 89, 88, 87, 86],
                itemStyle: {
                    color: '#ff922b'
                }
            },
            {
                name: '综合评分',
                type: 'bar',
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                    color: '#ffffff'
                },
                data: [96.5, 95.5, 94.5, 93.5, 92.5, 91.5, 90.5, 89.5, 88.5, 87.5],
                itemStyle: {
                    color: '#1a3a8f'
                }
            }
        ]
    };
    
    supplierTop10Chart.setOption(option);
}

// 页面加载完成后初始化所有图表
document.addEventListener('DOMContentLoaded', initCharts);