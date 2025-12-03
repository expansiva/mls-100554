/// <mls shortName="widgetCollabChart" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { propertyDataSource } from '/_100554_/l2/collabDecorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

declare var echarts: any;

@customElement('widget-collab-chart-100554')
export class WcEchartsPie100554 extends StateLitElement {

    @propertyDataSource({ type: String }) data: any | undefined;

    @property({ type: String }) chartTitle = '';

    @property({ type: String }) framework: 'echarts' = 'echarts';

    @property({ type: String }) renderer: 'canvas' | 'svg' = 'canvas';

    @query('.echart-main') main: HTMLDivElement | undefined;

    private myChart: any;

    updated(changedProperties: Map<string | number | symbol, unknown>) {

        if (changedProperties.has('framework') && this.framework === 'echarts') {
            if (!(window as any).echartsLoaded) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/echarts@latest';
                script.onload = () => {
                    (window as any).echartsLoaded = true;
                    this.initChart();
                };
                document.head.appendChild(script);
            } else {
                this.initChart();
            }
        }
    }

    private waitForLoadIfNeeded(callback: () => void, timeout: number = 10000, interval: number = 100) {
        let elapsedTime = 0;
        const checkVariable = () => {
            if ((window as any).echartsLoaded) {
                callback();
            } else if (elapsedTime < timeout) {
                elapsedTime += interval;
                setTimeout(checkVariable, interval);
            } else {
                console.error(`Error on load echarts.js. please try again`);
            }
        };
        checkVariable();
    }


    initChart() {
        const that = this;
        if (!this.data) return;

        if (typeof this.data === 'string') {
            try {
                this.data = JSON.parse(this.data);
            } catch (e) {
                this.data = {};
            }
        }

        if (this.chartTitle) {
            if (!this.data.title) this.data.title = {};
            this.data.title.text = this.chartTitle;
        }

        this.waitForLoadIfNeeded(() => {
            if (that.myChart) {
                that.myChart.setOption(that.data);
                return;
            }
            if (!that.main || !echarts) return;
            that.myChart = echarts.init(that.main, undefined, { renderer: this.renderer });
            that.myChart.setOption(that.data);
        });

    }

    firstUpdated() {
        this.initChart();
    }

    render() {
        return html`<div class="echart-main" style="width:100%; height:100%;"></div>`;
    }


}