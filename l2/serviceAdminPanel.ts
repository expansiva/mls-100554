/// <mls shortName="serviceAdminPanel" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import './_100554_collabPanel';
@customElement('service-admin-panel-100554')
export class ServiceAdminPanel100554 extends ServiceBase {

    @property() msize: string = '';

    @query('serviceAdminPanel') serviceAdminPanel: HTMLElement | undefined;

    static styles = css`
        serviceAdminPanel{
            display:flex;
            background:#ebeff3;
            flex-direction: column;
            gap: .5rem;
            align-items: center;
            overflow-y: auto;
        }
    `;

    private myData: { [key: string]: mls.plugin.MenuAction[] } = {};

    @property({ reflect: true }) inLoading = 'true';

    @property() activeTab: string = 'ISite';

    //----------SERVICE--------------------
    public details: IService = {
        icon: '&#xf5ba',
        state: 'foreground',
        position: 'left',
        tooltip: 'Admin Panel',
        visible: true,
        widget: '_100554_serviceAdminPanel',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op;
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    public menu: IMenu = {
        title: 'Admin Panel',
        actions: {
        },
        icons: {

            ISite: 'Site;f1c9',
            IRepository: 'Repository;f233',
            IPlugin: 'Plugin;f1e6',

        },
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        iconDefault: 'ISite',
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    //------------COMPONENT-----------------

    firstUpdated() {
        this.setMyData();
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);

        if (!this.visible) return;

        const [w, h] = this.msize.split(',');
        if (!this.serviceAdminPanel) return;
        this.serviceAdminPanel.style.height = h + 'px';
        
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'ISite':
                return this.renderSite();
            case 'IRepository':
                return this.renderRepository();
            case 'IPlugin':
                return this.renderPlugin();
            default:
                return html``;
        }
    }

    renderRepository() {
        return html`Repository`
    }

    renderPlugin() {
        return html`Plugin`
    }

    renderSite() {

        if (this.inLoading === 'true') {
            this.loading = true;
            return html``;
        }

        this.loading = false;
        return this.renderItens();

    }

    renderItens() {

        const keys = Object.keys(this.myData);

        return html`
        <serviceAdminPanel>
            ${this.renderFilter()}
            ${repeat(keys, (
            (key: string, idx: number) => key + idx) as any,
            ((item: string, index: any) => {

                return this.renderItem(item, index);

            }) as any
        )}
        </serviceAdminPanel>
        `

    }

    renderFilter() {
        return html`
            <div style="background:#fff;padding:.2rem;margin-bottom:1rem;margin-top:1rem; width:80%; border:1px solid #dfdfdf; border-radius:10px;display:flex;gap:.2rem">
                <input type="text" @input="${this.filter}"style="border:none;border-right:1px solid #dfdfdf;outline:none;height:25px; width:calc(100% - 30px)" placeholder="Filter plugins ...">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </div>
        `
    }

    renderItem(key: string, index: number) {

        return html`
            <collab-panel-100554 .myData=${this.myData[key]}>
            </collab-panel-100554>
        
        `

    }

    //----------IMPLEMENTS------------------

    private timeFilter = 0;
    private filter(e: KeyboardEvent) {
        const el = e.target as HTMLInputElement;

        clearTimeout(this.timeFilter)
        this.timeFilter = setTimeout(() => {

            const val = el.value.toLocaleLowerCase();
            const all = this.shadowRoot?.querySelectorAll('collab-panel-item-100554');
            if (!all) return;

            Array.from(all).forEach((i) => {

                (i as HTMLElement).style.display = '';
                const f = i.getAttribute('filter') as string;
                if (f.toLocaleLowerCase().indexOf(val) < 0) {
                    (i as HTMLElement).style.display = 'none';
                }

            });

        }, 500);
    }

    private async setMyData() {

        const prj = mls.actual[5].project;
        if (!prj) return;
        let array: any[] = [];
        await mls.plugin.loadAll(prj, false);
        array = mls.plugin.getAllMenuActions(prj, {} as any)

        array.forEach((item: mls.plugin.MenuAction) => {

            const cat = item.category as string;
            if (!this.myData[cat]) this.myData[cat] = [item]
            else this.myData[cat].push(item);

        });

        this.setAttribute('inLoading', '');
    }
}
