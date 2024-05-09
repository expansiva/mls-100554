/// <mls shortName="wcdToolboxItemActionPadding" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IActionsToolbox } from './_100554_icaGlobal';
import { WCDToolbox } from './_100554_wcdToolbox';

//version 4
@customElement('wcd-toolbox-item-action-padding-100554')
export class WCDToolboxItemActionPadding extends LitElement {

    @property({ type: String, reflect: true })
    private tpChange: 'top' | 'bottom' | 'left' | 'right' | 'all' | undefined;

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined;
    private elExternal: HTMLElement | undefined;
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

        render(this.renderPadding(), this.elExternal);

    }

    private renderPadding() {
        if (!this.elMain) return html``;
        return html`
            <div style="display:flex; flex-direction:column; gap:.5rem ;padding:1rem" class="myAuxGroup">
                <p style=" margin-bottom: 5px;">A propriedade <b>padding</b> define uma a distância entre o conteúdo de um elemento e suas bordas</p>
                <h4 style="display:flex; gap:1.5rem;margin:0px" >${this.myMsg.padding}<input type="checkbox" prop="padding"></h4>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.top}</div>
                    <input prop="paddingTop" type="text" .value="${this.elMain.style.paddingTop}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.right}</div>
                    <input prop="paddingRight" type="text" .value="${this.elMain.style.paddingRight}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div> 
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.bottom}</div>
                    <input prop="paddingBottom" type="text" .value="${this.elMain.style.paddingBottom}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.left}</div>
                    <input prop="paddingLeft" type="text" .value="${this.elMain.style.paddingLeft}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
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
        const group = el ? el.getAttribute('group') as string : '';
        const elGroup = el.closest('.myAuxGroup')?.querySelector(`input[prop="${group}"]`) as HTMLInputElement;
        let isGroup = false;
        if (elGroup) isGroup = elGroup.checked;

        if (!prop || !this.elMain || !this.myParent) return;

        if (isGroup) {

            this.elMain.style.padding = el.value;
            ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'].forEach((pr: string) => {

                const field = el.closest('.myAuxGroup')?.querySelector(`input[prop="${pr}"]`) as HTMLInputElement;
                if (field) field.value = el.value;

            });

            this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');
            this.fireEvent(`{"padding":"${this.elMain.style.padding}"}`);
            return;

        }

        this.elMain.style[prop as any] = el.value;
        this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
        this.myParent.updateBackgroundAuxSize('show');
        this.fireEvent();
    }


    //-------------------------------------------

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

            if (!this.elMain || !this.myParent) return;

            this.myParent.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
            const deltaY: number = (e.clientY - this.startY);

            if (!this.tpChange || ['top'].includes(this.tpChange)) {
                this.elMain.style.paddingTop = (this.startTop + deltaY) + 'px';
            }

            if (!this.tpChange || ['bottom'].includes(this.tpChange)) {
                this.elMain.style.paddingBottom = (this.startBottom + deltaY) + 'px';
            }

            if (!this.tpChange || ['left'].includes(this.tpChange)) {
                this.elMain.style.paddingLeft = (this.startLeft + deltaX) + 'px';
            }

            if (!this.tpChange || ['right'].includes(this.tpChange)) {
                this.elMain.style.paddingRight = (this.startRight + deltaX * -1) + 'px';
            }

            this.renderOutdoorScenary();
            this.myParent.updateBaseNoPadding(this.elMain, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');
        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elMain || !this.myParent) return;

            this.myParent.style.background = '';

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

            if (this.tpChange === 'top') ret = `{"paddingTop":"${this.elMain.style.paddingTop}"}`;

            if (this.tpChange === 'bottom') ret = `{"paddingBottom":"${this.elMain.style.paddingBottom}"}`;

            if (this.tpChange === 'left') ret = `{"paddingLeft":"${this.elMain.style.paddingLeft}"}`;

            if (this.tpChange === 'right') ret = `{"paddingRight":"${this.elMain.style.paddingRight}"}`;

        }

        const evento = new CustomEvent('onChange', {
            detail: { valor: `{"tp":"style","style":${ret} }` },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(evento);

    }



    private myMsg = {
        margin: 'Margin',
        padding: 'Padding',
        top: 'Top',
        left: 'Left',
        bottom: 'Bottom',
        right: 'Right',
    }

}

export const getTemplate = (mode: string = '', position: string = ''): IActionsToolbox => {

    let ret: IActionsToolbox = templateActionPadding.buttonPadding as IActionsToolbox;
    if (mode === 'paddingTop') ret = templateActionPadding.paddingTop as IActionsToolbox;
    if (mode === 'paddingRight') ret = templateActionPadding.paddingRight as IActionsToolbox;
    if (mode === 'paddingBottom') ret = templateActionPadding.paddingBottom as IActionsToolbox;
    if (mode === 'paddingLeft') ret = templateActionPadding.paddingLeft as IActionsToolbox;

    if (position !== '') ret.position = position as any;
    return ret as IActionsToolbox;

}

const templateActionPadding = {
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
        isDblClick: false,
    },

    //padding
    buttonPadding: {
        position: 'p-l4',
        tp: 'button',
        format: '',
        title: 'padding',
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z"/></svg>',
        onclick: (e: MouseEvent, wc: WCDToolbox) => {
            wc.setIconsWcdToolbox(
                [
                    templateActionPadding.backButton as IActionsToolbox,
                    templateActionPadding.paddingTop as IActionsToolbox,
                    templateActionPadding.paddingRight as IActionsToolbox,
                    templateActionPadding.paddingBottom as IActionsToolbox,
                    templateActionPadding.paddingLeft as IActionsToolbox
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
        isDblClick: false,
    },
    paddingTop: {
        position: 'p-m1',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-padding-100554',
        cursor: 'ns-resize',
        attrs: [{ attr: 'tpchange', value: 'top' }],
        isDblClick: false,
    },
    paddingRight: {
        position: 'p-r2',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-padding-100554',
        cursor: 'ew-resize',
        attrs: [{ attr: 'tpchange', value: 'right' }],
        isDblClick: false,
    },
    paddingBottom: {
        position: 'p-m3',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-padding-100554',
        cursor: 'ns-resize',
        attrs: [{ attr: 'tpchange', value: 'bottom' }],
        isDblClick: false,
    },
    paddingLeft: {
        position: 'p-l2',
        tp: 'action',
        format: 'square',
        title: '',
        iconSvg: '',
        onclick: undefined,
        menuItens: [],
        menuSubItens: [],
        widget: 'wcd-toolbox-item-action-padding-100554',
        cursor: 'ew-resize',
        attrs: [{ attr: 'tpchange', value: 'left' }],
        isDblClick: false,
    },
}

