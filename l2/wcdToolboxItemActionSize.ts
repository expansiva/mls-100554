/// <mls shortName="wcdToolboxItemActionSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';


//version 4

/// **collab_i18n_start**
const message_pt = {
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',

}

const message_en = {
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-toolbox-item-action-size-100554')
export class WCDToolboxItemActionSize extends WcdToolboxItemBase {

    private myMsg: MessageType = messages['en'];
    public args: string | undefined;

    private elExternal: HTMLElement | undefined;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

    //------COMPONENT-------------------

    disconnectedCallback() {
        if (this.elExternal && this.hasRenderOutdoor) {
            render('', this.elExternal);
        }
        super.disconnectedCallback();
    }

    createRenderRoot() {
        return this;
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elICA || !this.myParent) return;

        if (this.args && ['all', 'height', 'width'].includes(this.args)) {
            this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');
            this.onmousedown = (e) => this.initDragging(e);
        }

    }

    render() {

        switch (this.args) {
            case 'height':
                return this.renderOne('height');
            case 'width':
                return this.renderOne('width');
            case 'all':
                return this.renderAll();
            default: return this.renderButton();
        }

    }

    renderButton() {
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>`;
    }

    renderOne(pos: string) {

        this.classList.add('f-square');
        switch (pos) {
            case 'height':
                this.style.cursor = 'ns-resize';
                break;
            case 'width':
                this.style.cursor = 'ew-resize';
                break;
            default: '';
        }
        return html``;
    }

    renderAll() {
        return html``;
    }

    //--------IMPLEMENTATION-------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent) return;

        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: 'size',
                    args: 'height',
                    position: 'p-m3'
                },
                {
                    name: 'size',
                    args: 'width',
                    position: 'p-r2'
                }
            ],
            false,
            'size'
        )

        const params = {
            level: 3,
            position: 'right',
            wdcPath: this.myParent.title,
            op: 'Styles',
        }

        mls.events.fire([3], 'WCDEvent' as any, JSON.stringify(params))
    }

    //------EXTERAL SCENARY----------------

    private hasRenderOutdoor = false;
    private async renderOutdoorScenary() {

        if (!this.myParent || this.myParent.level !== '3') return;

        this.elExternal = await this.myParent.getAndSetScenaryOutDoor('Styles');
        if (!this.elExternal) return;

        if (!this.hasRenderOutdoor) render('', this.elExternal);
        this.hasRenderOutdoor = true;

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
        if (!this.elICA) return html``;
        return html`
            <div style="display:flex; flex-direction:column; gap:.5rem ;padding:1rem" class="myAuxGroup">
                <p style=" margin-bottom: 5px;">A <b>width</b> propriedade CSS define a largura de um elemento.<br/>A <b>height</b> propriedade CSS especifica a altura de um elemento.</p>
                <h4 style="display:flex; gap:1.5rem;margin:0px" >Size</h4>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">Width</div>
                    <collab-ds-input-range-100554 prop="width" value="${this.elICA.style.width}" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">Height</div>
                    <collab-ds-input-range-100554 prop="height" value="${this.elICA.style.height}" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
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


        if (!prop || !this.elICA || !this.myParent) return;

        this.elICA.style[prop as any] = el.value;
        this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
        this.myParent.updateBackgroundAuxSize('show');
        this.fireEvent();
    }

    //---------DRAG----------------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private initDragging(e: MouseEvent): void {

        if (!this.elICA || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.elICA).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.elICA).height, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elICA || !this.myParent) return;

            console.info(this.args)
            if (!this.args || ['all', 'width'].includes(this.args)) {
                this.elICA.style.width = (this.startWidth + e.clientX - this.startX) + 'px';
            }

            if (!this.args || ['all', 'height'].includes(this.args)) {
                this.elICA.style.height = (this.startHeight + e.clientY - this.startY) + 'px';
            }

            this.renderOutdoorScenary();
            this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elICA) return;

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            this.fireEvent();

        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

    //----------FIRE----------------

    private fireEvent(ret: string = ''): void {

        if (!this.elICA || !this.myParent) return;

        if (ret === '') {

            ret = `width: ${this.elICA.style.width}; height: ${this.elICA.style.height};`
            if (this.args === 'width') ret = `width: ${this.elICA.style.width};`
            if (this.args === 'height') ret = `height: ${this.elICA.style.height};`

        }

        this.myParent.setStyle(ret);

    }

}