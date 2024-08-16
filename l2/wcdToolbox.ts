/// <mls shortName="wcdToolbox" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { CollabLitElement } from './_100554_collabLitElement';
import { ActionTag } from './_100554_icaGlobal';
import { ServiceBase } from './_100554_serviceBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';

export function initWCDToolbox() {
    return true;
} 

@customElement('wcd-toolbox-100554')
export class WCDToolbox extends CollabLitElement {

    // ------------ PROPERTIES ------------------

    @query('wcd-toolbox-title') titleEl: HTMLElement | undefined;

    @property({ type: String, reflect: true })
    public level: string | undefined;

    @property({ type: String, reflect: true })
    private widget: string | undefined;

    public elMain: HTMLElement | undefined; // component from ica render

    public elICA: IcaLitElementBase | undefined; // ica base to wcd

    private wcServiceICA: ServiceBase | undefined;

    public fcBeforeBackButton: Function | undefined = undefined;

    //public actions: IActionsToolbox[] = [];

    get lastHelper() {
        if (!this.elICA) return '';
        return (this.elICA as any)['lasthelper'];
    }

    set lastHelper(helper: string) {
        if (!this.elICA) return;
        (this.elICA as any)['lasthelper'] = helper;
    }

    // ------------ COMPONENT-------------------

    connectedCallback() {
        super.connectedCallback();
        if (!this.elICA) return;
        const widgetName = this.elICA.getAttribute('widget');
        if (!widgetName) return;
        const widget = this.elICA.querySelector(widgetName);
        if (!widget) return;
        this.elMain = widget as HTMLElement;
        this.setAttribute('widget', widget.tagName.toLowerCase())
    }


    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    firstUpdated() {
        if (!this.elMain) return;
        this._renderAction();
        this.updateSize(this.elMain, this, true);
        this.initObserverResize();
        this.calculateTitlePosition();
    }

    render() {
        return html`
         <wcd-toolbox-aux-background></wcd-toolbox-aux-background>
         <wcd-toolbox-title>${this.widget}</wcd-toolbox-title>
        `;
    }

    //---------------PUBLIC----------------

    public updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void {
        return this._updateSize(elBase, elChange, changePosition);
    }

    public getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined> {
        return this._getAndSetScenaryOutDoor(op);
    }

    public backNavigationScenaryOutdoor(): void {
        return this._backNavigationScenaryOutdoor();
    }

    public setIconsWcdToolbox(act: ActionTag[], useSelf: boolean = false, updataSize: 'false' | 'size' | 'padding' = 'false'): void {
        return this._setIconsWcdToolbox(act, useSelf, updataSize);
    }

    public updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void {
        return this._updateBaseNoPadding(elBase, elChange)
    }
    public updateBackgroundAuxSize(tp: 'show' | 'hide' = 'hide'): void {
        return this._updateBackgroundAuxSize(tp);
    }


    //---------------IMPLEMENTATION----------------

    private async _renderAction(actions?: ActionTag[]) {

        const parent = this.parentElement?.parentElement as any;
        
        if (!parent || !parent.getActionsTagsDefault) return;
        const defaultActions = parent.getActionsTagsDefault();

        if (!this.elICA || !this.elICA.getActionsTags) return;
        if (!actions) actions = this.elICA.getActionsTags();

        if (!this.shadowRoot) return;

        const allItens = this.shadowRoot.querySelectorAll('*');
        allItens.forEach((i: Element) => {
            if (i.tagName.toLocaleLowerCase() === 'wcd-toolbox-aux-background') return;
            if (i.tagName.toLocaleLowerCase() === 'wcd-toolbox-title') return;
            i.remove()
        });

        for await (let i of actions) {

            if (!this.shadowRoot) continue;

            if (defaultActions[i.name]) {
                const args = i.args ? i.args : undefined;
                const pos = i.position ? i.position : undefined;
                i = Object.assign({}, defaultActions[i.name]) as ActionTag;
                if (args) i.args = args;
                if (pos) i.position = pos;
            }

            if (i.name === 'button') {
                this.addBackButton();
                continue;
            }

            if (!i.name.startsWith('_') || !i.level || (this.level && !i.level.includes(+this.level))) continue;

            const ok = await this.importWCDActions(i.name);
            if (!ok) continue;

            const el = document.createElement(convertFileNameToTag(i.name)) as WcdToolboxItemBase;
            el.className = `p ${i.position}`;
            el.myParent = this;
            el.elMain = this.elMain;
            el.elICA = this.elICA;
            el.style.zIndex = '9998';
            el.args = i.args;

            this.shadowRoot.appendChild(el);

        };

        this.adjustPositionIfNecessary()

    }

