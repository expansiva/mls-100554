/// <mls shortName="wcdToolbox" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": [ "wcd-toolbox-item-action-size-100554", "wcd-toolbox-item-action-margin-100554", "wcd-toolbox-item-action-padding-100554","wcd-toolbox-item-action-edit-quill-100554","wcd-toolbox-item-action-move-100554"]
 * } 
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IActionsToolbox, IActionsToolboxMenu, updateSize } from './_100554_fcaGlobal';
import * as states from './_100554_fcaCollabStore';

@customElement('wcd-toolbox-100554')
export class WCDToolbox extends CollabLitElement {

    @property({ type: String, reflect: true })
    private level: string | undefined;

    @property({ type: String, reflect: true })
    private widget: string | undefined;

    private elMain: HTMLElement | undefined;

    private itens: IActionsToolbox[] = [];

    get lastHelper() {
        if (!this.parentElement) return '';
        return (this.parentElement as any)['lasthelper'];
    }

    set lastHelper(helper: string) {
        if (!this.parentElement) return;
        (this.parentElement as any)['lasthelper'] = helper;
    }

    public setItensActions(acts: IActionsToolbox[]): void {
        this.itens = acts;
        this.renderItens();
    }

    render() {
        return html``;
    }

    private renderItens(): void {

        if (!this.shadowRoot) return;

        let lastHelper: HTMLElement | undefined;

        const allItens = this.shadowRoot.querySelectorAll('*');
        allItens.forEach((i: Element) => i.remove());

        this.itens.forEach((i: IActionsToolbox) => {

            switch (i.tp) {
                case 'menu':
                    this.addMenu(i);
                    break;
                case 'button':
                    const btnEl = this.addButton(i);
                    if (this.lastHelper === i.title) lastHelper = btnEl;
                    break;
                case 'back-button':
                    this.addBackButton(i);
                    break;
                case 'action-editQuill':
                    this.addActionEditQuill(i);
                    break;
                case 'action-size':
                    this.addActionSize(i);
                    break;
                case 'action-margin':
                    this.addActionMargin(i);
                    break;
                case 'action-padding':
                    this.addActionPadding(i);
                    break;
                case 'action-move':
                    this.addActionMove(i);
                    break;

                default: '';
            }

        });

        if (lastHelper) {
            lastHelper.click();
        }

    }

    private addMenu(item: IActionsToolbox): void {

        if (!this.shadowRoot || !this.parentElement) return undefined;

        if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        const menuContainer = document.createElement('wcd-toolbox-menu');
        const container = document.createElement('wcd-toolbox-menu-container');
        const containerItens = document.createElement('wcd-toolbox-itemmenu');
        const iSubItens = document.createElement('a');
        const containerSubItens = document.createElement('wcd-toolbox-submenu');

        menuContainer.className = item.position;
        menuContainer.appendChild(container);

        containerSubItens.onmouseleave = () => {
            containerSubItens.style.display = 'none';
        }

        containerSubItens.onclick = () => {
            containerSubItens.style.display = 'none';
        }

        item.menuItens.forEach((i: IActionsToolboxMenu) => {

            if (!i.onclick) return;

            const a = document.createElement('a');
            const ic = document.createElement('i');

            ic.title = i.text;
            ic.style.cssText = `width: 18px; background-position: center; height: 18px; background-size: auto; background-repeat: no-repeat;`;
            ic.style.backgroundImage = `url('data:image/svg+xml,${(i.iconSvg as string).replace(/\'/g, '"')}')`;
            a.className = 'menuItensFcaToolbox';
            a.appendChild(ic);
            containerItens.appendChild(a);
            a.onclick = (e) => {
                e.stopPropagation();
                i.onclick();
            }

        });

        container.appendChild(containerItens);
        if (item.menuSubItens.length > 0) {

            //iSubItens.className = 'fa-solid fa-ellipsis-vertical menuItensFcaToolbox';
            iSubItens.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>`;

            iSubItens.onclick = () => {
                containerSubItens.style.display = containerSubItens.style.display === '' ? 'none' : '';
            }

            containerItens.appendChild(iSubItens);
            containerSubItens.style.display = 'none';
            container.appendChild(containerSubItens);

        }

        item.menuSubItens.forEach((i: IActionsToolboxMenu) => {

            if (!i.onclick) return;

            const a = document.createElement('a');
            const ic = document.createElement('i');
            const span = document.createElement('span');
            span.innerText = i.text;

            ic.style.cssText = `width: 18px; background-position: center; height: 18px; background-size: auto; background-repeat: no-repeat;`;
            ic.style.backgroundImage = `url('data:image/svg+xml,${(i.iconSvg as string).replace(/\'/g, '"')}')`

            a.className = 'menuSubItensFcaToolbox';
            a.appendChild(ic);
            a.appendChild(span);
            a.onclick = (e) => {
                e.stopPropagation();
                i.onclick();
            }
            containerSubItens.appendChild(a);

        });

        this.shadowRoot.appendChild(menuContainer);

        updateSize(this.elMain, this, true);

    }

