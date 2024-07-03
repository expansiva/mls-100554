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
    private resizeObserver: ResizeObserver | undefined;

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

    createRenderRoot() {
        return this; // dont use shadow root
    }

    render() {
        this.style.position = 'relative';
        return html``;
    }

    private checkToAddOverlay() {
        if (this.overlay) this.overlay.remove();
        this.createOverlay();
    }

    private createOverlay() {
        this.overlay = document.createElement('wcd-overlay') as HTMLElement;
        this.overlay.style.position = 'absolute';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.top = '0';

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
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
        (icaInfo.element as any).overlayRef = icaOverlayItem;
        icaOverlayItem.style.position = 'absolute';
        icaOverlayItem.style.width = pos.width;
        icaOverlayItem.style.height = pos.height;
        icaOverlayItem.style.zIndex = '9999';
        icaOverlayItem.style.top = pos.top;
        icaOverlayItem.style.left = pos.left;

        icaOverlayItem.onmouseover = (e) => {
            this.onIcaOverlayItemOver(e, icaOverlayItem);
        }

        icaOverlayItem.onmouseleave = (e) => {
            this.onIcaOverlayItemLeave(e, icaOverlayItem);
        }

        icaOverlayItem.onclick = (e) => {
            this.onIcaOverlayItemClick(e, icaOverlayItem);
        };

        content.appendChild(icaOverlayItem)

    }

    private onIcaOverlayItemLeave(e: MouseEvent, icaOverlayItem: IWCDOverlayItem) {
        icaOverlayItem.style.opacity = '';
        icaOverlayItem.style.background = '';
    }

    private onIcaOverlayItemOver(e: MouseEvent, icaOverlayItem: IWCDOverlayItem) {
        icaOverlayItem.style.background = '#d3e3fd';
        icaOverlayItem.style.opacity = '.3'
    }

    private onIcaOverlayItemClick(e: MouseEvent, icaOverlayItem: IWCDOverlayItem) {
        e.stopPropagation();
        if (!this.overlay) return;

        const origin = (e.detail as any).origin;

        const wcds = this.overlay.querySelectorAll('wcd-toolbox-100554');
        wcds.forEach((wc) => wc.remove());
        const wcd = document.createElement('wcd-toolbox-100554') as WCDToolbox;
        wcd.elICA = icaOverlayItem.info.element;
        icaOverlayItem.appendChild(wcd);

    
        if (origin !== "editor") this.selectOnHTML(icaOverlayItem);

        // if (this.level !== '4') return;
        // mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);
        // mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
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

        return elements;
    }

    private selectOnHTML(el:IWCDOverlayItem): void {

        if (this.level !== '2') return;
        if(!el.info.element) return;
        const id = el.info.element.id;
        if (!id) return;

        const infoL2 = (mls.actual[2] as any).left as any;
        const name = mls.l2.editor.getKey({ project: infoL2.project, shortName: infoL2.shortName });
        const mfile = mls.l2.editor.mfiles[name];
        if (!mfile || !(mfile as any).modelHTML) return;

        const model = (mfile as any).modelHTML;
        const line = model.findMatches(`id="${id}"`, false, false, false, null, true);
        if (!line || !line[0]) return;
        const { startLineNumber } = line[0].range;

        mls.events.fire(2, 'WidgetAction' as any, `{"op":"SelectLine", "line":${startLineNumber}, "origin":"preview"}`);

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
