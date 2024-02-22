/// <mls shortName="serviceCacList" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-cac-list-100554')
export class ServiceCACList100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get invertPosition() { return this.position === 'left' ? 'right' : 'left' };

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

    public menu: IMenu = {
        title: 'CAC List',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    activeTab: ITabType = 'all';

    changeTab(tabName: ITabType) {
        this.activeTab = tabName;
    }


    render() {
        return html`
      <ul class="tabs">
        <li class="tab ${this.activeTab === 'all' ? 'active' : ''}" @click="${() => this.changeTab('all')}">All</li>
        <li class="tab ${this.activeTab === 'service' ? 'active' : ''}" @click="${() => this.changeTab('service')}">Service</li>
        <li class="tab ${this.activeTab === 'add' ? 'active' : ''}" @click="${() => this.changeTab('add')}">Add</li>
      </ul>
      ${this.renderContent()}
    `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'all':
                return this.renderAll();
            case 'service':
                return this.renderService();
            case 'add':
                return this.renderAdd();
            default:
                return html``;
        }
    }

    renderAll() {
        return html`<div>In develpoment</div>`;
    }

    renderService() {
        const serviceActive = this.nav3Service?.getActiveInstance(this.invertPosition);
        if (!serviceActive) return html`<div>No service select in position ${this.invertPosition} </div>`;;
        return html`<div>Showing Task for service: ${serviceActive.details.tooltip} </div>`;
    }

    renderAdd() {
        return html`<div>In develpoment</div>`;
    }
}

type ITabType = 'all' | 'service' | 'add'
