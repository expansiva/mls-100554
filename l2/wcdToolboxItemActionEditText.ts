/// <mls shortName="wcdToolboxItemActionEditText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-toolbox-item-action-edit-text-100554')
export class WCDToolboxItemActionEditText extends WcdToolboxItemBase {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBase | undefined;
    public args: string | undefined;

    private myMsg: MessageType = messages['en'];

    private edittextwcd: HTMLElement | undefined;

    //-------COMPONENT---------------------

    createRenderRoot() {
        return this;
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elMain || !this.myParent) return;

    }

    render() {

        switch (this.args) {
            case 'edit':
                return this.renderEdit();
            default: return this.renderButton();
        }

    }

    renderButton() {
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;
    }

    renderEdit() {
        if (!this.elMain || !this.myParent) return;

        const el = (this.elMain.shadowRoot ? this.elMain.shadowRoot.children[0] : this.elMain.children[0]) as HTMLElement;

        if (!el) return html`Not found element`;

        const info = this.myParent.getBoundingClientRect();
        const css = `width:${info.width}px; height:${info.height}px; background:#fff`
        return html`<div id="edittextwcd" contenteditable="true" @keydown="${this.onkeyDown}" @input="${this.onInput}" style="${css}">${unsafeHTML(el.innerHTML)}</div>`;
    }

    //---------IMPLEMENTATION-----------------

    private onInput(e: MouseEvent) {
        e.stopPropagation();
        const me = e.target as HTMLElement;

        if (!me || !this.elMain || !this.myParent) return;

        const el = (this.elMain.shadowRoot ? this.elMain.shadowRoot.children[0] : this.elMain.children[0]) as HTMLElement;

        el.innerText = me.innerText as string;
    }

    private onkeyDown(e: any) {
        e.stopPropagation();

        if (!this.myParent || !this.elMain) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            this.myParent.updateSize(this.elMain, this.querySelector('#edittextwcd') as HTMLElement, true);
            document.execCommand('insertText', false, '\n');
        } else if (e.key === 'Backspace') {
            this.myParent.updateSize(this.elMain, this.querySelector('#edittextwcd') as HTMLElement, true);
            
        }

    }

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent) return;

        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: 'edit',
                    args: 'edit',
                    position: 'p-m2'
                },

            ],
            false,
            'size'
        )

    }
}