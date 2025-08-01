/// <mls shortName="serviceCollabMessages" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { addCoachMark, ICoachMarks } from './_100554_coachMarks';
import { html, css, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { saveUserIdLocalStorage } from "./_100554_aiAgentHelper";
import { listThreads, addThread, listUsers, updateUsers } from './_100554_msgDBController';
import { saveLastTab, loadLastTab } from "./_100554_collabMessageHelper";

import './_100554_collabMessagesAdd';
import './_100554_collabMessagesChat';
import './_100554_collabTasks';
import './_100554_collabMessagesSettings';
import './_100554_collabMessagesFindtask';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Conectar',
}

const message_en = {
    loading: 'Loading...',
    crm: 'CRM',
    tasks: 'Tasks',
    docs: 'Docs',
    connect: 'Connect',
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

    @property() dataLocal: IDataLocal = { lastTab: 'CRM' };
    @property() activeTab: ITabType = 'CRM';
    @property() activeScenerie: IScenery = 'tabs';
    @state() isLoadingThread: boolean = false;
    @state() userPerfil: mls.msg.User | undefined;
    @state() userThreads: IThreadData = {}

    groupSelected: ITabType = 'CRM';

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
        saveLastTab(this.activeTab);
    }

    public onClickMain(op: string) {
        if (op === 'opReset') this.resetOnBoarding();
        if (op === 'opSettings') this.openSettings();
        if (op === 'opFindTask') this.openFindTask();

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
            opFindTask: { text: 'Find Task', icon: 'f002' },
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
            selected: ETabs.Loading,
            options: [
                { text: this.msg.crm, icon: 'f095' },
                { text: this.msg.tasks, icon: 'f0ae' },
                { text: this.msg.connect, icon: 'f0c1' },
                { text: this.msg.docs, icon: 'f02d' },
            ]
        },
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
        onClickTools: this.onClickTools.bind(this),

    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    connectedCallback() {
        super.connectedCallback();
        this.dataLocal.lastTab = loadLastTab() as ITabType;
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);

    }

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('activeTab') && ['CRM', 'TASK', 'DOCS', 'CONNECT', 'APPS'].includes(this.activeTab)) {
            this.userPerfil = await this.getUser();
            saveUserIdLocalStorage(this.userPerfil.userId);
            await this.getThreadFromLocalDB();
            this.updateThreads();
        }

        if (changedProperties.has('dataLocal')) {

            if (this.menu.setTabActive && this.activeTab !== 'Loading') this.menu.setTabActive(ETabs[this.dataLocal.lastTab])
        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return this.renderTabs();
    }


    renderTabs() {
        switch (this.activeTab) {
            case 'CRM':
                return this.renderCRM();
            case 'TASK':
                return this.renderTasks()
            case 'DOCS':
                return this.renderDocs();
            case 'CONNECT':
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
        this.groupSelected = 'CRM';
        this.execCoachMarks('CRM');
        return html`<collab-messages-chat-100554 
            
            .isLoadingThread= ${this.isLoadingThread}
            group="CRM"
            .userThreads=${{
                CRM: Object.keys(this.userThreads)
                    .filter((key) => this.userThreads[key].thread.group === 'CRM')
                    .map((key) => this.userThreads[key])
            }} 
            userId=${this.userPerfil?.userId} 
        ></collab-messages-chat-100554>`
    }

    renderTasks() {
        this.groupSelected = 'TASK';
        this.execCoachMarks('Tasks');
        return html`<collab-tasks-100554></collab-tasks-100554>`
    }
    //style="height:${this.style.height}"

    renderDocs() {
        this.groupSelected = 'DOCS';
        this.execCoachMarks('Docs');
        return html`<collab-messages-chat-100554 
            
            .isLoadingThread= ${this.isLoadingThread}
            group="DOCS"
            .userThreads=${{
                DOCS: Object.keys(this.userThreads)
                    .filter((key) => this.userThreads[key].thread.group === 'DOCS')
                    .map((key) => this.userThreads[key])
            }} 
            userId=${this.userPerfil?.userId} 
        ></collab-messages-chat-100554>`
    }

    renderConnect() {
        this.groupSelected = 'CONNECT';
        this.execCoachMarks('Connect');
        return html`<collab-messages-chat-100554 
            
            .isLoadingThread= ${this.isLoadingThread}
            group="CONNECT"
            .userThreads=${{
                CONNECT: Object.keys(this.userThreads)
                    .filter((key) => this.userThreads[key].thread.group === 'CONNECT')
                    .map((key) => this.userThreads[key])
            }} 
            userId=${this.userPerfil?.userId} 
        ></collab-messages-chat-100554>`
    }


    renderAdd() {

        const onAddSuccess = () => {
            this.activeTab = this.groupSelected;
        }

        return html`
            <collab-messages-add-100554 
                .onAddSuccess=${onAddSuccess.bind(this)}
                .group=${this.groupSelected}
                userId=${this.userPerfil?.userId} 
            ></collab-messages-add-100554>`
    }

    private openAdd() {
        this.activeTab = 'Add';
        if (this.menu.tabs) this.menu.tabs.selected = ETabs.Add;
        if (this.menu.closeMenu) this.menu.closeMenu();
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

        this.isLoadingThread = true;
        const userId = this.userPerfil.userId;
        const userThreads: string[] = this.userPerfil.threads;

        for await (let threadId of userThreads) {
            if (this.userThreads[threadId]) {
                continue;
            }
            const threadInfo = await this.getThreadInfo(threadId, userId);
            this.userThreads[threadId] = threadInfo;
            addThread(threadInfo.thread);
            updateUsers(threadInfo.users);
        }

        this.isLoadingThread = false;
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
                    text: `<div style="padding:1rem;"><img src="/100554/l3/assets/coachMarkCollabMessages${name}.png"  style="display: block; max-width: 100%; height: auto;"></img></div>`,
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

    private openFindTask() {
        if (this.menu.setTabActive) this.menu.setTabActive(-1);
        if (this.menu.setMode) {
            const settings = document.createElement('collab-messages-findtask-100554');
            (settings as any)['serviceBase'] = this;
            this.menu.setMode('page', settings);
        }
        return true;
    }



}

interface IDataLocal {
    lastTab: ITabType
}

type IThreadData = { [key: string]: IThreadInfo }

interface IThreadInfo {
    thread: mls.msg.Thread,
    users: mls.msg.User[]
}

enum ETabs {
    'CRM' = 0,
    'TASK' = 1,
    'CONNECT' = 2,
    'DOCS' = 3,
    'Add' = 4,
    'Loading' = 5,
}


type ITabType = 'CRM' | 'TASK' | 'DOCS' | 'CONNECT' | 'Add' | 'Loading';
type IScenery = 'tabs' | 'settings' | 'findTask'
