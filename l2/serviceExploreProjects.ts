/// <mls shortName="serviceExploreProjects" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, queryAll, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import './_100554_pluginCreateNewProject'

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

@customElement('service-explore-projects-100554')
export class ServiceExploreProjects100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @property() projectCreated: boolean = false;
    @property() state: IServiceList = { history: [], orgs: [], projectSelected: undefined };
    @property() lastPrjId: string | null | undefined;
    @queryAll('.serviceListProjects .serviceListList li') list: NodeListOf<HTMLElement> | undefined;
    @queryAll('.serviceListProjects .serviceListTitle') titleList: NodeListOf<HTMLElement> | undefined;
    @query('.l5-project-list-history') historieEl: HTMLElement | undefined;

    @property() activeTab: string = 'IMyProject';
    //----------CONFIG SERVICE------------------

    public details: IService = {
        icon: '&#xf0b1',
        state: 'background',
        position: 'left',
        tooltip: 'Projects',
        visible: true,
        widget: '_100554_serviceExploreProjects',
        level: [6]
    }

    public onClickMain(op: string) {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        this.activeTab = ETabs[index];
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Explore', icon: 'f542' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible) {
            this.requestUpdate();
        }
    }

    //----------EVENTS---------------------

    private setEvents() {
        mls.events.addEventListener([6], ['ProjectExplore'] as any, (details) => {
            this.openService('_100554_serviceExploreProjects', 'left', 6);
        });
    }


    //----------COMPONENT------------------

    connectedCallback() {
        super.connectedCallback();
        this.setEvents();
    }

    createRenderRoot() {
        return this;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'IExplore':
                return this.renderExplore();
            default:
                return html``;
        }
    }

    renderExplore() {
        this.firedetail('<projects-100554></projects-100554>');
        return html`<h3 style="padding:2rem">Explore others projects , in development</h3>`
    }

    //----------IMPLEMENTS------------------

    private async firedetail(msg: string) {

        mls.events.fire(
            6,
            'PluginDetails' as any,
            JSON.stringify(
                {
                    htmlText: `<div>${msg}</div>`

                }
            ),
            0
        );
    }

}

enum ETabs {
    'IExplore' = 0,
}

interface IStateOrg {
    key: string,
    name: string,
    created_at: string,
    description: string,
    projects: IInfoPrj[]
}

interface IInfoPrj {
    project: number,
    name: string,
    doSelect: boolean,
}

interface IServiceList {
    history: IHistory[],
    orgs: IStateOrg[],
    projectSelected: number | undefined
}

interface IHistory {
    project: number,
    name: string,
    doSelect: boolean,
}
interface IParamsEvent {
    emitter: 'right' | 'left',
    value: number
}
