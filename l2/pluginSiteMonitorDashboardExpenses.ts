/// <mls shortName="pluginSiteMonitorDashboardExpenses" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';

export const pluginData: mls.plugin.IPluginData = {
    title: "Expenses",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22"  style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>
    `;
    }
};

export class PluginSiteMonitorDashboardExpenses extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartData = {};

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
        function escapeHTML(str:string) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        if (this.body) this.body.innerHTML = `<wc-chart-100554 renderer="svg" datasource="${escapeHTML(data)}"></wc-chart-100554>`;

    }

    // firstUpdated() {
    //     if (!this.body) return;
    //     this.body.style.height = '500px';
    //     this.body.style.width = '800px';
    //     this.prepare();
    // }

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
            padding: 20px;
            border-radius: 8px;
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
