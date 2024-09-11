/// <mls shortName="pluginTestDashboard2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('plugin-test-dashboard2-100554')
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
