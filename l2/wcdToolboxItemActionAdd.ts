/// <mls shortName="wcdToolboxItemActionAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IWCDCommand } from './_100554_wcdTypes';
import { execute as excCommandEnter } from './_100554_wcdCommandEnter';

@customElement('wcd-toolbox-item-action-add-100554')
export class WCDToolboxItemActionEditAttr extends WcdToolboxItemBase {

    public args: string | undefined;

    constructor() {
        super();

    }

    //-------COMPONENT---------------------

    createRenderRoot() {
        return this;
    }

    disconnectedCallback() {

        super.disconnectedCallback();
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elMain || !this.myParent) return;

    }

    render() {

        return this.renderButton();

    }

    renderButton() {
        this.title = "add";
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>`;
    }

    //---------IMPLEMENTATION-----------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent || !this.elICA || !this.elICA.overlayRef) return;

        const param: IWCDCommand = {
            args: new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: this.elICA.overlayRef.parentElement as any,
            selectedIca: this.elICA
        }

        excCommandEnter(param);

    }

}