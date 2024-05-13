/// <mls shortName="serviceBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { LitElement } from 'lit';
import { CollabLitElement } from './_100554_collabLitElement';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('service-base-100554')
export abstract class ServiceBase extends CollabLitElement {

    // @property({ type: Number, reflect: true })
    get level(): mls.events.Level { return +(this.getAttribute('level') || 7) as mls.events.Level };

    @property({ type: String, reflect: true })
    public position: 'left' | 'right' = 'left';

    @property({ type: String })
    visible = 'false';

    @property({ type: String, noAccessor: true }) msize = '';

    @state() loading: boolean = false;

    get serviceContent() { return this.getNav3ServiceContent(); }

    get nav3Service() { return this.getNav3Service(); }

    get serviceItemNav() { return this.getServiceItemNav(); }

    get tooltipEl() { return this.getTooltip(); }

    abstract details: IService;

    abstract menu: IMenu;

    abstract onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void;

    getActualRef(): string {
        return this.nav3Service?.getAttribute('data-service') || '';
    }

    connectedCallback() {
        super.connectedCallback();
        (this as any)['mlsWidget'] = this;
        this.serviceContent?.addEventListener('focusin', this.checkFocus.bind(this));
    }

    checkFocus() {
        if (!this.serviceContent) return;
        if (this.serviceContent.contains(document.activeElement)) {
            this.setActualServicePosition();
        }
    }

    checkMouse() {
        this.setActualServicePosition();
    }

    setActualServicePosition() {
        if (!this.serviceContent || !this.nav3Service) return;
        const service = this.serviceContent.getAttribute('data-service') || '';
        const position = this.nav3Service.getAttribute('toolbarposition') || '';
        mls.setActualPosition(position as any);
        mls.setActualService(service)
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        if (name === 'visible') {
            const visible = newVal === 'true';
            const reinit: boolean = oldVal !== null && visible !== false;
            if (this.onServiceClick && typeof this.onServiceClick === 'function') this.onServiceClick(visible, reinit, this.getNav3ServiceContent())
        }

        if (name === 'msize') {
            const [width, height, top, left] = this.msize.split(',');
            if (height) this.style.height = height + 'px';
        }
        super.attributeChangedCallback(name, oldVal, newVal);

    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);

        if (changedProperties.has('loading')) {
            const loading = changedProperties.get('loading');

            if (loading !== undefined) {

                const nav3Service = this.getNav3Service();
                if (!nav3Service) return;
                (nav3Service as any)['serviceBind'] = this.details.widget;
                nav3Service.setAttribute('loading', (!loading).toString());

            }
        }
    }

    setError(error: string): void {
        const nav3Service = this.getNav3Service();
        if (!nav3Service) return;
        (nav3Service as any)['serviceBind'] = this.details.widget;
        nav3Service.setAttribute('error', error);
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

    showNav2Item(show: boolean) {
        const itemService = this.serviceItemNav as IMlsNav2Item;
        if (itemService && itemService.show) itemService.show(show);
    }

    openService(service: string, position: 'left' | 'right', level: number) {
        let page = this.closest('collab-page');
        if (!page) return;


        const toolbar = page.querySelector(`collab-nav-2[toolbarposition="${position}"]`) as HTMLElement;
        if (!toolbar) return;
        if (this.level !== level) {
            (toolbar as any).state[level][position] = service;
            this.selectLevel(level);
            return;
        }
        const item = toolbar.querySelector(`collab-nav-2-item[data-service="${service}"]`) as HTMLElement;
        if (item) item.click();
        return;

    }

    selectLevel(level: number) {

        const page = this.closest('collab-page');
        const nav = page?.querySelector('collab-nav-1') as HTMLElement;

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
        const mlsNav2 = this.closest('collab-nav-3')?.previousElementSibling as IMlsNav2 | null;
        return mlsNav2;
    }

    private getNav3ServiceContent() {
        const parentToolbarContent = this.closest('collab-nav-3-service') as IToolbarContent | null;
        return parentToolbarContent;
    }

    private getNav3Service() {
        const parentToolbarContent = this.closest('collab-nav-3') as IMlsNav3 | null;
        return parentToolbarContent;
    }

    private getTooltip() {
        const tooltip = document.querySelector('collab-tooltip') as ITooltipElement | null;
        return tooltip;
    }

    private getServiceItemNav(): IMlsNav2Item | null {
        const toolbar = this.getMlsNav2();
        if (!toolbar) return null;
        const content = this.getNav3ServiceContent();
        if (!content) return null;
        const dataservice = content.getAttribute('data-service');
        const item = toolbar.querySelector(`collab-nav-2-item[data-service="${dataservice}"]`) as IMlsNav2Item;
        return item;
    }

}

