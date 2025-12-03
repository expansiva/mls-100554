/// <mls shortName="wcdToolbox" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js'
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { ServiceBase } from '/_100554_/l2/serviceBase.js';
import { WCDToolboxMethodos, WCDToolboxItemMethodos, WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';
import { execute as excCommandDel } from '/_100554_/l2/wcdCommandDel.js';
import { dispatchEventConciliate } from '/_100554_/l2/wcdCommandBase.js';

import * as tps from '/_100554_/l2/icaTypes.js';

export function initWCDToolbox() {
    return true;
}

@customElement('wcd-toolbox-100554')
export class WCDToolbox extends CollabLitElement implements WCDToolboxMethodos {

    // ------------ PROPERTIES ------------------

    @property({ type: String, reflect: true })
    public level: string = '';

    //@property({ type: String, reflect: true })
    //public widget: string | undefined;

    //public elMain: HTMLElement | undefined; // component from ica render

    public elICA: tps.IcaLitElementBaseMethods | undefined; // ica base to wcd

    private wcServicePage: ServiceBase | undefined;

    public fcBeforeBackButton: Function | undefined = undefined;

    get lastHelper() {
        if (!this.elICA) return '';
        return (this.elICA as any)['lasthelper'];
    }

    set lastHelper(helper: string) {
        if (!this.elICA) return;
        (this.elICA as any)['lasthelper'] = helper;
    }

    // ------------ COMPONENT-------------------


    createRenderRoot() {
        return this; // dont use shadow root
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.elICA) return;

    }


    disconnectedCallback() {
        //globalWcd.elICA = undefined;
        globalWcd.myParent = undefined;
        globalWcd.wcdItens = undefined;
        globalWcd.overlay = undefined;

        if (this.parentElement && (this.parentElement as any).fcRemoveWcd)
            (this.parentElement as any).fcRemoveWcd();

        this.verifyNeedDel();

        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    firstUpdated() {
        if (!this.elICA) return;
        this.updateSize(this.elICA, this, true);
        this.initObserverResize();
        this._renderAction();

    }

    render() {
        return html`
         <wcd-toolbox-aux-background></wcd-toolbox-aux-background>
        `;
    }


    //---------------PUBLIC----------------

    public async beforeDelete() {

        for await (const i of Array.from(this.children)) {
            i.remove();
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

    }

    public updateSize(elBase: HTMLElement, elChange: HTMLElement, changePosition: boolean): void {
        return this._updateSize(elBase, elChange, changePosition);
    }

    public getAndSetScenaryOutDoor(op: string): Promise<HTMLElement | undefined> {
        return this._getAndSetScenaryOutDoor(op);
    }

    public backNavigationScenaryOutdoor(): void {
        return this._backNavigationScenaryOutdoor();
    }

    public setIconsWcdToolbox(act: tps.ActionTag[], useSelf: boolean = false, updataSize: 'false' | 'size' | 'padding' = 'false'): void {
        return this._setIconsWcdToolbox(act, useSelf, updataSize);
    }

    public updateBaseNoPadding(elBase: HTMLElement, elChange: HTMLElement): void {
        return this._updateBaseNoPadding(elBase, elChange)
    }

    public updateBackgroundAuxSize(tp: 'show' | 'hide' = 'hide'): void {
        return this._updateBackgroundAuxSize(tp);
    }

    private _settimetouSetStyle: number = 0;
    public setStyle(style: string): void {
        if (!this.elICA) return;
        const styleEl = this.elICA.getAttribute('style');
        if (!styleEl) this.elICA.setAttribute('style', style);
        else {
            const newStyle = styleEl.trim().endsWith(';') ? styleEl.trim() + style : `${styleEl};${style}`;

            const elTemp = document.createElement('span');
            elTemp.style.cssText = newStyle;
            this.elICA.setAttribute('style', elTemp.style.cssText);
            elTemp.remove();
        }

        if (this._settimetouSetStyle) clearTimeout(this._settimetouSetStyle);
        this._settimetouSetStyle = setTimeout(() => {
            dispatchEventConciliate();
        }, 500);
    }

    //---------------IMPLEMENTATION----------------

    private async _renderAction(actions?: tps.ActionTag[]) {

        const parent = this.parentElement?.parentElement as any;

        if (!parent || !parent.getActionsTagsDefault) return;
        const defaultActions = parent.getActionsTagsDefault();

        if (!this.elICA || !this.elICA.getActionsTags) return;
        if (!actions) actions = this.elICA.getActionsTags();

        const allItens = this.querySelectorAll('*');
        allItens.forEach((i: Element) => {
            if (i.tagName.toLocaleLowerCase() === 'wcd-toolbox-aux-background' || i.tagName.toLocaleLowerCase() === 'style') return;
            i.remove()
        });

        this.setDefaultToolBoxOptions();

        globalWcd.elICA = this.elICA;
        globalWcd.myParent = this as any;
        globalWcd.overlay = this.getOverlay();

        for await (let i of actions) {

            if (defaultActions[i.name]) {
                const args = i.args ? i.args : undefined;
                const pos = i.position ? i.position : undefined;
                const toll = i.toolboxOptions ? i.toolboxOptions : undefined;

                i = Object.assign({}, defaultActions[i.name]) as tps.ActionTag;
                if (args) i.args = args;
                if (pos) i.position = pos;
                if (toll) i.toolboxOptions = toll;
            }

            if (i.toolboxOptions) this.setToolBoxOptions(i.toolboxOptions);

            if (i.name === 'button') {
                this.addBackButton();
                continue;
            }

            if (!i.name.startsWith('_') || !i.level || (this.level && !i.level.includes(+this.level))) continue;

            const ok = await this.importWCDActions(i.name);
            if (!ok) continue;

            const infoPath = mls.l2.getPath(i.name);
            const el = document.createElement(convertFileNameToTag({ project: infoPath.project, shortName: infoPath.shortName, folder: infoPath.folder })) as WCDToolboxItemMethodos;
            el.className = `p ${i.position}`;
            el.style.zIndex = '9998';
            el.args = i.args;

            if (!globalWcd.wcdItens) globalWcd.wcdItens = [el as any];
            else globalWcd.wcdItens.push(el as any);

            this.appendChild(el);

        };

        this.adjustPositionIfNecessary();

        setTimeout(() => {
            if (globalWcd.overlay) globalWcd.overlay.updateSizeOverlayItems();
        }, 200);

    }

    private getOverlay(): WCDOverlayMethods | undefined {

        let ret = undefined;

        const page = this.closest('*[modeoverlay]');
        if (!page) return ret;
        const tag = page.getAttribute('modeoverlay');

        if (!tag) return ret;

        ret = page.querySelector(tag) as WCDOverlayMethods;

        return ret;

    }

    private setDefaultToolBoxOptions() {
        this.style.background = '';
        this.style.border = '';
    }

    private setToolBoxOptions(info: tps.IToolboxOptions) {

        if (info.background) this.style.background = info.background;
        if (info.border) this.style.border = info.border;

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

    private _setIconsWcdToolbox(act: tps.ActionTag[], useSelf: boolean = false, updataSize: 'false' | 'size' | 'padding' = 'false'): void {

        if (useSelf) this._renderAction();
        else this._renderAction(act);

        this._updateBackgroundAuxSize();

        if (this.elICA && updataSize === 'size') this.updateSize(this.elICA, this, true);

        if (this.elICA && updataSize === 'padding') this._updateBaseNoPadding(this.elICA, this);

    }

    private addBackButton(): void {

        //if (!this.shadowRoot || !this.parentElement) return;
        if (!this.parentElement) return;

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

        //this.shadowRoot.appendChild(el);
        this.appendChild(el);

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
            if (this.level !== '3') resolve(undefined);

            //mls.events.fire(4, 'WCDEvent' as any, `{"op":"${op}"}`);
            setTimeout(() => {

                if (this.wcServicePage) {
                    resolve((this.wcServicePage as any).querySelector('div'));
                } else {
                    const nav3 = this.getNav3();
                    if (!nav3 || !this.elICA) resolve(undefined);

                    const wc = (nav3 as any).getActiveInstance('left');
                    if (!wc) resolve(undefined);
                    if (wc.tagName !== 'SERVICE-PAGE-100554') resolve(undefined);
                    else {
                        this.wcServicePage = wc;
                        resolve(wc.querySelector('div'));
                    }

                }

            }, 200)
        });

    }

    private _backNavigationScenaryOutdoor(): void {
        if (this.level !== '3') return;
        mls.events.fire(3, 'WCDEvent' as any, `{"op":"Navigation"}`);
    }

    //------SIZE AND POSITION--------------------

    private resizeObserver: ResizeObserver | undefined;

    private timeResize = 0;
    private initObserverResize() {

        if (!this.elICA) return;

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (!this.elICA) return;
                clearTimeout(this.timeResize);
                this.timeResize = setTimeout(() => {

                    const attr = this.getAttribute('needresize');
                    if (!this.elICA || attr === 'false') return;
                    this.updateSize(this.elICA, this, true);

                }, 100)
            }
        });
        this.resizeObserver.observe(this.elICA);
    }

    private adjustPositionIfNecessary() {

        setTimeout(() => {

            //if (!this.shadowRoot) return;

            let child: HTMLElement[] = [];
            //Array.from(this.shadowRoot.children).forEach((item) => {
            Array.from(this.children).forEach((item) => {
                const tag = item.tagName.toLocaleLowerCase();
                const invalid = ['span', 'wcd-toolbox-aux-background'];
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

        }, 200);

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


        const display = elChange.style.display;
        elChange.style.display = 'none!important';
        //const icaBase = elBase.parentElement;
        //if (!icaBase) return;
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

        elChange.style.width = `${width}px`;
        elChange.style.height = `${height + 1}px`;
        elChange.style.display = display;

    }

    private _updateBackgroundAuxSize(tp: 'show' | 'hide' = 'hide'): void {

        const elChange = this.querySelector('wcd-toolbox-aux-background') as HTMLElement;
        const elBase = this.elICA;
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

    private verifyNeedDel() {

        if (!this.elICA || !this.elICA.overlayRef || !this.elICA.getActionsTags) return;
        const acts = this.elICA.getActionsTags()

        if (acts.some((a) => a.name === 'add')) {
            const param = {
                args: new KeyboardEvent('keydown', {
                    key: 'Del',
                    code: 'Del',
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                }),
                overlay: this.elICA.overlayRef.parentElement as any,
                selectedIca: globalWcd.elICA
            }

            excCommandDel(param);
        }
    }


}