    private addBackButton(item: IActionsToolbox): void {

        if (!this.shadowRoot || !this.parentElement) return;

        const el = document.createElement('wcd-toolbox-item-action-backbutton-100554');
        el.innerHTML = '';
        el.className = `${item.position} fcaBackButton`;
        el.title = item.title as string;
        el.style.cssText = `width: 18px; background-position: center; height: 18px;
        background-size: auto; background-repeat: no-repeat;`;

        el.style.backgroundImage = `url('data:image/svg+xml,${(item.iconSvg as string).replace(/\'/g, '"')}')`

        el.onclick = (e: MouseEvent) => {
            e.stopPropagation();
            this.lastHelper = '';
            if (item.onclick) item.onclick();

        }

        this.shadowRoot.appendChild(el);

    }

    private addActionEditQuill(item: IActionsToolbox): void {

        if (!this.shadowRoot || !this.parentElement || !item.onclick) return;

        if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        this.ondblclick = (ev: MouseEvent) => {

            if (!item.onclick || !this.shadowRoot || !this.elMain) return;
            item.onclick(ev);

            const el = document.createElement('wcd-toolbox-item-action-edit-quill-100554');

            el.setAttribute('text', this.elMain.outerHTML);
            this.elMain.style.opacity = '0';

            el.addEventListener("onChange", (obj: any) => {

                if (!obj || !obj.detail || !obj.detail.valor) return;

                let ret = `{"tp":"html","html":"${obj.detail.valor}" }`;
                super.setCollabState(states.CHANGESTATE, ret);

            });

            this.shadowRoot.appendChild(el);

        }

    }

    private addButton(item: IActionsToolbox): HTMLElement | undefined {

        if (!item.onclick || !this.shadowRoot || !this.parentElement || !['p-r4', 'p-m4', 'p-l4', 'p-l5'].includes(item.position)) return;

        const el = document.createElement('i');
        el.innerHTML = '';
        el.className = `${item.position} fcaButtonAction`;
        el.title = item.title as string;
        el.style.cssText = `width: 18px; height: 18px; background: #fff; display:flex; justify-content: center; align-items:center`;

        if (item.format === 'circle') {
            el.style.cssText += ' border-radius:50%; box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3);'
        }

        el.innerHTML = (item.iconSvg as string);

        el.onclick = (e: MouseEvent) => {
            e.stopPropagation();
            if (item.onclick) item.onclick();
            this.lastHelper = item.title as string;
        }

        this.shadowRoot.appendChild(el);

        return el;

    }

    private addActionPadding(item: IActionsToolbox): HTMLElement | undefined {

        if (!this.shadowRoot || !this.parentElement || !['p-l2', 'p-m1', 'p-r2', 'p-m3'].includes(item.position)) return undefined;

        if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        const el = document.createElement('wcd-toolbox-item-action-padding-100554');
        el.innerHTML = '';
        el.className = `${item.position} f-${item.format}`;
        (el as any).myFather = this;
        (el as any).elMain = this.elMain;

        if (item.position === 'p-l2') {
            el.style.cursor = 'ew-resize';
            el.setAttribute('tpChange', 'left');
        }
        else if (item.position === 'p-m1') {
            el.style.cursor = 'ns-resize';
            el.setAttribute('tpChange', 'top');
        }
        else if (item.position === 'p-r2') {
            el.style.cursor = 'ew-resize';
            el.setAttribute('tpChange', 'right');
        }
        else if (item.position === 'p-m3') {
            el.style.cursor = 'ns-resize';
            el.setAttribute('tpChange', 'bottom');
        }

        el.addEventListener("onChange", (obj: any) => {

            if (!obj || !obj.detail || !obj.detail.valor) return;

            let ret = `{"tp":"style","style":${obj.detail.valor} }`;
            super.setCollabState(states.CHANGESTATE, ret);

        })

        this.shadowRoot.appendChild(el);

        return el;

    }

