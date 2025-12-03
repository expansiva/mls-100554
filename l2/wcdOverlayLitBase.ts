/// <mls shortName="wcdOverlayLitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { ActionTag, IICADepths, IcaLitElementBaseMethods, } from '/_100554_/l2/icaTypes.js';
import { WCDOverlayMethods, IWCDCommand, WCDToolboxMethodos, IListWidgetBase, WCDOverlayItensMethods } from '/_100554_/l2/wcdTypes.js';
import { getPosition } from '/_100554_/l2/icaGlobal.js';

export abstract class WcdOverlayLitBase extends CollabLitElement implements WCDOverlayMethods {

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    @property({ type: String, reflect: true }) msize: string | undefined;

    public myItens: IICADepths[] = [];

    private resizeObserver: ResizeObserver | undefined;

    constructor() {
        super();
        document.onkeydown = (e) => { this.onkeyDown(e) }
    }

    refreshOverlay(): void {
        throw new Error('Method not implemented.');
    }

    //------------COMPONENT---------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

    timeoutResize: number | undefined;

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (typeof ResizeObserver !== 'undefined') {
            if (this.resizeObserver) this.resizeObserver.disconnect();
            this.resizeObserver = new ResizeObserver(entries => {
                if (this.timeoutResize) clearTimeout(this.timeoutResize);
                this.timeoutResize = setTimeout(() => {
                    this.updateSizeOverlayItems();
                })
            });
            this.resizeObserver.observe(this);
        }
        this.updateSizeOverlayItems();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        const hasMsize = changedProperties.has('msize');

        if (changedProperties.has('globalVariation') && changedProperties.get('globalVariation') !== undefined) {
            setTimeout(() => this.updateSizeOverlayItems(), 500);
        }

        if (hasMsize) {
            if (this.timeoutResize) clearTimeout(this.timeoutResize);
            this.timeoutResize = setTimeout(() => {
                this.updateSizeOverlayItems();
            }, 50);
        }
    }

    //-----------IMEPLEMENTATION----------   

    abstract overlayItemTagName: string;

    abstract listWidgetsBase: IListWidgetBase[]

    abstract myKeyEvents: { [key: string]: Function }

    abstract selectItem(ica: IcaLitElementBaseMethods): void;

    abstract getActionsTagsDefault(): { [key: string]: ActionTag };

    private onkeyDown(e: KeyboardEvent) {

        e.stopPropagation();

        let el = this.querySelector('wcd-toolbox-100554') as WCDToolboxMethodos;

        const param: IWCDCommand = {
            args: e,
            overlay: this,
            selectedIca: undefined
        };

        if (!el) {
            if (this.myKeyEvents[e.key]) this.myKeyEvents[e.key](param);
            return;
        }

        if (this.myKeyEvents[e.key]) {
            param.selectedIca = el.elICA;
            this.myKeyEvents[e.key](param);
        }

    }

    createOverlayItems(): void {

        const boundingPage = this.getBoundingClientRect();
        this.innerHTML = '';
        this.myItens.forEach((item) => {
            item.element.setAttribute('level', this.level);
            this.createOverlayItem(item, this as HTMLElement, boundingPage);
        });

        setTimeout(() => this.updateSizeOverlayItems(), 100)
    }

    changeOverlayItemsLevel(): void {
        if (!this) return;
        Array.from(this.children).forEach((item) => {
            item.setAttribute('level', this.level);
        });
        this.updateSizeOverlayItems();
    }

    private createOverlayItem(icaInfo: IICADepths, content: HTMLElement, boundingPage: DOMRect): void {

        const icaOverlayItem = document.createElement(this.overlayItemTagName) as WCDOverlayItensMethods;
        icaOverlayItem.setAttribute('widget', icaInfo.element.tagName.toLowerCase());
        icaOverlayItem.setAttribute('level', this.level);
        icaOverlayItem.info = icaInfo as any;
        icaOverlayItem.boundingPage = boundingPage;
        content.appendChild(icaOverlayItem);
    }

    public updateSizeOverlayItems() {

        requestAnimationFrame(() => {
            const items = Array.from(this.children) as WCDOverlayItensMethods[];
            const boundingPage = this.getBoundingClientRect();
            items.forEach((item) => {
                if (!item.info) return;
                const { x, y, height, width } = item.info.element.getBoundingClientRect();
                item.info.x = x;
                item.info.y = y;
                item.info.height = height;
                item.info.width = width;
                const pos = getPosition(item.info, boundingPage);
                item.style.width = pos.width;
                item.style.height = pos.height;
                item.style.top = pos.top;
                item.style.left = pos.left;
            });
        });

    }

}
