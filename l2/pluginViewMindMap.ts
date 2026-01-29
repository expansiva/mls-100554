/// <mls shortName="pluginViewMindMap" project="100554" enhancement="_100554_enhancementLit" />

import { svg, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { MindMapNode, MindMapData } from '/_100554_/l2/widgetMindMapL4.js'
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
    @property({ type: String }) dataJson: MindMapData | undefined;

    firstUpdated() {
        if (!this.autoPrepare) return;
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
        return html`<widget-mind-map-l4-100554 .mapState=${this.dataJson}></widget-mind-map-l4-100554>`
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

        const info = mls.l2.getPath(this.page);
        if (!info || !info.shortName) return;
        let { project, folder, shortName } = info;
        folder = folder.replace('/l2', '').trim();

        const key = mls.stor.getKeyToFile({ project, level: 2, shortName, folder, extension: '.defs.ts' });

        if (!mls.stor.files[key]) throw new Error(`Not found mls.stor: ${key}`);
        const src = await mls.stor.files[key].getContent() as string;
        const jsonRaw = this.extractJsonFromAsIs(src);
        const data = this.buildMindMapFromInsights(jsonRaw);
        data.nodes = data.nodes.map((i) => {

            i = {
                ...i,
                related: Array.from(new Set(i.related))
            }
            if (i.related.length <= 1 && !['imports', 'asIs'].includes(i.id)  ) i.related = [];
            return i

        });
        this.dataJson = data;


    }

    private extractJsonFromAsIs(source: string): any {
        const firstBrace = source.indexOf("{");
        if (firstBrace === -1) {
            throw new Error("Nenhum '{' encontrado na string.");
        }

        let depth = 0;
        let endIndex = -1;

        for (let i = firstBrace; i < source.length; i++) {
            const char = source[i];

            if (char === "{") depth++;
            if (char === "}") depth--;

            if (depth === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            throw new Error("JSON malformado: não foi possível fechar '}'.");
        }

        const jsonText = source.slice(firstBrace, endIndex + 1);

        try {
            return JSON.parse(jsonText);
        } catch (e) {
            console.error("JSON bruto extraído:\n", jsonText);
            throw new Error("Falha ao fazer parse do JSON extraído.");
        }
    }

    private buildMindMapFromInsights(input: any): MindMapData {
        const nodes: MindMapNode[] = [];

        const centerId = `service:${input.meta.fileReference}`;

        // Helper: cria nó e já registra
        const pushNode = (node: MindMapNode) => {
            nodes.push(node);
            return node;
        };

        // Helper: dedup no final
        const normalizeRelations = () => {
            nodes.forEach(n => {
                n.related = Array.from(new Set(n.related));
            });
        };

        // Center node (related será preenchido dinamicamente)
        const centerNode = pushNode({
            id: centerId,
            label: input.meta.fileReference,
            type: "main",
            related: []
        });

        // ---------------- LANGUAGES ----------------
        if (Array.isArray(input.meta.languages) && input.meta.languages.length) {
            const groupId = "language";

            const groupNode = pushNode({
                id: groupId,
                label: "Languages",
                type: "language",
                related: []
            });

            centerNode.related.push(groupId);

            input.meta.languages.forEach((lang: string) => {
                const id = `lang:${lang}`;

                pushNode({
                    id,
                    label: lang.toUpperCase(),
                    type: "attributes",
                    related: [groupId]
                });

                groupNode.related.push(id);
            });
        }

        // ---------------- WEB COMPONENTS ----------------
        if (Array.isArray(input.references?.webComponents) && input.references.webComponents.length) {
            const groupId = "webComponents";

            const groupNode = pushNode({
                id: groupId,
                label: "Web Components",
                type: "webcomponent",
                related: []
            });

            centerNode.related.push(groupId);

            input.references.webComponents.forEach((wc: string) => {
                const id = `wc:${wc}`;

                pushNode({
                    id,
                    label: wc,
                    type: "file",
                    related: [groupId],
                    navigate:true   
                });

                groupNode.related.push(id);
            });
        }

        // ---------------- IMPORTS ----------------
        if (Array.isArray(input.references?.imports) && input.references.imports.length) {
            const groupId = "imports";

            const groupNode = pushNode({
                id: groupId,
                label: "Imports",
                type: "imports",
                related: []
            });

            centerNode.related.push(groupId);

            input.references.imports.forEach((imp: any) => {
                const importId = `import:${imp.ref}`;

                let text = '';
                (imp.dependencies || []).forEach((dep: any) => {
                    const depId = `dep:${imp.ref}:${dep.name}`;
                    text = `${text}<li>${dep.name}</li>`
                });
                if( text !== '') text = `<ul>${text}</ul>`;

                const importNode = pushNode({
                    id: importId,
                    label: imp.ref,
                    type: "file",
                    related: [groupId],
                    navigate: true,
                    description: text
                });

                groupNode.related.push(importId);

                /*(imp.dependencies || []).forEach((dep: any) => {
                    const depId = `dep:${imp.ref}:${dep.name}`;

                    pushNode({
                        id: depId,
                        label: dep.name,
                        type: "level5",
                        related: [importId]
                    });

                    importNode.related.push(depId);
                });*/
            });
        }

        // ---------------- CODE INSIGHTS ----------------
        const insights = input.codeInsights || {};
        if (Object.keys(insights).length) {
            const groupId = "codeInsights";

            const groupNode = pushNode({
                id: groupId,
                label: "Code Insights",
                type: "codeInsights",
                related: []
            });

            centerNode.related.push(groupId);

            Object.entries(insights).forEach(([key, value]) => {
                const sectionId = `insight:${key}`;
                let description = this.joinStringArrayDescription(value);
                description = description === '<ul></ul>' ? '' : description;

                pushNode({
                    id: sectionId,
                    label: key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
                    type: "text",
                    related: [groupId],
                    description
                });

                groupNode.related.push(sectionId);
            });
        }

        // ---------------- AS IS ----------------
        const asIs = input.asIs || {};
        const semantic = asIs.semantic || {};

        if (Object.keys(semantic).length) {
            const groupId = "asIs";

            const groupNode = pushNode({
                id: groupId,
                label: "As Is",
                type: "asIs",
                related: ['asIs:semantic']
            });

            centerNode.related.push(groupId);

            const semanticId = "asIs:semantic";
            const semanticNode = pushNode({
                id: semanticId,
                label: "Semantic",
                type: "attributes",
                related: [groupId]
            });

            groupNode.related.push(semanticId);

            Object.entries(semantic).forEach(([key, value]) => {
                const nodeId = `asIs:semantic:${key}`;
                let description = this.joinStringArrayDescription(value);
                description = description === '<ul></ul>' ? '' : description;

                pushNode({
                    id: nodeId,
                    label: key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
                    type: "text",
                    related: [semanticId],
                    description
                });

                semanticNode.related.push(nodeId);
            });
        }

        normalizeRelations();

        return {
            current: centerId,
            nodes
        };
    }

    private joinStringArrayDescription(value: any): string | undefined {
        if (Array.isArray(value) && value.every(v => typeof v === "string")) {
            return `<ul>${value.map((i) => `<li>${i}</li>`).join("\n")}</ul>`;
        }
        if (typeof value === "string") {
            return value;
        }
        return undefined;
    }
}

if (!customElements.get('plugin-view-mind-map-100554')) {
    customElements.define('plugin-view-mind-map-100554', PluginViewMindMap);
}