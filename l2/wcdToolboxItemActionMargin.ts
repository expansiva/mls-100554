/// <mls shortName="wcdToolboxItemActionMargin" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { updateSize } from './_100554_fcaGlobal';

@customElement('wcd-toolbox-item-action-margin-100554')
export class WCDToolboxItemActionMargin extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'top' | 'bottom' | 'left' | 'right' | 'all' |undefined;

    public myFather: HTMLElement | undefined;
    public elMain: HTMLElement | undefined;
    private startX: number = 0;
    private startY: number = 0;
    private startTop: number = 0;
    private startBottom: number = 0;
    private startLeft: number = 0;
    private startRight: number = 0;

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
        const st = document.defaultView.getComputedStyle(this.elMain);
        this.startTop = parseInt(st.marginTop, 10);
        this.startBottom = parseInt(st.marginBottom, 10);
        this.startLeft = parseInt(st.marginLeft, 10);
        this.startRight = parseInt(st.marginRight, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;

            this.myFather.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
		    const deltaY: number = (e.clientY - this.startY);

            if(!this.tpChange || ['top'].includes(this.tpChange)){
                this.elMain.style.marginTop = (this.startTop + deltaY * -1) + 'px';
            }

            if(!this.tpChange || ['bottom'].includes(this.tpChange)){
                this.elMain.style.marginBottom = (this.startBottom + deltaY) + 'px';
            }

            if(!this.tpChange || ['left'].includes(this.tpChange)){
                this.elMain.style.marginLeft = (this.startLeft + deltaX ) + 'px';
            }

            if(!this.tpChange || ['right'].includes(this.tpChange)){
                this.elMain.style.marginRight = (this.startRight + deltaX) + 'px';
            }

            updateSize(this.elMain, this.myFather, true);
            
        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;

            this.myFather.style.background = '';

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            let ret = ``;

            if (this.tpChange === 'top') ret = `{"marginTop":"${this.elMain.style.marginTop}"}`;

            if (this.tpChange === 'bottom') ret = `{"marginBottom":"${this.elMain.style.marginBottom}"}`;

            if (this.tpChange === 'left') ret = `{"marginLeft":"${this.elMain.style.marginLeft}"}`;

            if (this.tpChange === 'right') ret = `{"marginRight":"${this.elMain.style.marginRight}"}`;

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