    private addActionMove(item: IActionsToolbox): HTMLElement | undefined {

        if (!this.shadowRoot || !this.parentElement || !['p-m2'].includes(item.position)) return undefined;

        //if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        const el = document.createElement('wcd-toolbox-item-action-move-100554');
        el.innerHTML = item.iconSvg as  string;
        el.className = `${item.position} `;
        (el as any).myFather = this;
        (el as any).elMain = this.parentElement;

        el.addEventListener("onChange", (obj: any) => {

            if (!obj || !obj.detail || !obj.detail.valor) return;

            let ret = `{"tp":${obj.detail.startDrop ? '"drag"': '"drop"'},"drop":${obj.detail.valor} }`;
            super.setCollabState(states.CHANGESTATE, ret);

        })

        this.shadowRoot.appendChild(el);

        return el;

    }

    private addActionMargin(item: IActionsToolbox): HTMLElement | undefined {

        if (!this.shadowRoot || !this.parentElement || !['p-l2', 'p-m1', 'p-r2', 'p-m3'].includes(item.position)) return undefined;

        if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        const el = document.createElement('wcd-toolbox-item-action-margin-100554');
        el.innerHTML = '';
        el.className = `${item.position} f-${item.format}`;
        (el as any).myFather = this;
        (el as any).elMain = this.elMain;

        if (item.position === 'p-l2') {
            el.style.cursor = 'ew-resize';
            el.setAttribute('tpChange', 'left');
        }
        else if (item.position === 'p-m1') {
            el.style.cursor = 'ns-resize';
            el.setAttribute('tpChange', 'top');
        }
        else if (item.position === 'p-r2') {
            el.style.cursor = 'ew-resize';
            el.setAttribute('tpChange', 'right');
        }
        else if (item.position === 'p-m3') {
            el.style.cursor = 'ns-resize';
            el.setAttribute('tpChange', 'bottom');
        }

        el.addEventListener("onChange", (obj: any) => {

            if (!obj || !obj.detail || !obj.detail.valor) return;

            let ret = `{"tp":"style","style":${obj.detail.valor} }`;
            super.setCollabState(states.CHANGESTATE, ret);

        })

        this.shadowRoot.appendChild(el);

        return el;

    }

    private addActionSize(item: IActionsToolbox): HTMLElement | undefined {

        if (!this.shadowRoot || !this.parentElement || !['p-r2', 'p-m3', 'p-r3'].includes(item.position)) return undefined;

        if (!this.elMain) this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        const el = document.createElement('wcd-toolbox-item-action-size-100554');
        el.style.cursor = 'nwse-resize';
        el.innerHTML = '';
        el.className = `${item.position} f-${item.format}`;
        el.setAttribute('tpChange', 'all');
        (el as any).myFather = this;
        (el as any).elMain = this.elMain;

        if (item.position === 'p-r2') {
            el.style.cursor = 'ew-resize';
            el.setAttribute('tpChange', 'width');
        }
        if (item.position === 'p-m3') {
            el.style.cursor = 'ns-resize';
            el.setAttribute('tpChange', 'height');
        }

        el.addEventListener("onChange", (obj: any) => {

            if (!obj || !obj.detail || !obj.detail.valor) return;

            let ret = `{"tp":"style","style":${obj.detail.valor} }`;
            super.setCollabState(states.CHANGESTATE, ret);

        })

        this.shadowRoot.appendChild(el);

        return el;

    }

    firstUpdated() {
        if (!this.shadowRoot || !this.parentElement) return;
        this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

    }

    updated(changedProperties: any) {

        if (!this.parentElement) return;
        if(this.parentElement.style.flex) updateSize(this.parentElement, this, true);

    }

