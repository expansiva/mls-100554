/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { CollabLitElement } from './_100554_collabLitElement';

export abstract class CollabPageElement extends CollabLitElement {

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

    render() {
        return html`<slot></slot>`
    }

}

export function getEventName(eventName: string, elementId?: string, device?: IDevice) {
    const handlerGeneric = `handle${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
    if (!elementId) return handlerGeneric;
    const handlerSpecificID = `${handlerGeneric}${elementId}`;
    if (!device) return handlerSpecificID;
    if (device.length > 0) device = device.charAt(0).toUpperCase() + device.slice(1) as IDevice;
    const handlerSpecificDevice = `${handlerSpecificID}${device}`
    return handlerSpecificDevice;
}
    
export type IDevice = 'desktop' | 'mobile' | 'others'
