/// <mls shortName="serviceFca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initCollabFCATree } from './_100554_collabFcaTree';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-fca-100554')
export class ServiceFca100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    static styles = css``

    @property()
    activeTab: ITabType = 'AboutFCA';

    constructor() {
        super();
        initCollabFCATree;
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

        /*if (!visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive('Navigation');
        }*/

        if (visible && reinit) {

            if (this.activeTab !== 'Navigation') return;
            const elTree = this.querySelector('collab-fca-tree-100554');
            if (elTree && (elTree as any).forceUpdate) (elTree as any).forceUpdate();
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

        return html`<collab-fca-tree-100554 .myParent=${this}></collab-fca-tree-100554>`;
    }

    renderProperties() {
        return html`<div>In development: Properties</div>`;
    }

    renderStyles() {
        return html`<div></div>`;
    }

    renderAnimation() {
        return html`<div>In development: Animation</div>`;
    }

    renderAboutFCA() {
        return html`<div>In develpoment: AboutFCA</div>`;
    }

    //------------IMPLEMENTATION------------------

    private setEvents(): void {
        mls.events.addListener(4, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
        mls.events.addListener(4, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setIconActive) {
            this.openMe();
            this.menu.setIconActive(data.op);
        }

    }

    private onWCDEventChange(ev: mls.events.IEvent) {

        if (this.activeTab !== 'Navigation') return;

        const elTree = this.querySelector('collab-fca-tree-100554');
        if (elTree && (elTree as any).forceUpdate) (elTree as any).forceUpdate();

    }



}

export type ITabType = 'Navigation' | 'Properties' | 'Styles' | 'Animation' | 'AboutFCA'

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}



