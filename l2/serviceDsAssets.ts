/// <mls shortName="serviceDsAssets" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initCollabInputTag, CollabInputTag } from './_100554_collabInputTag';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    description: 'Descrição',
    name: 'Nome',
    versionRef: 'Versão',
    addNewFile: 'Aidcionar um novo arquivo'
    
}
const message_en = {
    loading: 'Loading...',
    cancel: 'Cancelar',
    confirm: 'Confirm',
    description: 'Description',
    name: 'Name',
    versionRef: 'Version Ref',
    addNewFile: 'Add new file'
}
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-assets-100554')
export class ServiceDsAssets100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    constructor() {
        super();
        this.setEvents();
        initCollabInputTag();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf802',
        state: 'foreground',
        tooltip: 'Assets',
        visible: true,
        position: "left",
        tags: ['ds_assets'],
        widget: '_100554_serviceDsAssets',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opHelper') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Assets',
        actions: {
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

        if (visible && reinit) {
            const params: IAssetsEventSelectedParams = {
                service: ['_100554_serviceDsAssetsOverview'],
            };
            const { project } = mls.actual[5];
            const { mode } = mls.actual[3];
            mls.events.fire([3], ['DSAssetsSelected'], JSON.stringify(params), 100);
            if (this.lastProject !== project || this.lastDsIndex !== mode) {
                this.loading = true;
                this.init();
            }
        }

        if (!visible) {
            const params: IAssetsEventSelectedParams = {
                service: [],
            };
            mls.events.fire([3], ['DSAssetsUnSelected'], JSON.stringify(params), 0);
        }
    }

    private setEvents() {
        mls.events.addEventListener([3], ['DSAssetsChanged'], (ev) => {
            this.onDsAssetsChanged(ev);
        });
    }

    async connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    private async init() {
        this.tree = {};
        this.actualFiles = [];
        await this.prepareFiles();
        this.loading = false;
        this.requestUpdate();
    }

    @query('tbody')
    tbody: HTMLElement | undefined;

    @query('.assets-tree')
    treeEl: HTMLElement | undefined;

    @query('#checkAll')
    checkBoxAll: HTMLInputElement | undefined

    @query('collab-input-tag-100554')
    inputTags: CollabInputTag | undefined;

    @query('.txtDesc')
    txtDesc: HTMLTextAreaElement | undefined;

    @query('.inputFile')
    inputFile: HTMLInputElement | undefined;

    @query('.selectType')
    selectType: HTMLInputElement | undefined;

    @property()
    tree: TreeNode = {}

    @property()
    isAddMode: boolean = false;

    @property()
    actualFiles: mls.stor.IFileInfo[] = [];

    actualPath: string = '';

    private treeController = {
        isNodeReadOnly: true
    }
    private filesController: IFileController = {
        totalFiles: 0,
        totalFilesSelected: 0,
        filesSelected: new Set([]),
        filesSelectedArr: [],
        helper: [],
        readOnly: false
    }

    private dsInstance: mls.l3.DesignSystemIO | undefined;

    private lastProject: number | undefined;

    private lastDsIndex: number | undefined;

    private files: IFiles = {
        readOnlyFiles: [],
        readOnlyFolders: [],
        project: undefined,
        list: {}
    }

    private serviceByExtensions: any = {
        _100554_serviceDsAssetsImage: ['.png', '.jpg', '.jpeg', '.webp', '.jfif'],
        _100554_serviceDsAssetsVideo: ['.mp4', '.webm'],
        _100554_serviceDsAssetsIcon: ['.svg', '.ico'],
        _100554_serviceDsAssetsEditor: ['.json', '.ts', '.js', '.css', '.txt', '.css', '.scss', '.less', '.xml', '.html'],
    }

    private objIcons: any = {
        png: 'fa-solid fa-image',
        jpeg: 'fa-solid fa-image',
        jpg: 'fa-solid fa-image',
        webp: 'fa-solid fa-image',
        jfif: 'fa-solid fa-image',
        js: 'fa-brands fa-js',
        ts: 'fa-regular fa-file-code',
        html: 'fa-regular fa-file-code',
        json: 'fa-regular fa-file-code',
        xml: 'fa-regular fa-file-code',
        pdf: 'fa-solid fa-file-pdf',
        ico: 'fa fa-info',
        txt: 'fa-solid fa-file-lines',
        doc: 'fa-solid fa-file-lines',
        mp3: 'fa-sharp fa-regular fa-file-audio',
        zip: 'fa-solid fa-file-zipper',
        gz: 'fa-solid fa-file-zipper',
        none: 'fa-solid fa-file',
    }

