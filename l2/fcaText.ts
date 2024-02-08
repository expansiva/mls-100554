/// <mls shortName="fcaText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * }
 */ 
 
import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase } from './_100554_fcaLitElementBase';
import { getTemplateActionMargin } from './_100554_wcdToolboxItemActionMargin';

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

    }


    // -------------- ABSTRACT ------------------

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

        const ret = getTemplateActionMargin('', '');

        let code = `
            <${this.widget} style="${this.styleel}">
                ${this.text}
            </${this.widget}>
            
        `;

        return html`
            ${unsafeHTML(code)}
            <wcd-toolbox-100554 level="${this.level}" widget="${this.widget}" 
            .actions=${[ret]} >
            </wcd-toolbox-100554>
        `;

    }


    public changeStateHtml(html: string): void {

        const s = document.createElement('span');
        s.innerHTML = atob(html);
        if (!s.children[0]) return;
        const el = this.clearStyleTree(s.children[0] as HTMLElement);
        this.text = el.innerHTML;
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

    // ----------- IMPLEMENTATION ---------------


    //preciso limpar o style que já existe para não duplicar na segunda renderização
    private clearStyleTree(el: HTMLElement): HTMLElement {

        el.style.cssText.replace(this.styleel as string, '');
        Array.from(el.children).forEach((i) => {

            this.clearStyleTree(i as HTMLElement);

        });

        return el;

    }

}
