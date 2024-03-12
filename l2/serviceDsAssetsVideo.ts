/// <mls shortName="serviceDsAssetsVideo" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IAssetsEventSelectedParams, IAssetsEventChangedParams } from './_100554_serviceDsAssets'

@customElement('service-ds-assets-video-100554')
export class ServiceDsAssetsVideo100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf03d',
        state: 'foreground',
        tooltip: 'Assets Video',
        visible: false,
        position: "right",
        tags: ['ds_assets'],
        widget: '_100554_serviceDsAssetsVideo',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opHelper') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Assets Video',
        actions: {
            opHelper: 'Assets Video',
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
            this.setVideo();
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

    @query('#serviceassetsvideo_video')
    private videoEl: HTMLVideoElement | undefined;

    private data: IAssetsEventChangedParams | undefined;

    private showInitial(): boolean {
        this.menu.title = 'Assets Video';
        return true;
    }

    private onDsAssetsUnSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventSelectedParams = JSON.parse(ev.desc)
        if (params.service.includes('_100554_serviceDsAssetsVideo')) return;
        this.showNav2Item(false);
    }

    private onDsAssetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventChangedParams = JSON.parse(ev.desc);
    
        if (params.position === 'right') return;
        if (params.info.helper.includes('_100554_serviceDsAssetsVideo')) {
            this.data = params;
            this.showNav2Item(true);
            this.openMe();
        } else this.showNav2Item(false);
    }

    private async setVideo() {
        if (!this.data) return;
        if (!this.data.info.filesSelectedArr) return undefined;
        
        const [fileSelected] = this.data.info.filesSelectedArr;
        if (!fileSelected) return undefined;

        const { folder, extension, level, project, shortName } = fileSelected;
        const keyFile = mls.stor.getKeyToFiles(project, level, shortName, folder, extension);
        const value = await mls.stor.files[keyFile]?.getContent();
        const file = value as Blob;
        const reader = new FileReader();

        if (!file) return;

        reader.addEventListener('load', () => {
            const base64String = btoa(reader.result as string);
            const base64Full = `data:${file.type};base64,${base64String}`;
            if (this.videoEl) this.videoEl.src = base64Full;
        });
        reader.readAsBinaryString(file);
    }

    render() {
        return html`
            <div class="service_assets_video">
                <video id="serviceassetsvideo_video" controls=""></video>
            </div>
        `;
    }
}