    static styles = css`
        :host{
            display:block;
            border:1px solid #d3cece;
            position:absolute;
            user-select:none;
            z-index:9999;
        }

        :host(:hover){
            border:1px solid purple!important;
        }

        .itensFcaToolbox:hover{
            background:purple;
        }

        .fcaButtonAction{
            cursor:pointer;
        }

        .fcaBackButton{
            cursor:pointer;
            display:block;
            position:absolute;
            top:-2rem;
            right:0px
        }

        .p-l1{
            cursor:pointer;
            display:block;
            position:absolute;
            top:-6px;
            left:-6px
        }

        .p-l2{
            cursor:pointer;
            display:block;
            position:absolute;
            top:50%;
            left:-6px;
            transform: translateY(-50%);
        }

        .p-l3{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-6px;
            left:-6px;
        }

        .p-l4{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-2rem;
            left:0px;
        }

        .p-l5{
            cursor:pointer;
            display:block;
            position:absolute;
            top:50%;
            left:-23px;
            transform: translateY(-50%);
        }

        .p-m1{
            cursor:pointer;
            display:block;
            position:absolute;
            top:-6px;
            left: 50%;
            transform: translateX(-50%);
        }

        .p-m2{
            cursor:pointer;
            display:block;
            position:absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .p-m3{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-6px;
            left: 50%;
            transform: translateX(-50%);
        }

        .p-m4{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-2rem;
            left: 50%;
            transform: translateX(-50%);
        }

        .p-r1{
            cursor:pointer;
            display:block;
            position:absolute;
            top:-6px;
            right:-6px
        }

        .p-r2{
            cursor:pointer;
            display:block;
            position:absolute;
            top:50%;
            right:-6px;
            transform: translateY(-50%);
        }

        .p-r3{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-6px;
            right:-6px;
        }

        .p-r4{
            cursor:pointer;
            display:block;
            position:absolute;
            bottom:-2rem;
            right:-6px;
        }

        .f-circle{
            width:10px;
            height:10px;
            background:#fff;
            border-radius:50%;
            box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3);
        }
        
        /* configuration f-squate */

        .f-square{
            width:23px;
            height:7px;
            background:#fff;
            border-radius:3px;
            box-shadow: 0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3);
        }

        .p-l1.f-square{
            top:-4px;
            left:-4px
        }

        .p-l2.f-square{
            top:50%;
            left:-4px;
            width:7px;
            height:23px;
        }

        .p-l3.f-square{
            bottom:-4px;
            left:-4px;
        }

        .p-m1.f-square{
            top:-4px;
            width:23px;
            height:7px;
        }

        .p-m2.f-square{
            width:23px;
            height:7px;
        }

        .p-m3.f-square{
            bottom:-4px;
            width:23px;
            height:7px;
        }

        .p-r1.f-square{
            top:-4px;
            right:-4px
        }

        .p-r2.f-square{
            right:-4px;
            width:7px;
            height:23px;
        }

        .p-r3.f-square{
            bottom:-4px;
            right:-4px;
        }

        /* end f-square */

        wcd-toolbox-menu.p-m1{
            top:-30px
        }

        wcd-toolbox-menu.p-m3{
            bottom:-30px
        }

        wcd-toolbox-menu{
            display:block;
            height:17px;
            border:1px solid #d3cece;
            padding:.2rem;
            border-radius:5px;
            position:relative;
            background:#fff;
            
        }

        wcd-toolbox-menu-container{
            display:block;
            position:relative;
        }

        wcd-toolbox-itemmenu{
            display:flex;
            height:20px;
            gap:.3rem;
            
        }

        wcd-toolbox-itemmenu a{
            display: flex!important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size:13px;
            width:18px;
            height:18px;
        }

        wcd-toolbox-itemmenu a:hover{
            background:#e1e1e1;
        }

        wcd-toolbox-submenu{
            position:absolute;
            top:19px;
            left:80%;
            display:flex;
            flex-direction: column;
            gap:.3rem;
            min-width: 150px;
            min-height: 50px;
            padding:.5rem;
            border:1px solid #d3cece;
            background:#fff;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
            box-shadow: 0px 1px 4px 1px #e1e1e1;
        }

        wcd-toolbox-submenu a {
            font-size:13px;
            display:flex;
            gap:.3rem;
            align-items: center;
            padding:.1rem;
        }

        wcd-toolbox-submenu a:hover {
            background:#e1e1e1;
        }


    `;


}