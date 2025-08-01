/// <mls shortName="serviceOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { convertFileNameToTag } from './_100554_utilsLit';
import "./_100554_wcdToolboxItemActionEditAttrOut";

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

@customElement('service-organism-100554')
export class ServiceOrganism100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    @property({ type: String }) msize = '';

    @property() activeTab: ITabType = 'icDetails';
    @property() pluginNav: string = '';
    @property() pluginProp: string = '';
    @property() pluginStyle: string = '';


    constructor() {
        super();
        this.setEvents();
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
    }

    //-------SERVICE---------------

    public details: IService = {
        icon: '&#xf471',
        state: 'foreground',
        position: 'right',
        tooltip: 'Organism',
        visible: true,
        widget: '_100554_serviceOrganism',
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
                { text: 'Navigation', icon: 'f041' },
                { text: 'Properties', icon: 'f0ce' },
                { text: 'Style', icon: 'f53f' },
                { text: 'Details', icon: '3f' }
                
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
        await this.loadPlugins();
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
            case 'icNavigation':
                return this.renderNavigation();
            case 'icProperties':
                return this.renderProperties();
            case 'icDetails':
                return this.renderDetails();
            case 'icStyle':
                return this.renderStyle();
            default:
                return html``;
        }
    }

    renderNavigation() {
        // this.openService('_100554_servicePreview', 'right', 3);
        return html` ${this.pluginNav ? unsafeHTML(`<${this.pluginNav} .service=${this}></${this.pluginNav}>`) : `<div>${this.msg.loading}</div>`}`;
    }

    renderProperties() {
        // this.openService('_100554_servicePreview', 'right', 3);
        return html`<wcd-toolbox-item-action-edit-attr-out-100554></wcd-toolbox-item-action-edit-attr-out-100554>`;
    }

    renderDetails() {
        return html`<div>${this.msg.detailsHint}</div>`;
    }

    renderStyle() {

        return html`<plugin-edit-style-l3-100554 .service=${this} msize="${this.msize}"></plugin-edit-style-l3-100554>`;
    }

    //---------IMPLEMENTATION------------

    private async loadPlugins() {

        const  project  = mls.actualProject;
        if (!project) return;
        await mls.plugin.loadAll(project, true);
        const plgNav = mls.plugin.getAllMenuActions(project, { scope: 'l3PageNavigation' } as any);
        const plgProp = mls.plugin.getAllMenuActions(project, { scope: 'l3PageProperties' } as any);
        const plgStyle = mls.plugin.getAllMenuActions(project, { scope: 'l3PageStyle' } as any);
        const plgNavName = plgNav[0] ? plgNav[0].widget : '';
        const plgPropName = plgProp[0] ? plgProp[0].widget : '';
        const plgStlpName = plgStyle[0] ? plgStyle[0].widget : '';

        if (plgNavName) {
            const { folder, project, shortName } = mls.l2.getPath(plgNavName);
            await import(`./_${project}_${shortName}`);
            this.pluginNav = convertFileNameToTag({ project, shortName, folder });
        }
        if (plgPropName) {
            const { folder, project, shortName } = mls.l2.getPath(plgPropName);
            await import(`./_${project}_${shortName}`);
            this.pluginProp = convertFileNameToTag({ project, shortName, folder });
        }

        if (plgStlpName) {
            const { folder, project, shortName } = mls.l2.getPath(plgStlpName);
            await import(`./_${project}_${shortName}`);
            this.pluginStyle = convertFileNameToTag({ project, shortName, folder });
        }
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setTabActive) {
            this.openMe();
            this.menu.setTabActive(ESceneries[data.op]);
        }

    }


}

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}

export type ITabType = 'icDetails' | 'icNavigation' | 'icProperties' | 'icStyle';

enum ESceneries {
    'icNavigation' = 0,
    'icProperties' = 1,
    'icStyle' = 2,
    'icDetails' = 3,
} 