/// <mls shortName="testCharts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';
import { Window } from './_100554_icaState';

@customElement('test-charts-100554')
export class TestCharts100554 extends CollabPageElement {

    initPage() {
        (window as any as Window).globalState = {
            plugin1: {
                chart: {
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['Sun', 43.3, 85.8, 93.7],
                            ['Mon', 83.1, 73.4, 55.1],
                            ['Tue', 86.4, 65.2, 82.5],
                            ['Wed', 72.4, 53.9, 39.1],
                            ['Thu', 43.3, 85.8, 93.7],
                            ['Fri', 83.1, 73.4, 55.1],
                            ['Sat', 43.3, 85.8, 93.7],
                        ]
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [{
                        type: 'bar',
                        itemStyle: {
                            color: (p: any) => {
                                const colorList = ["#f68a55", "#f68a55", "#f68a55", "#f68a55", "#f68a55", "#f68a55", "#f68a55"];
                                return colorList[p.dataIndex];
                            }
                        }
                    }, {
                        type: 'bar',
                        itemStyle: {
                            color: (p: any) => {
                                const colorList = ["#f4b491", "#f4b491", "#f4b491", "#f4b491", "#f4b491", "#f4b491", "#f4b491"];
                                return colorList[p.dataIndex];
                            }
                        }
                    }, {
                        type: 'bar',
                        itemStyle: {
                            color: (p: any) => {
                                const colorList = ["#f8c9bc", "#f8c9bc", "#f8c9bc", "#f8c9bc", "#f8c9bc", "#f8c9bc", "#f8c9bc"];
                                return colorList[p.dataIndex];
                            }
                        }
                    }]
                },
                chart2: {
                    "tooltip": { "trigger": "axis" },
                    "xAxis": { "type": "category", "data": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
                    "yAxis": { "type": "value" },
                    "series": [
                        {
                            "name": "Lorem",
                            "type": "line",
                            "smooth": true,
                            "data": [10, 15, 23, 30, 18, 22, 16]
                        },
                        {
                            "name": "Ipsum",
                            "type": "line",
                            "smooth": true,
                            "data": [20, 10, 18, 25, 27, 17, 22]
                        }
                    ]
                },
                chart3: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['Oct', 'Nov', 'Dec', 'Jan']
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: false
                            },
                            color: "#979df5",
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334]
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: false
                            },
                            color: "#656def",
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134]
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: false
                            },
                            color: "#989cf7",
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234]
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: false
                            },
                            color: "#656def",
                            height: "20px",
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154]
                        },
                    ]
                },
                chart4: {
                    "tooltip": {
                        "trigger": "item"
                    },
                    "legend": {
                        "top": "5%",
                        "left": "center"
                    },
                    "series": [
                        {
                            "name": "Access From",
                            "type": "pie",
                            "radius": ["40%", "70%"],
                            "avoidLabelOverlap": false,
                            "itemStyle": {
                                "borderRadius": 10
                            },
                            "label": {
                                "show": false,
                                "position": "center",
                                "formatter": "{d}%",  // Aqui você formata para mostrar a porcentagem
                                "fontSize": 20,
                                "fontWeight": "bold",
                                "color": "#333"
                            },
                            "emphasis": {
                                "label": {
                                    "show": true,
                                    "fontSize": "30",
                                    "fontWeight": "bold",
                                    "formatter": "{d}%"  // Exibe a porcentagem com ênfase
                                }
                            },
                            "labelLine": {
                                "show": false
                            },
                            "data": [
                                { "value": 1048, "name": "Search Engine" },
                                { "value": 735, "name": "Direct" }
                            ]
                        }
                    ]
                },
                chart5: {
                    "series": [
                        {
                            "type": "gauge",
                            "progress": {
                                "show": true,
                                "width": 18
                            },
                            "axisLine": {
                                "lineStyle": {
                                    "width": 18
                                }
                            },
                            "axisTick": {
                                "show": false
                            },
                            "splitLine": {
                                "length": 15,
                                "lineStyle": {
                                    "width": 2,
                                    "color": "#999"
                                }
                            },
                            "axisLabel": {
                                "distance": 25,
                                "color": "#999",
                                "fontSize": 20,
                                "formatter": function (value: string) {
                                    return value + '%';
                                }
                            },
                            "anchor": {
                                "show": true,
                                "showAbove": true,
                                "size": 25,
                                "itemStyle": {
                                    "borderWidth": 10
                                }
                            },
                            "title": {
                                "show": false
                            },
                            "detail": {
                                "valueAnimation": true,
                                "fontSize": 30,
                                "formatter": function (value: string) {
                                    return value + '%';
                                },
                                "offsetCenter": [0, "70%"]
                            },
                            "data": [
                                {
                                    "value": 75,
                                    "formatter": function (value: string) {
                                        return value + '%';

                                    }

                                }
                            ]
                        }
                    ]
                },
                chart6: {
                    "visualMap": {
                        "show": false,
                        "min": 0,
                        "max": 100,
                        "inRange": { "color": ["#e0ffff", "#006edd"] }
                    },
                    "calendar": {
                        "range": "2024-01",
                        "cellSize": ["auto", 20],
                        "orient": "vertical",
                        "yearLabel": { "show": false },
                        "dayLabel": { "firstDay": 1, "nameMap": "en" },
                        "monthLabel": { "show": false }
                    },
                    "series": [
                        {
                            "type": "heatmap",
                            "coordinateSystem": "calendar",
                            "data": [
                                ["2024-01-01", 100],
                                ["2024-01-02", 50],
                                ["2024-01-14", 75]
                            ]
                        }
                    ]
                },
                chart7: {
                    color: [],
                    title: {
                        text: 'Gradient Stacked Area Chart'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: []
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'Line 1',
                            type: 'line',
                            stack: 'Total',
                            smooth: true,
                            lineStyle: {
                                width: 0
                            },
                            showSymbol: false,
                            areaStyle: {
                                opacity: 0.8,
                                color: 'rgb(128, 255, 165)',
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: [140, 232, 101, 264, 90, 340, 250]
                        },
                        {
                            name: 'Line 2',
                            type: 'line',
                            stack: 'Total',
                            smooth: true,
                            lineStyle: {
                                width: 0
                            },
                            showSymbol: false,
                            areaStyle: {
                                opacity: 0.8,
                                color: 'rgb(77, 119, 255)',
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 282, 111, 234, 220, 340, 310]
                        },
                    ]
                },
                chart8: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '3%',
                        bottom: '10%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    yAxis: [
                        {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                formatter: function (value: string) {
                                    return `{value|${value}}`;
                                },
                                rich: {
                                    value: {
                                        color: '#000',
                                        align: 'center',
                                        padding: [5, 0, 0, 0]
                                    }
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'Direct',
                            type: 'bar',
                            barWidth: '20%',  // Ajuste a largura da barra
                            data: [10, 52, 200, 334, 390, 330, 220],
                            itemStyle: {
                                borderRadius: [4, 4, 4, 4]  // Borda arredondada para as barras
                            },
                            label: {
                                show: true,
                                position: 'right'  // Posição do rótulo à direita de cada barra
                            }
                        }
                    ]
                }


            }

        };
    }


    /// **collab_events_start**
    handleClickbuttonSum() {
        // here or code for event
    }

}
