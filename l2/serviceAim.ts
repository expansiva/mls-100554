/// <mls shortName="serviceAim" project="100554" enhancement="_100554_enhancementLitService" groupName="service"/>
				
import { html, css, unsafeHTML, render, styleMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IToolbarChangeEvent } from './_100554_serviceBase';
import { convertFileNameToTag } from './_100554_utilsLit';
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
        level: [2]
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

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void {        
    }

    setEvents(): void {
        mls.events.addListener(this.level, 'ToolBarSelected', (ev) => this.onToolbarSelectChange(ev));
    }

    onToolbarSelectChange(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IToolbarChangeEvent = JSON.parse(ev.desc);
        if (data.level !== this.level) return;
        if (data.position === this.position) return;
        // if (this.activeTab !== 'Service') return;
        this.requestUpdate();
    }

    renderAll() {
        function renderTask(taskRoot: cbe.ITaskRoot, index: number) {
            const actionName = convertFileNameToTag(taskRoot.widget);
            const sHtml = `<${actionName} mode="${taskRoot.mode}" taskIndex="${index}" />`;
            return html`${unsafeHTML(sHtml)}`;
        }

        return html`
        <h4 class='title'>All Tasks</h4>
        ${tasks.map( (task, index) => renderTask(task, index))}
        <h4 class='title'>End</h4>
        `;
    } 

    renderUser() {
        const getTitleUser = () => {
            const userName = localStorage['loginUser'];
            return html`${userName}`;
        }

        return html`
        <h4 class='title'>User Tasks</h4>
        <div>Showing Jobs for user: ${getTitleUser()} </div>`;
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
        this.actions = await findActions([2], ['_100554_ServiceSource']); // todo: select cf context
        this.requestUpdate();
    }

    renderAdd() {
        const renderItems = () => {
            return this.actions.map((action, index) => html`
                <div class="ActionItem" @click=${() => this.onAddTask(action, index)}>
                    <div>${action.title}</div>
                    <div>${action.project} - ${action.shortName}</div>
                </div>
            `);
        }

        if (this.actions.length === 0) return html`<div class="no-actions">No Actions to Add</div>`;

        const showListStyle = { display: !this.useContainerAdd ? 'none' : 'grid' };
        const showContainerStyle = { display: !this.useContainerAdd ? 'block' : 'none' }; 

        return html`
        <div class='addTab'>
          <h4 class='title'>Select Action to Add</h4>
          <div class='ActionItemContainer'  style=${styleMap(showListStyle)}>
            ${renderItems()}
          </div>
          <div id='componentContainer' class='addContainer' style=${styleMap(showContainerStyle)} @finished-add-task-root=${this.finishedAddTaskRoot}></div> 
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
        render(html`${unsafeHTML('<' + tagName + newTabIndex + newMode +'/> ')}`, container);
        this.useContainerAdd = false;
    } catch (error) {
        console.error("Erro ao carregar o componente:" + widget + ", error: ", error);
        this.useContainerAdd = true;
    }
  }
}

type ITabType = 'All' | 'User' | 'Ref' | 'Add'
