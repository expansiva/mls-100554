/// <mls shortName="servicePage" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

import "./_100554_pluginPrototypeImprove";
import "./_100554_pluginExploreList";
import "./_100554_pluginPageNavigation";

/// **collab_i18n_start**
const message_pt = {
    detailsHint: 'Detalhes do objeto selecionado na página, - help , - ajustes widget como mutations (ica), - ajustes dinâmicos (wcd) , por favor selecione um item na página',
    selectPlugin: 'Por favor selecione um plugin IA',
    loading: 'Carregando...'

}

const message_en = {
    detailsHint: 'Details of the selected object on the page, - help , - widget settings like mutations (ica), - dynamic settings (wcd), please select an item on the page',
    selectPlugin: 'Please select a plugin IA',
    loading: 'Loading...'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-page-100554')
export class ServicePage100554 extends ServiceBase {


    constructor() {
        super();
        mls.events.addListener(4, 'FileAction', this.onFileAction.bind(this));
    }

    private msg: MessageType = messages['en'];

    @property() activeTab: ITabType = 'icNavigation';


    //-------SERVICE---------------

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Page',
        visible: true,
        widget: '_100554_servicePage',
        level: [5]
    }


    public onClickMain(op: string) {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        this.activeTab = ESceneries[index] as ITabType;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Explore', icon: 'e521' },
                { text: 'Navigation', icon: 'f041' },
                { text: 'Improve', icon: 'f5dc' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    //-------COMPONENT--------------

    createRenderRoot() {
        return this;
    }


    async firstUpdated() {
        if (this.menu.setTabActive) this.menu.setTabActive(ESceneries[this.activeTab]);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {

        switch (this.activeTab) {
            case 'icExplorer':
                return this.renderExplorer();
            case 'icNavigation':
                return this.renderNavigation();
            case 'icImprove':
                return this.renderImprove();
            default:
                return html``;
        }
    }

    renderNavigation() {
        return html`<plugin-page-navigation-100554></plugin-page-navigation-100554>`;
    }

    renderExplorer() {
        return html`<plugin-explore-list-100554 autoprepare="true" .service=${this}></plugin-explore-list-100554>`;
    }

    renderImprove() {
        return html`<plugin-prototype-improve-100554></plugin-prototype-improve-100554>`;
    }


    private onFileAction(ev: mls.events.IEvent) {
        if (ev.level !== 4 || (ev.type !== 'FileAction')) return;
        if (this.menu && this.menu.setTabActive) this.menu.setTabActive(ESceneries.icNavigation);
    }


}

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}

export type ITabType = 'icExplorer' | 'icNavigation' | 'icImprove';

enum ESceneries {
    'icExplorer' = 0,
    'icNavigation' = 1,
    'icImprove' = 2,
} 