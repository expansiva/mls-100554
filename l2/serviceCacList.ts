/// <mls shortName="serviceCacList" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IToolbarChangeEvent } from './_100554_serviceBase';

@customElement('service-cac-list-100554')
export class ServiceCACList100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get invertPosition() { return this.position === 'left' ? 'right' : 'left' };

    constructor() {
        super();
        this.setEvents();
    }

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

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (!visible) return;
        if (this.menu.setIconActive) this.menu.setIconActive('icTs');
    }

    @property()
    activeTab: ITabType = 'All';

    setEvents(): void {
        mls.events.addListener(this.level, 'ToolBarSelected', (ev) => this.onToolbarSelectChange(ev));
    }

    onToolbarSelectChange(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IToolbarChangeEvent = JSON.parse(ev.desc);
        if (data.level !== this.level) return;
        if (data.position === this.position) return;
        if (this.activeTab !== 'Service') return;
        this.requestUpdate();
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
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

type ITabType = 'All' | 'Service' | 'Add'
