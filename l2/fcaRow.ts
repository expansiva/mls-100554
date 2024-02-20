/// <mls shortName="fcaRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * } 
 */

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase, IAllowCommand } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-row-100554')
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
            await this.importAction('_100554_wcdToolboxItemActionMargin', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionPadding', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionMenu', this.actions, this.level as any);
        }

        return;
        
    }

    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand{

        const activeInMe = this.querySelector('*[renderType="editactive"]');

        const elMychildren = document.createElement('span') as HTMLElement;
        elMychildren.innerHTML = this.myInnerHTML;

        if (activeInMe && elMychildren.children.length <= 1) return { inside: false, before: false, after: false }
        
        const myScope = this.getMyScope();

        if(myScope !== scope) return { inside: false, before: false, after: false };

        const tag = target.tagName.toLocaleLowerCase();

        let inside = false;
        
        if (tag === 'fca-row-100554') inside =  false;

        if (!this.myInnerHTML || this.myInnerHTML === '') inside = true;

        if (this.myInnerHTML.indexOf('fca-col-100554') < 0) inside =  true;

        if (this.myInnerHTML.indexOf('fca-col-100554') >= 0 && tag === 'fca-col-100554') {
            inside =  true;
        }

        const parent = this.getMyParentFCA(this);

        const insideFather = parent && parent.tagName.startsWith('FCA-') ?parent.allowCommand('move', scope, target) : {inside:true};
        const before = insideFather.inside;
        const after = insideFather.inside;

        return { inside, before, after }
        
    }

}
