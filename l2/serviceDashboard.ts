/// <mls shortName="serviceDashboard" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import { getConfigProject } from '/_100554_/l2/libProjectConfig.js';
import { loadPluginProject } from '/_100554_/l2/libCommom.js';

import '/_100554_/l2/collabTiles.js';

@customElement('service-dashboard-100554')
export class ServiceDashboard100554 extends ServiceBase {

    @property() msize: string = '';

    @property() cssBreakPoint: string = '';

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

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');
         
    }

    public onClickTabs(index: number) {
        this.activeTab = ESceneries[index];
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutThis: 'About this content',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Example 1', icon: 'f0e8' },
                { text: 'Example 2', icon: 'f0e8' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (!visible) {
            const el = this.shadowRoot?.querySelector('collab-tiles-100554');
            if (!el) return;

            const config = el.getAttribute('config');
            if (config === 'close' || !(el as any).onlyclose) return;

            (el as any).onlyclose();


        }
    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'collab-tiles-100554';
        
        div.innerHTML = `
        
            <h3>About this content</h3>
            <ul>
                <li>Reference: ${name}</li>
                <li>Level: ${this.level}</li>
                <li>Position: ${this.position}</li>
            </ul>
		

        `;

        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
        
    }

    //---------COMPONENT-------------

    createRenderRoot() {
        return this;
    }

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
            case 'Example1':
                return this.renderIcon1();
            case 'Example2':
                return this.renderIcon2();
            default:
                return html``;
        }
    }

    renderIcon1() {

        if (this.pluginsDash1.length <= 0) return html`<h3 style="padding:2rem">Not found plugins</h3>`;

        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash1} example="1" class="${this.cssBreakPoint}"></collab-tiles-100554>`;
    }

    renderIcon2() {

        if (this.pluginsDash2.length <= 0) return html`<h3 style="padding:2rem">Not found plugins</h3>`;

        return html`<collab-tiles-100554 .tilesItens=${this.pluginsDash2} example="2" class="${this.cssBreakPoint}"></collab-tiles-100554>`
    }

    //------------IMPLEMENTATION---------------

    private pluginsDash1: ITiles[] = [];

    private pluginsDash2: ITiles[] = [];

    private baseProject = 100554;
    private async loadAndSetPlugins() {

        const prj = mls.actualProject;
        if (!prj) return;

        const dash = "l6Dashboard" as mls.plugin.Scope;

        const arry = await loadPluginProject(prj, dash);

        const config = await getConfigProject(prj);

        arry.forEach((i, index) => {

            const item: ITiles = {
                title: 'Tile_' + index,
                plugin: i.widget,
                position: '2 2',
                index: '99',
                enabled: 'true',
                widgetConfig: ''
            };

            const infoPlugin = this.getInfoPlugin(config, i.widgetConfig, i.widget, i.category);

            item.position = infoPlugin.pos;
            item.index = infoPlugin.index;
            item.enabled = infoPlugin.enabled;
            item.widgetConfig = infoPlugin.widgetConfig;

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

        this.pluginsDash1.sort((a, b) => {
            return Number(a.index) - Number(b.index);
        });

        this.pluginsDash2.sort((a, b) => {
            return Number(a.index) - Number(b.index);
        });

        this.requestUpdate();
    }

    private getInfoPlugin(config: mls.l5_common.ProjectConfig | undefined, widgetConfig: string | undefined, widget: string, cat: string | null): { index: string, enabled: string, pos: string, widgetConfig: string } {

        const ret = { index: '99', enabled: 'true', pos: '2 2', widgetConfig: '' }
        if (!config || !widgetConfig || !cat) return ret;

        const plugin = config.plugins;

        widgetConfig = '_' + widgetConfig.replace('2_', '').replace('.ts', '');

        ret.widgetConfig = widgetConfig;

        if (!plugin[widgetConfig] || !plugin[widgetConfig][widget] || !(plugin[widgetConfig][widget] as any)["l6Dashboard" as any] || !(plugin[widgetConfig][widget] as any)["l6Dashboard"][cat]) return ret;

        const pos = (plugin[widgetConfig][widget] as any)["l6Dashboard"][cat].replace('tile', '').trim();

        const a: string[] = pos.split(' ');

        if (a.length < 3) ret.pos = a.join(' ');
        else {
            ret.index = a.pop() as string;
            ret.pos = a.join(' ');
        }

        ret.enabled = (plugin[widgetConfig][widget] as any).enabled;

        return ret;

    }

}
enum ESceneries {
    'Example1' = 0,
    'Example2' = 1,
}

interface ITiles {
    title: string,
    plugin: string,
    position: string,
    index: string,
    enabled: string,
    widgetConfig: string
}
