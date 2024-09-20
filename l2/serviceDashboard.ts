/// <mls shortName="serviceDashboard" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import './_100554_collabTiles';

@customElement('service-dashboard-100554')
export class ServiceDashboard100554 extends ServiceBase {

    @property() msize: string = '';

    @property() cssBreakPoint: string = '';

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() activeTab: string = 'Icon1';

    //------SERVICE----------

    public details: IService = {
        icon: '&#xf201',
        state: 'foreground',
        position: 'left',
        tooltip: 'Dashboard',
        visible: true,
        widget: '_100554_serviceDashboard',
        level: [6]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            Icon1: 'Example 1;f0e8',
            Icon2: 'Example 2;f0d6',

        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'Icon1',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    //---------COMPONENT-------------

    private refreshTimeOut = 0;
    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;

            const [w, h] = this.msize.split(',');

            if (w && +w < 800) this.cssBreakPoint = 'break-800';
            else if (w && +w > 800) this.cssBreakPoint = '';
            clearTimeout(this.refreshTimeOut);

            this.refreshTimeOut = setTimeout(() => {
                this.shadowRoot?.querySelectorAll('collab-tiles-item-100554 collabtileitemcontent').forEach((item) => {
                    Array.from(item.children).forEach((plugin) => {
                        const root = plugin.shadowRoot || plugin;
                        root.querySelectorAll('wc-chart-100554').forEach((chart: any) => {
                            if (chart.myChart && chart.myChart.resize) chart.myChart.resize();
                        });
                    });
                });

            }, 500)

        }
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'Icon1':
                return this.renderIcon1();
            case 'Icon2':
                return this.renderIcon2();
            default:
                return html``;
        }
    }

    private pluginsDash1 = [
        {
            title: 'Errors',
            plugin: '_100554_pluginSiteMonitorDashboardErrors',
            position: '1 / 1 / 4 / 3'
        },

        {
            title: 'Spikes',
            plugin: '_100554_pluginSiteMonitorDashboardSpikes',
            position: '1 / 3 / 4 / 7'
        },
        {
            title: 'Expenses',
            plugin: '_100554_pluginSiteMonitorDashboardExpenses',
            position: '4 / 4 / 7 / 7'
        },
        {
            title: 'Sales',
            plugin: '_100554_pluginSiteMonitorDashboardSales',
            position: '4 / 1 / 7 / 4'
        },
        {
            title: 'Response Time',
            plugin: '_100554_pluginSiteMonitorDashboardResponseTime',
            position: '7 / 1 / 11 / 4'
        },
        {
            title: 'Active Users',
            plugin: '_100554_pluginSiteMonitorDashboardActiveUsers',
            position: '7 / 4 / 11 / 7'
        },
        {
            title: 'Regional Latency',
            plugin: '_100554_pluginSiteMonitorDashboardRegionalLatency',
            position: '11 / 1 / 15 / 7'
        },
    ];

    private pluginsDash2 = [
        {
            title: 'Errors',
            plugin: '_100554_pluginSiteMonitorDashboardErrors',
            position: '1 / 1 / 5 / 4'
        },

        {
            title: 'Spikes',
            plugin: '_100554_pluginSiteMonitorDashboardExpenses',
            position: '1 / 4 / 5 / 7'
        },
        {
            title: 'Expenses',
            plugin: '_100554_pluginSiteMonitorDashboardSpikes',
            position: '5 / 4 / 8 / 7'
        },
        {
            title: 'Sales',
            plugin: '_100554_pluginSiteMonitorDashboardSales',
            position: '5 / 1 / 8 / 4'
        },
    ];


    renderIcon1() {
        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash1} class="${this.cssBreakPoint}"></collab-tiles-100554>`;
    }

    renderIcon2() {
        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash2} class="${this.cssBreakPoint}"></collab-tiles-100554>`
    }
}
