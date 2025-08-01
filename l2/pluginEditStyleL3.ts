/// <mls shortName="pluginEditStyleL3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, query, property, state } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { LessCSS } from "./_100554_lessCSS";
import { getState } from './_100554_collabState';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item foi encontrado!'
}

const message_en = {
    noItens: 'No items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-edit-style-l3-100554')
export class PluginEditStyleL3 extends PluginBaseModule {

    //--------PROPERTS-----------
    @query('mls-editor-100529') private editorEl: HTMLElement | undefined;
    @property({ type: String }) msize = '';
    @state() error = '';

    //--------VARIABLES-----------
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private msg: MessageType = messages['en'];
    private model: monaco.editor.ITextModel | undefined;

    public modelLessCSS: LessCSS | undefined;
    public lessCSS: LessCSS | undefined;
    private keysResolve: any = {};

    //-----------INIT------------

    get getKeyEditor() { return 'l3_left' };
    get confE() { return `l3_left`; }

    constructor() {
        super();
        this.setEvents();
    }


    //--------EVENTS-------------

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

        mls.events.addListener(3, 'L3EditEvents' as any, this.onL3EditEvents.bind(this));

    }

    private onL3EditEvents(ev: mls.events.IEvent) {

        if (!ev.desc || ev.level !== 3) return;

        const info = JSON.parse(ev.desc);

        if (!info || !info.action || !info.position || info.position === 'left') return;

    }

    private onlevelChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const j = JSON.parse(ev.desc);
        if (j.level === 3) {
            this.forceUpdate();
        }
    }



    //-------COMPONENT----------

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.initMonaco();
    }

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('msize')) {
            this.updatedMSizeEditor();
        }
    }

    render() {
        this.style.display = 'block';
        if (this.error) return html`<h3 style="color:red">${this.error}</h3>`
        return html`
            <mls-editor-100529 slot="left"></mls-editor-100529>
        `
    }



    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.requestUpdate();
    }

    private async initMonaco() {
        if (!this._ed1) {
            await this.initMonaco_Editor();
        }

        this.openFile();
    }

    private async initMonaco_Editor(): Promise<void> {

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);

    }

    private async openFile() {

        if (!mls.actual[2].left) {
            this.error = 'Not found storfile';
            return;
        }

        const scope = window.preview?.iframe?.contentDocument?.body;
        const iframeDoc = window.preview?.iframe?.contentWindow;

        if (!scope || !iframeDoc) {
            this.error = 'Not found preview';
            return;
        }

        if (!this.model) this.model = await this.createModel(mls.actual[2].left);

        if (!this._ed1 || !this.model) {
            this.error = 'Not found model';
            return;
        }

        this._ed1.setModel(this.model);

        this.setContent(scope, iframeDoc);

        this.updatedMSizeEditor();

    }

    private setContent(scope: HTMLElement, iframeDoc: Window) {

        const active = scope.querySelector('*[clb_mode]') as HTMLElement;
        if (!active) {
            this.error = 'Not found element';
            return;
        }

        this.modelLessCSS = getState(`less.left.lessCSS`);
        if (!this.modelLessCSS) return;

        let cssText = '';
        const sel = this.getMatchingRulesForElement(active, iframeDoc);
        console.info(sel);

        Object.keys(this.modelLessCSS.lessAST.ast).forEach((key) => {

            const selector = this.resolveSelector(key);
            if (this.keysResolve[selector]) return;
            this.keysResolve[selector] = key;

        });

        sel.forEach((selector) => {

            if (!this.modelLessCSS) return;
            const keyCss = this.keysResolve[selector.selector];
            if (!keyCss) return;
            const baseRule = this.modelLessCSS.lessAST.ast[keyCss];
            if (!baseRule) return;
            cssText += `\n${selector.selector}{`
            for (const key of Object.keys(baseRule)) {
                const info = baseRule[key];
                if (!info || typeof info === 'number') continue;
                cssText += `\n${key}: ${info.value};`
            }

            cssText += `\n}`

        });

        this.model?.setValue(cssText);
        this._ed1?.getAction('editor.action.formatDocument')?.run();

    }

    private async createModel(storFile: mls.stor.IFileInfo): Promise<monaco.editor.ITextModel | undefined> {

        try {
            const uri = monaco.Uri.parse(`file://server/_${storFile.project}_l3_editor.less`);
            let model = monaco.editor.getModel(uri);
            if (!model) model = monaco.editor.createModel('', 'less', uri)

            model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => this._onModelChange(e, model, storFile));

            return model;
        } catch (e: any) {
            this.error = e.message;
        }
    }

    private _onModelChange(e: monaco.editor.IModelContentChangedEvent, activeModel: monaco.editor.ITextModel | null, storFile: mls.stor.IFileInfo): void {

        if (this._ed1) {
            const uri = `file://server/_${storFile.project}_l3_editor.less`;
            this.lessCSS = new LessCSS(uri.toString(), this._ed1, 'right');
            this.lessCSS.setEditor(this._ed1);

            this.changeLessOrigin();
        }

    }

    private timeOnChangeLessOrigin = 0;
    private changeLessOrigin() {
        clearTimeout(this.timeOnChangeLessOrigin);
        this.timeOnChangeLessOrigin = setTimeout(() => {
            this.changeLessOrigin2();
        }, 500);
    }

    private changeLessOrigin2() {

        if (!this.lessCSS || !this.modelLessCSS) return;

        const keys = Object.keys(this.lessCSS.lessAST.ast);
        keys.forEach((myKey) => {

            if (!this.lessCSS || !this.modelLessCSS) return;
            const keyCss = this.keysResolve[myKey];
            if (!keyCss) return;

            if (this.modelLessCSS.lessAST.ast[keyCss]) {
                this.modelLessCSS.setSelector(keyCss);
                this.lessCSS.setSelector(myKey);

                const baseRules = this.lessCSS.lessAST.ast[myKey];
                for (const attr of Object.keys(baseRules)) {
                    const info = baseRules[attr];
                    if (!info || typeof info === 'number' || typeof attr === 'number' || (this.modelLessCSS.styles as any)[attr] === info.value) continue;
                    (this.modelLessCSS.styles as any)[attr] = info.value;
                }

            }

        });

    }

    private getMatchingRulesForElement(element: HTMLElement, iframeDoc: Window): ISelector[] {
        if (!(iframeDoc as any).getMatchingRulesForElement) return [];
        return (iframeDoc as any).getMatchingRulesForElement(element);
    }

    private updatedMSizeEditor() {
        this.editorEl?.setAttribute('msize', this.msize);
    }

    private resolveSelector(selector: string): string {
        const parts = selector.trim().split(/\s+/);
        const result: string[] = [];

        for (const part of parts) {
            if (part.startsWith('&.')) {
                const className = part.slice(1); // remove o '&'
                if (result.length > 0) {
                    result[result.length - 1] += className; // junta com o anterior
                } else {
                    result.push(className); // fallback se for o primeiro
                }
            } else {
                result.push(part);
            }
        }

        return result.join(' ');
    }

}

interface ISelector {
    origin: string,
    selector: string,
    style: StyleSheet

}