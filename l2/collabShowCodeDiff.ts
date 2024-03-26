/// <mls shortName="collabShowCodeDiff" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeCSS, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

export function initCollabShowCodeDiff100554() {
    return true;
}
@customElement('collab-show-code-diff-100554')
export class CollabShowCodeDiff extends LitElement {

    constructor() {
        super();
        this.loadCSS();
    }

    createRenderRoot() {
        return this;
    }


    public static modelCount: number;

    @property({ type: String })
    msize = '400.00,420.00,106.00,0';

    @property({ type: String })
    alias = 'diff';

    @property({ type: String })
    editorType = 'typescript';

    private _ed1: monaco.editor.IStandaloneDiffEditor | undefined;

    @query('mls-editor-100529')
    private c1: HTMLElement | undefined;

    private createEditor(): void {
        if (!this.c1 || this._ed1) return;
        const opt = {
            automaticLayout: true,
        };
        this._ed1 = monaco.editor.createDiffEditor(this.c1, opt);
        (this.c1 as any)['mlsEditor'] = this._ed1;
    }


    private createOrGetModel(editorType: string, src: string, tp: string) {
        const uri = this.getUri(`${this.constructor.name}_${this.alias}_${tp}`);
        let model1 = monaco.editor.getModel(uri);
        if (!model1) {
            model1 = monaco.editor.createModel(src, editorType, uri);
        }
        return model1;
    }

    private getUri(shortFN: string): monaco.Uri {
        CollabShowCodeDiff.modelCount = CollabShowCodeDiff.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${CollabShowCodeDiff.modelCount}.ts`);
    }

    public setInitialHistories(srcOriginal: string, srcModified: string) {
        this.createEditor();
        const modelOriginal = this.createOrGetModel(this.editorType, srcOriginal, 'original');
        const modelModified = this.createOrGetModel(this.editorType, srcModified, 'modified');
        if (!this._ed1) return;
        this._ed1.updateOptions({ readOnly: true });
        this._ed1.setModel({
            original: modelOriginal,
            modified: modelModified,
        });
    }

    private setMsizeEditor() {
        this.c1?.setAttribute('msize', this.msize);
    }

    async loadCSS() {
        const cssPath = `../../../monaco/${(window as any).latest?.monaco}/monaco.css`;
        const response = await fetch(cssPath);
        const cssText = await response.text();
        const styleElement = document.createElement('style');
        styleElement.innerHTML = cssText;
        this.appendChild(styleElement);
    }

    render() {
        return html`<mls-editor-100529 ismls2="true"></mls-editor-100529>`;
    }
}
