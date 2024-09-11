/// <mls shortName="pluginTestDashboard3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('plugin-test-dashboard3-100554')
export class PluginTestDashboard1100554 extends LitElement {


    @property() dashboardindex: string = '';
    @property() scope: 'detail' | 'dashboard' = 'dashboard';
    @property() chartData = {};

    createRenderRoot() {
        return this;
    }

    async prepare() {
        await this.delay(3000);
        await import('./_100554_wcChart');
        this.chartData = {
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