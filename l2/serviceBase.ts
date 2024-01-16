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

    get serviceContent() { return this.getParent(); }

    abstract details: IService;

    abstract onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void;

    connectedCallback() {
        super.connectedCallback();
        (this as any)['mlsWidget'] = this;
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        if (name === 'visible') {
            const visible = newVal === 'true';
            const reinit: boolean = oldVal !== null && visible !== false;
            if (this.onServiceClick && typeof this.onServiceClick === 'function') this.onServiceClick(visible, reinit, this.getParent())
        }
    }

    private getParent() {
        const parentToolbarContent = this.closest('mls-toolbar-content-service-100529') as IToolbarContent | null;
        return parentToolbarContent;
    }

}

export interface IMenuKeyValue {
    [key: string]: string
}
export interface IIconsKeyValue {
    [key: string]: string
}

export type IClickLinkCallBack = (op: string) => boolean | undefined;
export type IClickIconCallBack = (op: string) => void | undefined;

export type ISetMode = (mode: IMode | null, page?: HTMLElement) => void;
export type IGetLastMode = () => IMode;
export type IMode =
    'initial' // show siblings with hamburguer icon
    | 'page' // show page (About ...) with close icon
    | 'editor'; // show siblings with close icon

export interface IMenu {
    title: string,
    actions: IMenuKeyValue,
    icons: IIconsKeyValue,
    actionDefault?: string,
    iconDefault?: string,
    onClickLink?: IClickLinkCallBack,
    onClickIcon?: IClickIconCallBack,
    setMode?: ISetMode,
    setIconActive?: (op: string) => void,
    getLastMode?: IGetLastMode,
    lastIcon?: string,
    updateTitle?: Function,
}

export interface IToolbarContent extends HTMLElement {
    layout: Function
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
