/// <mls shortName="fcaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';
import * as states from './_100554_fcaCollabStore';

export abstract class FcaLitElementBase extends CollabLitElement {

    // ------------ PROPERTIES ------------------

    @property({ type: String })
    @collabState(states.CHANGESTATE)
    private changeState: string = '';

    @property({ type: String, reflect: true })
    public widget: string | undefined;

    @property({ type: String })
    public renderType: 'preview' | 'edit' | 'editactive' | undefined;

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;

    @property({ type: String, reflect: true })
    public styleel: string | undefined;

    public myInnerHTML = '';


    // ------------ ABSTRACT ------------------

    abstract renderPreview: (param: string) => any;
    abstract renderEditActive: (param: string) => any;

    abstract changeStateStyle(info: {}): void;
    abstract changeStateHtml(info: string): void;
    abstract allowCommand(cmd: 'move' | '', scope: HTMLElement, target: HTMLElement): IAllowCommand;

    // ------------ COMPONENT-------------------

    connectedCallback() {
        super.connectedCallback();
        this.configFirstTime();

    }

    createRenderRoot() {
        return this;
    }

    render() {


        let objRender;
        switch (this.renderType) {
            case 'preview':
                objRender = this.renderPreview('');
                break;
            case 'edit':
                objRender = this.renderPreview('');
                break;
            case 'editactive':
                objRender = this.renderEditActive('');
                break;
            default:
                objRender = html`<span>not found render function</span>`;
        }

        return objRender;
    }


    shouldUpdate(changedProperties: Map<string, string>): boolean {
        // shouldUpdate determinar se o componente deve ser renderizado novamente true = executa, false = não executa o render().

        const valorAntigo = changedProperties.get('renderType');

        if (valorAntigo === 'editactive' && this.renderType !== 'editactive') {

            //verifico se é um wc que esta saindo do estado de active para edit nesse caso tem que limpar o state
            super.setCollabState(states.CHANGESTATE, '');

        } else if (changedProperties.get('changeState') !== undefined && this.changeState) {

            // aviso da alteração do state
            this.doChangeState(this.changeState);
            return false;

        }
        return true;

    }

    updated(changedProperties: Map<string, string>) {

        if (this.renderType === 'edit') {


            this.onclick = (e: MouseEvent) => {

                //When clicking on an "edit" item I return the old "editactive" to "edit" and set the new "editactive"
                e.stopPropagation();

                if ((e.target as HTMLElement).tagName.startsWith('WCD-')) return;

                const all = document.querySelectorAll('*[renderType="editactive"]');
                Array.from(all).forEach((i) => i.setAttribute('renderType', 'edit'));
                this.onclick = undefined as any;
                this.updateMyInnerHtmlIfNeed();

            }

        }

    }

    // ------------ IMPLEMENTATION-------------------

    public getMyScope(): FcaLitElementBase | undefined {

        return this.closest('fca-page-100554') as FcaLitElementBase;

    }

    public getMyParentFCA(target: HTMLElement): FcaLitElementBase | undefined {

        const parent = target.parentElement;
        if (!parent) return;

        const tag = parent.tagName.toLowerCase();

        if (!tag.startsWith('fca-')) {

            return this.getMyParentFCA(parent);

        } else if (tag.startsWith('fca-')) {

            return parent as FcaLitElementBase;

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

        }

    }

    private configFirstTime(): void {

        if (this.myInnerHTML === '' && this.innerHTML !== '') {

            this.myInnerHTML = this.innerHTML;
            this.innerHTML = '';

        }

    }

    private async updateMyInnerHtmlIfNeed(uptType: boolean = true) {

        if (this.innerHTML.indexOf('<fca-') >= 0) {
            console.info(this)

            let elMain = this.querySelector(`${this.widget}:first-child`);
            if (!elMain) return;

            elMain = elMain.cloneNode(true) as HTMLElement;

            const el = await this.clearTree(document.createElement('span'), elMain as HTMLElement);

            this.myInnerHTML = el ? el.innerHTML : this.myInnerHTML;

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


}

export interface IAllowCommand {
    inside: boolean,
    before: boolean,
    after: boolean
}
