/// <mls shortName="wcdToolboxItemActionSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/// <mls shortName="wcdToolboxItemActionSize" project="100552" enhancement="_100541_enhancementLit" groupName="rating" />

import { html, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { updateSize } from './_100554_fcaGlobal';

@customElement('wcd-toolbox-item-action-size-100554')
export class WCDToolboxItemActionSize extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'all' | 'height' | 'width' | undefined;

    public myFather: HTMLElement | undefined;
    public elMain: HTMLElement | undefined;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

    createRenderRoot() {
        return this;
    }

    render() {

        return html``;

    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        (this as HTMLElement).addEventListener('mousedown', this.initDragging, false);

    }

    private initDragging(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.elMain).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.elMain).height, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;

            if(!this.tpChange || ['all', 'width'].includes(this.tpChange)){
                this.elMain.style.width = (this.startWidth + e.clientX - this.startX) + 'px';
            }

            if(!this.tpChange || ['all', 'height'].includes(this.tpChange)){
                this.elMain.style.height = (this.startHeight + e.clientY - this.startY) + 'px';
            }

            updateSize(this.elMain, this.myFather, false);

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain) return;

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            let ret = `{"width":"${this.elMain.style.width}", "height":"${this.elMain.style.height}"}`;

            if (this.tpChange === 'width') ret = `{"width":"${this.elMain.style.width}"}`;

            if(this.tpChange === 'height') ret = `{"height":"${this.elMain.style.height}"}`;

            const evento = new CustomEvent('onChange', {
                detail: { valor: ret },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(evento);
        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

}