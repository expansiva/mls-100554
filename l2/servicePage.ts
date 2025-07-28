/// <mls shortName="servicePage" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

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

@customElement('service-page-100554')
export class ServicePage100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @property() activeTab: ITabType = 'icDetails';
    @property() pluginNav: string = '';
    @property() pluginProp: string = '';
    @property() pluginsIA: { [key: string]: mls.plugin.MenuAction[] } = {};
    @property() pluginIALoaded: boolean = false;


    constructor() {
        super();
        this.setEvents();
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
    }

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
                { text: 'Details', icon: '3f' },
                { text: 'Navigation', icon: 'f041' },
                { text: 'Properties', icon: 'f0ce' },
                { text: 'IA', icon: 'f5dc' },

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
        await this.setPluginIA();
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
            case 'icIA':
                return this.renderIA();
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

    renderIA() {

        const keys = Object.keys(this.pluginsIA);
        return html`

            ${!this.pluginIALoaded
                ? html`<div>${this.msg.loading}</div>`
                : html`
                <div>
                    ${repeat(keys, (
                    (key: string, idx: number) => key + idx) as any,
                    ((item: string, index: any) => {
                        return html`<collab-panel-100554 .myData=${this.pluginsIA[item]}>
                    </collab-panel-100554>`;
                    }) as any
                )}
                </div>`
            }
        `
    }

    //---------IMPLEMENTATION------------

    private async loadPlugins() {

        const { project } = mls.actual[5];
        if (!project) return;
        await mls.plugin.loadAll(project, true);
        const plgNav = mls.plugin.getAllMenuActions(project, { scope: 'l3PageNavigation' } as any);
        const plgProp = mls.plugin.getAllMenuActions(project, { scope: 'l3PageProperties' } as any);
        const plgNavName = plgNav[0] ? plgNav[0].widget : '';
        const plgPropName = plgProp[0] ? plgProp[0].widget : '';
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
    }

    private async setPluginIA() {

        const { project } = mls.actual[5];
        if (!project) return;
        let array: any[] = [];
        await mls.plugin.loadAll(project, false);
        array = mls.plugin.getAllMenuActions(project, { scope: 'l3PageAI' } as any);

        array.forEach((item: mls.plugin.MenuAction) => {
            const cat = item.category as string;
            if (!this.pluginsIA[cat]) this.pluginsIA[cat] = [item]
            else this.pluginsIA[cat].push(item);
        });

        this.pluginIALoaded = true;
        this.requestUpdate();
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

export type ITabType = 'icDetails' | 'icNavigation' | 'icProperties' | 'icIA';

enum ESceneries {
    'icDetails' = 0,
    'icNavigation' = 1,
    'icProperties' = 2,
    'icIA' = 3,
} 