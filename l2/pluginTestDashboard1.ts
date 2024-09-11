/// <mls shortName="pluginTestDashboard1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('plugin-test-dashboard1-100554')
export class PluginTestDashboard1100554 extends LitElement {


    @property() dashboardindex: string = '';
    @property() scope: 'detail' | 'dashboard' = 'dashboard';
    @property() chartData = {};

    createRenderRoot() {
        return this;
    }

    async prepare() {
        await this.delay(5000);
        await import('./_100554_wcChart');
        this.chartData = {
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
        }

        this.innerHTML = `<wc-chart-100554 renderer="svg" datasource=${JSON.stringify(this.chartData)}></wc-chart-100554>`;

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
