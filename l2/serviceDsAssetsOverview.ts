/// <mls shortName="serviceDsAssetsOverview" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IAssetsEventSelectedParams, IAssetsEventChangedParams } from './_100554_serviceDsAssets'

@customElement('service-ds-assets-overview-100554')
export class ServiceDsAssetsOverview100554 extends ServiceBase {
    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf229',
        name: 'Assets Overview',
        mode: 'H',
        position: 'right',
        tooltip: 'Assets Overview',
        tags: ['ds_tokens'],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opHelper') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Assets Overview',
        actions: {
            opHelper: 'Assets Overview',
        },
        icons: {},
        actionDefault: 'opHelper', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            this.setData();
            if (el && typeof el.layout === 'function') el.layout();
        }
    }

    private setEvents() {
        mls.events.addEventListener([this.level], ['DSAssetsUnSelected'], (ev) => {
            this.onDsAssetsUnSelected(ev);
        });

        mls.events.addEventListener([this.level], ['DSAssetsChanged'], (ev) => {
            this.onDsAssetsChanged(ev);
        });

    }


    private data: IAssetsEventChangedParams | undefined;

    private onDsAssetsUnSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventSelectedParams = JSON.parse(ev.desc)
        if (params.service.includes('_100554_serviceDsAssetsOverview')) return;
        this.showNav2Item(false);
    }

    private onDsAssetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventChangedParams = JSON.parse(ev.desc);
    
        if (params.position === 'right') return;
        if (params.info.helper.includes('_100554_serviceDsAssetsOverview')) {
            this.data = params;
            this.showNav2Item(true);
            this.openMe();
        } else this.showNav2Item(false);
    }

    private showInitial(): boolean {
        this.menu.title = 'Assets Image';
        this.setData();
        return true;
    }

    private async setData() {

        if (!this.data) return;
        if (!this.data.info.filesSelectedArr) return undefined;
        console.info(Array.from(this.data.info.filesSelectedArr))
        

    }


    render() {
        return html`
        <div class="service_assets_overview" >
            <details open="open" >
                <summary></summary>
                <ul >
                    <li >
                        <i class="fa-solid fa-folder" ></i>
                        <span >Folder:</span>
                        <span></span>
                    </li>
                    <li ">
                        <i class="fa-solid fa-database" "></i>
                        <span ">In Local Storage:</span>
                        <span></span>
                    </li>
                </ul>
                <div class="ds_assets_ds_container" style="display:none;" >
                    <label>Description:</label>
                    <textarea></textarea>
                    <label>Tags:</label>
                    <mls-l3-input-tags-100529></mls-l3-input-tags-100529>
                    <div class="actions">
                        <button>Delete File</button>
                    </div>
                </div>
            </details>
        </div>`;
    }
}