    private showInitial(): boolean {
        this.menu.title = 'Assets';
        return true;
    }

    private async initDsInstance(project: number, dsIndex: number) {
        this.dsInstance = mls.l3.getDSInstance(project, dsIndex);
        await this.dsInstance.init();
    }

    private async prepareFiles() {

        const { project } = mls.actual[5];
        const { mode } = mls.actual[3];
        if (project === undefined || mode === undefined) return;
        this.lastProject = project;
        this.lastDsIndex = mode;
        await this.initDsInstance(project, mode);
        await mls.stor.server.loadProjectInfoIfNeeded(project);
        const listDs = mls.l5.ds.list(project);
        if (!this.dsInstance) return;
        const nameDs = listDs[this.dsInstance.dsindex].dsName;

        const rc: IStoreFiles = {};
        const listFiles: IStoreFiles = mls.stor.files;
        const onlyProjects = Object.keys(listFiles).filter((file) => listFiles[file].project === project);
        onlyProjects.forEach((item) => {
            const { level, folder, status } = listFiles[item];
            if (status === 'deleted') return;
            if (level === 3 && (folder.startsWith(`ds/${nameDs}/`) || folder === `ds/${nameDs}`)) rc[item] = listFiles[item];
        });

        this.files.list = rc;
        this.files.project = project;
        this.files.readOnlyFiles = [];
        this.files.readOnlyFolders = ['ds', `ds/${nameDs}`, `ds/${nameDs}/docs`, `ds/${nameDs}/css`, `ds/${nameDs}/css`, `ds/${nameDs}/components*`];


        Object.entries(this.files.list).forEach((entry) => {
            const [key, value] = entry;
            const parts = value.folder.split('/');
            let currentFolder: any = this.tree;

            parts.forEach(folder => {
                currentFolder[folder] = currentFolder[folder] || {};
                currentFolder = currentFolder[folder];
            });

            currentFolder[key] = {
                shortName: value.shortName,
                folder: value.folder,
                info: { ...value }
            };

        })
    }

