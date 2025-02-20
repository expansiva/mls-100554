/// <mls shortName="wcdToolboxItemActionEditAttrDialog" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement,query } from 'lit/decorators.js';
import {IListWidgetBase } from './_100554_wcdTypes';
import { CollabLitElement } from './_100554_collabLitElement'
import { globalWcd } from './_100554_wcdState';
import './_100554_wcdToolboxItemActionEditAttrOut';

@customElement('wcd-toolbox-item-action-edit-attr-dialog-100554')
export class WcdToolboxItemActionEditAttrDialog extends CollabLitElement {

    private lastIca: HTMLElement | undefined;
    private lastHeight: string | undefined;
    private lastHeightWcd: string | undefined;
    @query('wcd-toolbox-item-action-edit-attr-out-100554') itemEdit:HTMLElement | undefined

    //-------COMPONENT----------

    disconnectedCallback() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (globalWcd.myParent) {
            globalWcd.myParent.removeAttribute('needresize');
            (globalWcd.myParent as any).style.overflowY = '';
            (globalWcd.myParent as any).style.height = this.lastHeightWcd || '';
        }
        if (globalWcd.elICA) globalWcd.elICA.style.height = this.lastHeight || '';
        else if (this.lastIca) this.lastIca.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        
    }

    render() {

        setTimeout(() => this.recalculeIcaHeight(), 200);
        this.style.cssText = `width: 100%; left:0px` ;
        return html`<wcd-toolbox-item-action-edit-attr-out-100554></wcd-toolbox-item-action-edit-attr-out-100554>`;
    }

    //------IMPLEMENTS----------

    private recalculeIcaHeight() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        if (!this.itemEdit) return;

        const heighttot = this.itemEdit.getBoundingClientRect()?.height;
        const height = (globalWcd.elICA as any).getBoundingClientRect()?.height;
        
        if (this.lastHeight === undefined) this.lastHeight = (globalWcd.elICA as any).style.height;
        if (this.lastHeightWcd === undefined) this.lastHeightWcd = (globalWcd.myParent as any).style.height;

        (globalWcd.myParent as any).setAttribute('needresize', 'false');
        //(globalWcd.myParent as any).style.overflowY = 'auto';
        (globalWcd.myParent as any).style.height = heighttot+'px';
        (globalWcd.elICA as any).style.height = heighttot + 'px';
        
        (globalWcd.myParent as any).style.top = height + 5 + 'px'; 
    }

}