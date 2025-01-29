/// <mls shortName="serviceAim" project="100554" enhancement="_100554_enhancementLitService" groupName="service"/>

import { html, css, unsafeHTML, render, styleMap, repeat, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IToolbarChangeEvent } from './_100554_serviceBase';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { tasks, readTasks, getUserConfigs, saveUserConfigs, IAimColums } from './_100554_aimHelper';
import { findActions, ResponseFindActions } from './_100554_aimActionBase';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import * as chatHelper from './_100554_aimChatHelper';
import './_100554_aimChatHeader';
import './_100554_aimChatRooms';
import './_100554_aimChatMessages';
import './_100554_aimChatMessage';


/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    tasks: 'Tasks',
    titleTasks: 'Todas as tarefas de AI, últimas',
    chats: 'Chats',
    project: 'Projeto',
    titleProject: 'Salas com referencias ao projeto atual',
    docs: 'Docs',
    titleDocs: 'Salas com documentações e guias',
    add: 'Adicionar',
    titleAdd: 'por favor selecione abaixo para adicionar',
    notFoundReference: 'Referência não encontrada',
    noActionsToAdd: 'Nenhuma ação para adicionar',
    selectColumnsYouWant: 'Selecione as colunas que deseja visualizar',
    save: 'Salvar',
    cancel: 'Cancelar'
}
const message_en = {
    loading: 'Loading...',
    tasks: 'Tasks',
    titleTasks: 'All AI Tasks, last',
    chats: 'Chats',
    project: 'Project',
    titleProject: 'Rooms with references to the current project',
    docs: 'Docs',
    titleDocs: 'Rooms with documentation and guides',
    add: 'Add',
    titleAdd: 'please select below to add',
    notFoundReference: 'Not found reference',
    noActionsToAdd: 'No Actions to Add',
    selectColumnsYouWant: 'Select the columns you want to view',
    save: 'Save',
    cancel: 'Cancel'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-aim-100554')
export class ServiceAim100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    @property() activeTab: ITabType = 'Chats';
    @property({ reflect: true }) useContainerAdd = true; // scenary add list or add action 
    @property({ reflect: true }) actionToOpen: string = '';
    @property({ reflect: true }) actualServiceOpName: string = '';
    @property() isloading: boolean = true;
    @propertyDataSource({ type: String, reflect: true }) activeRoom: string | undefined;
    @propertyDataSource({ type: String, reflect: true }) activeMessage: string | undefined;
    @propertyDataSource({ type: String, reflect: true }) activeFilterRooms: string | undefined;

    actualServiceOpLevel: number = 0;

    constructor() {
        super();
        this.setEvents();
        this.activeRoom = chatHelper.pathActiveRoom;
        this.activeMessage = chatHelper.pathActiveMessage;
        this.activeFilterRooms = chatHelper.pathActiveFilterRooms;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab ]);
        if (this.actionToOpen) this.activeTab = 'Add'
        switch (this.activeTab) {
            case 'Tasks':
                return this.renderTasks();
            case 'Chats':
                return this.renderChats()
            case 'Project':
                return this.renderProject();
            case 'Docs':
                return this.renderDocs();
            case 'Add':
                const renderAddResult = this.renderAdd();
                Promise.resolve().then(() => {
                    this.checkIfHasActionToOpen();
                });
                return renderAddResult;
            default:
                return html``;
        }
    }


    public details: IService = {
        icon: '&#xf086', // '&#xf03a',
        state: 'foreground',
        position: 'all',
        tooltip: 'Collab Chat',
        visible: true,
        widget: '_100554_serviceAim',
        level: [0, 2, 3, 5]
    }

    get invertedPosition() { return this.position === 'left' ? 'right' : 'left' };

    public onClickMain(op: string) {
        if (op === 'opColumns') this.showConfigColumns();
        else if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        if (this.activeTab === ETabs[index]) return;
        this.activeTab = ETabs[index] as ITabType;
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: ETabs.Chats,
            options: [
                { text: this.msg.project, icon: 'f542' },
                { text: this.msg.chats, icon: 'f007' },
                { text: this.msg.tasks, icon: 'f0ae' },
                { text: this.msg.docs, icon: 'f02d' },
                { text: this.msg.add, icon: '2b' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }


    async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (!visible || !reinit) return;
        await this.setActions();
        this.requestUpdate();
    }

    setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onToolbarSelectChange(ev));
        this.addEventListener('refresh-request', this.handleRefreshRequest);
    }

    onToolbarSelectChange(ev: mls.events.IEvent) {

        if (mls.istrace) console.log('serviceAim, toolbarSelected', ev);
        if (this.activeTab !== 'Add') return;
        if (!ev.desc) return;
        const data: IToolbarChangeEvent = JSON.parse(ev.desc);
        if (mls.istrace) console.log(`serviceAim, ${data.position}, ${this.position}`);
        if (data.position === this.position || data.level !== this.level) {
            this.useContainerAdd = true;
            return;
        }
        this.actualServiceOpLevel = data.level;
        this.actualServiceOpName = data.to;
        if (this.visible === 'true') this.requestUpdate();
    }

    sortKey(arr: mls.cbe.ITaskRoot[]) {
        function getKey(key: string): number {
            if (!key) return -1;
            const parts = key.split('/');
            if (parts.length !== 3) return -1;
            const index = Number.parseInt(parts[2]);
            return Number.isNaN(index) ? -1 : index;
        }

        function sort(a: mls.cbe.ITaskRoot, b: mls.cbe.ITaskRoot) {
            if (a.mode === "in progress" && b.mode !== "in progress") {
                return -1;
            } else if (a.mode !== "in progress" && b.mode === "in progress") {
                return 1;
            }
            else {
                return getKey(b.key as string) - getKey(a.key as string)
            }
        }

        return arr.sort(sort);
    }

    renderTasks() {

        const renderTask = (taskRoot: mls.cbe.ITaskRoot, index: number) => {
            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}" />`;
            return html`${unsafeHTML(sHtml)}`;
        }

        const orderned = this.sortKey(tasks);
        if (mls.istrace) console.log(`serviceAim, renderAll`);

        if (this.isloading) return html`<span>${this.msg.loading}</span>`
        return html`
        <h4 class='title'>${this.msg.titleTasks} (${tasks.length})</h4>
            ${repeat(
            orderned,
            ((task: mls.cbe.ITaskRoot, index: number) => task.key) as any,
            ((task: mls.cbe.ITaskRoot, index: number) => renderTask(task, index)) as any
        )}
        `;
    }

    renderChats(): TemplateResult {
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
        console.log('render serviceaim, activerrom=', this.activeRoom, ', activeMessage=', this.activeMessage)

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

    renderProject() {
        let refOpr: string = this.getRef();

        const renderTask = (taskRoot: mls.cbe.ITaskRoot, index: number) => {
            let hasRef = taskRoot.children.filter((c) => c.ref === refOpr);
            if (!hasRef || hasRef.length <= 0) return;
            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}"/>`;
            return html`${unsafeHTML(sHtml)}`;
        }

        let orderned = this.sortKey(tasks);
        if (refOpr.length <= 0) refOpr = '***notFoundService---';

        const verifyOrderned = orderned.filter((i) => {
            let hasRef = i.children.filter((c) => c.ref === refOpr);
            if (!hasRef || hasRef.length <= 0) return false;
            return true
        });

        return html`
            <h4 class='title'>${this.msg.titleProject} </h4>
                ${verifyOrderned.length > 0 ? repeat(
            orderned,
            ((task: mls.cbe.ITaskRoot, index: number) => index) as any,
            ((task: mls.cbe.ITaskRoot, index: number) => renderTask(task, index)) as any
        ) : html`<h4>${this.msg.notFoundReference}</h4>`}
        `;
    }

    renderDocs() {
        return html`
            <h4 class='title'>${this.msg.titleDocs}</h4>
        `;
    }

    getRef(): string {
        // return file ref in opposite side 
        if (this.nav3Service) {
            const pos = this.position === 'left' ? 'right' : 'left';
            const op = this.nav3Service.getActiveInstance(pos);
            if (op && op.getActualRef) return op.getActualRef()
        } else {
            // in preview ?
            const left = (mls.actual[2] as any)['left'];
            if (left) return `_${left.project}_${left.shortName}`
        }
        return '';
    }

    actions: ResponseFindActions[] = [];

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (!changedProperties.has('activeTab')) return;
        switch (this.activeTab) {
            case 'Tasks':
                // readTasksFromServer('all', '')
                //     .then(() => this.sendRefreshRequest());
                return;
            case 'Chats':
                // readTasksFromServer('byUser', '')
                //     .then(() => this.sendRefreshRequest());
                return;
            case 'Project':
                return;
            case 'Add':
                this.setActions().then(() => this.sendRefreshRequest());
                return;
            case 'Docs':
                return;
            case 'Loading':
                return;
            default:
                console.error('invalid activeTab:', this.activeTab);
        }
    }


    sendRefreshRequest() {
        const event = new CustomEvent('refresh-request', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    handleRefreshRequest() {
        this.requestUpdate();
    }

    async connectedCallback() {
        super.connectedCallback();

        if (!this.nav3Service) { // for preview test
            this.actualServiceOpName = '_100554_ServiceSource';
            this.actualServiceOpLevel = 2;
        }

        await readTasks().then(async () => {
            await this.setActions();
            const widgetsDistincts = new Set<string>();
            tasks.forEach(task => {
                widgetsDistincts.add(task.widget);
            });
            const arrayWidgets: string[] = Array.from(widgetsDistincts);
            for await (let widget of arrayWidgets) {
                try {
                    await this.loadComponentModule(widget);
                } catch (e) {
                    console.log('action don exists: ' + widget);
                }
            }

            this.isloading = false;
            this.requestUpdate();
        });

    }

    async attributeChangedCallback(prop: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(prop, oldValue, newValue);
        if (prop === 'actualserviceopname' && oldValue !== newValue) {
            await this.setActions();
            this.requestUpdate();
        }
    }

    private async setActions() {
        this.actions = await this.getActionsByContext();
    }

    private async getActionsByContext(): Promise<ResponseFindActions[]> {

        if (!this.actualServiceOpName || this.actualServiceOpLevel !== this.level) {
            const activeInstance = this.nav3Service?.getActiveInstance(this.invertedPosition);
            if (!activeInstance || !(activeInstance instanceof ServiceBase)) {
                return [];
            }
            const tag = activeInstance.tagName;
            const fileName = convertTagToFileName(tag.toLowerCase());
            this.actualServiceOpLevel = activeInstance.level;
            this.actualServiceOpName = fileName;

        }

        const act = await findActions(this.level, [this.actualServiceOpName]);
        return act;
    }

    renderAdd() {

        let filteredActions: ResponseFindActions[] = [];

        if (!this.nav3Service) filteredActions = this.actions; // for preview test
        else filteredActions = this.actions.filter((item) => item.tagsValid === true && item.levelsValid);

        const renderItems = () => {
            return filteredActions.map((action, index) => {
                const dataAction = `_${action.project}_${action.shortName}`;
                return html`
                <div data-action=${dataAction} class="ActionItem" @click=${() => this.onAddTask(action, index)}>
                    <div>${action.title}</div>
                    <div>${action.project} - ${action.shortName}</div>
                </div>
            `
            })
        }

        const showListStyle = { display: !this.useContainerAdd ? 'none' : 'grid' };
        const showContainerStyle = { display: !this.useContainerAdd ? 'block' : 'none' };

        return html`
        <div class='addTab' >
          <h4 class='title'>${this.msg.titleAdd} : ${this.actualServiceOpName}</h4>
          <div class='ActionItemContainer'  style=${styleMap(showListStyle)}>
            ${filteredActions.length === 0
                ? html`<div class="no-actions" style="color: #fff;">${this.msg.noActionsToAdd}</div>`
                : renderItems()
            }
          </div>
          <div
            id='componentContainer'
            class='addContainer'
            style=${styleMap(showContainerStyle)} 
            @add-task=${this.finishedAddTaskRoot}
            @finished-add-task-root=${this.finishedAddTaskRoot}
          >
          </div> 
        </div>
        `;

    }

    onAddTask(action: ResponseFindActions, index: number) {
        const webComponentAddHandle = `_${action.project}_${action.shortName}`;
        const container = this.querySelector('#componentContainer') as HTMLElement;
        this.loadAndRenderComponent(webComponentAddHandle, container);
    }

    finishedAddTaskRoot(e: CustomEvent) {

        if (e.detail.cancel) {
            this.useContainerAdd = true;
            return;
        }
        this.activeTab = 'Project';
        this.useContainerAdd = true;
    }

    async loadAndRenderComponent(widget: string, container: HTMLElement | null | undefined): Promise<void> {
        if (!widget || !container) {
            console.error(`invalid call on loadAndRenderComponent: `, !!widget, !!container);
            return;
        }

        try {
            const componentModule = await this.loadComponentModule(widget);
            if (!componentModule) {
                console.error('widget not exists or invalid:' + widget);
                return;
            }

            const tagName = convertFileNameToTag(widget);
            const newTabIndex = ' tabIndex="-1" ';

            const msizeH = this.msize.split(',')[1];
            const height = ` height= "${Number.parseFloat(msizeH) - 95}"`;
            const modeInit: mls.cbe.IMode = "add";
            const newMode = ' mode="' + modeInit + '"';

            render(html`${unsafeHTML('<' + tagName + newTabIndex + newMode + height + '/> ')}`, container);
            this.useContainerAdd = false;
        } catch (error) {
            console.error("Erro ao carregar o componente:" + widget + ", error: ", error);
            this.useContainerAdd = true;
        }
    }

    private async loadComponentModule(widget: string) {
        const componentModule = await import('./' + widget);
        return componentModule;
    }

    private stateColumns: IAimColums | undefined;

    renderColums() {

        this.stateColumns = getUserConfigs();
        const keys = Object.keys(this.stateColumns);
        return html`
            ${this.msg.selectColumnsYouWant}
            <div style="padding:0 1rem;">
                ${keys.map((key: string) => {
            const isChecked = (this.stateColumns as any)[key] === true;
            const isDisabled = key === 'status';

            return html`
                        <div style="display:flex; align-items:center;">
                            <input
                                id="${key}" 
                                type="checkbox"
                                ?checked=${isChecked} 
                                ?disabled=${isDisabled} 
                                @change=${(event: Event) => this.handleInputChange(event, key)}
                            ></input>
                            <label style="cursor:pointer;" for=${key}>${key}</label>
                        </div>
                    `
        }
        )}
                <div style="margin-top:1rem;">
                    <button @click=${this.handleSaveColumnClick.bind(this)}>${this.msg.save}</button>
                    <button @click=${this.handleCancelColumnClick.bind(this)}>${this.msg.cancel}</button>
                </div>
            
            </div>
        `
    }

    private handleInputChange(event: Event, key: string) {
        const target = event.target as HTMLInputElement
        const checked = target.checked;
        if (key === 'status') return;
        (this.stateColumns as any)[key] = checked;
    }

    private handleCancelColumnClick() {
        if (this.menu.closeMenu) this.menu.closeMenu();
    }

    private handleSaveColumnClick() {
        if (this.stateColumns) {
            saveUserConfigs(this.stateColumns);
            this.activeTab = 'Loading';
            setTimeout(() => {
                this.activeTab = 'Project';
                if (this.menu.closeMenu) this.menu.closeMenu();
            }, 50)
        }
    }

    private showConfigColumns(): boolean {

        const div1 = document.createElement('div');
        div1.style.padding = '1rem';
        render(this.renderColums(), div1);
        if (this.menu.setMode) this.menu.setMode('page', div1);
        return true;
    }

    private checkIfHasActionToOpen() {
        if (!this.actionToOpen) return;
        setTimeout(() => {
            const action = this.shadowRoot?.querySelector(`.ActionItem[data-action="${this.actionToOpen}"]`) as HTMLElement;
            if (action) action.click();
            this.actionToOpen = '';
        }, 100)

    }
}

enum ETabs {
    'Project' = 0,
    'Chats' = 1,
    'Tasks' = 2,
    'Docs' = 3,
    'Add' = 4,
    'Loading' = 5,
}

type ITabType = 'Tasks' | 'Chats' | 'Project' | 'Add' | 'Docs' | 'Loading';
