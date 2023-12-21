/// <mls shortName="wcdToolboxItemActionPadding" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { updateBaseNoPadding } from './_100554_fcaGlobal';

@customElement('wcd-toolbox-item-action-padding-100554')
export class WCDToolboxItemActionPadding extends LitElement {

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
        if (!this.elMain ||  !this.myFather) return;
        updateBaseNoPadding(this.elMain, this.myFather);
        (this as HTMLElement).addEventListener('mousedown', this.initDragging, false);

    }

    private initDragging(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        const st = document.defaultView.getComputedStyle(this.elMain);
        this.startTop = parseInt(st.paddingTop, 10);
        this.startBottom = parseInt(st.paddingBottom, 10);
        this.startLeft = parseInt(st.paddingLeft, 10);
        this.startRight = parseInt(st.paddingRight, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;

            this.myFather.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
		    const deltaY: number = (e.clientY - this.startY);

            if(!this.tpChange || ['top'].includes(this.tpChange)){
                this.elMain.style.paddingTop = (this.startTop + deltaY ) + 'px';
            }

            if(!this.tpChange || ['bottom'].includes(this.tpChange)){
                this.elMain.style.paddingBottom = (this.startBottom + deltaY) + 'px';
            }

            if(!this.tpChange || ['left'].includes(this.tpChange)){
                this.elMain.style.paddingLeft = (this.startLeft + deltaX ) + 'px';
            }

            if(!this.tpChange || ['right'].includes(this.tpChange)){
                this.elMain.style.paddingRight = (this.startRight + deltaX * -1) + 'px';
            }

            updateBaseNoPadding(this.elMain, this.myFather);
            
        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myFather) return;

            this.myFather.style.background = '';

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            let ret = ``;

            if (this.tpChange === 'top') ret = `{"paddingTop":"${this.elMain.style.paddingTop}"}`;

            if (this.tpChange === 'bottom') ret = `{"paddingBottom":"${this.elMain.style.paddingBottom}"}`;

            if (this.tpChange === 'left') ret = `{"paddingLeft":"${this.elMain.style.paddingLeft}"}`;

            if (this.tpChange === 'right') ret = `{"paddingRight":"${this.elMain.style.paddingRight}"}`;

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