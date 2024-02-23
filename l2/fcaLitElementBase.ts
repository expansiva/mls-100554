/// <mls shortName="fcaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement, collabState } from './_100554_collabLitElement';
import { IActionLevels } from './_100554_fcaGlobal';
import * as states from './_100554_fcaCollabStore';

export abstract class FcaLitElementBase extends CollabLitElement {

    // ------------ PROPERTIES ------------------

    @property({ type: String })
    @collabState(states.CHANGESTATE)
    private changeState: string = '';

    @property({ type: String, reflect: true })
    public widget: string | undefined;

    @property({ type: Boolean, reflect: true })
    public isFCAGroup: boolean | undefined;

    @property({ type: String })
    public renderType: 'preview' | 'edit' | 'editactive' | undefined;

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;

    @property({ type: String, reflect: true })
    public styleel: string | undefined = '';

    public myInnerHTML = '';


    // ------------ ABSTRACT ------------------

    private isLoadMyAction: any = {};
    abstract actions: IActionLevels;
    abstract setMyActions(level: string): Promise<void>;

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
    
        if (changedProperties.get('level') && !this.isLoadMyAction[this.level as any] && this.renderType === 'editactive') {
            this.auxSetMyActions();
        }

        return true;

    }

    private async auxSetMyActions() {

        try {

            await this.setMyActions(this.level as any);
            this.isLoadMyAction[this.level as any] = true;
            this.renderType = 'edit';
            setTimeout(() => { this.click(); }, 200) 

        } catch (e) {
            
        }
        
    }

    updated(changedProperties: Map<string, string>) {

        if (this.renderType === 'edit') {


            this.onclick = async (e: MouseEvent) => {

                //When clicking on an "edit" item I return the old "editactive" to "edit" and set the new "editactive"
                e.stopPropagation();

                if ((e.target as HTMLElement).tagName.startsWith('WCD-')) return;

                const all = document.querySelectorAll('*[renderType="editactive"]');
                Array.from(all).forEach((i) => i.setAttribute('renderType', 'edit'));


                const inGroup = this.closest('*[isfcagroup]') as HTMLElement;

                if (inGroup && inGroup !== this) {
                    inGroup.click();
                    return;
                }

                this.onclick = undefined as any;

                if (!this.isLoadMyAction[this.level as any] || this.isLoadMyAction[this.level as any] === false) {

                    await this.setMyActions(this.level as any);
                    this.isLoadMyAction[this.level as any] = true;

                }

                this.updateMyInnerHtmlIfNeed();

            }

        }

    }

    // ------------ IMPLEMENTATION-------------------

    public async importAction(imports: string, actions: IActionLevels, level: string, mode: string = '', position: string = '') {

        try {

            if (!imports.startsWith('./')) imports = './' + imports;
            const { getTemplate } = await import(imports);
            const temp = getTemplate(mode, position);
            (actions as any)[level].push(temp);

        } catch (e) {

            console.info(e);

        }



    }

    public getFCAComponents(scope: HTMLElement): FcaLitElementBase[] {

        let ret: FcaLitElementBase[] = [];

        const reentrance = (el: FcaLitElementBase | HTMLElement) => {

            const tag = el.tagName.toLowerCase();
            if (tag.startsWith('fca-')) {

                ret.push(el as FcaLitElementBase);

            }

            const isGroup = el.getAttribute('isFCAGroup');

            if (!isGroup || isGroup === 'false') {
                Array.from(el.children).forEach(i => {
                    reentrance(i as HTMLElement);
                })
            }

        }

        Array.from(scope.children).forEach(i => {
            reentrance(i as HTMLElement);
        })



        return ret;

    }

    public getMyScope(): FcaLitElementBase | HTMLElement | undefined {

        let ret = this.closest('fca-page-100554') as FcaLitElementBase;
        if (!ret) ret = this.closest('body') as any;
        return ret

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

    private async configFirstTime() {

        try {

            if (this.myInnerHTML === '' && this.innerHTML !== '') {

                this.myInnerHTML = this.innerHTML;
                this.innerHTML = '';

                if (this.myInnerHTML.indexOf('<!--?lit') >= 0) {

                    const span = document.createElement('span');
                    span.innerHTML = this.myInnerHTML;

                    const el = await this.clearTree(document.createElement('span'), span);

                    this.myInnerHTML = el ? el.innerHTML : this.myInnerHTML
                    Array.from(this.children).forEach((e) => e.remove());
                    const l = this.level;
                    this.setAttribute('level', '0');
                    this.setAttribute('level', l as string);



                }

            }

        } catch (e) {

            if (this.myInnerHTML === '' && this.innerHTML !== '') {
                this.myInnerHTML = this.innerHTML;
                this.innerHTML = '';
            }

        }


    }

    public async updateMyInnerHtmlIfNeed(uptType: boolean = true) {

        if (this.innerHTML.indexOf('<fca-') >= 0) {

            let elMain = this.querySelector(`${this.widget}:first-child`);
            if (!elMain) return;

            elMain = elMain.cloneNode(true) as HTMLElement;

            const el = await this.clearTree(document.createElement('span'), elMain as HTMLElement);

            this.myInnerHTML = el ? el.innerHTML : this.myInnerHTML;

            const l = this.level;
            this.setAttribute('level', '0');
            this.setAttribute('level', l as string);

        } else this.myInnerHTML = '';

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
