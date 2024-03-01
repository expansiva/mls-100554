/// <mls shortName="serviceFca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

//teste
@customElement('service-fca-100554')
export class ServiceFca100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property()
    activeTab: ITabType = 'AboutFCA';

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf2db',
        state: 'background',
        position: 'left',
        tooltip: 'Service FCA',
        visible: true,
        widget: '_100554_serviceFca',
        level: [4]
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            AboutFCA: 'About FCA;3f',
            Navigation: 'Navigation;f041',
            Properties: 'Properties;f0ce',
            Styles: 'Styles;f5ad',
            Animation: 'Animation;f5ae',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'AboutFCA',
        setMode: undefined, // child will set this
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (!visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive('Navigation');
        }

    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'Navigation':
                return this.renderNavigation();
            case 'Properties':
                return this.renderProperties();
            case 'Styles':
                return this.renderStyles();
            case 'Animation':
                return this.renderAnimation();
            case 'AboutFCA':
                return this.renderAboutFCA();
            default:
                return html``;
        }
    }

    renderNavigation() {
        //console.info(this.getFCAComponents());
        return html`<div>In develpoment: Navigation</div>`;
    }

    renderProperties() {
        return html`<div>In develpoment: Properties</div>`;
    }

    renderStyles() {
        return html`<div></div>`;
    }

    renderAnimation() {
        return html`<div>In develpoment: Animation</div>`;
    }

    renderAboutFCA() {
        return html`<div>In develpoment: AboutFCA</div>`;
    }

    //------------IMPLEMENTATION------------------

    private setEvents(): void {
        mls.events.addListener(4, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setIconActive) {
            this.openMe();
            this.menu.setIconActive(data.op);
        }

    }

    private servicePreview: HTMLElement | undefined;
    private setServicePreview(): void {
        if (this.servicePreview) return;

        const nav3 = this.nav3Service;
        if (!nav3) return;

        const wc = (nav3 as any).getActiveInstance('right');
        if (!wc) return;
        
        if (wc.tagName.toLowerCase() !== 'service-preview-100554') return;
        else {
            this.servicePreview = wc.parentElement.querySelector('service-preview-view-100554');
        }


    }

    private getFCAComponents(): HTMLElement[] {

        this.setServicePreview();

        let ret: HTMLElement[] = [];

        if (!this.servicePreview || !this.servicePreview.shadowRoot) return ret;

        const iframe = this.servicePreview.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        if (!iframe) return ret;

        const scope = iframe.contentDocument?.body;
        if (!scope) return ret;

        const reentrance = (el: HTMLElement | HTMLElement) => {

            const tag = el.tagName.toLowerCase();
            if (tag.startsWith('fca-')) {

                ret.push(el as HTMLElement);

            }

            const isGroup = el.getAttribute('isFCAGroup');

            if (!isGroup || isGroup === 'false') {
                Array.from(el.children).forEach(i => {
                    reentrance(i as HTMLElement);
                })
            }

        }

        Array.from(scope.children).forEach(i => {
            reentrance(i as HTMLElement);
        })

        return ret;

    }

}

export type ITabType = 'Navigation' | 'Properties' | 'Styles' | 'Animation' | 'AboutFCA'

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}

