/// <mls shortName="collabShowCodeDiff" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import {
    collab_check,
    collab_copy,
    collab_repeat,
    collab_thumbs_down,
    collab_thumbs_up,
} from './_100554_collabIcons'
import { CollabLitElement } from './_100554_collabLitElement';


export function initCollabShowCodeDiff100554() {
    return true;
}
/// **collab_i18n_start**
const message_pt = {
    diff: 'Com Diferença',
    reject: 'Rejeitar',
    tryAgain: 'Tentar Novamente',
    accept: 'Aceitar',
    copy: 'Copiar',
    copied: 'Copiado'
}

const message_en = {
    diff: 'With Diff',
    reject: 'Reject',
    tryAgain: 'Try Again',
    accept: 'Accept',
    copy: 'Copy',
    copied: 'Copied'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**
@customElement('collab-show-code-diff-100554')
export class CollabShowCodeDiff extends CollabLitElement {

    private msg: MessageType = messages['en-us'];

    static monaco_css: string = '';
    static inLoadingCss: boolean = false;
    static loadingPromise: Promise<string>;

    @property({ type: String }) msize = '400.00,420.00,106.00,0';

    @property({ type: String, reflect: true }) language = 'typescript';

    @property({ type: Boolean, reflect: true }) withCopy = true;

    @property({ type: Boolean, reflect: true }) withAccept = false;

    @property({ type: Boolean, reflect: true }) withReject = false;

    @property({ type: Boolean, reflect: true }) withTryAgain = false;

    @property({ type: Boolean, reflect: true }) withDiff = false;

    @property({ type: Boolean }) coping = false;

    onAccept: Function | undefined = () => { console.info('not implement') };

    onReject: Function | undefined = () => { console.info('not implement') };

    onTryAgain: Function | undefined = () => { console.info('not implement') };

    private _ed1Diff: monaco.editor.IStandaloneDiffEditor | undefined;

    private _ed1Result: monaco.editor.IStandaloneCodeEditor | undefined;

    private modelResult: monaco.editor.ITextModel | undefined;

    private modelDiffOriginal: monaco.editor.ITextModel | undefined;

    private modelDiffModified: monaco.editor.ITextModel | undefined;

    private actualEditor: 'diff' | 'result' | undefined = 'result';

    public actualTextDiffOriginal: string = '';

    public actualTextDiffModified: string = '';

    public actualTextResult: string = '';

    @query('mls-editor-100529')
    private c1: HTMLElement | undefined;

    @query('#diff_check')
    private inputDiff: HTMLInputElement | undefined;

    public init() {
        if (this.actualEditor === 'diff') this.setDiffValue(this.actualTextDiffOriginal, this.actualTextDiffModified);
        else this.setResultValue(this.actualTextResult)
    }

    private createEditorDiff(): void {
        if (!this.c1 || this._ed1Diff) return;
        if (this._ed1Result) {
            this._ed1Result.dispose();
            this.modelResult?.dispose();
            this._ed1Result = undefined;
            this.modelResult = undefined;
        }
        const opt: monaco.editor.IDiffEditorOptions = {
            automaticLayout: true,
            renderSideBySide: false,
            readOnly: true
        };
        this._ed1Diff = monaco.editor.createDiffEditor(this.c1, opt);
        (this.c1 as any)['mlsEditor'] = this._ed1Diff;
    }

    private createEditorResult(): void {

        if (!this.c1 || this._ed1Result) return;
        if (this._ed1Diff) {
            this._ed1Diff.dispose();
            this.modelDiffModified?.dispose();
            this.modelDiffOriginal?.dispose();
            this._ed1Diff = undefined;
            this.modelDiffModified = undefined;
            this.modelDiffOriginal = undefined;
        }
        const opt: monaco.editor.IDiffEditorOptions = {
            automaticLayout: true,
            readOnly: true
        };
        this._ed1Result = monaco.editor.create(this.c1, opt);
        (this.c1 as any)['mlsEditor'] = this._ed1Result;
    }

    private createModelDiff(editorType: string, srcOriginal: string, srcModified: string) {
        if (!this.modelDiffModified) this.modelDiffModified = monaco.editor.createModel(srcModified, editorType);
        else this.modelDiffModified.setValue(srcModified);

        if (!this.modelDiffOriginal) this.modelDiffOriginal = monaco.editor.createModel(srcOriginal, editorType);
        else this.modelDiffOriginal.setValue(srcOriginal);

    }

    private createModelResult(editorType: string, src: string) {
        if (!this.modelResult) this.modelResult = monaco.editor.createModel(src, editorType);
        else this.modelResult.setValue(src);
    }

    private setDiffValue(srcOriginal: string, srcModified: string) {
        this.createEditorDiff();
        this.createModelDiff(this.language, srcOriginal, srcModified);
        if (!this._ed1Diff || !this.modelDiffOriginal || !this.modelDiffModified) return;
        this._ed1Diff.setModel({
            original: this.modelDiffOriginal,
            modified: this.modelDiffModified,
        });

        this.actualTextDiffModified = srcModified;
        this.actualTextDiffOriginal = srcOriginal
    }

    private setResultValue(src: string) {
        this.createEditorResult();
        this.createModelResult(this.language, src);
        if (!this._ed1Result || !this.modelResult) return;
        this._ed1Result.setModel(this.modelResult);
        this.actualTextResult = src;
    }

    private setMsizeEditor() {
        this.c1?.setAttribute('msize', this.msize);
    }

    private onCopyClick() {
        this.coping = true;
        const value = this.actualEditor && this.actualEditor === 'result' ? this.modelResult?.getValue() : this.modelDiffModified?.getValue()
        navigator.clipboard.writeText(value || '')
        setTimeout(() => {
            this.coping = false;
        }, 3000)
    }

    private onAcceptClick() {
        if (this.onAccept && typeof this.onAccept === 'function') {
            this.onAccept();
        }
    }

    private onRejectClick() {
        if (this.onReject && typeof this.onReject === 'function') {
            this.onReject();
        }
    }

    private onTryAgainClick() {
        if (this.onTryAgain && typeof this.onTryAgain === 'function') {
            this.onTryAgain();
        }
    }

    private async getCssMonaco() {
        const cssPath = `../../../monaco/${(window as any).latest?.monaco}/monaco.css`;
        const response = await fetch(cssPath);
        const cssText = await response.text();
        return cssText;
    }

    private styleElement: HTMLStyleElement | undefined;

    async loadCSS() {

        if (this.styleElement) return;
        let cssText: string = '';

        if (CollabShowCodeDiff.monaco_css) cssText = CollabShowCodeDiff.monaco_css;
        else if (CollabShowCodeDiff.inLoadingCss) {
            cssText = await CollabShowCodeDiff.loadingPromise;
        } else {
            CollabShowCodeDiff.inLoadingCss = true;
            CollabShowCodeDiff.loadingPromise = this.getCssMonaco();
            cssText = await CollabShowCodeDiff.loadingPromise;
            CollabShowCodeDiff.monaco_css = cssText;
            CollabShowCodeDiff.inLoadingCss = false;
        }

        if (!cssText) return;
        this.styleElement = document.createElement('style');
        this.styleElement.innerHTML = CollabShowCodeDiff.monaco_css;
        this.shadowRoot?.appendChild(this.styleElement);
    }


    private renderWithCopy() {
        return html`
            <div @click=${this.onCopyClick} class="action-item" style="display:${this.coping ? 'none' : 'flex'}">
                ${collab_copy}
                <span>${this.msg.copy}</span>
            </div>
            <div class="action-item copied" style="display:${this.coping ? 'flex' : 'none'}">
                ${collab_check}
                <span>${this.msg.copied}</span>
            </div>
            `
    }

    private renderWithAccept() {
        return html`
            <div @click=${this.onAcceptClick} class="action-item ${!this.withAccept ? 'disabled' : ''}">
                ${collab_thumbs_up}
                <span>${this.msg.accept}</span>
            </div>
        `
    }

    private renderTryAgain() {
        return html`
            <div @click=${this.onTryAgainClick} class="action-item ${!this.withTryAgain ? 'disabled' : ''}">
                ${collab_repeat}
                <span>${this.msg.tryAgain}</span>
            </div>
        `
    }

    private renderReject() {
        return html`
            <div @click=${this.onRejectClick} class="action-item ${!this.withReject ? 'disabled' : ''}">
                ${collab_thumbs_down}
                <span>${this.msg.reject}</span>
            </div>
        `
    }

    private handleChangeDiff() {
        if (!this.inputDiff) return;
        if (this.inputDiff.checked) {
            this.actualEditor = 'diff';
            this.createEditorDiff();
            this.setDiffValue(this.actualTextDiffOriginal, this.actualTextDiffModified);
        } else {
            this.actualEditor = 'result';
            this.createEditorResult();
            this.setResultValue(this.actualTextResult);
        }
    }

    private renderShowDiff() {
        return html`
            <div class="${!this.withDiff ? 'disabled' : ''}">
                <input @change=${this.handleChangeDiff} id="diff_check" type="checkbox"></input>
                <label for="diff_check">${this.msg.diff}<label>
            </div>
        `
    }

    firstUpdated() {
        this.loadCSS();
        this.dispatchEvent(new CustomEvent('show-diff-ready'));
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="actions">
                    <span class="language">${this.language}</span>
                
                    <div class="actions-list">
                        ${this.renderShowDiff()}
                        ${this.renderWithAccept()}
                        ${this.renderReject()}
                        ${this.renderTryAgain()}
                        ${this.withCopy ? this.renderWithCopy() : ''}
                    </div>
            </div>

            <mls-editor-100529 style="display: block;height:600px;" ismls2="true"></mls-editor-100529>
    `;
    }


    static styles = css`
      :host{
        display:block;
      }
      .actions{
        height:30px; 
        background: #b4b4b4; 
        display:flex; 
        align-items:center;
        padding:0 1rem; 
        color:#fff;
        .actions-list{
          display:flex;
          gap:1rem;
        }
      }
      .language {
        flex:1;
      }
      
      .action-item{

        user-select: none;
        display:flex; 
        align-items:center;
        justify-content: center;
        cursor:pointer;
        min-width: 50px;
      }
      .disabled {
        cursor:default;
        text-decoration: line-through;
        pointer-events: none;
      }
      .copied{
        cursor:default;
        pointer-events: none;
      }
    `;

}
