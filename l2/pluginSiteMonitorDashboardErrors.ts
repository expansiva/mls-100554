/// <mls shortName="pluginSiteMonitorDashboardErrors" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';

export const pluginData: mls.plugin.IPluginData = {
  title: "Errors",
  getSvg(): TemplateResult {
    return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="14" font-weight="bold">E</text>
      </svg>
    `;
  }
};

export class PluginSiteMonitorDashboardErrors extends PluginBaseModule {

    @property ({ type: String }) filter: string = "last 30 days";

    render(): TemplateResult {
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
                <icon>${pluginData.getSvg()}</icon>
                <h2>${this.title}</h2>
                <small>Filter: ${this.filter}</small>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        return html`<p>Billing data is in development...</p>`;
    }

static styles = css`
        .plugin-container {
            background-color: #f4f5ff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
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
    `;


}

if (!customElements.get('plugin-site-monitor-dashboard-errors-100554')) {
  customElements.define('plugin-site-monitor-dashboard-errors-100554', PluginSiteMonitorDashboardErrors);
}
