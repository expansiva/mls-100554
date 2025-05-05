/// <mls shortName="serviceCollabMessages" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { addCoachMark, ICoachMarks } from './_100554_coachMarks';
import { html, css, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { CollbaMessagesAddResponse } from './_100554_collabMessagesAdd';
import { saveUserIdLocalStorage } from "./_100554_aiAgentHelper";

import { listThreads, addThread, updateThreads, listUsers, updateUsers } from './_100554_msgDBController';
import './_100554_collabMessagesAdd';
import './_100554_collabMessagesConnect';
import './_100554_wcImage';
import './_100554_collabTasks';
import './_100554_collabMessagesSettings';


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
    @property() activeScenerie: IScenery = 'tabs';
    @state() userPerfil: mls.msg.User | undefined;
    @state() userThreads: IThreadData = {}

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
        if (this.activeTab === ETabs[index]) {
            this.activeTab = 'Loading';
            setTimeout(() => {
                this.activeTab = ETabs[index] as ITabType;
            }, 0)
            return;
        };
        this.activeTab = ETabs[index] as ITabType;
    }

    public onClickMain(op: string) {
        if (op === 'opReset') this.resetOnBoarding();
        if (op === 'opSettings') this.openSettings();
    }

    public onClickTools(op: string) {
        if (op === 'toolAdd') this.openAdd();
        else throw new Error('Invalid option')
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opReset: { text: 'Reset onboarding', icon: 'f2ea' },
            opSettings: { text: 'Settings', icon: 'f085' },

        },
        tools: {
            toolAdd: {
                type: 'link',
                options: [
                    { text: 'Add Thread', icon: '2b' },
                ]
            }

        },
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
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
        onClickTools: this.onClickTools.bind(this),

    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        this.userPerfil = await this.getUser();
        saveUserIdLocalStorage(this.userPerfil.userId);
        await this.getThreadFromLocalDB();
        this.updateThreads();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        // if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab]);
        return this.renderTabs();
    }


    renderTabs() {
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
            case 'Add':
                return this.renderAdd();
            case 'Loading':
                return html`${this.msg.loading}`
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
        return html`<collab-tasks-100554></collab-tasks-100554>`
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
        return html`<collab-messages-connect-100554 
            style="height:${this.style.height}"
            .userThreads=${{
                CONNECT: Object.keys(this.userThreads)
                    .filter((key) => this.userThreads[key].thread.group === 'CONNECT')
                    .map((key) => this.userThreads[key])
            }} 
            userId=${this.userPerfil?.userId} 
        ></collab-messages-connect-100554>`
    }


    renderAdd() {
        return html`
            <collab-messages-add-100554 
                userId=${this.userPerfil?.userId} 
                .afterAdd=${this.onAfterAdd}
            ></collab-messages-add-100554>`
    }



    private openAdd() {
        this.activeTab = 'Add';
        if (this.menu.tabs) this.menu.tabs.selected = ETabs.Add;
        if (this.menu.closeMenu) this.menu.closeMenu();
    }

    private onAfterAdd(response: CollbaMessagesAddResponse) {
        if (!response.ok) {
            this.setError(response.msg || 'Error on add thread');
            console.error(response.msg);
            return;
        }

        if (response.data) addThread(response.data)
    }

    private async getUser(): Promise<mls.msg.User> {
        try {
            const response = await mls.api.msgGetUserUpdate({ userId: "" });
            return response.user;
        } catch (err: any) {
            this.setError(err.message);
            throw new Error(err.message);
        }
    }


    private async updateThreads() {
        if (!this.userPerfil?.userId) {
            this.setError('Invalid userId');
            return;
        }

        const userId = this.userPerfil.userId;
        const userThreads: string[] = this.userPerfil.threads;

        for await (let threadId of userThreads) {
            if (this.userThreads[threadId]) {
                continue;
            }
            const threadInfo = await this.getThreadInfo(threadId, userId);
            this.userThreads[threadId] = threadInfo;
            updateThreads([threadInfo.thread]);
            updateUsers(threadInfo.users);
        }

        this.requestUpdate();

    }

    private async getThreadFromLocalDB() {
        const threads = await listThreads();
        const users = await listUsers();

        for (let thread of threads) {
            if (this.userThreads[thread.threadId]) {
                return;
            }
            const threadUsers: mls.msg.User[] = [];
            thread.users.forEach((user) => {
                const userDB = users.find((us) => us.userId === user.userId);
                if (userDB) threadUsers.push(userDB);
            })
            this.userThreads[thread.threadId] = {
                thread: thread,
                users: threadUsers
            }
        }
    }

    private async getThreadInfo(threadId: string, userId: string): Promise<IThreadInfo> {
        try {
            const response = await mls.api.msgGetThreadUpdate({
                threadId,
                userId
            });
            return response;

        } catch (err: any) {
            this.setError('Erro ao buscar threads: ' + err);
            throw new Error(err.message)
        }
    }


    private execCoachMarks(name: string) {

        if (this.visible === 'false') return;

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

    private resetOnBoarding() {
        const ls = localStorage.getItem('coach-marks-100554');
        if (!ls) return;
        const data: string[] = JSON.parse(ls);

        ['CRM', 'Tasks', 'Docs', 'Connect', 'Apps'].forEach((tab) => {
            const indexToRemove = data.findIndex((item) => item === `serviceCollabMessage${tab}`);
            if (indexToRemove !== -1) {
                data.splice(indexToRemove, 1);
            }
        });

        localStorage.setItem('coach-marks-100554', JSON.stringify(data));
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    private openSettings() {
        if (this.menu.setTabActive) this.menu.setTabActive(-1);

        if (this.menu.setMode) {
            const settings = document.createElement('collab-messages-settings-100554');
            (settings as any)['serviceBase'] = this;
            this.menu.setMode('page', settings);
        }
        return true;
    }

}

type IThreadData = { [key: string]: IThreadInfo }

interface IThreadInfo {
    thread: mls.msg.Thread,
    users: mls.msg.User[]
}

enum ETabs {
    'CRM' = 0,
    'Tasks' = 1,
    'Docs' = 2,
    'Connect' = 3,
    'Apps' = 4,
    'Add' = 5,
    'Loading' = 65,
}


type ITabType = 'CRM' | 'Tasks' | 'Docs' | 'Connect' | 'Apps' | 'Add' | 'Loading';
type IScenery = 'tabs' | 'settings'
