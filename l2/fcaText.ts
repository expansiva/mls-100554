/// <mls shortName="fcaText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * }
 */

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase, IAllowCommand } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-text-100554')
export class FcaText extends FcaLitElementBase {

    // ------------ PROPERTIES ------------------

    @property({ type: String, reflect: true })
    public text: string | undefined;

    private styleElMain: CSSStyleDeclaration | undefined = undefined;

    // ------------ COMPONENT--------------------

    firstUpdated(changedProperties: any) {

        super.firstUpdated(changedProperties);

        const el = document.createElement('span');
        el.style.cssText = this.styleel ? this.styleel : '';
        this.styleElMain = el.style;

        this.setMyActions();

    }


    // -------------- ABSTRACT ------------------

    public actions: IActionLevels = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {

        if (cmd === 'move') return this.commandMove(scope, target);

        return { inside: false, before: false, after: false };

    }

    public renderPreview = (param: string): any => {

        if (!this.text) this.text = '';

        let code = `
            <${this.widget} style="${this.styleel}">
                ${this.text}
            </${this.widget}>`
            ;

        return html`${unsafeHTML(code)}`;

    }

    public renderEditActive = (param: string): any => {

        if (!this.text) this.text = '';

        let code = `
            <${this.widget} style="${this.styleel}">
                ${this.text}
            </${this.widget}>
            
        `;

        let act = (this.actions as any)[this.level as any];
        if (!act) act = [];

        return html`
            ${unsafeHTML(code)}
            <wcd-toolbox-100554 level="${this.level}" widget="${this.widget}" 
            .actions=${act} >
            </wcd-toolbox-100554>
        `;

    }


    public changeStateHtml(html: string): void {

        const s = document.createElement('span');
        s.innerHTML = atob(html);
        if (!s.children[0]) return;
        const el = this.clearStyleTree(s.children[0] as HTMLElement);
        setTimeout(() => { this.setAttribute('text', el.innerHTML); }, 200)

    }

    public changeStateStyle(style: {}): void {

        if (!this.styleElMain || !style) return;

        const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
        if (el) {

            this.styleElMain.cssText = el.style.cssText;
            Object.assign(this.styleElMain, style as CSSStyleDeclaration);
            el.style.cssText = this.styleElMain.cssText;
            this.setAttribute('styleel', el.style.cssText);

        }

    }

    // ----------- IMPLEMENTATION ---------------

    private async setMyActions() {

        const { getTemplateActionMargin } = await import('./_100554_wcdToolboxItemActionMargin');
        const { getTemplateActionPadding } = await import( './_100554_wcdToolboxItemActionPadding');
        const { getTemplateActionSize } = await import( './_100554_wcdToolboxItemActionSize');
        const { getTemplateActionMove } = await import( './_100554_wcdToolboxItemActionMove');
        const { getTemplateActionQuill } = await import( './_100554_wcdToolboxItemActionEditQuill');

        const margin = getTemplateActionMargin();
        const padding = getTemplateActionPadding();
        const size = getTemplateActionSize('all');
        const move = getTemplateActionMove(); 
        const quill = getTemplateActionQuill();

        this.actions[4].push(margin);
        this.actions[4].push(padding);
        this.actions[4].push(size);
        this.actions[4].push(move);
        this.actions[4].push(quill);

    }

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        const myScope = this.getMyScope();

        if (myScope !== scope) return { inside: false, before: false, after: false };

        const parent = this.getMyParentFCA(this);
        if (!parent) return { inside: false, before: false, after: false };

        const insideFather = parent.allowCommand('move', scope, target);
        const before = insideFather.inside;
        const after = insideFather.inside;

        return { inside: false, before, after }

    }

    //preciso limpar o style que já existe para não duplicar na segunda renderização
    private clearStyleTree(el: HTMLElement): HTMLElement {

        el.style.cssText.replace(this.styleel as string, '');
        Array.from(el.children).forEach((i) => {

            this.clearStyleTree(i as HTMLElement);

        });

        return el;

    }

}
