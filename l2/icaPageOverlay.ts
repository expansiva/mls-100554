/// <mls shortName="icaPageOverlay" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getPosition } from './_100554_icaGlobal';
import { CollabLitElement } from './_100554_collabLitElement';
import { IcaPageOverlayItem } from './_100554_icaPageOverlayItem';

export function initIcaPageOverlay(): boolean {
    return true;
}

@customElement('ica-page-overlay-100554')
export class IcaPageOverlay extends CollabLitElement {

    private resizeObserver: ResizeObserver | undefined;

    firstUpdated() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                this.updateSizeOverlayItems();
                
            }
        });
        this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('globalVariation') && changedProperties.get('globalVariation') !== undefined) {
            setTimeout(() => this.updateSizeOverlayItems(), 500);
        }
    }

    createRenderRoot() {
        return this; // dont use shadow root
    }

    render() {
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.width = '100%';
        this.style.height = 'calc(100% + 55px)';//'calc(100vh - 50px)';//'100%';
        this.style.zIndex = '9000';
        this.style.top = '0';
        return html``;
    }

    
    private updateSizeOverlayItems() {
        
        const items = Array.from(this.children) as IcaPageOverlayItem[];
        const boundingPage = this.getBoundingClientRect();
        items.forEach((item) => {
            if (!item.info) return;
            const { x, y, height, width } = item.info.element.getBoundingClientRect();
            item.info.x = x;
            item.info.y = y;
            item.info.height = height;
            item.info.width = width;
            const pos = getPosition(item.info, boundingPage);
            item.style.width = pos.width;
            item.style.height = pos.height;
            item.style.top = pos.top;
            item.style.left = pos.left;
        });
    }

}
