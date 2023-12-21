/// <mls shortName="serviceBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-base-100554')
export abstract class ServiceBase extends LitElement {

    @property({ type: String, reflect: true })
    public level: mls.events.Level | undefined;

    @property({ type: String, reflect: true })
    public position: 'left' | 'right' | undefined;

    @property({ type: String })
    visible = 'false';

    abstract details: IService;

    abstract onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void;

    connectedCallback() {
        super.connectedCallback();
        (this as any)['mlsWidget'] = this;
    }

    createRenderRoot() {
        return this;
    }

    private getParent() {
        const parentToolbarContent = this.closest('mls-toolbar-content-service-100529') as IToolbarContent | null;
        return parentToolbarContent;
    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('visible')) {
            const visible = changedProperties.get('visible');
            const reinit: boolean = visible !== 'true' && visible !== undefined;
            if (this.onServiceClick && typeof this.onServiceClick === 'function') this.onServiceClick(visible !== 'true' || visible === undefined, reinit, this.getParent())
        }
    }


}

export interface IToolbarContent extends HTMLElement {
    layout:Function
}

export interface IService {
    icon: string,
    name: string,
    mode: IServiceMode,
    position: IServicePosition
    readOnly: boolean,
    tooltip: string,
    className: IServiceClassName,
    tags: string[],
    levels: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
}
export type IServiceClassName = 'separator-left' | 'separator-right' | undefined;
export type IServicePosition = 'left' | 'right' | 'all';
export type IServiceMode = 'A' | 'H' | 'D' | 'B';// active, hidden, disabled, background, 
