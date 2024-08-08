/// <mls shortName="wcdToolboxItemActionMenu" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render, repeat, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as icaGlobal from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';



/// **collab_i18n_start**
const message_pt = {
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',

}

const message_en = {
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-toolbox-item-action-menu-100554')
export class WcdToolboxItemActionMenu extends WcdToolboxItemBase {

    private myMsg: MessageType = messages['en'];

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBase | undefined;
    public args: string | undefined;

    @property({ reflect: true }) myItens: IWCDMenu100554 | undefined;
    @query('wcd-toolbox-submenu') containerSubMenu: HTMLElement | undefined;

    //----------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    updated() {

        try {

            if (!this.args || this.args === '') {
                this.myItens = this.defaultItens;
            } else {
                this.myItens = JSON.parse(this.args) as IWCDMenu100554;
            }

        } catch (e) {

            this.myItens = undefined;

        }

    }

    render() {

        if (!this.myItens) return html``;
        this.style.zIndex = '9999';
        return html`
        <style>${this.css}</style>
        <wcd-toolbox-itemmenu>
        ${repeat(this.myItens.itens,
            ((key: IWCDMenuItem100554, idx: number) => 'i' + idx) as any,
            ((item: IWCDMenuItem100554, index: any) => {

                return this.renderItem(item, index);

            }) as any
        )}
        ${this.renderSubMenu()}
        </wcd-toolbox-itemmenu>
        <wcd-toolbox-submenu style="display:none">
            ${repeat(this.myItens.subItens,
            ((key: IWCDMenuItem100554, idx: number) => 'i' + idx) as any,
            ((item: IWCDMenuItem100554, index: any) => {

                return this.renderSubItem(item, index);

            }) as any
        )}
        </wcd-toolbox-submenu>
            
        `;

    }

    renderItem(item: IWCDMenuItem100554, index: number) {
        return html`
            <a @click="${this.clickMenu}" .opt="${item.value}">
                <i title="${item.title}">${unsafeHTML(item.icon)}</i>
            </a>
        `
    }

    renderSubMenu() {
        if (!this.myItens || !this.myItens.subItens || this.myItens.subItens.length === 0) return html``;

        return html`
            <a @click="${this.toggleSubMenu}">
                <i title="SubMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                </i>
            </a>
        `

    }

    renderSubItem(item: IWCDMenuItem100554, index: number) {
        return html`
            <a @click="${this.clickSubMenu}" .opt="${item.value}">
                <i title="${item.title}">${unsafeHTML(item.icon)}</i>
                <span>${item.title}</span>
            </a>
        `
    }


    //-----------IMPLEMENTATION-----------


    private clickMenu(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'a') el = el.closest('a') as HTMLElement;

        if (!el) return;

        if (this.args === '' || !this.args) {
            this.goToDefaultActions((el as any).opt);
            return;
        }

        if (this.elICA && this.elICA.clickMenu) this.elICA.clickMenu((el as any).opt);

    }

    private clickSubMenu(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (el.tagName.toLocaleLowerCase() !== 'a') el = el.closest('a') as HTMLElement;

        if (!el) return;

        if (!this.containerSubMenu) return;

        this.containerSubMenu.style.display = 'none';

        if (this.args === '' || !this.args) {
            this.goToDefaultActions((el as any).opt);
            return;
        }

        if (this.elICA && this.elICA.clickMenu) this.elICA.clickMenu((el as any).opt);

    }

    private toggleSubMenu(e: MouseEvent) {

        if (!this.containerSubMenu) return;

        this.containerSubMenu.style.display = this.containerSubMenu.style.display === '' ? 'none' : '';
    }

    private goToDefaultActions(opt: string): void {

        switch (opt) {
            case 'goToParents':
                this.goToParent();
                break;
            case 'goToFirstChild':
                this.goToFirstChild();
                break;
            case 'removeMe':
                this.removeMe();
                break;
            default: '';
        }

    }

    private goToParent() {

        const toParent = (el: IcaLitElementBase) => {


            let parent = el.parentElement;
            if (!parent) parent = el.getRootNode() ? (el.getRootNode() as any).host : null;
            if (!parent) return;
            const tag = parent.tagName.toLowerCase();

            if (!tag.startsWith(`${icaGlobal.PREFIX}-`)) toParent(parent as IcaLitElementBase);
            else if (tag.startsWith(`${icaGlobal.PREFIX}-`)) {
                const overlayItem = (parent as IcaLitElementBase).overlayRef;
                if (!overlayItem) return;
                overlayItem.click();
            }

        }

        if (!this.elICA) return;
        toParent(this.elICA);


    }

    private goToFirstChild() {

        const toFirstChild = (el: IcaLitElementBase) => {


            if (el.children.length === 0) return;

            const findNextIca = (childrens: Element[]): IcaLitElementBase => {
                const child = childrens.find((item => item.tagName.toLowerCase().startsWith(`${icaGlobal.PREFIX}-`)));
                if (!child) {
                    for (let ch of childrens) {
                        const arrChildren = (Array.from(ch.shadowRoot ? ch.shadowRoot.children : ch.children));
                        let next = findNextIca(arrChildren);
                        if (!next) continue;
                        return next;
                    }
                }
                return child as IcaLitElementBase;
            };

            const arrChildren = (Array.from(el.shadowRoot ? el.shadowRoot.children : el.children));
            const nextIca = findNextIca(arrChildren);

            if (!nextIca) return;
            const overlayItem = nextIca.overlayRef;
            if (!overlayItem) return;
            overlayItem.click();

        }

        if (!this.elICA) return;
        toFirstChild(this.elICA);
    }

    private removeMe() {

        if (!this.elICA) return;
        this.elICA.overlayRef?.remove();
        this.elICA.remove();

    }
    //--------CSS------------------------

    private css = `

        wcd-toolbox-item-action-menu-100554{
            display:block;
            height:17px;
            border:1px solid #d3cece;
            padding:.2rem;
            border-radius:5px;
            position:relative;
            background:#fff;
        }

        wcd-toolbox-itemmenu{
            display:flex;
            height:20px;
            gap:.3rem;
            
        }

        wcd-toolbox-itemmenu a{
            display: flex!important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size:12px;
            width:18px;
            height:18px;
            
        }

        wcd-toolbox-itemmenu a:hover{
            background:#e1e1e1;
        }

        wcd-toolbox-submenu{
            position:absolute;
            top:19px;
            left:80%;
            display:flex;
            flex-direction: column;
            gap:.3rem;
            min-width: 150px;
            min-height: 50px;
            padding:.5rem;
            border:1px solid var(--bg-secondary-color-darker);
            background:#fff;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
            background:var(--bg-primary-color-lighter)
        }

        wcd-toolbox-submenu a {
            font-size:13px;
            display:flex;
            gap:.3rem;
            align-items: center;
            padding:.1rem;
            color:var(--text-primary-color);
        }

        wcd-toolbox-submenu a:hover {
            background:var(--grey-color-light);
        }
    `


    //---------PREDEFINITION--------------

    private defaultItens: IWCDMenu100554 = {
        itens: [
            {
                title: 'To Parent',
                value: 'goToParents',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z"/></svg>'
            },
        ],
        subItens: [
            {
                title: 'To Child',
                value: 'goToFirstChild',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M350 334.5c3.8 8.8 2 19-4.6 26l-136 144c-4.5 4.8-10.8 7.5-17.4 7.5s-12.9-2.7-17.4-7.5l-136-144c-6.6-7-8.4-17.2-4.6-26s12.5-14.5 22-14.5h88l0-192c0-17.7-14.3-32-32-32H32C14.3 96 0 81.7 0 64V32C0 14.3 14.3 0 32 0l80 0c70.7 0 128 57.3 128 128l0 192h88c9.6 0 18.2 5.7 22 14.5z"/></svg>'
            },
            {
                title: 'Delete',
                value: 'removeMe',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
            }
        ]
    }
}

interface IWCDMenu100554 {
    itens: IWCDMenuItem100554[],
    subItens: IWCDMenuItem100554[]
}

interface IWCDMenuItem100554 {
    title: string,
    value: string,
    icon: string
}