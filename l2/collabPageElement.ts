/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { WCDToolbox } from '_100554_wcdToolbox';

export abstract class CollabPageElement extends CollabLitElement {

    abstract initPage(): void
    public isPage = true;

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    private overlay: HTMLElement | undefined;

    connectedCallback() {
        super.connectedCallback();
        this.setupEventListeners();
    }

    setupEventListeners() {
        let device: string = this.getVariationDevice();
        if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1);
        const elements = this.querySelectorAll('[data-event]');
        const that = this as any;
        elements.forEach(element => {
            const events = element.getAttribute('data-event')?.split(' ') || [];
            const elementId = element.getAttribute('id');
            events.forEach(event => {
                // search por functions name, from specific to generic,
                // ex: handleClick1Desktop, handleClick1, handleClick
                const handlerGeneric = `handle${event.charAt(0).toUpperCase() + event.slice(1)}`;
                const handlerSpecificID = `${handlerGeneric}${elementId}`;
                const handlerSpecificDevice = `${handlerSpecificID}${device}`
                if (that[handlerSpecificDevice]) {
                    element.addEventListener(event, that[handlerSpecificDevice].bind(this));
                } else if (that[handlerSpecificID]) {
                    element.addEventListener(event, that[handlerSpecificID].bind(this));
                } else if (that[handlerGeneric]) {
                    element.addEventListener(event, that[handlerGeneric].bind(this));
                }
            });
        });
    }

    getVariationDevice(): IDevice {
        const device = (document.documentElement.getAttribute('data-device') || 'desktop').toLowerCase();
        return device as IDevice;
    }

    createRenderRoot() {
        return this; // dont use shadow root
    }

    firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        setTimeout(() => {
            this.checkToAddOverlay();
        }, 500);
        this.initPage();
    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('level') && changedProperties.get('level') !== undefined) {
            this.checkToAddOverlay();
        }
    }

    private checkToAddOverlay() {
        if (this.overlay) this.overlay.remove();
        this.createOverlay();
    }

    private resizeObserver: ResizeObserver | undefined;

    private createOverlay() {
        this.overlay = document.createElement('wcd-overlay') as HTMLElement;
        this.overlay.style.position = 'absolute';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.top = '0';
        this.overlay.onclick = (e: MouseEvent) => {
            /// this.onClickOverlay(e)
        };

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            console.info(entries)
            for (let entry of entries) {
                this.updateSizeOverlayItems();
            }
        });

        this.resizeObserver.observe(this.overlay);
        const boundingPage = this.getBoundingClientRect();
        const icas = this.findAllElementsIca(this);
        icas.forEach((item) => {
            this.createOverlayItem(item, this.overlay as HTMLElement, boundingPage);
        });
        this.appendChild(this.overlay);
    }

    private updateSizeOverlayItems() {
        if (!this.overlay) return;
        const items = Array.from(this.overlay.children) as IWCDOverlayItem[];
        const boundingPage = this.getBoundingClientRect();

        items.forEach((item) => {
            const { x, y, height, width } = item.info.element.getBoundingClientRect();
            item.info.x = x;
            item.info.y = y;
            item.info.height = height;
            item.info.width = width;
            const pos = this.getPosition(item.info, boundingPage);
            item.style.width = pos.width;
            item.style.height = pos.height;
            item.style.top = pos.top;
            item.style.left = pos.left;
        });
    }

    private createOverlayItem(icaInfo: IICADepths, content: HTMLElement, boundingPage: DOMRect) {

        const pos = this.getPosition(icaInfo, boundingPage);
        const icaOverlayItem = document.createElement('wcd-overlay-item') as IWCDOverlayItem;
        icaOverlayItem.setAttribute('widget', icaInfo.element.tagName.toLowerCase());
        icaOverlayItem.info = icaInfo;
        icaOverlayItem.style.position = 'absolute';
        icaOverlayItem.style.width = pos.width;
        icaOverlayItem.style.height = pos.height;
        icaOverlayItem.style.zIndex = '9999';
        icaOverlayItem.style.top = pos.top;
        icaOverlayItem.style.left = pos.left;

        icaOverlayItem.onmouseover = () => {
            const items = Array.from(content.children) as IWCDOverlayItem[];
            items.forEach((item) => {
                item.style.opacity = '';
                item.style.background = '';
            });
            icaOverlayItem.style.background = '#d3e3fd';
            icaOverlayItem.style.opacity = '.3'

        }

        icaOverlayItem.onclick = (e)=>{
            e.stopPropagation();
            if(!this.overlay) return;
            const wcds = this.overlay.querySelectorAll('wcd-toolbox-100554');
            wcds.forEach((wc) => wc.remove());
            const wcd = document.createElement('wcd-toolbox-100554') as WCDToolbox;
            wcd.elICA = icaOverlayItem.info.element;
            icaOverlayItem.appendChild(wcd);
        };
        

        content.appendChild(icaOverlayItem)

    }

    private getPosition(icaInfo: IICADepths, boundingPage: DOMRect) {

        const elBase = icaInfo.element;
        let { width, height } = icaInfo;

        const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);
        const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

        let left = icaInfo.x;
        let top = icaInfo.y;
        left -= parseInt(marginLeft, 10);
        top -= parseInt(marginTop, 10);
        width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

        if (width > elBase.ownerDocument.body.clientWidth) width -= 3;
        height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));

        return {
            left: `${left - boundingPage.left}px`,
            top: `${top - boundingPage.top}px`,
            width: `${width}px`,
            height: `${height}px`
        }
    }

    private onClickOverlay(e: MouseEvent) {
        const elements = this.ownerDocument.elementsFromPoint(e.clientX, e.clientY);
        const mostDepth = elements[1];
        if (!mostDepth) return;
        const allIcas = this.findAllElementsIca(mostDepth as HTMLElement);
        const finalEl = this.findMostDeepElementFromPoint(allIcas, e.clientX, e.clientY);
        this.actualSelected = finalEl;
        console.info(this.actualSelected);
        // const parent = this.findClosestIcaParent(this.actualSelected as Element);
        // console.info(parent);
    }

    private findMostDeepElementFromPoint(arr: IICADepths[], clientX: number, clientY: number) {

        function isBetween(nr: number, min: number, max: number) {
            return nr >= min && nr <= max;
        }

        function findMaxDepthElement(elements: IICADepths[]): IICADepths | null {
            if (elements.length === 0) return null;
            return elements.reduce((max, current) => {
                return current.depth > max.depth ? current : max;
            });
        }

        const res: IICADepths[] = [];
        arr.forEach((ica) => {
            const { x, y, height, width } = ica.element.getBoundingClientRect();
            const isBtwX = isBetween(clientX, x, x + width);
            const isBtwY = isBetween(clientY, y, y + height);
            if (isBtwY && isBtwX) {
                res.push(ica);
            }
        });

        const mostDepth = findMaxDepthElement(res);
        if (!mostDepth) return null;
        else return mostDepth.element;

    }

    private actualSelected: HTMLElement | null = null;

    private findAllElementsIca(el: HTMLElement): IICADepths[] {
        let elements: IICADepths[] = [];
        let elToSearch: Element | ShadowRoot = el;

        function traverseShadowRoot(element: HTMLElement, depth: number) {

            if (element.tagName.toLowerCase().startsWith('ica')) {
                const { x, y, height, width } = element.getBoundingClientRect();
                elements.push({ element, depth, x, y, height, width, opacity: element.style.opacity });
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item as HTMLElement, depth + 1);
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child as HTMLElement, depth + 1));
                }
            }
        }

        if (el.shadowRoot) elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement, 0); // Inicializar com profundidade 0
        });

        // if (el.parentElement && el.parentElement.tagName.toLowerCase().startsWith('ica')) elements.unshift({ element: el.parentElement, depth: 0 });

        return elements;
    }

    private findClosestIcaParent(element: Element): Element | null {
        let elToSearch: Element | ShadowRoot = element;

        function traverseParents(currentElement: Element | null): Element | null {
            if (!currentElement) return null;

            if (currentElement.tagName.toLowerCase().startsWith('ica')) {
                return currentElement;
            } else {
                if (currentElement.parentElement) {
                    return traverseParents(currentElement.parentElement);
                } else {
                    const parentNode = currentElement.parentNode;
                    if (parentNode && parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        const hostElement = (parentNode as ShadowRoot).host;
                        if (hostElement instanceof Element) {
                            return traverseParents(hostElement);
                        }
                    }
                }
            }
            return null;
        }

        if (element.shadowRoot) elToSearch = element.shadowRoot;
        return traverseParents(element.parentElement);
    }

    render() {
        this.style.position = 'relative';
        return html``;
    }


}

interface IICADepths {
    element: HTMLElement,
    depth: number,
    x: number,
    y: number,
    height: number,
    width: number,
    opacity: string,
}

interface IWCDOverlayItem extends HTMLElement {
    info: IICADepths
}
export function getEventName(eventName: string, elementId?: string, device?: IDevice) {
    const handlerGeneric = `handle${eventName.charAt(0).toUpperCase() + eventName.slice(1)} `;
    if (!elementId) return handlerGeneric;
    const handlerSpecificID = `${handlerGeneric}${elementId} `;
    if (!device) return handlerSpecificID;
    if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1) as IDevice;
    const handlerSpecificDevice = `${handlerSpecificID}${device} `
    return handlerSpecificDevice;
}

export type IDevice = 'desktop' | 'mobile' | 'others'
