/// <mls shortName="wcdToolboxItemActionPadding" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';


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

@customElement('wcd-toolbox-item-action-padding-100554')
export class WCDToolboxItemActionPadding extends WcdToolboxItemBase {

    private msg: MessageType = messages['en'];

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
            this.onmousedown = (e) => this.initDragging(e);
            this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');
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
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z"/></svg>`;
    }

    renderOne(pos: string) {
        this.classList.add('f-square');

        switch (pos) {
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
                    name: 'padding',
                    args: 'top',
                    position: 'p-m1'
                },
                {
                    name: 'padding',
                    args: 'right',
                    position: 'p-r2'
                },
                {
                    name: 'padding',
                    args: 'bottom',
                    position: 'p-m3'
                },
                {
                    name: 'padding',
                    args: 'left',
                    position: 'p-l2'
                }
            ],
            false,
            'padding'
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
        
        render(this.renderPadding(), this.elExternal);

    }

    private renderPadding() {
        if (!this.elICA) return html``;
        return html`
            <div style="display:flex; flex-direction:column; gap:.5rem ;padding:1rem" class="myAuxGroup">
                <p style=" margin-bottom: 5px;">A propriedade <b>padding</b> define uma a distância entre o conteúdo de um elemento e suas bordas</p>
                <h4 style="display:flex; gap:1.5rem;margin:0px" >${this.msg.padding}<input type="checkbox" prop="padding"></h4>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.msg.top}</div>
                    <input prop="paddingTop" type="text" .value="${this.elICA.style.paddingTop}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.msg.right}</div>
                    <input prop="paddingRight" type="text" .value="${this.elICA.style.paddingRight}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div> 
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.msg.bottom}</div>
                    <input prop="paddingBottom" type="text" .value="${this.elICA.style.paddingBottom}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
                </div>
                <div style="display:flex; gap:.5rem">
                    <div style="width:70px">${this.msg.left}</div>
                    <input prop="paddingLeft" type="text" .value="${this.elICA.style.paddingLeft}"  group="padding" @input="${(e: any) => this.onChangeProp(e)}" />
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

            this.elICA.style.padding = el.value;
            ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'].forEach((pr: string) => {
                const field = el.closest('.myAuxGroup')?.querySelector(`input[prop="${pr}"]`) as HTMLInputElement;
                if (field) field.value = el.value;
            });

            this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');
            this.fireEvent(`{"padding":"${this.elICA.style.padding}"}`);
            return;

        }

        this.elICA.style[prop as any] = el.value;
        this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
        this.myParent.updateBackgroundAuxSize('show');
        this.fireEvent();
    }

    //---------DRAG------------------

    private timeRemoveResize = 0;
    private initDragging(e: MouseEvent): void {

        if (!this.elICA || !document.defaultView) return;
        this.startX = e.clientX;
        this.startY = e.clientY;
        const st = document.defaultView.getComputedStyle(this.elICA);
        this.startTop = parseInt(st.paddingTop, 10);
        this.startBottom = parseInt(st.paddingBottom, 10);
        this.startLeft = parseInt(st.paddingLeft, 10);
        this.startRight = parseInt(st.paddingRight, 10);

        const doDragging = (e: MouseEvent) => {

            if (!this.elICA || !this.myParent) return;

            this.myParent.style.background = '#f9cc9d80';

            const deltaX: number = (e.clientX - this.startX);
            const deltaY: number = (e.clientY - this.startY);

            if (!this.args || ['top'].includes(this.args)) {
                this.elICA.style.paddingTop = (this.startTop + deltaY) + 'px';
            }

            if (!this.args || ['bottom'].includes(this.args)) {
                this.elICA.style.paddingBottom = (this.startBottom + deltaY) + 'px';
            }

            if (!this.args || ['left'].includes(this.args)) {
                this.elICA.style.paddingLeft = (this.startLeft + deltaX) + 'px';
            }

            if (!this.args || ['right'].includes(this.args)) {
                this.elICA.style.paddingRight = (this.startRight + deltaX * -1) + 'px';
            }

            this.renderOutdoorScenary();
            this.myParent.updateBaseNoPadding(this.elICA, this.myParent);
            this.myParent.updateBackgroundAuxSize('show');

        }


        const stopDragging = (e: MouseEvent) => {

            if (!this.elICA || !this.myParent) return;

            this.myParent.style.background = '';

            document.body.removeEventListener('mousemove', doDragging, false);
            document.body.removeEventListener('mouseup', stopDragging, false);

            clearTimeout(this.timeRemoveResize);
            this.timeRemoveResize = setTimeout(() => {
                if (!this.elICA || !this.myParent) return;
                this.myParent.setAttribute('needResize', '');
            }, 800);

            this.fireEvent();
        }

        if (!this.elICA || !this.myParent) return;
        this.myParent.setAttribute('needResize', 'false');
        document.body.addEventListener('mousemove', doDragging, false);
        document.body.addEventListener('mouseup', stopDragging, false);
    }

    //----------FIRE-----------------

    private fireEvent(ret: string = ''): void {

        if (!this.elICA || !this.myParent) return;

        if (ret === '') {

            if (this.args === 'top') ret = `padding-top: ${this.elICA.style.paddingTop}; `;
            if (this.args === 'bottom') ret = `padding-bottom:${this.elICA.style.paddingBottom}; `;
            if (this.args === 'left') ret = `padding-left: ${this.elICA.style.paddingLeft}; `;
            if (this.args === 'right') ret = `padding-right: ${this.elICA.style.paddingRight}; `;

        }
        
        this.myParent.setStyle(ret);

    }

}