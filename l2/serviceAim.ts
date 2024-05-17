/// <mls shortName="serviceAim" project="100554" enhancement="_100554_enhancementLitService" groupName="service"/>

import { html, css, unsafeHTML, render, styleMap, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IToolbarChangeEvent } from './_100554_serviceBase';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { tasks, readTasksFromServer, getUserConfigs, saveUserConfigs, IAimColums } from './_100554_aimHelper';
import { findActions, ResponseFindActions } from './_100554_aimActionBase';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    selectadd: 'por favor selecione abaixo para adicionar',
    allTasksLast: 'Todas as tarefas, últimas',
    user: 'Usuário',
    all: 'Todos',
    ref: 'Ref',
    add: 'Adicionar',
    notFoundReference: 'Referência não encontrada',
    tasksByReference: 'Tarefas por referência',
    noActionsToAdd: 'Nenhuma ação para adicionar',
    selectColumnsYouWant: 'Selecione as colunas que deseja visualizar',
    save: 'Salvar',
    cancel: 'Cancelar'
}

const message_en = {
    loading: 'Loading...',
    selectadd: 'please select below to add',
    allTasksLast: 'All Tasks, last',
    user: 'User',
    all: 'All',
    ref: 'Ref',
    add: 'Add',
    notFoundReference: 'Not found reference',
    tasksByReference: 'Tasks by reference',
    noActionsToAdd: 'No Actions to Add',
    selectColumnsYouWant:'Select the columns you want to view',
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

    private myMessage: MessageType = messages['en'] ;

    constructor() {
        super();
        this.setEvents();
    }

    @property() activeTab: ITabType = 'All';
    @property({ reflect: true }) useContainerAdd = true; // scenary add list or add action 
    @property({ reflect: true }) actionToOpen: string = '';
    @property({ reflect: true }) actualServiceOpName: string = '';
    @property() isloading: boolean = true;

    actualServiceOpLevel: number = 0;

    render() {
     
        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang];

        if (this.menu.setIconActive) this.menu.setIconActive(this.activeTab);
        if (this.actionToOpen) this.activeTab = 'Add'
        switch (this.activeTab) {
            case 'All':
                return this.renderAll();
            case 'User':
                return this.renderUser();
            case 'Ref':
                return this.renderRef();
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
        icon: '&#xf03a',
        state: 'foreground',
        position: 'all',
        tooltip: 'AI',
        visible: true,
        widget: '_100554_serviceAim',
        level: [2, 3]
    }

    get invertedPosition() { return this.position === 'left' ? 'right' : 'left' };

    static styles = css`[[mls_getDefaultDesignSystem]]`;
    //static message = `[[mls_DS_messages_local_language]]`; // todo: test

    public onClickLink = (op: string): boolean => {
        if (op === 'opColumns') return this.showConfigColumns();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (this.activeTab === op) return;
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: 'AI',
        actions: {
            opColumns: 'Columns',
        },
        icons: {
            All: `${this.myMessage.all};f560`,
            User: `${this.myMessage.user};f007`,
            Ref: `${this.myMessage.ref};f15b`,
            Add: `${this.myMessage.add};2b`
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'All',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
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
        if (data.position === this.position || data.level !== this.level) return;
        this.actualServiceOpLevel = data.level;
        this.actualServiceOpName = data.to;
        if (this.visible === 'true') this.requestUpdate();
    }

    sortKey(arr: cbe.ITaskRoot[]) {
        function getKey(key: string): number {
            if (!key) return -1;
            const parts = key.split('/');
            if (parts.length !== 3) return -1;
            const index = Number.parseInt(parts[2]);
            return Number.isNaN(index) ? -1 : index;
        }

        function sort(a: cbe.ITaskRoot, b: cbe.ITaskRoot) {
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


    renderAll() {

        const renderTask = (taskRoot: cbe.ITaskRoot, index: number) => {
            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}" />`;
            return html`${unsafeHTML(sHtml)}`;
        }

        const orderned = this.sortKey(tasks);
        if (mls.istrace) console.log(`serviceAim, renderAll`);

        if (this.isloading) return html`<span>${this.myMessage.loading}</span>`
        return html`
        <h4 class='title'>${this.myMessage.allTasksLast} (${tasks.length})</h4>
            ${repeat(
            orderned,
            ((task: cbe.ITaskRoot, index: number) => task.key) as any,
            ((task: cbe.ITaskRoot, index: number) => renderTask(task, index)) as any
        )}
        `;
    }

    renderUser() {

        const userName = localStorage.getItem('loginUser');
        function renderTask(taskRoot: cbe.ITaskRoot, index: number) {
            if (taskRoot.userName !== userName) return;

            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}"/>`;
            return html`${unsafeHTML(sHtml)}`;
        }
        const orderned = this.sortKey(tasks);
        return html`
        <h4 class='title'>${this.myMessage.user}: ${userName} </h4>
            ${repeat(
            orderned,
            ((task: cbe.ITaskRoot, index: number) => index) as any,
            ((task: cbe.ITaskRoot, index: number) => renderTask(task, index)) as any
        )}            
        `;

    }

    renderRef() {

        let refOpr = '';
        if (this.nav3Service) {
            const pos = this.position === 'left' ? 'right' : 'left';
            const op = this.nav3Service.getActiveInstance(pos);
            if (op && op.getActualRef) refOpr = op.getActualRef();
        }

        function renderTask(taskRoot: cbe.ITaskRoot, index: number) {
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
            <h4 class='title'>${this.myMessage.tasksByReference} </h4>
                ${verifyOrderned.length > 0 ? repeat(
            orderned,
            ((task: cbe.ITaskRoot, index: number) => index) as any,
            ((task: cbe.ITaskRoot, index: number) => renderTask(task, index)) as any
        ) : html`<h4>${this.myMessage.notFoundReference}</h4>`}
        `;
    }

    actions: ResponseFindActions[] = [];

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.update(changedProperties);
        if (!changedProperties.has('activeTab')) return;
        switch (this.activeTab) {
            case 'All':
                // readTasksFromServer('all', '')
                //     .then(() => this.sendRefreshRequest());
                return;
            case 'User':
                // readTasksFromServer('byUser', '')
                //     .then(() => this.sendRefreshRequest());
                return;
            case 'Ref':
                return;
            case 'Add':
                this.setActions().then(() => this.sendRefreshRequest());
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

        await readTasksFromServer('all', '').then(async () => {
            await this.setActions();
            const widgetsDistincts = new Set<string>();
            tasks.forEach(task => {
                widgetsDistincts.add(task.widget);
            });
            const arrayWidgets: string[] = Array.from(widgetsDistincts);
            for await (let widget of arrayWidgets) {
                await this.loadComponentModule(widget);
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

        const act = await findActions([this.level], [this.actualServiceOpName]);
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
          <h4 class='title'>${this.myMessage.selectadd} : ${this.actualServiceOpName}</h4>
          <div class='ActionItemContainer'  style=${styleMap(showListStyle)}>
            ${filteredActions.length === 0
                ? html`<div class="no-actions" style="color: #fff;">${this.myMessage.noActionsToAdd}</div>`
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
        const container = this.shadowRoot?.getElementById('componentContainer');
        this.loadAndRenderComponent(webComponentAddHandle, container);
    }

    finishedAddTaskRoot(e: CustomEvent) {

        if (e.detail.cancel) {
            this.useContainerAdd = true;
            return;
        }
        this.activeTab = 'All';
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
            const modeInit: cbe.IMode = "add";
            const newMode = ' mode="' + modeInit + '"';
            render(html`${unsafeHTML('<' + tagName + newTabIndex + newMode + '/> ')}`, container);
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
            ${this.myMessage.selectColumnsYouWant}
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
                    <button @click=${this.handleSaveColumnClick.bind(this)}>${this.myMessage.save}</button>
                    <button @click=${this.handleCancelColumnClick.bind(this)}>${this.myMessage.cancel}</button>
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
                this.activeTab = 'All';
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

type ITabType = 'All' | 'User' | 'Ref' | 'Add' | 'Loading'