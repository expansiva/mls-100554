/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { WCDOverlayMethods } from './_100554_wcdTypes';
import { IICADepths } from './_100554_icaTypes'

import { convertTagToFileName } from './_100554_utilsLit'

export const PREFIX_ICA_ID = 'ica_';

export function toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, match => match.replace('-', '').toUpperCase());
}

export abstract class CollabPageElement extends CollabLitElement {

    abstract initPage(): void

    @property({ type: String, reflect: true }) modeoverlay: string = '';

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    public overlay: WCDOverlayMethods | undefined;

    public isPage = true;

    public refreshOverlay() {
        this.checkToAddOverlay();
    }

    constructor() {
        super();
    }

    //--------COMPONENT------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

    firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        setTimeout(() => {
            this.checkToAddOverlay();
        }, 500);

        this.setupIds();
        this.setupEvents();
        this.initPage();

    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('level') && changedProperties.get('level') !== undefined) {
            this.checkToAddOverlay();
        }
    }

    render() {
        this.style.position = 'relative';
        return html``;
    }

    //--------IMPLEMENTS------------

    private getVariationDevice(): IDevice {
        const device = (document.documentElement.getAttribute('data-device') || 'desktop').toLowerCase();
        return device as IDevice;
    }


    private setupIds(): void {
        const icas = this.findAllElementsIca(this);
        let device: string = this.getVariationDevice();
        if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1);

        icas.forEach((item) => {
            const oldId = item.element.id;
            const icaId = `${PREFIX_ICA_ID}${item.element.id}`;
            item.element.setAttribute('id', icaId);
            item.element.setAttribute('idel', oldId);
        });

    }

    private setupEvents(): void {

        const allWebComponentsInPage = this.getAllWebComponents(this);
        let device: IDevice = this.getVariationDevice();
        if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1) as IDevice;

        allWebComponentsInPage.forEach((el) => {
            const widget = el.tagName.toLowerCase();
            customElements.whenDefined(widget).then(() => {
                const events = el.getAttribute('data-event')?.split(' ') || [];
                if (!events || events.length === 0) return;
                const elementId = el.getAttribute('idel') || el.getAttribute('id');
                if (!elementId) return;
                const that = this as any;
                events.forEach(event => {
                    // search por functions name, from specific to generic,
                    // ex: handleClick1Desktop, handleClick1, handleClick
                    const handlerGeneric = getEventName(event)
                    const handlerSpecificID = getEventName(event, elementId);
                    const handlerSpecificDevice = getEventName(event, elementId, device);
                    if (that[handlerSpecificDevice]) {
                        el.addEventListener(event, that[handlerSpecificDevice].bind(this));
                    } else if (that[handlerSpecificID]) {
                        el.addEventListener(event, that[handlerSpecificID].bind(this));
                    } else if (that[handlerGeneric]) {
                        el.addEventListener(event, that[handlerGeneric].bind(this));
                    }
                });
            })
        })

    }



    private checkToAddOverlay(): void {

        if (this.level === '7') {
            this.overlay?.remove();
            this.overlay = undefined;
            return;
        }

        if (this.overlay) {
            this.overlay.setAttribute('level', this.level)
            this.overlay.changeOverlayItemsLevel();
            return;
        }

        this.createOverlay();
    }

    private async createOverlay() {

        if (!this.modeoverlay) return;

        const ok = await this.importWCDOverlay(this.modeoverlay);
        if (!ok) return;
        this.overlay = document.createElement(this.modeoverlay) as WCDOverlayMethods;
        this.overlay.myItens = this.findAllElementsIca(this);
        this.overlay.createOverlayItems();
        this.appendChild(this.overlay as HTMLElement);

    }

    private hasImport: string[] = [];
    private async importWCDOverlay(imports: string) {

        try {

            if (this.hasImport.includes(imports)) return true;
            imports = convertTagToFileName(imports);
            if (!imports.startsWith('./')) imports = './' + imports;
            await import(imports);
            this.hasImport.push(imports);
            return true;

        } catch (e) {
            console.info(e);
            return false
        }

    }

    private findAllElementsIca(el: HTMLElement): IICADepths[] {
        let elements: IICADepths[] = [];
        let elToSearch: Element | ShadowRoot = el;

        const arrayEls: HTMLElement[] = [];

        function traverseShadowRoot(element: HTMLElement, depth: number) {

            if (element.tagName.toLowerCase().startsWith('ica') && !arrayEls.includes(element)) {
                const { x, y, height, width } = element.getBoundingClientRect();
                elements.push({ element: element as IcaLitElementBase, depth, x, y, height, width, opacity: element.style.opacity });
                arrayEls.push(element);
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



        if (el.shadowRoot)
            elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement, 0); // Inicializar com profundidade 0
        });

        return elements;

    }

    private getAllWebComponents(root: HTMLElement): HTMLElement[] {
        const webComponents: HTMLElement[] = [];

        function findWebComponents(node: Node) {
            if (node instanceof HTMLElement) {
                const tagName = node.tagName.toLowerCase();
                if (tagName.split('-').length > 1) {
                    webComponents.push(node);
                }

                // Check if the element has a shadow root
                if (node.shadowRoot) {
                    node.shadowRoot.childNodes.forEach(childNode => findWebComponents(childNode));
                }
            }

            node.childNodes.forEach(childNode => findWebComponents(childNode));
        }

        findWebComponents(root);
        return webComponents;
    }


}


export function getEventName(eventName: string, elementId?: string, device?: IDevice) {
    const newId = toPascalCase(elementId || '')
    const handlerGeneric = `handle${toPascalCase(eventName)}`;
    if (!newId) return handlerGeneric;
    const handlerSpecificID = `${handlerGeneric}${newId}`;
    if (!device) return handlerSpecificID;
    if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1) as IDevice;
    const handlerSpecificDevice = `${handlerSpecificID}${device}`
    return handlerSpecificDevice;
}

export type IDevice = 'desktop' | 'mobile' | 'others'
