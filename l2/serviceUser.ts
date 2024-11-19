/// <mls shortName="serviceUser" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

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

    @query('details') firstDetails: HTMLDetailsExplore | undefined;


    public details: IService = {
        icon: '&#xf4fe',
        state: 'foreground',
        position: 'right',
        tooltip: 'User',
        visible: true,
        widget: '_100554_serviceUser',
        level: [0]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as IScenery;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            Settings: 'Settings;e521',
        },
        iconDefault: 'Settings',
        iconMenuType: 'full',
        actionDefault: '', // call after close icon clicked
        setMode: undefined,
        updateTitle: undefined,
        getLastMode: undefined,
        lastIcon: undefined,
        setIconActive: undefined,
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    async firstUpdated() {
        this.setMyData();
        if (this.activeTab === 'Settings') {
            await this.updateComplete;
            if (this.firstDetails) this.firstDetails.click();
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

    private async setMyData() {

        const prj = mls.actual[5].project;
        if (!prj) return;
        let array: any[] = [];
        await mls.plugin.loadAll(prj, false);
        array = mls.plugin.getAllMenuActions(prj, { scope: 'l5UserSettings' } as any);
        array.forEach((item: mls.plugin.MenuAction) => {
            const cat = item.category as string;
            if (!this.data[cat]) this.data[cat] = [item]
            else this.data[cat].push(item);
        });

        this.requestUpdate();

    }

}

interface HTMLDetailsExplore extends HTMLDetailsElement {
    data: mls.plugin.MenuAction
}

type IScenery = 'Settings'
