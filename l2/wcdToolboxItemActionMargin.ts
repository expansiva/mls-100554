/// <mls shortName="wcdToolboxItemActionMargin" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_fcaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';

@customElement('wcd-toolbox-item-action-margin-100554')
export class WCDToolboxItemActionMargin extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'top' | 'bottom' | 'left' | 'right' | 'all' | undefined;

    public myParent: HTMLElement | undefined;
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
        this.onmousedown = (e) => this.initDragging(e);
        //(this as HTMLElement).addEventListener('mousedown', this.initDragging, false);

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

            if (!this.elMain || !this.myParent) return;

            this.myParent.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
            const deltaY: number = (e.clientY - this.startY);

            if (!this.tpChange || ['top'].includes(this.tpChange)) {
                this.elMain.style.marginTop = (this.startTop + deltaY * -1) + 'px';
            }

            if (!this.tpChange || ['bottom'].includes(this.tpChange)) {
                this.elMain.style.marginBottom = (this.startBottom + deltaY) + 'px';
            }

            if (!this.tpChange || ['left'].includes(this.tpChange)) {
                this.elMain.style.marginLeft = (this.startLeft + deltaX) + 'px';
            }

            if (!this.tpChange || ['right'].includes(this.tpChange)) {
                this.elMain.style.marginRight = (this.startRight + deltaX) + 'px';
            }

            (this.myParent as any).updateSize(this.elMain, this.myParent, true);

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myParent) return; 

            this.myParent.style.background = '';

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            let ret = ``;

            if (this.tpChange === 'top') ret = `{"marginTop":"${this.elMain.style.marginTop}"}`;

            if (this.tpChange === 'bottom') ret = `{"marginBottom":"${this.elMain.style.marginBottom}"}`;

            if (this.tpChange === 'left') ret = `{"marginLeft":"${this.elMain.style.marginLeft}"}`;

            if (this.tpChange === 'right') ret = `{"marginRight":"${this.elMain.style.marginRight}"}`;

            
            const evento = new CustomEvent('onChange', {
                detail: { valor: `{"tp":"style","style":${ret} }` },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(evento);
        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

}

export const getTemplateActionMargin = (mode: string = '', position: string = ''): IActionsToolbox => {

    let ret: IActionsToolbox = templateActionMargin.buttonMargin as IActionsToolbox;
    if (mode === 'marginTop') ret = templateActionMargin.marginTop as IActionsToolbox;
    if (mode === 'marginRight') ret = templateActionMargin.marginRight as IActionsToolbox;
    if (mode === 'marginBottom') ret = templateActionMargin.marginBottom as IActionsToolbox;
    if (mode === 'marginLeft') ret = templateActionMargin.marginLeft as IActionsToolbox;

    if (position !== '') ret.position = position as any;
    return ret as IActionsToolbox;

}

const templateActionMargin = {
    backButton: {
        position: '',
        tp: 'back-button',
        format: '',
        title: 'Back',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            wc.setIconsWcdToolbox([], true);
        },
        menuItens: [],
        menuSubItens: [],
        widget: '',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick:false,
    },
    buttonMargin: {
        position: 'p-m4',
        tp: 'button',
        format: '',
        title: 'Margin',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 32h64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352H288V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H192c-88.4 0-160-71.6-160-160s71.6-160 160-160z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            wc.setIconsWcdToolbox(
                [
                    templateActionMargin.backButton as IActionsToolbox,
                    templateActionMargin.marginTop as IActionsToolbox,
                    templateActionMargin.marginRight as IActionsToolbox,
                    templateActionMargin.marginBottom as IActionsToolbox,
                    templateActionMargin.marginLeft as IActionsToolbox
                ],
                false,
                'size'
            )
        },
        menuItens: [],
        menuSubItens: [],
        widget: '',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick:false,
    },
    marginTop: {
        position: 'p-m1',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-margin-100554',
        cursor: 'ns-resize',
        attrs: [{ attr: 'tpchange', value: 'top' }],
        isDblClick:false,
    },
    marginRight: {
        position: 'p-r2',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-margin-100554',
        cursor: 'ew-resize',
        attrs: [{ attr: 'tpchange', value: 'right' }],
        isDblClick:false,

    },
    marginBottom: {
        position: 'p-m3',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-margin-100554',
        cursor: 'ns-resize',
        attrs: [{ attr: 'tpchange', value: 'bottom' }],
        isDblClick:false,
    },
    marginLeft: {
        position: 'p-l2',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-margin-100554',
        cursor: 'ew-resize',
        attrs: [{ attr: 'tpchange', value: 'left' }],
        isDblClick:false,
    },

}