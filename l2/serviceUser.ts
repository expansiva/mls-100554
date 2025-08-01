/// <mls shortName="serviceUser" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, repeat, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { loadPluginProject } from './_100554_libCommom';
import './_100554_collabPanel';
import './_100554_collabPanelItem';

/// **collab_i18n_start**
const message_pt = {
    installPlugin: 'Explore e adicione novos plug-ins',
}

const message_en = {
    installPlugin: 'Explore and add new plugins',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-user-100554')
export class ServiceUser100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private data: { [key: string]: mls.plugin.MenuAction[] } = {};

    @property() activeTab: IScenery = 'Settings';

    @property() plugin: string = '';

    @query('collab-panel-100554') collabPanel: LitElement | undefined;

    public details: IService = {
        icon: '&#xf4fe',
        state: 'foreground',
        position: 'right',
        tooltip: 'User',
        visible: true,
        widget: '_100554_serviceUser',
        level: [0]
    }

    public onClickMain(op: string) {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(op: number): void {
        this.activeTab = EScenery[op] as IScenery;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'full',
            selected: 0,
            options: [
                { text: 'Settings', icon: 'f013' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),

    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    async updated(changedP: any) {
        super.updated(changedP);
        if (this.plugin !== "" && this.collabPanel && this.visible === 'true') {
            await this.updateComplete;
            await this.collabPanel.updateComplete;
            const item = this.querySelector(`collab-panel-item-100554[widget="${this.plugin}"]`) as HTMLElement;
            if (item) item.click();
        }
    }

    async firstUpdated() {
        await this.setMyData();
        this.requestUpdate();
        await this.updateComplete;
        if (this.plugin && this.collabPanel) {
            await this.collabPanel.updateComplete;
            const item = this.querySelector(`collab-panel-item-100554[widget="${this.plugin}"]`) as HTMLElement;
            if (item) item.click();
            this.plugin = '';
        }
    }


    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            ${this.renderContent()}
        `;
    }

    private renderContent() {
        switch (this.activeTab) {
            case 'Settings':
                return this.renderSettings();
            default:
                return html``;
        }
    }

    private renderSettings() {

        const keys = Object.keys(this.data);
        return html`
        <div>
            ${repeat(keys, (
            (key: string, idx: number) => key + idx) as any,
            ((item: string, index: any) => {

                return this.renderPanel(item, index);

            }) as any
        )}
        </div>`

    }

    private renderPanel(key: string, index: number) {
        return html`
            <collab-panel-100554 .myData=${this.data[key]}></collab-panel-100554>
        `
    }

    private baseProject = 100554;

    private async setMyData() {

        const prj = mls.actualProject;
        if (!prj) return;
        let array = await loadPluginProject(prj, 'l5UserSettings', false);

        array.forEach((item: any) => {
            const cat = item.category as string;
            item.mode = 'tag';
            if (!this.data[cat]) this.data[cat] = [item]
            else this.data[cat].push(item);
        });

        this.requestUpdate();

    }

}


enum EScenery {
    'Settings' = 0
}

type IScenery = 'Settings'
