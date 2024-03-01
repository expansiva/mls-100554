/// <mls shortName="serviceCacList" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css, unsafeHTML, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IToolbarChangeEvent } from './_100554_serviceBase';
import { convertFileNameToTag } from './_100554_utilsLit';
import { init as initTask } from './_100554_serviceCacSimulate';

@customElement('service-cac-list-100554')
export class ServiceCACList100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
        initTask();
    }

    @property()
    activeTab: ITabType = 'Add';

    tasks: ITask[] = [];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get invertedPosition() { return this.position === 'left' ? 'right' : 'left' };


    public details: IService = {
        icon: '&#xf03a',
        state: 'foreground',
        position: 'all',
        tooltip: 'CAC List',
        visible: true,
        widget: '_100554_serviceCacList',
        level: [2]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: 'CAC List',
        actions: {
        },
        icons: {
            All: 'All;f560',
            Service: 'Service;f0ae',
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

    render() {
        if (this.menu.setIconActive) this.menu.setIconActive(this.activeTab);
        switch (this.activeTab) {
            case 'All':
                return this.renderAll();
            case 'Service':
                return this.renderService();
            case 'Add':
                return this.renderAdd();
            default:
                return html``;
        }
    } 

    renderAll() {
        function renderTask(task: ITask) {
            return html`
            <cac-task-100554 title=${task.title} mode=${task.mode} model=${task.model}>
                ${task.body}
            </cac-task-100554><br>
            `;
        }

        return html`
        <div> tasks on pool</div>
        ${this.tasks.map(task => renderTask(task))}
        `;
    }

    renderService() {
        const serviceActive = this.nav3Service?.getActiveInstance(this.invertedPosition);
        if (!serviceActive ||
            !serviceActive.details ||
            !serviceActive.details.tooltip) return html
                `<div>No service selected in position ${this.invertedPosition} </div>`;

        return html`<div>Showing Jobs for service: ${serviceActive.details.tooltip} </div>`;
    }


    options = {
        'design': {
            'change color': '',
            'verify less/css': ''
        },
        'typescript': {
            'spell verify': '_100554_cacAddTypescriptSpell',
            'add function': ''
        }
    };

    @state() selectedGroup: string = '';
    @state() selectedCategory: string = '';
    selectGroup = 'Selecione um grupo';
    selectCategory = 'Selecione uma categoria';

    renderAdd() {
         const handleGroupChange = (event: Event) => {
            this.selectedGroup = (event.target as HTMLSelectElement).value;
             this.selectedCategory = '';
            console.log('category=' + this.selectedCategory)
        }

        const handleCategoryChange = (event: Event) => {
            this.selectedCategory = (event.target as HTMLSelectElement).value || '';
            console.log('category=' + this.selectedCategory)
         }

        const webComponentAddHandle = (this.selectedGroup && this.selectedCategory) ? (this.options as any)[this.selectedGroup][this.selectedCategory] : "";
        const rc = html`<div style='display: flex; gap: 1em;'>
        <select @change="${handleGroupChange}">
        <option disabled selected value="">${this.selectGroup}</option>
        ${Object.keys(this.options).map(group => html`<option value="${group}">${group}</option>`)}
        </select>
        
        ${this.selectedGroup ?html`
        <select @change="${handleCategoryChange}" data-key="${this.selectedGroup}/${this.selectedCategory}">
            <option value="" disabled ?selected=${this.selectedCategory === ''}>${this.selectCategory}</option>
            ${Object.keys(this.options[this.selectedGroup as keyof typeof this.options]).map(category => html`<option value="${category}" ?selected=${category === this.selectedCategory}>${category}</option>`)}
                 
        </select>
        ` : ''} 
        </div>
        
        ${!this.selectedCategory ? "" : html`
        <details><summary>about this selection</summary>
          <ul>
          <li>group: ${this.selectedGroup}</li>
          <li>category: ${this.selectedCategory}</li>
          <li>widget selected: "${webComponentAddHandle}"</li>
          </ul>
        </details>
        <br/>
        <div id="componentContainer" @add-task="${this.addTask}">loading ...</div>
        `}`;
        return rc;
    } 

    addTask(e: CustomEvent) {
        const task: ITask = e.detail;
        if (!task.title || !task.mode || !task.body) {
            console.error('error on add Task , invalid details');
        }
        this.tasks.push(Object.assign(task, ''));
        console.log('total tasks=' + this.tasks.length)
        this.activeTab = 'All';
    }

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('selectedGroup') || changedProperties.has('selectedCategory')) {
            const webComponentAddHandle = this.selectedGroup && this.selectedCategory ? (this.options as any)[this.selectedGroup][this.selectedCategory] : "";
            const container = this.shadowRoot?.getElementById('componentContainer');
            if (container && webComponentAddHandle) {
                this.loadAndRenderComponent(webComponentAddHandle, container);
            } else {
                if (container) container.innerText = "widget not defined";
            }
        }
    }

  async loadAndRenderComponent(widget: string, container: HTMLElement | null | undefined): Promise<boolean> {
      if (!widget || !container) {
          console.error('invalid call on loadAndRenderComponent: ', !!widget, !!container);
          return false;
      }
    try {
        const componentModule = await import('./' + widget);
        if (!componentModule) {
            console.error('widget not exists or invalid:' + widget);
            return false;
        }
        const tagName = convertFileNameToTag(widget);
        container.innerHTML = '';
        render(html`${unsafeHTML('<' + tagName + '/> ')}`, container);
        return true;
    } catch (error) {
        console.error("Erro ao carregar o componente:" + widget + ", error: ", error);
        return false;
    }
  }

}
export type IMode = 'waiting' | 'in progress' | 'ready' | 'error' | 'processed' | 'canceled';

export type IModel = '' | 'gpt4' | 'gpt3.5';

export interface ITask {
    mode: IMode;
    title: string;
    body: string;
    model: IModel;    
}

type ITabType = 'All' | 'Service' | 'Add'
