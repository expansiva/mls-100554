/// <mls shortName="wcdToolbox" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IActionsToolbox, IActionsToolboxMenu } from './_100554_icaGlobal';
import { ServiceBase } from './_100554_serviceBase';
import * as states from './_100554_icaCollabStore';

//version 4

export function initWCDToolbox() {
    return true;
}

@customElement('wcd-toolbox-100554')
export class WCDToolbox extends CollabLitElement {

    // ------------ PROPERTIES ------------------

    @property({ type: String, reflect: true })
    public level: string | undefined;

    @property({ type: String, reflect: true })
    private widget: string | undefined;

    private elMain: HTMLElement | undefined;

    public actions: IActionsToolbox[] = [];

    get lastHelper() {
        if (!this.parentElement) return '';
        return (this.parentElement as any)['lasthelper'];
    }

    set lastHelper(helper: string) {
        if (!this.parentElement) return;
        (this.parentElement as any)['lasthelper'] = helper;
    }

    // ------------ COMPONENT-------------------

    firstUpdated() {

        if (this.parentElement) {
            this.parentElement.style.position = 'relative';

        }

        if (!this.shadowRoot || !this.parentElement) return;
        this.elMain = this.parentElement.querySelector(`${this.widget}:first-child`) as HTMLElement;

        if (!this.elMain) this.elMain = this.parentElement;

        this.renderActions(this.actions);
        this.updateSize(this.elMain, this, true);
        this.setAttribute('title', this.elMain.tagName);

    }

    updated(changedProperties: Map<string, string>) {

        if (this.parentElement && (this.parentElement as any).renderType === 'editactive') {

            this.setIconsWcdToolbox((this.parentElement as any).actions[this.level as any]);

        }



    }

    shouldUpdate(changedProperties: Map<string, string>): boolean {
        // shouldUpdate determinar se o componente deve ser renderizado novamente true = executa, false = não executa o render().

        if (changedProperties.get('level')) {
            this.lastHelper = '';
        }

        return true;

    }

    render() {
        return html`<wcd-toolbox-aux-background/>`;
    }

    // ------------ IMPLEMENTATION-------------------

    private wcServiceFCA: ServiceBase | undefined;

    public beforeRemove(): void {

        if (!this.shadowRoot) return;

        const allItens = this.shadowRoot.querySelectorAll('*');
        allItens.forEach((i: Element) => {
            if (i.tagName.toLocaleLowerCase() === 'wcd-toolbox-aux-background') return;
            if ((i as any).beforeRemove) (i as any).beforeRemove();
        });

    }

