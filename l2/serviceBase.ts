/// <mls shortName="serviceBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('service-base-100554')
export abstract class ServiceBase extends LitElement {

    @property({ type: Number, reflect: true })
    public level: mls.events.Level = 7;

    @property({ type: String, reflect: true })
    public position: 'left' | 'right' = 'left';

    @property({ type: String })
    visible = 'false';

    @state() loading: boolean = false;

    get serviceContent() { return this.getParent(); }

    get serviceItemNav() { return this.getServiceItemNav(); }

    get tooltipEl() { return this.getTooltip(); }

    abstract details: IService;

    abstract menu: IMenu;

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

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);

        if (changedProperties.has('loading')) {
            const loading = changedProperties.get('loading');

            if (loading !== undefined) {
                this.serviceContent?.setAttribute('loading', (!loading).toString());
            }
        }
    }

    setError(error: string): void {
        this.serviceContent?.setAttribute('error', error);
    }

    toogleBadge(show: boolean, serviceName: string) {
        const mlsNav2 = this.getMlsNav2();
        if (!mlsNav2) {
            console.error('Function toogleBadge: mls-nav-2 dont exist');
            return;
        }
        mlsNav2.toogleBadge(show, serviceName);
    }

    openMe() {
        const itemService = this.serviceItemNav;
        if (itemService) itemService.click();
    }

    openService(service: string, position: 'left' | 'right', level: number) {
        const page = this.closest('mls-page-100529');
        if (!page) return;
        const toolbar = page.querySelector(`mls-toolbar-100529[toolbarposition="${position}"][level="${level}"]`);
        if (!toolbar) return;
        const toolbarItem = toolbar.querySelector(`mls-toolbar-item-100529[path="${service}"`) as HTMLElement;

        if (toolbarItem) {
            if (this.level !== level) {
                this.selectLevel(level);
                toolbar.setAttribute('service-to-open', service);
                return;
            }
            toolbarItem.click();
        }
    }

    selectLevel(level: number) {
        const nav = this.closest('mls-nav1-100529');
        const objIndex = {
            0: 7,
            1: 6,
            2: 5,
            3: 4,
            4: 3,
            5: 2,
            6: 1,
            7: 0,

        } as any;
        if (!nav) return;
        nav.setAttribute('tabindexactive', objIndex[level]);
    }

    private getMlsNav2(): IMlsNav2 | null {
        const mlsNav2 = this.closest('mls-toolbar-100529') as IMlsNav2 | null;
        return mlsNav2;
    }

    private getParent() {
        const parentToolbarContent = this.closest('mls-toolbar-content-service-100529') as IToolbarContent | null;
        return parentToolbarContent;
    }

    private getTooltip() {
        const tooltip = document.querySelector('mls-tooltip-100529') as ITooltipElement | null;
        return tooltip;
    }

    private getServiceItemNav(): IMlsNav2Item | null {
        const toolbar = this.getMlsNav2();
        if (!toolbar) return null;
        const parent = this.parentElement;
        if (!parent) return null;
        const path = parent.getAttribute('path');
        const item = toolbar.querySelector(`mls-toolbar-item-100529[path="${path}"]`) as IMlsNav2Item;
        return item;
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
    setMenuActive?: (op: string) => void,
    getLastMode?: IGetLastMode,
    lastIcon?: string,
    updateTitle?: Function,
}

export interface IToolbarContent extends HTMLElement {
    layout: Function
}

export interface ITooltipElement extends HTMLElement {
    tooltip: (el:HTMLElement) => void
}

export interface IMlsNav2 extends HTMLElement {
    toogleBadge: (show: boolean, serviceName: string) => void
}

export interface IMlsNav2Item extends HTMLElement {

}

export interface IService {
    icon: string,
    name: string,
    mode: IServiceMode,
    position: IServicePosition
    readOnly?: boolean,
    tooltip: string,
    className?: IServiceClassName,
    tags: string[],
    levels: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)[];
}
export type IServiceClassName = 'separator-left' | 'separator-right' | undefined;
export type IServicePosition = 'left' | 'right' | 'all';
export type IServiceMode = 'A' | 'H' | 'D' | 'B';// active, hidden, disabled, background, 
