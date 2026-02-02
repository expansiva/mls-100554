/// <mls shortName="pluginViewMindMap" project="100554" enhancement="_100554_enhancementLit" />

import { svg, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import {  MindMapData, getMindMapByName, setMindMapVariable } from '/_100554_/l2/libMindMap.js'
import '/_100554_/l2/widgetMindMapL4.js';


export const pluginData: mls.plugin.IPluginData = {
    title: "View mindMap",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

export class PluginViewMindMap extends PluginBaseModule {

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property({ type: String }) page: string = '';
    @property({ type: String }) initialNode: string | undefined;
    @property({ type: String }) dataJson: MindMapData | undefined;

    firstUpdated() {
        if (!this.autoPrepare) return;
        setMindMapVariable([]);
        this.prepare();

    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('page');
        if (propMode) {
            this.init();
        }
    }

    render() {
        if (!this.dataJson) return html`No valid defs found in this ${this.page}`;
        return html`<widget-mind-map-l4-100554 .mapState=${this.dataJson} initialNode="${this.initialNode}"></widget-mind-map-l4-100554>`
    }


    async prepare() {
        await this.init();
    }

    //------******* IMPLEMENTATION **----------- 

    private async init() {

        if (!this.page) return;
        await this.getJson();

    }

    private async getJson() {
        this.dataJson = await getMindMapByName(this.page);
    }

    
    
}

if (!customElements.get('plugin-view-mind-map-100554')) {
    customElements.define('plugin-view-mind-map-100554', PluginViewMindMap);
}