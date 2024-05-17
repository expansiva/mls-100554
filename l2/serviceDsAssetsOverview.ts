/// <mls shortName="serviceDsAssetsOverview" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { IAssetsEventSelectedParams, IAssetsEventChangedParams } from './_100554_serviceDsAssets'
import { initCollabInputTag } from './_100554_collabInputTag';

/// **collab_i18n_start**
const message_pt = {
    folder: 'Pastas',
    inLocalStorage: 'Em local',
    description: 'Descrição',
    tags: 'Tags',
    deleteFile: 'Deletar Arquivo',
}

const message_en = {
    folder: 'Folder',
    inLocalStorage: 'In local storage',
    description: 'Description',
    tags: 'Tags',
    deleteFile: 'Delete file',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-assets-overview-100554')
export class ServiceDsAssetsOverview100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    constructor() {
        super();
        this.setEvents();
        initCollabInputTag();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf229',
        state: 'foreground',
        tooltip: 'Assets Overview',
        visible: false,
        position: "right",
        tags: ['ds_assets'],
        widget: '_100554_serviceDsAssetsOverview',
        level: [3]
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

    private ds: mls.l3.DesignSystemIO | undefined;

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
            this.setData();
        } else this.showNav2Item(false);
    }

    private showInitial(): boolean {
        this.menu.title = 'Assets Image';
        this.setData();
        return true;
    }

    private state: IStateOverviewAssets = {
        multiple: false,
        text: '',
        folder: '',
        inLocalStorage: '',
        readOnly: true,
        description: '',
        tags: '',
        actualFileInfo: undefined,
        actualAssetsItem: null
    }

    private async setData() {

        if (!this.data) return;
        if (!this.data.info.filesSelectedArr) return undefined;
        if (this.data.info.filesSelectedArr.length === 0) {
            this.state.text = `No file selected.`;
            this.state.multiple = true;
            this.state.folder = '';
            this.state.inLocalStorage = '';
        } else if (this.data.info.filesSelectedArr.length > 1) {
            this.state.multiple = true;
            this.state.inLocalStorage = '';
            this.state.text = `${this.data.info.filesSelectedArr.length} files selected.`
        } else {
            const [file] = this.data.info.filesSelectedArr;
            this.state.actualFileInfo = file;
            this.state.multiple = this.data.info.readOnly;
            this.state.text = file.shortName + file.extension;
            this.state.folder = file.folder;
            this.state.inLocalStorage = file.inLocalStorage.toString();
            await this.prepareStateFile(file);
        }

        this.state.readOnly = this.data.info.readOnly;
        this.requestUpdate();

    }

    private async initDs() {
        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];
        if (project === undefined || mode === undefined) return;
        this.ds = mls.l3.getDSInstance(project, mode);
        await this.ds.init();
    }

    private async prepareStateFile(file: mls.stor.IFileInfo) {

        this.state.actualAssetsItem = null;
        this.state.tags = '';
        this.state.description = '';

        await this.initDs();
        if (!this.ds) return;
        const fullname = file.shortName + file.extension;
        const assetsItem = this.ds.assets.find(file.folder, fullname);
        if (!assetsItem) return;

        this.state.actualAssetsItem = assetsItem;
        this.state.tags = assetsItem.tags ? assetsItem.tags.join(',') : '';
        this.state.description = assetsItem.description;

    }

    private handleKeyUp(e: MouseEvent) {
        if (!this.ds) return;
        const value = (e.target as HTMLTextAreaElement).value;
        if (this.state.actualAssetsItem) {
            this.ds.assets.update(this.state.folder, this.state.actualAssetsItem.shortname, this.state.actualAssetsItem.tags, value, this.state.actualAssetsItem.type);
        }
    }

    private handleValueChanged(value: string) {

        if (!this.ds) return;
        if (this.state.actualAssetsItem) {
            this.ds.assets.update(this.state.folder, this.state.actualAssetsItem.shortname, value.split(','), this.state.actualAssetsItem.description, this.state.actualAssetsItem.type);
        }
    }

    private async handleDelete() {

        if (!this.ds) return;
        if (this.state.actualAssetsItem && this.state.actualFileInfo) {

            const deletedFile: mls.stor.IFileInfo = this.state.actualFileInfo;
            const params: IAssetsEventChangedParams = {
                action: 'delete',
                info: this.data?.info as any,
                position: 'right'
            };

            await this.ds.assets.remove(this.state.folder, this.state.actualAssetsItem.shortname);
            mls.events.fire(3, 'DSAssetsChanged', JSON.stringify(params), 0);

        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
        <div class="service_assets_overview" >
            <details open="open" >
                <summary>${this.state.text}</summary>
                <ul >
                    <li >
                        <i class="fa-solid fa-folder" ></i>
                        <span >${this.msg.folder}:</span>
                        <span>${this.state.folder}</span>
                    </li>
                    <li ">
                        <i class="fa-solid fa-database" "></i>
                        <span ">${this.msg.inLocalStorage}:</span>
                        <span>${this.state.inLocalStorage}</span>
                    </li>
                </ul>
                <div class="ds_assets_ds_container" style="display:${this.state.multiple ? "none;" : ""}" >
                    <label>${this.msg.description}:</label>
                    <textarea rows="5" @input=${(e: MouseEvent) => { this.handleKeyUp(e) }} .value="${this.state.description}"></textarea>
                    <label>${this.msg.tags}:</label>
                    <collab-input-tag-100554 .value=${this.state.tags} .onValueChanged=${(value: string) => { this.handleValueChanged(value) }} ></collab-input-tag-100554>
                    <div class="actions">
                        <button @click=${() => { this.handleDelete(); }}>${this.msg.deleteFile}</button>
                    </div>
                </div>
            </details>
        </div>`;
    }
}

interface IStateOverviewAssets {
    multiple: boolean,
    text: string,
    folder: string,
    inLocalStorage: string,
    readOnly: boolean,
    description: string,
    tags: string,
    actualAssetsItem: mls.l3.IAssetsInfo | null,
    actualFileInfo: mls.stor.IFileInfo | undefined
}