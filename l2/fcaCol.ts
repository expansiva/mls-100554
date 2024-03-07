/// <mls shortName="fcaCol" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * } 
 */

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase, IAllowCommand } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-col-100554')
export class FcaCol extends FcaLitElementBase { 

    // ------------ PROPERTIES ------------------


    private styleElMain: CSSStyleDeclaration | undefined = undefined;

    // ------------ COMPONENT--------------------

    firstUpdated(changedProperties: any) {

        super.firstUpdated(changedProperties);

        const el = document.createElement('span');
        el.style.cssText = this.styleel ? this.styleel : '';
        this.styleElMain = el.style;

    }

    // -------------- ABSTRACT ------------------

    public mySymbol = 'fa-table-columns';

    public actions: IActionLevels = {'1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': []}

    public renderPreview = (param: string): any => {

        let code = `
            <${this.widget} style="${this.styleel}">
                ${this.myInnerHTML}
            </${this.widget}>
            
        `;

        return html`${unsafeHTML(code)}`;

    }

    public renderEditActive = (param: string): any => {


        let act = (this.actions as any)[this.level as any];
        if (!act) act = [];

        let code = `
            <${this.widget} style="${this.styleel}">
                ${this.myInnerHTML}
            </${this.widget}>
            
        `;

        return html`
            ${unsafeHTML(code)}
            <wcd-toolbox-100554 level="${this.level}" widget="${this.widget}" 
            .actions=${act} >
            </wcd-toolbox-100554>
        `;

    }


    public changeStateHtml(html: string): void {

    }

    public changeStateStyle(style: {}): void {

        if (!this.styleElMain || !style) return;

        const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
        if (el) {

            this.styleElMain.cssText = el.style.cssText;
            Object.assign(this.styleElMain, style as CSSStyleDeclaration);
            el.style.cssText = this.styleElMain.cssText;
            this.styleel = el.style.cssText

        }

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand{

        if (cmd === 'move') return this.commandMove(scope, target);

        return { inside: false, before: false, after: false };
            
    }

    public async setMyActions(level:string) {

        if(level === '4'){
            await this.importAction('_100554_wcdToolboxItemActionMove', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionGroup', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionMenu', this.actions, this.level as any);
            
        }

        return;
        
    }

    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand{

        const activeInMe = this.querySelector('*[renderType="editactive"]');

        if (activeInMe && this.children.length <= 1) return { inside:false, before:false, after:false }
        
        const myScope = this.getMyScope();

        if(myScope !== scope) return { inside: false, before: false, after: false };

        const tag = target.tagName.toLocaleLowerCase();

        let inside = tag !== 'fca-row-100554' && tag !== 'fca-col-100554';

        if (activeInMe && this.children.length <= 1) inside = false;

        const parent = this.getMyParentFCA(this);    
        
        const insideFather = parent && parent.tagName.startsWith('FCA-') ? parent.allowCommand('move', scope, target) : {inside:true};
        const before = insideFather.inside;
        const after = insideFather.inside;

        return { inside, before, after }
        
    }


}



/*
import { html, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FcaLitElementBase } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-col-100554')
export class FCACol extends FcaLitElementBase {

    public allowAddBody = false;
    public allowsChild = (tag: string): boolean => {

        return tag !== 'fca-row-100554' && tag !== 'fca-col-100554';

    };

    public actions: IActionLevels = {
        '1': [],
        '2': [],
        '3': [],
        '4': [
            this.templateActions.move,
            this.templateActions.size,
            {
                position: 'p-m1',
                tp: 'menu',
                format: '',
                title: '',
                iconSvg: '',
                onclick: undefined,
                menuItens: [
                    this.templateActionsMenu.goToParents

                ],
                menuSubItens: [
                    this.templateActionsMenu.goToFirstChild,
                    this.templateActionsMenu.removeMe
                ],
            }
        ],
        '5': [],
        '6': [],
        '7': [],
    }

    private styleElMain: CSSStyleDeclaration | undefined = undefined;

    firstUpdated(changedProperties: any) {

        super.firstUpdated(changedProperties);
        let elS: HTMLElement = document.createElement('span');
        this.styleElMain = elS.style;

    }

    public renderPreview = (param: string): any => {

        this.style.display = 'block';
        this.style.flex = '1';

        const code = `<div ${this.styleel}">${this.myInnerHTML}</div>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    public renderTag = (param: string): any => {

        this.style.display = 'block';
        this.style.flex = '1';

        const code = `<div ${this.styleel}">${this.myInnerHTML}</div>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    public renderEdit = (param: string): any => {

        this.style.display = 'block';
        this.style.flex = '1';

        const code = `<div ${this.styleel}">${this.myInnerHTML}</div><wcd-toolbox-100554 level="${this.level}" widget="div"></wcd-toolbox-100554>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    createRenderRoot() {
        return this;
    }

    public changeStateHtml(html: string): void {

    }

    public changeStateStyle(style: {}): void {

        if (!this.styleElMain || !style) return;

        const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
        if (el) {

            this.styleElMain.cssText = el.style.cssText;
            Object.assign(this.styleElMain, style as CSSStyleDeclaration);
            el.style.cssText = this.styleElMain.cssText;
            this.styleel = el.style.cssText

        }

    }

}*/