/// <mls shortName="wcdToolboxItemActionEditAttrDialog" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'
import { globalWcd } from '/_100554_/l2/wcdState.js';
import '/_100554_/l2/wcdToolboxItemActionEditAttrOut.js';

@customElement('wcd-toolbox-item-action-edit-attr-dialog-100554')
export class WcdToolboxItemActionEditAttrDialog extends CollabLitElement {

    private lastIca: HTMLElement | undefined;
    private lastHeight: string | undefined;
    private lastHeightWcd: string | undefined;
    @query('wcd-toolbox-item-action-edit-attr-out-100554') itemEdit: HTMLElement | undefined

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
        if (this.resizeObserver) this.resizeObserver.disconnect();

        super.disconnectedCallback();
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        this.initObserverResize();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);

    }

    render() {

        setTimeout(() => this.recalculeIcaHeight(), 200);
        this.style.cssText = `width: 100%; left:0px`;
        return html`<wcd-toolbox-item-action-edit-attr-out-100554></wcd-toolbox-item-action-edit-attr-out-100554>`;
    }

    //------IMPLEMENTS----------

    private resizeObserver: ResizeObserver | undefined;
    private timeResize = 0;
    private lastHeightResize = 0;
    private firstHeight = 0;
    private initObserverResize() {
        if (!this) return;

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {

            if (!entries || !entries[0] || !entries[0].contentRect) return;
            const actual = entries[0].contentRect.height;

            if (actual === this.lastHeightResize) return;

            this.lastHeightResize = actual;
            clearTimeout(this.timeResize);

            this.timeResize = setTimeout(() => {
                this.recalculeIcaHeight();
            }, 100)

        });
        this.resizeObserver.observe(this);
    }

    private recalculeIcaHeight() {

        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        if (!this.itemEdit) return;

        const heighttot = this.itemEdit.getBoundingClientRect()?.height;
        const height = (globalWcd.elICA as any).getBoundingClientRect()?.height;

        if (this.lastHeight === undefined) {
            this.lastHeight = (globalWcd.elICA as any).style.height;
            this.firstHeight = height;
        }
        if (this.lastHeightWcd === undefined) this.lastHeightWcd = (globalWcd.myParent as any).style.height;

        (globalWcd.myParent as any).setAttribute('needresize', 'false');
        //(globalWcd.myParent as any).style.overflowY = 'auto';
        (globalWcd.myParent as any).style.height = heighttot + 'px';
        (globalWcd.elICA as any).style.height = (heighttot + this.firstHeight + 30) + 'px';

        (globalWcd.myParent as any).style.top = this.firstHeight + 5 + 'px';
    }

}