    private hasImport: string[] = [];
    private async importWCDActions(imports: string) {

        try {

            if (this.hasImport.includes(imports)) return true;
            if (!imports.startsWith('./')) imports = './' + imports;
            await import(imports);
            this.hasImport.push(imports);
            return true;

        } catch (e) {
            console.info(e);
            return false
        }

    }

    private _setIconsWcdToolbox(act: ActionTag[], useSelf: boolean = false, updataSize: 'false' | 'size' | 'padding' = 'false'): void {

        if (useSelf) this._renderAction();
        else this._renderAction(act);

        this._updateBackgroundAuxSize();

        if (this.elMain && updataSize === 'size') this.updateSize(this.elMain, this, true);

        if (this.elMain && updataSize === 'padding') this._updateBaseNoPadding(this.elMain, this);

    }

    private addBackButton(): void {

        if (!this.shadowRoot || !this.parentElement) return;

        const el = document.createElement('span');
        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>';
        el.className = `wcdBackButton`;
        el.title = 'back' as string;
        el.style.cssText = `width: 18px; background-position: center; height: 18px; background-size: auto; background-repeat: no-repeat; z-index: 9;`;
        el.style.zIndex = '9999';

        el.onclick = (e: MouseEvent) => {
            e.stopPropagation();

            if (this.fcBeforeBackButton) {
                this.fcBeforeBackButton(this);
                this.fcBeforeBackButton = undefined;
            }

            this._setIconsWcdToolbox([], true, 'size');
            this.backNavigationScenaryOutdoor();

        }

        this.shadowRoot.appendChild(el);

        setTimeout(() => {
            if (!this.isElementVisible(el)) {
                el.style.top = '0px';
                el.style.right = '0px';
            }
        }, 300)

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


    private isElementVisible(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }



    private ensureVisibility(elem: HTMLElement) {

        const rect = elem.getBoundingClientRect();

        if (rect.right > window.innerWidth) {
            elem.style.left = `${window.innerWidth - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            elem.style.top = `${window.innerHeight - rect.height}px`;
        }
    }

    //------SCENARY--------------------

    private _getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined> {

        return new Promise<HTMLElement | undefined>((resolve, reject) => {
            if (this.level !== '4') resolve(undefined);

            mls.events.fire(4, 'WCDEvent' as any, `{"op":"${op}"}`);
            setTimeout(() => {

                if (this.wcServiceICA) {
                    resolve((this.wcServiceICA as any).querySelector('div'));
                } else {
                    const nav3 = this.getNav3();
                    if (!nav3 || !this.elMain) resolve(undefined);

                    const wc = (nav3 as any).getActiveInstance('left');
                    if (!wc) resolve(undefined);
                    if (wc.tagName !== 'SERVICE-ICA-100554') resolve(undefined);
                    else {
                        this.wcServiceICA = wc;
                        resolve(wc.querySelector('div'));
                    }

                }

            }, 200)
        });

    }

    private _backNavigationScenaryOutdoor(): void {
        if (this.level !== '4') return;
        mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);
    }

    //------SIZE AND POSITION--------------------

    private resizeObserver: ResizeObserver | undefined;

    private timeResize = 0;
    private initObserverResize() {

        if (!this.elICA) return;

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (!this.elMain) return;
                clearTimeout(this.timeResize);
                this.timeResize = setTimeout(() => {

                    const attr = this.getAttribute('needresize');
                    if (!this.elMain || attr === 'false') return;
                    this.updateSize(this.elMain, this, true);

                }, 500)
            }
        });
        this.resizeObserver.observe(this.elICA);
    }

    private adjustPositionIfNecessary() {

        setTimeout(() => {

            if (!this.shadowRoot) return;

            let child: HTMLElement[] = [];
            Array.from(this.shadowRoot.children).forEach((item) => {
                const tag = item.tagName.toLocaleLowerCase();
                const invalid = ['wcd-toolbox-aux-background', 'wcd-toolbox-title'];
                if (invalid.includes(tag)) return;
                child.push(item as HTMLElement);
            });

            if (child.length > 1) {

                child = this.organizeArray(child);

                for (let idx = 0; idx < child.length; idx++) {

                    const item1 = child[idx];
                    const item2 = child[idx + 1];

                    if (!item1 || !item2) continue;

                    let rect1 = item1.getBoundingClientRect();
                    let rect2 = item2.getBoundingClientRect();

                    const overlap = this.rectsOverlap(rect1, rect2);

                    if (overlap) {

                        const base = item1.style.left !== '' ? parseInt(item1.style.left, 10) : 0;

                        item2.style.left = base > 0 ? (base + 20) + 'px' : `${((rect1.right - rect1.left) + 20)}px`;

                    }


                }

            }

        }, 500);

    }

    private calculateHorizontalOffset(element1: HTMLElement, element2: HTMLElement, padding = 20) {

        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();


        if (rect1.right > rect2.left && rect1.left < rect2.right) {

            const offset = (rect1.right - rect2.left) + padding;
            return offset;
        }


        return 0;
    }

    private organizeArray(elementsArray: HTMLElement[]): HTMLElement[] {
        const classOrder = ['p-l1', 'p-m1', 'p-r1',
            'p-l2', 'p-m2', 'p-r2',
            'p-l3', 'p-m3', 'p-r3',
            'p-l4', 'p-m4', 'p-r4'];

        // 2. Função de comparação para usar no sort
        const compareByClass = (a: any, b: any) => {
            // Encontre a classe de cada elemento que esteja na lista de ordem
            const aClass = classOrder.find(cls => a.classList.contains(cls)) as string;
            const bClass = classOrder.find(cls => b.classList.contains(cls)) as string;

            // Compare as posições dessas classes na lista
            return classOrder.indexOf(aClass) - classOrder.indexOf(bClass);
        }


        return elementsArray.sort(compareByClass);
    }

    private rectsOverlap(rect1: DOMRect, rect2: DOMRect): boolean {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    private _updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void {

        if (!elBase) return;
        setTimeout(() => {

            const display = elChange.style.display;
            elChange.style.display = 'none!important';
            const icaBase = elBase.parentElement;
            if (!icaBase) return;
            const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);
            const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

            let { width, height, y } = elBase.getBoundingClientRect();
            let left = 0;
            let top = 0;
            left -= parseInt(marginLeft, 10);
            top -= parseInt(marginTop, 10);
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

    private calculateTitlePosition() {
        if (!this.widget || !this.parentElement) return;
        const widget = this.elMain;
        if (!widget || !this.titleEl) return;
        const selectBoxRect = widget.getBoundingClientRect();
         this.titleEl.style.display = 'none';
        const popupWidth = this.titleEl.offsetWidth;
        this.titleEl.style.display = '';
        this.titleEl.style.left = '';
        this.titleEl.style.top = '';
        this.titleEl.style.bottom = '';

        this.titleEl.style.right = `${-1}px`;

        //const spaceRight = window.innerWidth - selectBoxRect.right;
        //if (spaceRight >= popupWidth) this.titleEl.style.left = `${-1}px`;
        //else this.titleEl.style.right = `${-1}px`;
    }

    private _updateBackgroundAuxSize(tp: 'show' | 'hide' = 'hide'): void {

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
        //left -= parseInt(marginLeft, 10);
        //top -= parseInt(marginTop, 10);

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

        if (parseInt(paddingTop, 10) !== 0 && ((elBase.style.height && paddingTop) || (paddingTop && paddingBottom))) {
            elChange.style.top = '-' + (parseInt(paddingTop, 10) + parseInt(fontSize, 10)) + 'px';
        } else if (paddingTop !== '0px') elChange.style.top = '-' + (heightori - 6) + 'px';

        if (paddingLeft !== '0px') elChange.style.left = '-' + parseInt(paddingLeft, 10) + 'px';

    }

    private _updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void {

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

    //--------------CSS--------------------

    static styles = css`

        :host{
            display:block;
            border:1px solid #d3cece;
            position:absolute;
            user-select:none;
            background: #c8c8c8c2;
        }

        .wcdBackButton{
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

        .f-button{
            cursor:pointer;
            background:var(--bg-primary-color)!important;
            padding:5px;
            border-radius:5px;
            border: 1px solid var(--grey-color-darker);
            width: 15px;
            height: 15px;
            display: flex;

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

        wcd-toolbox-title {
            display:block;
            position: absolute;
            background: #4c4c4c;
            color: #fff;
            font-size: 11px;
            text-transform: lowercase;
            padding: 0 .5rem;
            height: 14px;
            bottom: -14px;
            right: -1px;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            font-weight: normal;
            letter-spacing: -.5px;
            font-family: monospace;
            width: max-content;
        }


    `;

}
