/// <mls shortName="wcdToolboxItemActionDelete" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { execute as excCommandDel } from '/_100554_/l2/wcdCommandDel.js';

@customElement('wcd-toolbox-item-action-delete-100554')
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
        if (!this.elICA || !this.myParent) return;

    }

    render() {

        return this.renderButton();

    }

    renderButton() {
        this.title = "delete";
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
    }

    //---------IMPLEMENTATION-----------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent || !this.elICA || !this.elICA.overlayRef) return;

        const param: IWCDCommand = {
            args: new KeyboardEvent('keydown', {
                key: 'Del',
                code: 'Del',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: this.elICA.overlayRef.parentElement as any,
            selectedIca: this.elICA
        }

        excCommandDel(param);

    }




}