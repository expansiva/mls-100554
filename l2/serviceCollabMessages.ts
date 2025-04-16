/// <mls shortName="serviceCollabMessages" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { addCoachMark, ICoachMarks } from './_100554_coachMarks';
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { propertyDataSource } from './_100554_icaLitElement';

import * as chatHelper from './_100554_aimChatHelper';
import './_100554_aimChatHeader';
import './_100554_aimChatRooms';
import './_100554_aimChatMessages';
import './_100554_aimChatMessage';
import './_100554_wcImage';


/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Conectar',
    apps: 'Apps',
}

const message_en = {
    loading: 'Loading...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Connect',
    apps: 'Apps',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-collab-messages-100554')
export class ServiceCollabMessages100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @property() activeTab: ITabType = 'CRM';
    @propertyDataSource({ type: String, reflect: true }) activeRoom: string | undefined;
    @propertyDataSource({ type: String, reflect: true }) activeMessage: string | undefined;
    @propertyDataSource({ type: String, reflect: true }) activeFilterRooms: string | undefined;

    constructor() {
        super();
        this.activeRoom = chatHelper.pathActiveRoom;
        this.activeMessage = chatHelper.pathActiveMessage;
        this.activeFilterRooms = chatHelper.pathActiveFilterRooms;
    }


    public details: IService = {
        icon: '&#xf086',
        state: 'foreground',
        position: 'right',
        tooltip: 'Collab Messages',
        visible: true,
        widget: '_100554_serviceCollabMessages',
        level: [0, 2, 3, 5]
    }

    public onClickTabs(index: number) {
        if (this.activeTab === ETabs[index]) return;
        this.activeTab = ETabs[index] as ITabType;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tools: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: ETabs.CRM,
            options: [
                { text: this.msg.crm, icon: 'f095' },
                { text: this.msg.tasks, icon: 'f0ae' },
                { text: this.msg.docs, icon: 'f02d' },
                { text: this.msg.connect, icon: 'f0c1' },
                { text: this.msg.apps, icon: 'f7d9' },
            ]
        },
        onClickTabs: this.onClickTabs.bind(this),

    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab]);

        switch (this.activeTab) {
            case 'CRM':
                return this.renderCRM();
            case 'Tasks':
                return this.renderTasks()
            case 'Apps':
                return this.renderApps();
            case 'Docs':
                return this.renderDocs();
            case 'Connect':
                return this.renderConnect();
            default:
                return html``;
        }
    }

    renderCRM() {
        this.execCoachMarks('CRM');
        return html`CRM`
    }

    renderTasks() {
        this.execCoachMarks('Tasks');

        const pathRoom = this.getAttribute('activeRoom');
        const pathMessage = this.getAttribute('activeMessage');
        const pathFilter = this.getAttribute('activeFilterRooms');

        const renderRooms = () => {
            return html`<aim-chat-rooms-100554 activeRoom="${pathRoom}" activeMessage="${pathMessage}" activeFilterRooms="${pathFilter}"></aim-chat-rooms-100554>`;
        }
        const renderMessages = () => {
            return html`<aim-chat-messages-100554 activeRoom="${pathRoom}" activeMessage="${pathMessage}" activeFilterRooms="${pathFilter}"></aim-chat-messages-100554>`;
        }
        const renderMessage = () => {
            return html`<aim-chat-message-100554 activeRoom="${pathRoom}" activeMessage="${pathMessage}" activeFilterRooms="${pathFilter}"></aim-chat-message-100554>`;
        }
        console.log('render servicecollabmessages, activerrom=', this.activeRoom, ', activeMessage=', this.activeMessage)

        return html`
            <aim-chat-header-100554
                activeRoom="${pathRoom}"
                activeMessage="${pathMessage}"
                activeFilterRooms="${pathFilter}">
            </aim-chat-header-100554>
            ${!this.activeRoom ? renderRooms() : !this.activeMessage ? renderMessages() : renderMessage()
            }
        `;

    }

    renderApps() {
        this.execCoachMarks('Apps');
        return html`Apps`
    }

    renderDocs() {
        this.execCoachMarks('Docs');
        return html`Docs`
    }

    renderConnect() {
        this.execCoachMarks('Connect');
        return html`Connect`
    }


    execCoachMarks(name: string) {
        const infoMark: ICoachMarks = {
            key: `serviceCollabMessage${name}`,
            transparency: "normal",
            fontSize: "1.1em",
            timeClose: 15,
            steps: [
                {
                    elementRef: `collab-nav-3-menu li[data-tooltip="${name}"]`,
                    text: `<div style="padding:1rem;"><wc-image-100554 src="/100554/l3/assets/coachMarkCollabMessages${name}.png"  style="display: block; max-width: 100%; height: auto;"></wc-image-100554></div>`,
                    position: "bottom",
                    marginV: 25,
                    marginH: 25,
                    arrow: "up",
                    duration: 15,
                    autoClose: true,

                },
            ]
        }
        addCoachMark(infoMark);
    }

}

enum ETabs {
    'CRM' = 0,
    'Tasks' = 1,
    'Docs' = 2,
    'Connect' = 3,
    'Apps' = 4,
}

type ITabType = 'CRM' | 'Tasks' | 'Docs' | 'Connect' | 'Apps';

