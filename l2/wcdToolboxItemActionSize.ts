/// <mls shortName="wcdToolboxItemActionSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/// <mls shortName="wcdToolboxItemActionSize" project="100552" enhancement="_100541_enhancementLit" groupName="rating" />

import { html, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_fcaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';

@customElement('wcd-toolbox-item-action-size-100554')
export class WCDToolboxItemActionSize extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'all' | 'height' | 'width' | undefined;

    public myParent: WCDToolbox | undefined;
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
        this.onmousedown = (e) => this.initDragging(e);
        //(this as HTMLElement).addEventListener('mousedown', this.initDragging, false);

    }

    private initDragging(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.elMain).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.elMain).height, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myParent) return;

            if (!this.tpChange || ['all', 'width'].includes(this.tpChange)) {
                this.elMain.style.width = (this.startWidth + e.clientX - this.startX) + 'px';
            } else {
                this.elMain.style.width = this.elMain.getBoundingClientRect().width + 'px';
            }

            if (!this.tpChange || ['all', 'height'].includes(this.tpChange)) {
                this.elMain.style.height = (this.startHeight + e.clientY - this.startY) + 'px';
            } else {
                this.elMain.style.height = this.elMain.getBoundingClientRect().height + 'px';
            }

            this.myParent.updateSize(this.elMain, this.myParent, false);

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain) return;

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            let ret = `{"width":"${this.elMain.style.width}", "height":"${this.elMain.style.height}"}`;

            if (this.tpChange === 'width') ret = `{"width":"${this.elMain.style.width}"}`;

            if (this.tpChange === 'height') ret = `{"height":"${this.elMain.style.height}"}`;

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

export const getTemplate = (mode: string = '', position: string = ''): IActionsToolbox => {

    let ret: IActionsToolbox = templateActionSize.buttonSize as IActionsToolbox;

    if (mode === 'all') ret = templateActionSize.size as IActionsToolbox;

    if (mode === 'height') ret = templateActionSize.sizeHeight as IActionsToolbox;

    if (mode === 'width') ret = templateActionSize.sizeWidth as IActionsToolbox;

    if (position !== '') ret.position = position as any;

    return ret as IActionsToolbox;

}


const templateActionSize = {

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
        isDblClick: true,
    },

    buttonSize: {
        position: 'p-r4',
        tp: 'button',
        format: '',
        title: 'Size',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            wc.setIconsWcdToolbox(
                [
                    templateActionSize.backButton as IActionsToolbox,
                    templateActionSize.sizeHeight as IActionsToolbox,
                    templateActionSize.sizeWidth as IActionsToolbox
                ]
            )
        },
        menuItens: [],
        menuSubItens: [],
        widget: '',
        cursor: 'pointer',
        attrs: undefined,
        isDblClick: true,
    },

    size: {
        position: 'p-r3',
        tp: 'action',
        format: 'circle',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-size-100554',
        cursor: 'nwse-resize',
        attrs: [{ attr: 'tpchange', value: 'all' }],
        isDblClick: true,
    },

    sizeWidth: {
        position: 'p-r2',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-size-100554',
        cursor: 'ew-resize',
        attrs: [{ attr: 'tpchange', value: 'width' }],
        isDblClick: true,
    },

    sizeHeight: {
        position: 'p-m3',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-size-100554',
        cursor: 'ns-resize',
        attrs: [{ attr: 'tpchange', value: 'height' }],
        isDblClick: true,
    },
}