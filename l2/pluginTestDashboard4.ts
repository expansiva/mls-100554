/// <mls shortName="pluginTestDashboard4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('plugin-test-dashboard4-100554')
export class PluginTestDashboard1100554 extends LitElement {


    @property() dashboardindex: string = '';
    @property() scope: 'detail' | 'dashboard' = 'dashboard';
    @property() chartData = {};

    createRenderRoot() {
        return this;
    }

    async prepare() {
        await this.delay(1000);
        await import('./_100554_wcChart');
        this.chartData = {
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
        }

        this.innerHTML = `<wc-chart-100554 datasource=${JSON.stringify(this.chartData)}></wc-chart-100554>`;

    }

    private async delay(timeout: number) {
        await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    render() {
        this.style.display = 'block';
        this.style.width = '100%';
        this.style.height = '100%';
        return html``;
    }
}