export interface IMenuKeyValue {
    [key: string]: string
}
export interface IIconsKeyValue {
    [key: string]: string
}

export interface IButtonsKeyValue {
    [key: string]: string
}

export type IClickLinkCallBack = (op: string) => boolean | undefined;
export type IClickIconCallBack = (op: string) => void | undefined;
export type IClickTitleCallBack = (title: string) => void | undefined;
export type IClickButtonCallBack = (op: string, opMenu?:string) => boolean;

export type ISetMode = (mode: IMode | null, page?: HTMLElement) => void;
export type IGetLastMode = () => IMode;
export type IMode =
    'initial' // show siblings with hamburguer icon
    | 'page' // show page (About ...) with close icon
    | 'editor'; // show siblings with close icon

export interface IMenu {
    title: IMenuTitle | string,
    actions: IMenuKeyValue,
    icons: IIconsKeyValue,
    buttons?: IButtonsKeyValue,

    actionDefault?: string,
    iconDefault?: string,
    onClickTitle?: IClickTitleCallBack,
    onClickLink?: IClickLinkCallBack,
    onClickIcon?: IClickIconCallBack,
    onClickButton?: IClickButtonCallBack,

    setMode?: ISetMode,
    setIconActive?: (op: string) => void,
    setMenuActive?: (op: string) => void,
    closeMenu?: Function,
    getLastMode?: IGetLastMode,
    lastIcon?: string,
    updateTitle?: Function,
}

export interface IMenuTitle {
    text: string,
    icon: string
}

export interface IToolbarContent extends HTMLElement {
    layout: Function
}

export interface ITooltipElement extends HTMLElement {
    tooltip: (el: HTMLElement) => void
}

export interface IMlsNav2 extends HTMLElement {
    toogleBadge: (show: boolean, serviceName: string) => void
}

export interface IMlsNav3 extends HTMLElement {
    getActiveInstance: (position: 'left' | 'right') => ServiceBase | undefined
}

export interface IMlsNav2Item extends HTMLElement {
    show: (show: boolean) => void
}

export interface IService {
    widget: string,
    state: ICollabServiceState,
    icon: string,
    tooltip: string,
    visible: boolean,
    position: ICollabServicePosition,
    level: number[],
    tags?: string[],
    classname?: ICollabServiceClass,
    isStatic?: boolean,
    customConfiguration?: IServiceCustom
}

export type IServiceCustom = {
    [key: number]: IServiceCustomByPosition | IServiceCustomPlace
}
export type IServiceCustomByPosition = {
    right?: IServiceCustomPlace,
    left?: IServiceCustomPlace,
}

export interface IServiceCustomPlace {
    tooltip?: string,
    visible?: boolean,
    state?: ICollabServiceState,
    classname?: ICollabServiceClass,
    show?: boolean
}

export interface IToolbarChangeEvent {
    level: number,
    position: 'left' | 'right',
    from: string,
    to: string
}

export type ICollabServicePosition = "left" | "right" | "all"
export type ICollabServiceState = "foreground" | "background"
export type ICollabServiceClass = "separator-left" | "separator-right"