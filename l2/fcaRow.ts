/// <mls shortName="fcaRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["wcd-toolbox-100554"]
 * } 
 */

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FcaLitElementBase } from './_100554_fcaLitElementBase';
import { IActionLevels } from './_100554_fcaGlobal';

@customElement('fca-row-100554')
export class FCARow extends FcaLitElementBase {

    public allowsChild = (tag: string): boolean => {

        if (tag === 'fca-row-100554') return false;

        if (!this.myInnerHTML) return true;

        if (this.myInnerHTML && this.myInnerHTML === '') return true;

        if (this.myInnerHTML.indexOf('fca-col-100554') < 0) return true;

        if (this.myInnerHTML.indexOf('fca-col-100554') >= 0 && tag === 'fca-col-100554') {
            return true;
        }

        return false

    };
    public allowAddBody = true;

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
                    {
                        text: 'Add Column',
                        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
                        onclick: () => this.addColumn()
                    }
                ],
                menuSubItens: [
                    this.templateActionsMenu.goToFirstChild,
                    this.templateActionsMenu.removeMe
                ],
            },
            {
                position: 'p-l5',
                tp: 'button',
                format: 'circle',
                title: 'New Line',
                iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
                onclick: () => { this.addNewLine() },
                menuItens: [],
                menuSubItens: [],
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

        this.style.display = '';

        const code = `<div style="display:flex; ${this.styleel}">${this.myInnerHTML}</div>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    public renderTag = (param: string): any => {

        this.style.display = '';

        const code = `<div style="display:flex; ${this.styleel}">${this.myInnerHTML}</div>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    public renderEdit = (param: string): any => {

        this.style.position = 'relative';

        const code = `<div style="display:flex; ${this.styleel}">${this.myInnerHTML}</div><wcd-toolbox-100554 level="${this.level}" widget="div"></wcd-toolbox-100554>`;

        const objRender = html`${unsafeHTML(code)}`;
        return objRender;

    }

    private addColumn(): void {

        try {
            const el = this.querySelector('div:first-child');
            if (!el) return;
            const els = el.querySelectorAll('fca-col-100554');
            const tot = els ? els.length + 1 : 1;
            const tag = `<fca-col-100554 renderType="edit" widget="div" level="${this.level}"> <fca-text-100554 text="Column ${tot}" styleel="display:block" widget="span" renderType="edit" level="${this.level}"></fca-text-100554></fca-col-100554>`
            const item = document.createElement('span');
            item.innerHTML = tag;
            el.appendChild(item.children[0]);
            this.updateMyInnerHtml();

        } catch (e) {
            console.info(e);
        }

    }

    private addNewLine(): void {

        try {
            const parent = this.parentElement;
            if (!parent) return;

            const tag = `
            <fca-row-100554 renderType="edit" widget="div" styleel="width:100%" level="${this.level}">
                    <fca-col-100554 renderType="edit" widget="div" level="${this.level}">
                            <fca-text-100554 style="width:100%" text="New Line" styleel="" widget="p" renderType="edit" level="${this.level}">
                            </fca-text-100554>
                    </fca-col-100554>
            </fca-row-100554>`;
            const item = document.createElement('span');
            item.innerHTML = tag;

            if (parent.lastChild === this) {
                parent.appendChild(item.children[0]);
            } else {
                parent.insertBefore(item.children[0], this.nextSibling);
            }

            this.updateMyInnerHtml();

        } catch (e) {
            console.info(e);
        }

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


}