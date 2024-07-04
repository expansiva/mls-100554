/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IcaPageOverlayItem, initIcaPageOverlayItem } from './_100554_icaPageOverlayItem';
import { IICADepths } from './_100554_icaPageOverlayBase';
import { initIcaPageOverlay } from './_100554_icaPageOverlay';
import { initWCDToolbox } from './_100554_wcdToolbox';

export abstract class CollabPageElement extends CollabLitElement {

    abstract initPage(): void
    public isPage = true;

    constructor() {
        super();
        initWCDToolbox();
        initIcaPageOverlay();
        initIcaPageOverlayItem();
    }

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
        this.overlay = document.createElement('ica-page-overlay-100554') as HTMLElement;
        const boundingPage = this.getBoundingClientRect();
        const icas = this.findAllElementsIca(this);
        icas.forEach((item) => {
            this.createOverlayItem(item, this.overlay as HTMLElement, boundingPage);
        });
        this.appendChild(this.overlay);
    }

    private createOverlayItem(icaInfo: IICADepths, content: HTMLElement, boundingPage: DOMRect) {
        const icaOverlayItem = document.createElement('ica-page-overlay-item-100554') as IcaPageOverlayItem;
        icaOverlayItem.setAttribute('widget', icaInfo.element.tagName.toLowerCase());
        icaOverlayItem.info = icaInfo;
        icaOverlayItem.boundingPage = boundingPage;
        content.appendChild(icaOverlayItem)
    }

    private findAllElementsIca(el: HTMLElement): IICADepths[] {
        let elements: IICADepths[] = [];
        let elToSearch: Element | ShadowRoot = el;

        function traverseShadowRoot(element: HTMLElement, depth: number) {

            if (element.tagName.toLowerCase().startsWith('ica')) {
                const { x, y, height, width } = element.getBoundingClientRect();
                elements.push({ element: element as IcaLitElementBase, depth, x, y, height, width, opacity: element.style.opacity });
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
