/// <mls shortName="serviceDashboard" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getConfigProject } from './_100554_libProjectConfig';
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
        title: 'Dashboard',
        actions: {
        },
        icons: {
            Icon1: 'Example 1;f0e8',
            Icon2: 'Example 2;f0e8',

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

    firstUpdated() {
        this.loadAndSetPlugins();
    }

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

    renderIcon1() {

        if (this.pluginsDash1.length <= 0) return html`<h3 style="padding:2rem">Not found plugins</h3>`;

        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash1} class="${this.cssBreakPoint}"></collab-tiles-100554>`;
    }

    renderIcon2() {

        if (this.pluginsDash2.length <= 0) return html`<h3 style="padding:2rem">Not found plugins</h3>`;

        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash2} class="${this.cssBreakPoint}"></collab-tiles-100554>`
    }

    //------------IMPLEMENTATION---------------

    private pluginsDash1: ITiles[] = [];

    private pluginsDash2: ITiles[] = [];

    private async loadAndSetPlugins() {

        const prj = mls.actual[5].project;
        if (!prj) return;

        await mls.plugin.loadAll(prj, true);
        const dash = "l6Dashboard" as mls.plugin.Scope;
        const arry = mls.plugin.getAllMenuActions(100554, { scope: dash } as any);

        const config = await getConfigProject(prj);

        arry.forEach((i, index) => {

            const item: ITiles = {
                title: 'Tile_' + index,
                plugin: i.widget,
                position: '2 2'
            };

            const pos = this.getPosition(config, i.widgetConfig, i.widget, i.category);

            item.position = pos;

            switch (i.category) {
                case 'Examples 1': {
                    this.pluginsDash1.push(item);
                    break;
                }
                case 'Examples 2': {
                    this.pluginsDash2.push(item);
                    break;
                }
                default: '';
            }

        });

        this.requestUpdate();
    }

    private getPosition(config: mls.l5_common.ProjectConfig | undefined, widgetConfig: string | undefined, widget: string, cat: string | null ): string{
        
        if (!config || !widgetConfig || !cat) return '2 2';

        const plugin = config.plugins;

        widgetConfig = '_' + widgetConfig.replace('2_', '').replace('.ts', '');
    
        if (!plugin[widgetConfig] || !plugin[widgetConfig][widget] || !(plugin[widgetConfig][widget] as any)["l6Dashboard" as any] || !(plugin[widgetConfig][widget] as any)["l6Dashboard"][cat]) return '2 2';

        return (plugin[widgetConfig][widget] as any)["l6Dashboard"][cat].replace('tile', '').trim();

        

    }

}

interface ITiles {
    title: string,
    plugin: string,
    position: string
}