    private async onDsAssetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const params: IAssetsEventChangedParams = JSON.parse(ev.desc);
        if (params.position === 'left') return;
        if (params.action === "delete") {
            this.onDelete();
        }
    }

    private async onDelete() {

        this.actualFiles = [];
        // await this.prepareFiles();
        this.updateActualFiles(this.actualPath);
        const params: IAssetsEventSelectedParams = {
            service: [],
        };
        mls.events.fire([3], ['DSAssetsUnSelected'], JSON.stringify(params), 500);
    }

    private handleFolderClick(e: MouseEvent, folder: string) {
        e.stopPropagation();
        this.actualPath = folder;
        this.updateActualFiles(folder);
        if (!this.treeEl) return;
        const target = e.target as HTMLElement;
        const treeItem = target.closest('.tree-item');
        if (!treeItem) return;
        const details = treeItem.closest('details');

        if (!treeItem.classList.contains('selected') && details && details.open) e.preventDefault();

        this.treeEl.querySelectorAll('.tree-item').forEach((it) => it.classList.remove('selected'));
        treeItem.classList.add('selected');

    }

    private updateActualFiles(folder: string) {
        const files = this.getFilesInFolder(folder);
        this.filesController.totalFiles = files.length;
        this.filesController.totalFilesSelected = 0;
        this.filesController.filesSelected = new Set([]);
        this.actualFiles = files;
        this.treeController.isNodeReadOnly = this.checkIsReadOnlyNode(folder);
    }

    private checkIsReadOnlyNode(pathFolders: string): boolean {
        let isreadonly: boolean = false;
        this.files.readOnlyFolders.forEach((item: string) => {
            const deep = item.endsWith('*');
            const path = deep ? item.substr(0, item.length - 1) : item;
            if (deep && pathFolders.startsWith(path)) isreadonly = true;
            else if (pathFolders === path) isreadonly = true;
        });
        return isreadonly;
    }

    private getFilesInFolder(folder: string) {
        const filesInFolder: mls.stor.IFileInfo[] = Object.keys(this.files.list).map((key) => {
            if (this.files.list[key].folder === folder && this.files.list[key].status !== "deleted") return this.files.list[key]
        }).filter(value => value !== undefined) as mls.stor.IFileInfo[]
        return filesInFolder;
    }

    private onCheckAllChange(ev: MouseEvent) {

        const val = (ev.target as HTMLInputElement).checked;
        if (!this.tbody) return;
        this.tbody.querySelectorAll('input[type="checkbox"').forEach((item) => {
            const input = (item as HTMLInputElement);
            input.checked = val;
            input.closest('tr')?.classList.toggle('selected', val);
        });

        if (val) this.filesController.totalFilesSelected = 0;

        this.actualFiles.forEach((item) => {
            if (val) this.addSelectedItem(item);
            else this.removeSelectedItem(item);
        });

    }

    private addSelectedItem(item: mls.stor.IFileInfo) {
        this.filesController.totalFilesSelected += 1;
        this.filesController.filesSelected.add(item);
        this.fireEventSelectedsItens();
    }

    private removeSelectedItem(item: mls.stor.IFileInfo) {
        this.filesController.totalFilesSelected -= 1;
        this.filesController.filesSelected.delete(item);
        this.fireEventSelectedsItens();
    }

    private fireEventSelectedsItens() {
        if (this.filesController.totalFilesSelected === 1) {

            const [file] = this.filesController.filesSelected;
            const extensiosServicesKey = Object.keys(this.serviceByExtensions);
            extensiosServicesKey.forEach((key) => {
                if (this.serviceByExtensions[key].includes(file.extension)) this.filesController.helper = [key, '_100554_serviceDsAssetsOverview'];
            });
            this.filesController.readOnly = this.treeController.isNodeReadOnly;

        } else {
            this.filesController.helper = ['_100554_serviceDsAssetsOverview'];
            this.filesController.readOnly = true;
        }

        this.filesController.filesSelectedArr = Array.from(this.filesController.filesSelected)

        const params: IAssetsEventChangedParams = {
            action: 'show',
            info: this.filesController,
            position: 'left'
        }

        mls.events.fire([3], ['DSAssetsChanged'], JSON.stringify(params));
    }

    private onFileClick(e: MouseEvent, item: mls.stor.IFileInfo) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (!tr) return;
        const check = tr.querySelector('input[type="checkbox"]') as HTMLInputElement;
        tr.classList.toggle('selected');

        if ((target as HTMLElement).tagName !== 'INPUT') check.checked = !check.checked;
        if (check.checked) this.addSelectedItem(item);
        else this.removeSelectedItem(item);

        if (this.filesController.totalFiles === this.filesController.totalFilesSelected) this.toogleCheckBoxAll(true);
        else this.toogleCheckBoxAll(false);
    }


    private toogleCheckBoxAll(checked: boolean) {
        if (!this.checkBoxAll) return;
        this.checkBoxAll.checked = checked;
    }

    private async onActionAddConfirm() {

        if (!this.inputFile || !this.dsInstance) return;

        const tags = this.inputTags?.value.trim().split(',') || [];
        const description = this.txtDesc?.value || '';
        const assetType = this.selectType?.value as mls.l3.AssetsGroupType;
        const file = this.inputFile.files ? this.inputFile.files[0] : undefined;
        if (!file) return;

        const content = file;
        const path = this.actualPath;
        await this.dsInstance.assets.add(path, file.name, tags, description, assetType, content, undefined);
        // await this.prepareFiles();
        this.updateActualFiles(this.actualPath);
        this.isAddMode = false;

    }

    private onActionAddCancel() {
        this.isAddMode = false;
    }

    private onAddNewFileClick() {
        this.isAddMode = true;
    }

    renderNode(key: string, node: any, folder: string): any {

        const isFile = (str: string) => {
            return str.split('_').length > 1;;
        }

        const hasFolderInNode = (checkNode: any) => {
            const keysNode = Object.keys(checkNode);
            const check = keysNode.filter((nd) => isFile(nd));
            return keysNode.length > check.length;
        }

        if (!isFile(key)) {
            const newFolder = folder ? `${folder}/${key}` : key;
            const hasFolder = hasFolderInNode(node);

            if (hasFolder) {
                return html`
                    <details style="margin-left: 1rem;" folder=${newFolder} @click=${(e: MouseEvent) => this.handleFolderClick(e, newFolder)}>
                        <summary class="tree-item">${key}</summary>
                        ${Object.keys(node).map(keyC => this.renderNode(keyC, node[keyC], newFolder))}
                    </details>
                `;
            }

            return html`
                    <div class="tree-item" style="margin-left: 1rem;" folder=${newFolder} @click=${(e: MouseEvent) => this.handleFolderClick(e, newFolder)}>
                        ${key}
                    </div>
                `;
        }
    }

    private renderTable() {
        const typesAssets: mls.l3.AssetsGroupType[] = ['image', 'video', 'icon', 'lib', 'other'];

        return html`

            <table class=${this.isAddMode ? "hidden" : ""}>
                <thead>
                    <tr>
                        <th>
                            <input id="checkAll" type="checkbox" @change=${(ev: MouseEvent) => { this.onCheckAllChange(ev); }}></input>
                        </th>
                        <th>#</th>
                        <th>${this.msg.name}</th>
                        <th>${this.msg.versionRef}</th>
                    </tr>
                    
                </thead>
                <tbody>

                ${repeat(this.actualFiles, ((key: any) => key) as any,
                    ((k: any, index: any) => {
                        const extWithoutDot: string = k.extension.substring(1, k.extension.length);
                        const extension = this.objIcons[extWithoutDot];
                        const typeFileIcon = extension || this.objIcons['none'];
                        return html`
                            <tr @click=${(e: MouseEvent) => { this.onFileClick(e, k) }}>
                                <td>
                                    <input type="checkbox"></input>
                                </td>
                                <td>
                                    <i class="${typeFileIcon}"></i>
                                </td>
                                <td>${k.shortName}</td>
                                <td>${k.versionRef}</td>
                            </tr>
                        `
                    }) as any

                )}
                </tbody>
            </table>
            <div class="actions" style="display:${this.treeController.isNodeReadOnly ? 'none' : ''}">
                <button
                    style="display:${this.isAddMode ? 'none' : 'block'}"
                    @click=${() => { this.onAddNewFileClick(); }}>
                ${this.msg.addNewFile}
                </button>
            </div>

            <div class="add-file-container ${this.isAddMode ? 'visible' : ''}">
                <input class="inputFile" type="file"></input>
                <select class="selectType">
                    ${typesAssets.map((t) => {
            return html`
                            <option value=${t}>${t}</option>
                        `
        })}
                </select>
                <textarea class="txtDesc" placeholder="${this.msg.description}"></textarea>
                <collab-input-tag-100554></collab-input-tag-100554>
                <div class="add-container-actions ${this.isAddMode ? 'visible' : ''}">
                    <button @click=${() => { this.onActionAddConfirm(); }}>${ this.msg.confirm}</button>
                    <button @click=${() => { this.onActionAddCancel(); }}>${ this.msg.cancel}</button>
                </div>
            </div>
        `
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
            <div>
                ${this.loading
                ? html`<p>${this.msg.loading}</p>`
                : html`
                    <div class="assets-container">
                        <div class="assets-tree">
                            ${Object.keys(this.tree).map((item) => {
                    return this.renderNode(item, this.tree[item], '');
                })}
                        </div>
                        <div class="assets-details">
                            ${this.renderTable()}
                        </div> 
                    </div> 
                    `
            }`;
    }
}

export interface IFileController {
    totalFiles: number,
    totalFilesSelected: number,
    filesSelected: Set<mls.stor.IFileInfo>,
    filesSelectedArr: mls.stor.IFileInfo[],
    helper: string[],
    readOnly: boolean
}

export interface IAssetsEventChangedParams {
    info: IFileController,
    position: "left" | "right",
    action: "show" | "delete" | "update"
}

interface IFiles {
    list: IStoreFiles,
    project: number | undefined,
    readOnlyFolders: string[],
    readOnlyFiles: string[],
}

interface TreeNode {
    [key: string]: ITreeItemFolder | mls.stor.IFileInfo;
}

interface ITreeItemFolder {
    shortName: string;
    folder: string;
}


export interface IAssetsEventSelectedParams {
    service: string[]
}

type IStoreFiles = Record<string, mls.stor.IFileInfo>
