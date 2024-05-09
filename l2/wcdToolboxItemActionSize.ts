/// <mls shortName="wcdToolboxItemActionSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';

//version 4
@customElement('wcd-toolbox-item-action-size-100554')
export class WCDToolboxItemActionSize extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'all' | 'height' | 'width' | undefined;

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    private elExternal: HTMLElement | undefined;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

    createRenderRoot() {
        return this;
    }

    render() {

        this.renderOutdoorScenary();
        return html``;

    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elMain || !this.myParent) return;
        this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
        this.myParent.updateBackgroundAuxSize('show');
        this.onmousedown = (e) => this.initDragging(e);

    }

    //-----------------
    private async renderOutdoorScenary() {

        if (!this.myParent || this.myParent.level !== '4') return;

        this.elExternal = await this.myParent.getAndSetScenaryOutDoor('Styles');
        if (!this.elExternal) return;

        render(this.renderSize(), this.elExternal);

        setTimeout(() => {

            if (!this.elExternal) return;

            const el = this.elExternal.querySelector('#scriptInputRange');
            if (el) return;

            const script = document.createElement('script');
            script.src = '/_100554_collabDsInputRange';
            script.id = 'scriptInputRange';
            script.type = 'module';

            this.elExternal.appendChild(script);

        }, 500);

    }

    private renderSize() {
        if (!this.elMain) return html``;
        return html`
            <div style="display:flex; flex-direction:column; gap:.5rem ;padding:1rem" class="myAuxGroup">
                <p style=" margin-bottom: 5px;">A <b>width</b> propriedade CSS define a largura de um elemento.<br/>A <b>height</b> propriedade CSS especifica a altura de um elemento.</p>
                <h4 style="display:flex; gap:1.5rem;margin:0px" >Size</h4>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">Width</div>
                    <collab-ds-input-range-100554 prop="width" value="${this.elMain.style.width}" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">Height</div>
                    <collab-ds-input-range-100554 prop="height" value="${this.elMain.style.height}" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div> 
            </div>
        `;
    }

    private timeonChangeProp = -1;
    private onChangeProp(e: KeyboardEvent) {
        const el = e.currentTarget as HTMLInputElement;
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.changeEl(el);
        }, 500);
    }

    private changeEl(el: HTMLInputElement): void {

        const prop = el.getAttribute('prop');


        if (!prop || !this.elMain || !this.myParent) return;

        this.elMain.style[prop as any] = el.value;
        this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
        this.myParent.updateBackgroundAuxSize('show');
        this.fireEvent();
    }

    //-------------------------------------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private initDragging(e: MouseEvent): void {

        if (!this.elMain || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.elMain).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.elMain).height, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myParent) return;

            console.info(this.tpChange)
            if (!this.tpChange || ['all', 'width'].includes(this.tpChange)) {
                this.elMain.style.width = (this.startWidth + e.clientX - this.startX) + 'px';
            }

            if (!this.tpChange || ['all', 'height'].includes(this.tpChange)) {
                this.elMain.style.height = (this.startHeight + e.clientY - this.startY) + 'px';
            }

            this.renderOutdoorScenary();
            this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain) return;

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            this.fireEvent();

        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

    private fireEvent(ret: string = ''): void {

        if (!this.elMain || !this.myParent) return;

        if (ret === '') {

            ret = `{"width":"${this.elMain.style.width}", "height":"${this.elMain.style.height}"}`;

            if (this.tpChange === 'width') ret = `{"width":"${this.elMain.style.width}"}`;

            if (this.tpChange === 'height') ret = `{"height":"${this.elMain.style.height}"}`;

        }

        const evento = new CustomEvent('onChange', {
            detail: { valor: `{"tp":"style","style":${ret} }` },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(evento);

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
            wc.setIconsWcdToolbox([], true, 'size');
            wc.backNavigationScenaryOutdoor();
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
                ],
                false,
                'padding'
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