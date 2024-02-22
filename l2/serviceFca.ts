/// <mls shortName="serviceFca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-fca-100554')
export class ServiceFca100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf2db',
        state: 'foreground',
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
        setMode: undefined, // child will set this
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    activeTab: ITabType = 'AboutFCA';

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

    setEvents(): void {
        mls.events.addListener(this.level, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
    }

    onWCDEvent(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data = JSON.parse(ev.desc);
        if (this.menu.setIconActive) this.menu.setIconActive(data.op);
    }

    renderNavigation() {
        return html`<div>In develpoment : Navigation</div>`;
    }

    renderProperties() {
        return html`<div>In develpoment: Properties</div>`;
    }

    renderStyles() {
        return html`<div>In develpoment: Styles</div>`;
    }

    renderAnimation() {
        return html`<div>In develpoment: Animation</div>`;
    }

    renderAboutFCA() {
        return html`<div>In develpoment: AboutFCA</div>`;
    }
}

type ITabType = 'Navigation' | 'Properties' | 'Styles' | 'Animation' | 'AboutFCA'

