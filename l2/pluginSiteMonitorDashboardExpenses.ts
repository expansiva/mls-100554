/// <mls shortName="pluginSiteMonitorDashboardExpenses" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';

export const pluginData: mls.plugin.IPluginData = {
    title: "Expenses",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
    `;
    }
};

export class PluginSiteMonitorDashboardExpenses extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartData = {};

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @query('.plugin-body') body: HTMLDivElement | undefined;


    async prepare() {

        await import('./_100554_wcChart');

        this.chartData = {
            title: {
                text: "Expense Breakdown",
                subtext: "Total Expenses: $920",
                left: "center"
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: ${c} ({d}%)"
            },
            legend: {
                orient: "vertical",
                left: "left",
                data: ["CDN", "EC2", "Database", "Domain", "Others"]
            },
            series: [
                {
                    name: "Expenses",
                    type: "pie",
                    radius: "50%",
                    data: [
                        { "value": 300, "name": "CDN" },
                        { "value": 250, "name": "EC2" },
                        { "value": 200, "name": "Database" },
                        { "value": 100, "name": "Domain" },
                        { "value": 70, "name": "Others" }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        title: "Save"
                    }
                }
            }
        }
        await this.updateComplete;
        const data = JSON.stringify(this.chartData);
        function escapeHTML(str: string) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        if (this.body) this.body.innerHTML = `<wc-chart-100554 renderer="svg" datasource="${escapeHTML(data)}"></wc-chart-100554>`;

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
        return html`<div class="plugin-body"></div>`;
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

if (!customElements.get('plugin-site-monitor-dashboard-expenses-100554')) {
    customElements.define('plugin-site-monitor-dashboard-expenses-100554', PluginSiteMonitorDashboardExpenses);
}
