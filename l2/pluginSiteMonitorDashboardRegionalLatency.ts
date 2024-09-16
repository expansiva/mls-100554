/// <mls shortName="pluginSiteMonitorDashboardRegionalLatency" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';

export const pluginData: mls.plugin.IPluginData = {
    title: "Regional Latency",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M384 476.1L192 421.2l0-385.3L384 90.8l0 385.3zm32-1.2l0-386.5L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3l0 334.8c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2l0 386.5L32.9 474.5C17.1 480.8 0 469.2 0 452.2L0 117.4c0-9.8 6-18.6 15.1-22.3z"/></svg>
    `;
    }
};

export class PluginSiteMonitorDashboardRegionalLatency extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartDataBar = {};

    @property() chartDataMap = {};


    @property({ type: Boolean }) autoPrepare: boolean = false;

    @query('.plugin-body') body: HTMLDivElement | undefined;

    @query('.bar') bar: HTMLDivElement | undefined;

    @query('.map') map: HTMLDivElement | undefined;

    async prepare() {

        await import('./_100554_wcChart');

        this.chartDataBar = {
            "title": {
                "text": "Regional Latency (ms)",
            },
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            "legend": {
                "data": ["Latency"]
            },
            "xAxis": {
                "type": "category",
                "data": ["North America", "Europe", "Asia", "South America", "Africa", "Australia"]
            },
            "yAxis": {
                "type": "value",
                "name": "Response Time (ms)",
                "axisLabel": {
                    "formatter": "{value} ms"
                }
            },
            "series": [
                {
                    "name": "Latency",
                    "type": "bar",
                    "data": [120, 150, 200, 180, 220, 130],
                    "markPoint": {
                        "data": [
                            { "type": "max", "name": "Max Latency" },
                            { "type": "min", "name": "Min Latency" }
                        ]
                    },
                    "markLine": {
                        "data": [
                            { "type": "average", "name": "Average Latency" }
                        ]
                    },
                    "itemStyle": {
                        "color": "#5470C6"
                    }
                }
            ],
            "toolbox": {
                "feature": {
                    "saveAsImage": {
                        "title": "Save"
                    }
                }
            },
            "grid": {
                "left": "3%",
                "right": "4%",
                "bottom": "3%",
                "containLabel": true
            }
        };

        await this.updateComplete;
        const dataBar = JSON.stringify(this.chartDataBar);
        const dataMap = JSON.stringify(this.chartDataMap);

        function escapeHTML(str: string) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        if (this.bar) this.bar.innerHTML = `<wc-chart-100554 renderer="svg" datasource="${escapeHTML(dataBar)}"></wc-chart-100554>`;
        // if (this.map) this.map.innerHTML = `<wc-chart-100554 renderer="svg" datasource="${escapeHTML(dataMap)}"></wc-chart-100554>`;


    }

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {
        this.style.display = 'block';
        this.style.width = '100%';
        this.style.height = '100%';
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <div>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </div>
                <select @change=${this.handleChange}>
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="mounth">Last 30 days</option>
                    <option value="all">All Time</option>
                </select>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body">
            <div class="bar"></div>
            <div class="map"></div>


        </div>`;
    }

    handleChange(e: MouseEvent) {
        const target = e.target as HTMLSelectElement;
        const value = target.value;
        this.filter = value;
        this.prepare();
    }

    static styles = css`

        .plugin-body{
            height:100%;
            width:100%;
        }
        .plugin-body > div{
            height:100%;
            width:100%;
        }
        .plugin-container {
            background-color: #f4f5ff;
            border-radius: 8px;
            padding: 10px 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            height:100%;
            width:100%;
        }

        header {
            display: flex;
            align-items: center;
            gap:3rem;
            margin-bottom: 16px;
        }
        header > div{
            display:flex;
            gap:.5rem;
        }

        icon {
            margin-right: 10px;
        }

        h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
            color: #333;
        }

        small {
            color: #888;
            margin-left: auto;
            font-size: 14px;
        }

        p {
            font-size: 16px;
            color: #555;
        }
        select {
            border-radius: 13px;
            border: 1px solid #cecece;
            padding: .3rem;
            cursor: pointer;
            outline: none;
        }
    `;


}

if (!customElements.get('plugin-site-monitor-dashboard-regional-latency-100554')) {
    customElements.define('plugin-site-monitor-dashboard-regional-latency-100554', PluginSiteMonitorDashboardRegionalLatency);
}
