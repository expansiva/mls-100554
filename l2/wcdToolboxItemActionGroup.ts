/// <mls shortName="wcdToolboxItemActionGroup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as icaGlobal from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

//version 4
@customElement('wcd-toolbox-item-action-group-100554')
export class WCDToolboxItemActionGroup extends LitElement {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    public elFCA: IcaLitElementBase | undefined;

    createRenderRoot() {
        return this;
    }

    render() {

        return html``;

    }

    firstUpdated() {

        if (!this.elFCA ) return;

        const inGroup = this.elFCA.getAttribute(icaGlobal.ATTRGROUP);
        const lock = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`;
        const unlock = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/></svg>`
        
        if (inGroup && inGroup === 'true') { 
            this.innerHTML = lock;
            return;
        } else {
            this.innerHTML = unlock;
        }
        

    }

    updated(changedProperties: any) {

        super.updated(changedProperties);

        this.onclick = (event) => { this.initClick(event); };

    }

    private initClick(e: MouseEvent): void {

        if (!this.elMain || !this.elFCA || !this.myParent || !document.defaultView) return;

        const inGroup = this.elFCA.getAttribute(icaGlobal.ATTRGROUP);
        const lock = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`;
        const unlock = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/></svg>`
        
        if (inGroup && inGroup === 'true') { 
            this.elFCA.removeAttribute(icaGlobal.ATTRGROUP);
            this.innerHTML = unlock;
            return;
        } else {
            this.innerHTML = lock;
            this.elFCA.setAttribute(icaGlobal.ATTRGROUP, 'true');
        }
    }
}

export const getTemplate = (mode: string = '', position: string = ''): icaGlobal.IActionsToolbox => {

    let ret: icaGlobal.IActionsToolbox = templateActionGroup.group as icaGlobal.IActionsToolbox;
    if (position !== '') ret.position = position as any;

    return ret as icaGlobal.IActionsToolbox;

}

const templateActionGroup = {
    group: {
        position: 'p-r4',
        tp: 'action',
        format: '',
        title: 'Group',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-group-100554',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick:false
    }
}