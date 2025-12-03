/// <mls shortName="wcdToolboxItemActionAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { execute as excCommandEnter } from '/_100554_/l2/wcdCommandEnter.js';


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
        if (!this.elICA || !this.myParent) return;

    }

    render() {

        if (this.args === 'child') return this.renderButtonChild();
        
        return this.renderButton();

    }

    renderButton() {
        this.title = "add";
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>`;
    }

    renderButtonChild() {
        this.title = "add child";
        this.onclick = (e) => this.clickButtonChild(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M544 416L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l512 0c17.7 0 32-14.3 32-32s-14.3-32-32-32zm22.6-137.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L480 274.7 480 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96zm-320-45.3c-12.5-12.5-32.8-12.5-45.3 0L160 274.7 160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7L54.6 233.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3z"/></svg>`;
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

    private clickButtonChild(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent || !this.elICA || !this.elICA.overlayRef) return;

        //this.elICA.allowCommand('addChild' as any, this, this);

    }

}