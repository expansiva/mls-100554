/// <mls shortName="fcaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';
import { WCDToolbox } from './_100554_wcdToolbox';
import * as vglobal from './_100554_fcaGlobal';
import * as states from './_100554_fcaCollabStore';

export abstract class FcaLitElementBase extends CollabLitElement {

    @property({ type: String })
    @collabState(states.CHANGESTATE)
    private changeState: string = '';

    @property({ type: String, reflect: true })
    public widget: string | undefined;

    @property({ type: String })
    public renderType: 'preview' | 'edit' | 'editactive'  | undefined;

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;

    @property({ type: String, reflect: true })
    public styleel: string | undefined;

    get levelActual(): number{
        if ((mls as any)['levelActual']) return (mls as any)['levelActual'];
        return 7
    };

    abstract actions: vglobal.IActionLevels;

    //abstract doChangeState(info: string): void;
    abstract changeStateStyle(info: {}): void;
    abstract changeStateHtml(info: string): void;
    abstract allowsChild: (tag: string) => boolean;
    abstract allowAddBody: boolean;

    abstract renderPreview: (param: string) => any;
    abstract renderTag: (param: string) => any;
    abstract renderEdit: (param: string) => any;

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('level', this.levelActual.toString());
    }

    public shouldUpdate(changedProperties: Map<string, string>): boolean {

        const valorAntigo = changedProperties.get('renderType');

        if (valorAntigo === 'editactive' && this.renderType !== 'editactive') {
            // clear reactive store
            super.setCollabState(states.CHANGESTATE, '');

        } else if (changedProperties.get('changeState') !== undefined && this.changeState) {//&& this.renderType === 'editactive' 

            this.doChangeState(this.changeState);

        }

        return true;

    }

    public myInnerHTML: string = '';

    private firstTime = true;

    public render() {

        this.configFirstTime();

        let objRender;
        switch (this.renderType) {
            case 'preview':
                objRender = this.renderPreview('');
                break;
            case 'edit':
                objRender = this.renderTag('');
                break;
            case 'editactive':
                objRender = this.renderEdit('');
                break;
            default:
                objRender = html`<span>not found render function</span>`;
        }

        return objRender;

    }

    private configFirstTime(): void {

        if (!this.firstTime) return;

        if (this.myInnerHTML === '' && this.innerHTML !== '') {

            this.myInnerHTML = this.innerHTML;
            this.innerHTML = '';

            if (this.myInnerHTML.indexOf('<!--?lit') >= 0) {

                const span = document.createElement('span');
                span.innerHTML = this.myInnerHTML;

                this.clearTree(document.createElement('span'), span).then((el) => {
                    this.myInnerHTML = el ? el.innerHTML : this.myInnerHTML
                    Array.from(this.children).forEach((e) => e.remove());
                    const l = this.levelActual.toString();
                    this.setAttribute('level', '0');
                    this.setAttribute('level', l as string);
                });

            }

        }

        this.firstTime = false;
        this.style.position = 'relative';

    }

    public updated(changedProperties: Map<string, string>) {

        if (this.renderType === 'edit') {

            this.onclick = (e: MouseEvent) => {

                e.stopPropagation();

                if ((e.target as HTMLElement).tagName === 'WCD-TOOLBOX-100554') return;

                const all = document.querySelectorAll('*[renderType="editactive"]');
                Array.from(all).forEach((i) => i.setAttribute('renderType', 'edit'));
                this.onclick = undefined as any;
                this.updateMyInnerHtml();


            }

        } else if (this.renderType === 'editactive') {

            if (!this.level || !this.actions[this.level]) return;
            this.setIconsFACToolbox(this.actions[this.level]);

        }

    }

    public async updateMyInnerHtml(uptType: boolean = true) {

        let elMain = this.querySelector(`${this.widget}:first-child`);
        if (!elMain) return;

        elMain = elMain.cloneNode(true) as HTMLElement;

        const el = await this.clearTree(document.createElement('span'), elMain as HTMLElement);

        this.myInnerHTML = el ? el.innerHTML : this.myInnerHTML;

        if (!uptType) {
            const l = this.level;
            this.setAttribute('level', '0');
            this.setAttribute('level', l as string);
        }

        if (uptType) this.setAttribute('renderType', 'editactive');

    }

    private async clearTree(elemento: HTMLElement, elMain: HTMLElement) {


        for await (const i of elMain.children) {

            const tag = i.tagName.toLowerCase();
            if (!tag.startsWith('fca-')) {

                await this.clearTree(elemento, i as HTMLElement);

            } else if (tag.startsWith('fca-')) {

                const clone = i.cloneNode();
                elemento.appendChild(clone);
                await this.clearTree(clone as HTMLElement, i as HTMLElement);

            }

        }

        return elemento;

    }

    public setIconsFACToolbox(array: vglobal.IActionsToolbox[]): void {

        const el = this.querySelector('wcd-toolbox-100554') as WCDToolbox;
        if (!el) return;
        el.setItensActions(array);

    }

    public goToFather(el: HTMLElement): void {

        const parent = el.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toLowerCase();

        if (!tag.startsWith('fca-')) {

            this.goToFather(parent);

        } else if (tag.startsWith('fca-')) {

            parent.click();

        }

    }

    public goToFirstChild(father: HTMLElement, el: HTMLElement): void {

        if (!el.children[0]) return;

        const child = el.children[0] as HTMLElement;
        if (!child) return;
        const tag = child.tagName.toLowerCase();

        if (!tag.startsWith('fca-')) {

            this.goToFirstChild(father, child);

        } else if (tag.startsWith('fca-')) {

            child.setAttribute('renderType', 'editactive');

            let elMain = this.querySelector(`${this.widget}:first-child`);
            if (!elMain) return;

            elMain = elMain.cloneNode(true) as HTMLElement;

            this.clearTree(document.createElement('span'), elMain as HTMLElement).then((el2) => {

                this.myInnerHTML = el2 ? el2.innerHTML : this.myInnerHTML;

                father.setAttribute('renderType', 'edit');
            });

        }

    }

    public removeElement(el: HTMLElement): void {

        const parent = el.parentElement as HTMLElement;
        const parentFCA = vglobal.getParentFCA(el);
        if (!parent || !parentFCA) {
            el.remove();
        } else if (parent.children.length === 1 && parentFCA.children.length === 1) {
            parentFCA.remove();
        } else {
            el.remove();
        }



    }

    private doChangeState(js: string): void {

        const info = JSON.parse(js);

        if (this.renderType === 'editactive') {

            switch (info.tp) {

                case "menu":
                    console.info(info.menu);
                    break;
                case "style":
                    this.changeStateStyle(info.style);
                    break;

                case "html":
                    this.changeStateHtml(info.html);
                    break;
                default:
                    '';
                    break;

            }

        } else {

            switch (info.tp) {

                case "drag":
                    vglobal.changeStateDrag(this, info.drop);
                    break;
                case "drop":
                    vglobal.changeStateDrop(this, info.drop);
                    break;
                default:
                    '';
                    break;

            }


        }

    }



    public templateActions = {
        //BackButton
        backButton: {
            position: '',
            tp: 'back-button',
            format: '',
            title: 'Back',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',
            onclick: () => {

                if (!this.level || !this.actions[this.level]) return;
                this.setIconsFACToolbox(this.actions[this.level])

                const elMain = this.querySelector(`${this.widget}:first-child`) as HTMLElement;
                const tollbox = this.querySelector(`fca-toolbox-100554`) as HTMLElement;

                if (!elMain || !tollbox) return;
                vglobal.updateSize(elMain, tollbox, true);
            },
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

        //move
        move: {
            position: 'p-m2',
            tp: 'action-move',
            format: '',
            title: 'Move',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg>',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

        //padding
        buttonPadding: {
            position: 'p-l4',
            tp: 'button',
            format: '',
            title: 'padding',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z"/></svg>',
            onclick: () => {
                this.setIconsFACToolbox(
                    [
                        this.templateActions.backButton,
                        this.templateActions.paddingTop,
                        this.templateActions.paddingRight,
                        this.templateActions.paddingBottom,
                        this.templateActions.paddingLeft
                    ]
                )
            },
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        paddingTop: {
            position: 'p-m1',
            tp: 'action-padding',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        paddingRight: {
            position: 'p-r2',
            tp: 'action-padding',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        paddingBottom: {
            position: 'p-m3',
            tp: 'action-padding',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        paddingLeft: {
            position: 'p-l2',
            tp: 'action-padding',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

        //Margin
        buttonMargin: {
            position: 'p-m4',
            tp: 'button',
            format: '',
            title: 'Margin',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 32h64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352H288V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H192c-88.4 0-160-71.6-160-160s71.6-160 160-160z"/></svg>',
            onclick: () => {
                this.setIconsFACToolbox(
                    [
                        this.templateActions.backButton,
                        this.templateActions.marginTop,
                        this.templateActions.marginRight,
                        this.templateActions.marginBottom,
                        this.templateActions.marginLeft
                    ]
                )
            },
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        marginTop: {
            position: 'p-m1',
            tp: 'action-margin',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        marginRight: {
            position: 'p-r2',
            tp: 'action-margin',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        marginBottom: {
            position: 'p-m3',
            tp: 'action-margin',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        marginLeft: {
            position: 'p-l2',
            tp: 'action-margin',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

        // Size
        buttonSize: {
            position: 'p-r4',
            tp: 'button',
            format: '',
            title: 'Size',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>',
            onclick: () => {
                this.setIconsFACToolbox(
                    [
                        this.templateActions.backButton,
                        this.templateActions.sizeHeight,
                        this.templateActions.sizeWidth
                    ]
                )
            },
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        size: {
            position: 'p-r3',
            tp: 'action-size',
            format: 'circle',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        sizeWidth: {
            position: 'p-r2',
            tp: 'action-size',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,
        sizeHeight: {
            position: 'p-m3',
            tp: 'action-size',
            format: 'square',
            title: '',
            iconSvg: '',
            onclick: undefined,
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

        //EditQuill
        editQuill: {
            position: 'p-r3',
            tp: 'action-editQuill',
            format: '',
            title: '',
            iconSvg: '',
            onclick: (ev: MouseEvent) => {

                this.setIconsFACToolbox(
                    [
                        {
                            position: '',
                            tp: 'back-button',
                            format: '',
                            title: 'Back',
                            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',
                            onclick: () => {

                                if (!this.level || !this.actions[this.level]) return;


                                const tollbox = this.querySelector(`wcd-toolbox-100554`) as HTMLElement;

                                const elMain = this.querySelector(`${this.widget}:first-child`) as HTMLElement;

                                if (!elMain || !tollbox || !tollbox.shadowRoot) return;

                                const elFca = tollbox.shadowRoot.querySelector('wcd-toolbox-item-action-edit-quill-100554');

                                if (elFca && (elFca as any)['onChanged']) {
                                    (elFca as any)['onChanged']();
                                    elFca.remove();
                                }

                                elMain.style.opacity = '';
                                this.setIconsFACToolbox(this.actions[this.level])

                                vglobal.updateSize(elMain, tollbox, true);

                            },
                            menuItens: [],
                            menuSubItens: [],
                        } as vglobal.IActionsToolbox
                    ]
                );
            },
            menuItens: [],
            menuSubItens: [],
        } as vglobal.IActionsToolbox,

    }

    public templateActionsMenu = {
        goToParents: {
            text: 'To Parent',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"/></svg>',
            onclick: () => this.goToFather(this)
        } as vglobal.IActionsToolboxMenu,
        goToFirstChild: {
            text: 'To Child',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M350 334.5c3.8 8.8 2 19-4.6 26l-136 144c-4.5 4.8-10.8 7.5-17.4 7.5s-12.9-2.7-17.4-7.5l-136-144c-6.6-7-8.4-17.2-4.6-26s12.5-14.5 22-14.5h88l0-192c0-17.7-14.3-32-32-32H32C14.3 96 0 81.7 0 64V32C0 14.3 14.3 0 32 0l80 0c70.7 0 128 57.3 128 128l0 192h88c9.6 0 18.2 5.7 22 14.5z"/></svg>',
            onclick: () => this.goToFirstChild(this, this)
        } as vglobal.IActionsToolboxMenu,
        removeMe: {
            text: 'Delete',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',
            onclick: () => this.removeElement(this)
        } as vglobal.IActionsToolboxMenu,
    }

}