    public backNavigationScenaryOutdoor(): void {

        if (this.level !== '4') return;
        mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);

    }

    public getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined> {

        return new Promise<HTMLElement | undefined>((resolve, reject) => {
            if (this.level !== '4') resolve(undefined);

            mls.events.fire(4, 'WCDEvent' as any, `{"op":"${op}"}`);
            setTimeout(() => {

                if (this.wcServiceFCA) {
                    resolve((this.wcServiceFCA as any).querySelector('div'));
                } else {
                    const nav3 = this.getNav3();
                    if (!nav3 || !this.elMain) resolve(undefined);

                    const wc = (nav3 as any).getActiveInstance('left');
                    if (!wc) resolve(undefined);
                    if (wc.tagName !== 'SERVICE-FCA-100554') resolve(undefined);
                    else {
                        this.wcServiceFCA = wc;
                        resolve(wc.querySelector('div'));
                    }

                }

            }, 200)
        });

    }

    private getNav3(): HTMLElement | undefined {

        if (!this) return;
        const bd = this.closest('body');
        if (!bd) return;
        const service = (bd as any).service;
        if (!service) return;
        const nav3 = service.getNav3Service();
        if (!nav3) return;
        return nav3;

    }

    public setIconsWcdToolbox(act: IActionsToolbox[], useSelf: boolean = false, updataSize: 'false' | 'size' | 'padding' = 'false'): void {

        if (useSelf) this.renderActions(this.actions);
        else this.renderActions(act);

        this.updateBackgroundAuxSize();
        if (this.elMain && updataSize === 'size') this.updateSize(this.elMain, this, true);
        if (this.elMain && updataSize === 'padding') this.updateBaseNoPadding(this.elMain, this);

    }

    private renderActions(arr: IActionsToolbox[]): void {
        if (!arr) return;
        if (!this.shadowRoot) return;

        let lastHelper: HTMLElement | undefined;
        const allItens = this.shadowRoot.querySelectorAll('*');
        allItens.forEach((i: Element) => {
            if (i.tagName.toLocaleLowerCase() === 'wcd-toolbox-aux-background') return;
            i.remove()
        });

        arr.forEach((i: IActionsToolbox) => {

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
                case 'action':
                    this.addAction(i);
                    break;
                default: '';
            }

        });

        if (lastHelper) {
            lastHelper.click();
        }

    }

    private addMenu(item: IActionsToolbox): void {

        if (!this.elMain || !this.shadowRoot) return undefined;

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
                i.onclick(e, this);
            }

        });

        if (!item.menuSubItens.find((i) => i.text === 'About')) item.menuSubItens.push(templateAbout);

        container.appendChild(containerItens);
        if (item.menuSubItens.length > 0) {


            iSubItens.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>`;

            iSubItens.onclick = (e) => {
                e.stopPropagation();
                containerSubItens.style.display = containerSubItens.style.display === '' ? 'none' : '';
            }

            iSubItens.setAttribute('title', '');
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
            a.title = i.text;

            ic.style.cssText = `width: 18px; background-position: center; height: 18px; background-size: auto; background-repeat: no-repeat;`;
            ic.style.backgroundImage = `url('data:image/svg+xml,${(i.iconSvg as string).replace(/\'/g, '"')}')`

            a.className = 'menuSubItensFcaToolbox';
            a.appendChild(ic);
            a.appendChild(span);
            a.onclick = (e) => {
                e.stopPropagation();
                i.onclick(e, this);
            }
            containerSubItens.appendChild(a);

        });

        this.shadowRoot.appendChild(menuContainer);
        setTimeout(() => {


            if (!this.isElementVisible(menuContainer)) {
                menuContainer.style.top = '0px';
                const el = this.shadowRoot?.querySelector('.p-m2');
                if (el) {
                    menuContainer.style.left = '0px';
                    menuContainer.style.transform = 'none';
                }
            }

        }, 300)
        //this.updateSize(this.elMain, this, true);

    }

    private addBackButton(item: IActionsToolbox): void {

        if (!this.shadowRoot || !this.parentElement) return;

        const el = document.createElement('wcd-toolbox-item-action-backbutton-100554');
        el.innerHTML = '';
        el.className = `${item.position} fcaBackButton`;
        el.title = item.title as string;
        el.style.cssText = `width: 18px; background-position: center; height: 18px;
        background-size: auto; background-repeat: no-repeat; z-index: 9;`;

        el.style.backgroundImage = `url('data:image/svg+xml,${(item.iconSvg as string).replace(/\'/g, '"')}')`

        el.onclick = (e: MouseEvent) => {
            e.stopPropagation();
            this.lastHelper = '';
            if (item.onclick) item.onclick(e, this);

        }

        this.shadowRoot.appendChild(el);
        setTimeout(() => {

            if (!this.isElementVisible(el)) {
                el.style.top = '0px';
                el.style.right = '0px';
            }

        }, 300)

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
            if (item.onclick) item.onclick(e, this);
            this.lastHelper = item.title as string;
        }

        this.shadowRoot.appendChild(el);

        setTimeout(() => {

            if (!this.isElementVisible(el)) {
                el.style.bottom = '0px';
            }

        }, 300)

        return el;

    }

    private addAction(act: IActionsToolbox): void {

        if (!this.elMain || !this.shadowRoot || !act.widget) return undefined;

        if (act.isDblClick && act.onclick) {

            this.ondblclick = (e: MouseEvent) => {
                if (act.onclick) {
                    act.onclick(
                        e,
                        this,
                        (vl: string) => {
                            super.setCollabState(states.CHANGESTATE, vl);
                        }
                    );
                }
            }
            return;

        }

        const el = document.createElement(act.widget);
        el.innerHTML = '';
        if (act.iconSvg && act.iconSvg !== '') el.innerHTML = act.iconSvg as string;

        el.className = `${act.position} f-${act.format}`;
        (el as any).myParent = this;
        (el as any).elMain = this.elMain;
        (el as any).elFCA = this.parentElement;
        el.style.cursor = act.cursor as string;

        if (act.attrs) {
            act.attrs.forEach((attr) => {
                el.setAttribute(attr.attr, attr.value);
            })
        }

        el.addEventListener("onChange", (obj: any) => {

            if (!obj || !obj.detail || !obj.detail.valor) return;
            super.setCollabState(states.CHANGESTATE, obj.detail.valor);

        })

        this.shadowRoot.appendChild(el);

    }

    public updateBackgroundAuxSize(tp: 'show' | 'hide' = 'hide'): void {

        if (!this.shadowRoot) return;

        const elChange = this.shadowRoot.querySelector('wcd-toolbox-aux-background') as HTMLElement;
        const elBase = this.elMain;
        if (!elBase || !elChange || !this.parentElement) return;

        if (tp === 'hide') {
            elChange.style.display = 'none';
            return
        }
        const display = elChange.style.display;
        elChange.style.display = 'none!important';

        const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);

        const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight, fontSize } = window.getComputedStyle(elBase);

        let { width, height } = elBase.getBoundingClientRect();

        const heightori = height;
        let left = 0;
        let top = 0;
        left -= parseInt(marginLeft, 10);
        top -= parseInt(marginTop, 10);

        if (top > 0) top = 0;

        width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

        if (width > elBase.ownerDocument.body.clientWidth) width -= 3;

        height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));


        elChange.style.left = `${(left - 1) < 0 ? 0 : (left - 1)}px`;
        elChange.style.top = `${top - 1}px`;

        elChange.style.width = `${width + 2}px`;
        elChange.style.height = `${height + 2}px`;
        elChange.style.display = display;


        elChange.style.display = this.parentElement.style.display;
        elChange.style.background = '#bdbdbd3d';
        elChange.style.position = 'absolute';

        if ((elBase.style.height && paddingTop) || (paddingTop && paddingBottom)) {
            elChange.style.top = '-' + (parseInt(paddingTop, 10) + parseInt(fontSize, 10)) + 'px';
        } else if (paddingTop !== '0px') elChange.style.top = '-' + (heightori - 6) + 'px';

        if (paddingLeft !== '0px') elChange.style.left = '-' + parseInt(paddingLeft, 10) + 'px';

    }

    public updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void {

        if (!elBase) return;
        setTimeout(() => {

            const display = elChange.style.display;
            elChange.style.display = 'none!important';

            const icaBase = elBase.parentElement;
            if (!icaBase) return;

            const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);
            const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

            let { width, height, y } = elBase.getBoundingClientRect();
            let topIca = icaBase.getBoundingClientRect().top;


            let left = 0;
            let top = 0;
            left -= parseInt(marginLeft, 10);
            top -=  parseInt(marginTop, 10);
            width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

            if (width > elBase.ownerDocument.body.clientWidth) width -= 3;
            height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));

            const grandFahter = elBase.parentElement && elBase.parentElement.parentElement ? elBase.parentElement.parentElement : undefined;

            if (grandFahter) {
                const display = window.getComputedStyle(grandFahter).display;
                if (['flex'].includes(display) && elBase.parentElement) {

                    const fTop = elBase.parentElement.getClientRects()[0].top;
                    const bTop = elBase.getClientRects()[0].top;
                    top = fTop - bTop;
                    top = top < 0 ? top * -1 : top;
                }
            }

            if (changePosition) {
                elChange.style.left = `${(left - 1) < 0 ? 0 : (left - 1)}px`;
                elChange.style.top = `${top - 1}px`;
            }

            elChange.style.width = `${width + 2}px`;
            elChange.style.height = `${height + 2}px`;
            elChange.style.display = display;

        }, 50);

    }

    public updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void {

        const st = elChange.style;
        st.position = 'absolute';

        const { borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

        let { width, height } = elBase.getBoundingClientRect();

        const cd = (v1: string, v2: string): string => {

            // ex: '1px' + '2px' = '3px'
            let rc = parseInt(v1, 10) + parseInt(v2, 10);
            if (rc < 0) rc = 0;
            return rc + 'px';

        };

        const ci = (v1: string, v2: string): number => {

            // ex: '1px' + '2px' = '3px'
            let rc = parseInt(v1, 10) + parseInt(v2, 10);
            if (rc < 0) rc = 0;
            return rc;

        };

        let cWidth = ci(paddingLeft, paddingRight);
        let cHeight = ci(paddingTop, paddingBottom);

        if (cWidth > 0 && cWidth < width) width = width - cWidth;
        if (cHeight > 0 && cHeight < height) height = height - cHeight;



        st.left = cd(paddingLeft, borderLeftWidth);
        st.bottom = cd(paddingBottom, borderBottomWidth);
        st.top = cd(paddingTop, borderTopWidth);
        st.right = cd(paddingRight, borderRightWidth);

        st.width = width + 'px';
        st.height = height + 'px';

    }

    public isElementVisible(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static styles = css`
        :host{
            display:block;
            border:1px solid #d3cece;
            position:absolute;
            user-select:none;
            z-index:9999;
            background: #c8c8c8c2; /*#edededc2;*/
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

const templateAbout = {

    text: 'About',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
    onclick: (e: MouseEvent, wc: WCDToolbox) => {

        const bd = wc.closest('body') as any;
        if (bd.service && bd.service.setAboutTag) bd.service.setAboutTag(wc.title.toLocaleLowerCase())

    }
}