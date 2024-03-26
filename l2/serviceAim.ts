/// <mls shortName="serviceAim" project="100554" enhancement="_100554_enhancementLitService" groupName="service"/>

import { html, css, unsafeHTML, render, styleMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IToolbarChangeEvent } from './_100554_serviceBase';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { tasks, readTasksFromServer } from './_100554_aimHelper';
import { findActions, ResponseFindActions } from './_100554_aimActionBase';

@customElement('service-aim-100554')
export class ServiceAim100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    @property() activeTab: ITabType = 'All';
    @property({ reflect: true }) useContainerAdd = true; // scenary add list or add action 
    @property({ reflect: true }) actualServiceOpName: string = '';
    actualServiceOpLevel: number = 0;

    render() {
        if (this.menu.setIconActive) this.menu.setIconActive(this.activeTab);
        switch (this.activeTab) {
            case 'All':
                return this.renderAll();
            case 'User':
                return this.renderUser();
            case 'Ref':
                return this.renderRef();
            case 'Add':
                return this.renderAdd();
            default:
                return html``;
        }
    }

    public details: IService = {
        icon: '&#xf03a',
        state: 'foreground',
        position: 'all',
        tooltip: 'AIM Service',
        visible: true,
        widget: '_100554_serviceAim',
        level: [2, 3]
    }

    get invertedPosition() { return this.position === 'left' ? 'right' : 'left' };

    // createRenderRoot() {
    //     return this; // dont use shadow root
    // }

    static styles = css`[[mls_getDefaultDesignSystem]]`;
    static message = `[[mls_DS_messages_local_language]]`; // todo: test

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (this.activeTab === op) return;
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: 'AIM Service',
        actions: {
        },
        icons: {
            All: 'All;f560',
            User: 'User;f007',
            Ref: 'Ref;f15b',
            Add: 'Add;2b'
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
    }

    onToolbarSelectChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IToolbarChangeEvent = JSON.parse(ev.desc);
        if (data.position === this.position) return;

        this.actualServiceOpLevel = data.level;
        this.actualServiceOpName = data.to;

        if (data.level !== this.level) return;
        this.requestUpdate();
    }

    sortKey(arr: cbe.ITaskRoot[]) {
        function getKey(key: string): number {
            if (!key) return -1;
            const parts = key.split('/');
            if (parts.length < 3) return -1;
            const lastPart = parts.pop();
            if (!lastPart) return -1;
            const index = Number.parseInt(lastPart);
            return index;
        }

        const inProcess = arr.filter(item => item.mode === 'in progress');
        const processed = arr.filter(item => item.mode !== 'in progress');
        processed.sort((a: any, b: any) => getKey(b.key) - getKey(a.key));

        const sortedArray = inProcess.concat(processed);
        return sortedArray;
    }

    renderAll() {

        function renderTask(taskRoot: cbe.ITaskRoot, index: number) {
            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}" />`;
            return html`${unsafeHTML(sHtml)}`;
        }
        const orderned = this.sortKey(tasks);

        return html`
        <h4 class='title'>All Tasks</h4>
        ${orderned.map((task, index) => renderTask(task, index))}
        <h4 class='title'>End</h4>
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
        <h4 class='title'>User: ${userName} </h4>
            ${orderned.map((task, index) => renderTask(task, index))}
        <h4 class='title'>End</h4>
        `;

    }

    renderRef() {
        const getTitleActualReference = () => {
            const serviceActive = this.nav3Service?.getActiveInstance(this.invertedPosition);
            if (!serviceActive ||
                !serviceActive.details ||
                !serviceActive.details.tooltip) return html
                    `<div>No service selected in position ${this.invertedPosition} </div>`;
            return html`${serviceActive.details.tooltip}`
        }

        return html`
        <h4 class='title'>Tasks by Reference</h4>
        <div>Showing Jobs for service:  ${getTitleActualReference()}</div>`;
    }

    actions: ResponseFindActions[] = [];

    updated(changedProperties: Map<string | number | symbol, unknown>) {

        if (!changedProperties.has('activeTab')) return;
        switch (this.activeTab) {
            case 'All':
                readTasksFromServer('all', '')
                    .then(value => {
                        this.requestUpdate();
                    });
            case 'User':
                readTasksFromServer('byUser', '')
                    .then(value => {
                        this.requestUpdate();
                    });
            case 'Ref':
                return;
            case 'Add':
                return;
            default:
                console.error('invalid activeTab:', this.activeTab);
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        if (!this.nav3Service) { // for preview test
            this.actualServiceOpName = '_100554_ServiceSource';
            this.actualServiceOpLevel = 2;
        }
        await this.setActions();
        this.requestUpdate();
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
            return filteredActions.map((action, index) => html`
                <div class="ActionItem" @click=${() => this.onAddTask(action, index)}>
                    <div>${action.title}</div>
                    <div>${action.project} - ${action.shortName}</div>
                </div>
            `);
        }

        // if (filteredActions.length === 0) return html`<div class="no-actions">No Actions to Add</div>`;

        const showListStyle = { display: !this.useContainerAdd ? 'none' : 'grid' };
        const showContainerStyle = { display: !this.useContainerAdd ? 'block' : 'none' };

        return html`
        <div class='addTab' >
          <h4 class='title'>Select Action to Add : ${this.actualServiceOpName}</h4>
          <div class='ActionItemContainer'  style=${styleMap(showListStyle)}>
            ${filteredActions.length === 0
                ? html`<div class="no-actions" style="color: #fff;">No Actions to Add</div>`
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
            const componentModule = await import('./' + widget);
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
}

type ITabType = 'All' | 'User' | 'Ref' | 'Add'
