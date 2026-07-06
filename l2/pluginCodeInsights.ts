/// <mls fileReference="_100554_/l2/pluginCodeInsights.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { getAllDefs, IdefModule } from '/_102027_/l2/libMindMap.js';  

export class pluginCodeInsights extends PluginBaseModule {


    @state() private error: string = '';
    @state() allItens: Record<string, IdefModule> | undefined;
    @state() element: Required<CodeInsights> | undefined;
    @state() private activeCategory: keyof CodeInsights | null = null;
    @state() private selectedFile: string | null = null;

    firstUpdated() {
        this.loadDefs();
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
    }

    render(): TemplateResult {

        if (!this.element) {
            return html`<div class="empty">No code insights found</div>`;
        }

        const categories = Object.entries(this.element)
            .filter(([_, files]) => Object.keys(files).length > 0);

        return html`
        <div class="agent-box">
            ${this.renderHeader()}
            <div class="layout">
                <!-- SIDEBAR -->
                <aside class="sidebar">
                    ${categories.map(([category, files]) => html`
                        <div
                            class="menu-item ${this.activeCategory === category ? 'active' : ''}"
                            @click=${() => this.activeCategory = category as keyof CodeInsights}
                        >
                            <span class="menu-label">
                                ${this.formatCategory(category)}
                            </span>
                            <span class="menu-count">
                                ${Object.keys(files).length}
                            </span>
                        </div>
                    `)}
                </aside>

                <!-- CONTENT -->
                <section class="content">
                    ${this.activeCategory ? html`

                        ${!this.selectedFile ? html`

                            <!-- LISTA DE ARQUIVOS -->
                            <ul class="file-list">
                                ${Object.keys(this.element[this.activeCategory]).map(key => html`
                                    <li 
                                        class="file-item"
                                        @click=${() => this.onClickItem(this.activeCategory!, key)}
                                    >
                                        ${key}
                                    </li>
                                `)}
                            </ul>

                        ` : html`

                            <!-- DETAIL VIEW -->
                            ${this.renderDetails()}

                        `}

                    ` : html`
                        <div class="placeholder">
                            Select a category
                        </div>
                    `}
                </section>

            </div>
        </div>
    `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title}</span>
            </header>
        `;
    }

    renderDetails(): TemplateResult {

        if (!this.activeCategory || !this.selectedFile) return html``;

        const fileData = this.element?.[this.activeCategory][this.selectedFile];

        const insights =
            fileData?.defs.codeInsights?.[this.activeCategory] ?? [];

        return html`
        <div class="details-view">

            <div class="details-header">
                <button class="back-btn" @click=${this.closeDetails}>
                    ← Back
                </button>

                <div class="file-title">
                    ${this.selectedFile}
                </div>
            </div>

            <div class="details-body">
                ${insights.length ? insights.map((item: any) => html`
                    <div class="insight-card">
                        ${typeof item === 'string'
                ? item
                : JSON.stringify(item)}
                    </div>
                `) : html`
                    <div class="placeholder">
                        No items found
                    </div>
                `}
            </div>

        </div>
    `;
    }


    //-------IMPLEMENTATION-------

    private formatCategory(name: string): string {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase());
    }

    async loadDefs() {
        this.allItens = await getAllDefs();
        const haveInsights = this.getWithCodeInsights();
        if (!haveInsights) return;
        this.element = this.groupCodeInsightsByCategory(haveInsights);
    }

    private getWithCodeInsights() {

        if (!this.allItens) return;
        const itens: Record<string, IdefModule> = {};

        Object.keys(this.allItens).forEach((key: string) => {

            if (!this.allItens) return;
            const item = this.allItens[key];

            if (item.defs.codeInsights &&
                Object.keys(item.defs.codeInsights).length > 0) {

                itens[key] = item;
            }

        });

        return itens;
    }

    private groupCodeInsightsByCategory(
        items: Record<string, IdefModule>
    ): Required<CodeInsights> {

        const result: Required<CodeInsights> = {
            todos: {},
            securityWarnings: {},
            unusedImports: {},
            deadCodeBlocks: {},
            accessibilityIssues: {},
            i18nWarnings: {},
            performanceHints: {}
        };

        Object.keys(items).forEach((keyMain) => {

            const item = items[keyMain];

            if (!item.defs.codeInsights) return;

            for (const key in result) {
                const values = item.defs.codeInsights[key as keyof CodeInsights];
                if (values?.length) {
                    result[key as keyof CodeInsights][keyMain.replace('.defs', '')] = item;
                }
            }

        });

        return result;
    }

    private onClickItem(category: string, key: string) {
        // Preparado para futura implementação
        console.log('Clicked:', category, key);
        this.selectedFile = key;

        const f = mls.stor.files[key];
        if (!f) return;

        this.fireEvents('open', f);
    }

    private closeDetails() {
        this.selectedFile = null;
    }

    async fireEvents(action: string, file: mls.stor.IFileInfo,  timeout: number = 0) {

        try {

            const params = {} as mls.events.IFileAction;

            await file.getOrCreateModel();

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = 'left';

            if (['open'].includes(action)) {

                let name = `_${file.project}_${file.shortName}`;
                if (file.folder) name = `_${file.project}_${file.folder}/${file.shortName}`;
                mls.actual[2].setFullName(name);
                mls.actual[2]['left'] = file

            }

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);

        } catch (err: any) {

        }

    }

}

type CodeInsights = {
    todos?: Record<string, IdefModule>;
    securityWarnings?: Record<string, IdefModule>;
    unusedImports?: Record<string, IdefModule>;
    deadCodeBlocks?: Record<string, IdefModule>;
    accessibilityIssues?: Record<string, IdefModule>;
    i18nWarnings?: Record<string, IdefModule>;
    performanceHints?: Record<string, IdefModule>;
};

if (!customElements.get('plugin-code-insights-100554')) {
    customElements.define('plugin-code-insights-100554', pluginCodeInsights);
}

export const pluginData: mls.plugin.IPluginData = {
    title: "Code insights",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"/></svg>
    `;
    }
};
