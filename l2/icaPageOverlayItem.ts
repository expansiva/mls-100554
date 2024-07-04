/// <mls shortName="icaPageOverlayItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDToolbox } from '_100554_wcdToolbox';
import { IICADepths, getPosition } from './_100554_icaPageOverlayBase';

export function initIcaPageOverlayItem(): boolean {
    return true;
}
@customElement('ica-page-overlay-item-100554')
export class IcaPageOverlayItem extends LitElement {

    @property() info: IICADepths | undefined;

    @property() widget: string | undefined;

    public boundingPage: DOMRect | undefined;

    private overlay: HTMLElement | undefined;

    createRenderRoot() {
        return this; // dont use shadow root
    }

    firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        this.setEvents();
    }

    render() {

        this.overlay = this.parentElement as HTMLElement;

        if (!this.info || !this.boundingPage) return html``;
        const pos = getPosition(this.info, this.boundingPage);
        this.info.element.overlayRef = this;
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.width = pos.width;
        this.style.height = pos.height;
        this.style.top = pos.top;
        this.style.left = pos.left;
        return html``;
    }

    private setEvents() {
        this.onmouseover = (e) => {
            this.onIcaOverlayItemOver(e);
        };
        this.onmouseleave = (e) => {
            this.onIcaOverlayItemLeave(e);
        };
        this.onclick = (e) => {
            this.onIcaOverlayItemClick(e);
        };
    }

    private onIcaOverlayItemLeave(e: MouseEvent) {
        this.style.opacity = '';
        this.style.background = '';
    }

    private onIcaOverlayItemOver(e: MouseEvent) {
        const wcd = this.querySelector('wcd-toolbox-100554');
        if(wcd) return;
        this.style.background = '#d3e3fd';
        this.style.opacity = '.3'
    }

    private async onIcaOverlayItemClick(e: MouseEvent) {
        e.stopPropagation();

        if (!this.overlay || !this.info) return;

        const origin = (e.detail as any).origin;
        const wcds = this.overlay.querySelectorAll('wcd-toolbox-100554');
        wcds.forEach((wc) => wc.remove());
        const wcd = document.createElement('wcd-toolbox-100554') as WCDToolbox;
        wcd.elICA = this.info.element;

        await this.setActions();
        let act = (this.info.element.actions as any)[this.info.element.level as any];
        if (!act) act = [];
        wcd.actions = act;

        this.appendChild(wcd);
        if (origin !== "editor") this.selectOnHTML();

        // if (this.level !== '4') return;
        // mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);
        // mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
    }

    private selectOnHTML(): void {

        if (!this.info || !this.info.element) return;
        const level = this.info.element.getAttribute('level');
        if (level !== '2') return;

        const id = this.info.element.id;
        if (!id) return;
        const infoL2 = (mls.actual[2] as any).left as any;
        const name = mls.l2.editor.getKey({ project: infoL2.project, shortName: infoL2.shortName });
        const mfile = mls.l2.editor.mfiles[name];
        if (!mfile || !(mfile as any).modelHTML) return;

        const model = (mfile as any).modelHTML;
        const line = model.findMatches(`id="${id}"`, false, false, false, null, true);
        if (!line || !line[0]) return;
        const { startLineNumber } = line[0].range;

        mls.events.fire(2, 'WidgetAction' as any, `{"op":"SelectLine", "line":${startLineNumber}, "origin":"preview"}`);

    }

    private async setActions() {
        if (!this.info || !this.info.element) return;
        const el = this.info.element;
        if(el.isLoadMyAction[el.level as any]) return;
        await el.setActions(el.level as any);
        el.isLoadMyAction[el.level as any] = true;
    }

}

