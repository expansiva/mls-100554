/// <mls shortName="wcdToolboxItemActionMargin" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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

@customElement('wcd-toolbox-item-action-margin-100554')
export class WCDToolboxItemActionMargin extends WcdToolboxItemBase {

    private myMsg: MessageType = messages['en'];

    public args: string | undefined;

    private elExternal: HTMLElement | undefined;
    private startX: number = 0;
    private startY: number = 0;
    private startTop: number = 0;
    private startBottom: number = 0;
    private startLeft: number = 0;
    private startRight: number = 0;

    //-------COMPONENT---------------------

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
        
        

        if (this.args && ['top', 'bottom', 'left', 'right'].includes(this.args)) {
            this.myParent.updateSize(this.elICA, this.myParent, true);
            this.onmousedown = (e) => this.initDragging(e);
        }

    }

    render() {

        switch (this.args) {
            case 'top':
                return this.renderOne('top');
            case 'bottom':
                return this.renderOne('bottom');
            case 'left':
                return this.renderOne('left');
            case 'right':
                return this.renderOne('right');
            case 'all':
                return this.renderAll();
            default: return this.renderButton();
        }

    }

    renderButton() {
        this.title = 'Margin';
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 32h64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352H288V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H192c-88.4 0-160-71.6-160-160s71.6-160 160-160z"/></svg>`;
    }

    renderOne(pos: string) {
        this.classList.add('f-square');

        switch (this.args) {
            case 'top':
                this.style.cursor = 'ns-resize';
                break;
            case 'bottom':
                this.style.cursor = 'ns-resize';
                break;
            case 'left':
                this.style.cursor = 'ew-resize';
                break;
            case 'right':
                this.style.cursor = 'ew-resize';
                break;
            default: '';
        }
        return html``;
    }

    renderAll() {
        return html``;
    }


    //------IMPLEMENTATION----------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent) return;

        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: 'margin',
                    args: 'top',
                    position: 'p-m1'
                },
                {
                    name: 'margin',
                    args: 'right',
                    position: 'p-r2'
                },
                {
                    name: 'margin',
                    args: 'bottom',
                    position: 'p-m3'
                },
                {
                    name: 'margin',
                    args: 'left',
                    position: 'p-l2'
                }
            ],
            false,
            'size'
        )

        this.hasRenderOutdoor = false;

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

        render(this.renderMargin(), this.elExternal); // external scneary
        
    }

    private renderMargin() {
        if (!this.elICA) return html``;

        return html`
            <div style="display:flex; flex-direction:column; gap:.5rem ;padding:1rem" class="myAuxGroup">
                <p style=" margin-bottom: 5px;">A propriedade <b>margin</b> do CSS define a área de margem nos quatro lados do elemento. </p>
                <h4 style="display:flex; gap:1.5rem;margin:0px" >${this.myMsg.margin}<input type="checkbox" prop="margin"></h4>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.top}</div>
                    <input prop="marginTop" type="text" .value="${this.elICA.style.marginTop}"  group="margin" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.right}</div>
                    <input prop="marginRight" type="text" .value="${this.elICA.style.marginRight}"  group="margin" @input="${(e: any) => this.onChangeProp(e)}" />
                </div> 
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.bottom}</div>
                    <input prop="marginBottom" type="text" .value="${this.elICA.style.marginBottom}"  group="margin" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.myMsg.left}</div>
                    <input prop="marginLeft" type="text" .value="${this.elICA.style.marginLeft}"  group="margin" @input="${(e: any) => this.onChangeProp(e)}" />
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

        if (!prop || !this.elICA || !this.myParent) return;

        if (isGroup) {

            this.elICA.style.margin = el.value;
            ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].forEach((pr: string) => {

                const field = el.closest('.myAuxGroup')?.querySelector(`input[prop="${pr}"]`) as HTMLInputElement;
                if (field) field.value = el.value;

            });

            this.myParent.updateSize(this.elICA, this.myParent, true);
            this.fireEvent(`margin: ${this.elICA.style.padding};`);
            return;

        }

        this.elICA.style[prop as any] = el.value;
        this.myParent.updateSize(this.elICA, this.myParent, true);
        this.fireEvent();
    }

    //---------DRAG------------------

    private initDragging(e: MouseEvent): void {

        if (!this.elICA || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        const st = document.defaultView.getComputedStyle(this.elICA);
        this.startTop = parseInt(st.marginTop, 10);
        this.startBottom = parseInt(st.marginBottom, 10);
        this.startLeft = parseInt(st.marginLeft, 10);
        this.startRight = parseInt(st.marginRight, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elICA || !this.myParent) return;

            this.myParent.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
            const deltaY: number = (e.clientY - this.startY);

            if (!this.args || ['top'].includes(this.args)) {
                this.elICA.style.marginTop = (this.startTop + deltaY * -1) + 'px';
            }

            if (!this.args || ['bottom'].includes(this.args)) {
                this.elICA.style.marginBottom = (this.startBottom + deltaY) + 'px';
            }

            if (!this.args || ['left'].includes(this.args)) {
                this.elICA.style.marginLeft = (this.startLeft + deltaX) + 'px';
            }

            if (!this.args || ['right'].includes(this.args)) {
                this.elICA.style.marginRight = (this.startRight + deltaX) + 'px';
            }

            this.renderOutdoorScenary();
            this.myParent.updateSize(this.elICA, this.myParent, true);

        }

        const stopDragging = (e: MouseEvent) => {

            if (!this.elICA || !this.myParent) return;

            this.myParent.style.background = '';

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            this.fireEvent();

        }

        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }



    //----------FIRE-----------------

    private fireEvent(ret: string = ''): void {

        if (!this.elICA || !this.myParent) return;

        if (ret === '') {

            if (this.args === 'top') ret = `margin-top: ${this.elICA.style.marginTop};`;
            if (this.args === 'bottom') ret = `margin-bottom: ${this.elICA.style.marginBottom};`;
            if (this.args === 'left') ret = `margin-left: ${this.elICA.style.marginLeft};`;
            if (this.args === 'right') ret = `margin-right: ${this.elICA.style.marginRight};`;

        }

        this.myParent.setStyle(ret);

    }

}