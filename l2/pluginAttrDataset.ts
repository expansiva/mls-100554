/// <mls fileReference="_100554_/l2/pluginAttrDataset.ts" group="other" enhancement="_100554_enhancementLit" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    msg: 'Em desenvolvimento'
}

const message_en = {
    msg: 'In development',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Config attr dataset",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"/></svg>
    `;
    }
};

export class PluginAttrDataSet extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @state() expandedPaths: Set<string> = new Set();
    @state() selectedPath = '';
    @property({ type: Object }) data = {};

    constructor() {
        super();
        this.init();
    }

    //--------COMPONENT------------

    render() {

        // <style>${this.css}</style>
        return html`
            

            <h3>Item:</h3>
            <div style="display:flex; align-items: center; gap: .5rem; margin-bottom:1rem;">
                <p style="width:calc(100% - 45px)">${this.selectedPath || 'Nenhum item selecionado'}</p>
                <button style="width:30px; height: 26px;" @click="${this.setConfig}">ok</button>
            </div>

            <h3>State</h3>
            ${this.renderTree(this.data)}
    
        `;
    }

    renderTree(data: any, path = ''): any {
        return html`
            <ul class="tree">
                ${Object.entries(data).map(([key, value]) => { return this.renderTreeItem(path, key, value) })}
            </ul>
        `;
    }

    renderTreeItem(path: string, key: string, value: any) {

        const newPath = path ? `${path}.${key}` : key;
        const isExpandable = typeof value === 'object' && value !== null;
        const isExpanded = this.expandedPaths.has(newPath);
        const vString = isExpandable ? '' : value;
        return html`
            <li>
                <div class="item ${this.selectedPath === newPath ? 'selected' : ''}">
                    <span class="toggle" @click=${() => this.toggleExpand(newPath)}>
                    ${isExpandable ? html`<span class="bullet"></span>` : ''}
                    </span>
                    <span @click=${() => this.selectItem(newPath)}><strong>${key}:</strong> ${vString}</span>
                </div>
                ${isExpanded && isExpandable ? this.renderTree(value, newPath) : ''}
            </li>
        `;
    }

    //-------IMPLEMENTS-------------

    private setConfig() {
        const evento = new CustomEvent('setconfig', {
            detail: { vl: `{{${this.selectedPath}}}` },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(evento);

    }

    private toggleExpand(path: string) {
        const newPaths = new Set(this.expandedPaths);
        if (newPaths.has(path)) {
            newPaths.delete(path);
        } else {
            newPaths.add(path);
        }
        this.expandedPaths = newPaths;
    }

    private selectItem(path: string) {
        path = this.formatPath(path);
        this.selectedPath = path;
    }

    private formatPath(path: string): string {
        return path.replace(/(\.\d+)(?=\.|$)/g, match => `[${match.slice(1)}]`);
    }

    private init() {

        const state = this.getState();
        this.data = state;
    }

    private getState(): any | undefined {


        let preview = window.preview?.iframe as HTMLIFrameElement;
        if (!preview) {
            preview = top?.preview?.iframe as HTMLIFrameElement;
        }

        if (!preview) {
            return {};
        }

        return (preview.contentWindow as any)?._ica;

    }

    private css = `
        plugin-attr-dataset-100554 {
            font-family: Arial, sans-serif;
            padding: 1rem;
            display: block;
            font-size: 13px;
        }

        plugin-attr-dataset-100554 h3{
            margin-top:.5rem
        }

        plugin-attr-dataset-100554 p{
            border:1px solid #ddd;
            border-radius:3px;
            margin:0px;
            padding:.3rem;
        }

        plugin-attr-dataset-100554 button {
            padding: 0 .3rem;
            background-color: #1890FF;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;

        }

        plugin-attr-dataset-100554    button:hover {
            opacity: .5;

        }

        .tree {
            list-style: none;
            padding-left: 15px;
            border-left: 2px solid #ddd;
            margin-left: 8px;
        }
        .item {
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            position: relative;
        }
        .toggle {
            width: 12px;
            height: 12px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-right: 8px;
            font-weight: bold;
            user-select: none;
            color: #555;
        }
        .bullet {
            width: 8px;
            height: 8px;
            background-color: #555;
            border-radius: 50%;
            display: inline-block;
        }
        .selected {
            background-color: lightblue;
            border-radius: 4px;
        }
    `;

}

if (!customElements.get('plugin-attr-dataset-100554')) {
    customElements.define('plugin-attr-dataset-100554', PluginAttrDataSet);
}