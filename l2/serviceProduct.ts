/// <mls shortName="serviceProduct" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';

/// **collab_i18n_start**

const message_pt = {
    updateListVerify: "atualizar lista/verificar",
    update: "atualizar",
    addNewFile: "adicionar novo arquivo",
    filter: "Filtrar",
    localProject: "Todos",
    projectFolder: "Pasta",
    totalFiles: "arquivos totais",
    filesWithErrors: "arquivos com erros",
    filesInLocalStorage: "arquivos no armazenamento local",
    filesChangedOnTheServer: "arquivos alterados no servidor",
    history: "Histórico",
    undo: "desfazer",
    clone: "clonar",
    rename: "renomear",
    delete: "excluir",
    security: 'segurança',
}

const message_en = {
    updateListVerify: 'update list/ verify',
    update: 'update',
    addNewFile: 'add new file',
    filter: 'Filter',
    projectFolder: "Folder",
    localProject: 'All',
    totalFiles: 'total files',
    filesWithErrors: 'files with errors',
    filesInLocalStorage: 'file in local storage',
    filesChangedOnTheServer: 'files changed on the server',
    history: 'History',
    undo: 'undo',
    clone: 'clone',
    rename: 'rename',
    delete: "delete",
    security: 'security',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-product-100554')
export class ServiceProduct extends ServiceBase {

    private resizeObserver: ResizeObserver | undefined;

    public service: ServiceBase | undefined;

    @property() refresh: string = '';

    private msg: MessageType = messages['en'];

    @property() levelFiles: number = 2;

    @property() project: number = -1; // -1: noFilter; 0: all project

    @property() filterProject: number = -1; // -1: noFilter; 0: all project

    @property() projectLabel: string = '1';

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property() activeTab: string = 'ITasks';

    @queryAll('li') lis: HTMLElement[] | undefined;

    constructor() {
        super();
    }

    private info = {
        tot: 0,
        version: 0,
        storage: 0,
        error: 0,
    }

    async prepare() {
        this.init();
    }

    //----------SERVICE--------------------
    public details: IService = {
        icon: '&#xf6ff',
        state: 'foreground',
        position: 'left',
        tooltip: 'Product',
        visible: true,
        widget: '_100554_serviceProduct',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');

    }

    public onClickTabs(index: number) {
        this.activeTab = ISceneries[index]
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

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
                { text: 'MindMap', icon: 'f5dc' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),

    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'nothing selected';

        switch (this.activeTab) {
            case 'IMindMap':
                name = 'widget-mind-map-l4-100554';
                break;
            default:
                name = 'nothing selected';
        }

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

    //--------EVENTS----------

    private onlevelChange(ev: mls.events.IEvent) {
        this.changeList();
        this.showLoading(false);
    }


    //---------COMPONENT-------------

    connectedCallback() {
        super.connectedCallback();
        this.initObserverResize();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.prepare();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return this.renderModeList();


    }

    renderModeList() {
        return html`
            <div class="contentServiceList scroll-custom">
                ${this.renderHeader()}
                <ul>
                    ${this.renderList()}
                </ul>
            </div>
        `
    }

    renderHeader() {

        let auxV = '';
        let auxE = '';
        let auxS = '';

        if (this.info.version > 0) {

            auxV = `<b>[${this.info.version}]</b> <span class="fa fa-unbalanced"></span> <b>${this.msg.filesChangedOnTheServer}, </b>`;
        }

        if (this.info.error > 0) {

            auxE = `<b>[${this.info.error}]</b> <span class="fa fa-bug"></span><b>${this.msg.filesWithErrors},</b>`;
        }

        if (this.info.storage > 0) {

            auxS = `<b>[${this.info.storage}]</b> <span class="fa fa-location-dot"></span> <b>${this.msg.filesInLocalStorage}.</b>`;
        }



        return html`
        <div class="groupHeader">
            <header class="toolbar">
                <div class="toolbar__left">
                    <input name="projectFilter" class="toolbar__search" type="text" placeholder="Filter" autocomplete="off" @input="${this.filterLiChange}">
                </div>
            </header>
            <div class="groupInfo">
                <span style="margin-right:10px">
                    [${this.info.tot}]
				    <span class="fa fa-file"></span> 
                    ${this.msg.totalFiles}
                </span>
                ${auxV ? html`<span .innerHTML="${auxV}" style="margin-right:10px"></span>` : ''}
                ${auxE ? html`<span .innerHTML="${auxE}" style="margin-right:10px"></span>` : ''}
                ${auxS ? html`<span .innerHTML="${auxS}" style="margin-right:10px"></span>` : ''}
            </div>
        </div>
        `
    }

    renderList() {

        let letterInit = '';
        return html`
            ${this.files.length <= 0 ? '' :
                html`
                    ${repeat(
                    this.files,
                    ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => {

                        if (letterInit !== file.shortName.charAt(0).toUpperCase()) {

                            letterInit = file.shortName.charAt(0).toUpperCase();

                            return html`
                                    <li class="headerTitle">${letterInit} </li>
                                    ${this.renderLiItem(file, index)}
                                `
                        }

                        return this.renderLiItem(file, index)

                    }) as any
                )}
                `
            }
        `;
    }

    renderLiItem(file: mls.stor.IFileInfo, index: number) {
        const name = this.getAllName(file);
        const nameFilter = name.toLocaleLowerCase();

        const style = this.inFilter ? 'display:none' : '';
        const actualL2 = (mls.actual[2] as any)[this.position]?.shortName;
        const actualL2Folder = (mls.actual[2] as any)[this.position]?.folder;
        let auxValidProject = '';

        return html`
            <li @click="${this.clickOptOpen}" class="${file.shortName === actualL2 && file.folder === actualL2Folder ? 'selected' : ''}" style="${style}${auxValidProject}" .myFile=${file} .nameFilter="${nameFilter}" >
                <div class="elContent">
                    <info-item>
                        <span class="spanFileName ${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                    </info-item>    
                </div>
            </li>
        `;

    }

    //------------ ACTIONS -----------------

    private getAllName(file: mls.stor.IFileInfo): string {
        let name = '';
        const folder = file.folder ? file.folder : '';
        if (folder) name = folder + '/' + file.shortName;
        else name = file.shortName;
        return name;
    }

    private showLoading(show: boolean) {
        if (this.service) this.service.loading = show;
    }

    private showError(error: string) {
        if (this.service) this.service.setError(error);
    }

    private async clickOptOpen(e: MouseEvent) {

        e.stopPropagation();
        const target = e.target as HTMLElement;
        const li = target.closest('li');

        if (li && li.querySelector('*[contenteditable]')) return;

        this.lis?.forEach((l) => l.classList.remove('selected'));
        if (li) li.classList.add('selected');

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        this.fireEvents('open', mfile, {});

    }

    private async fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): Promise<void> {

        try {

            const params = {} as mls.events.IFileAction;

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = this.position as ('right' | 'left');

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);


        } catch (err: any) {
            this.showError(err.message || '[fireEvents]: erro open');
        }


    }

    private changeListTimeout: number = 0;
    public changeList(time: number = 500): void {
        this.showLoading(false);
        clearTimeout(this.changeListTimeout);
        this.changeListTimeout = setTimeout(async () => {
            await this.init();

        }, time);

    }

    //------------ IMPLEMENTS -----------------


    private async init() {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.projectLabel = (mls.actualProject || 0).toString();
        await this.getFiles();

    }

    private getMyFileInElement(el: HTMLElement): mls.stor.IFileInfo | undefined {

        el = el.closest('li') as HTMLElement;
        if (!el || !(el as any)['myFile']) return;
        const mfile = (el as any)['myFile'] as mls.stor.IFileInfo
        return mfile;

    }

    private inFilter = false;
    private timeFilterChange = 0;
    private filterLiChange(e: InputEvent) {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;
        clearTimeout(this.timeFilterChange);
        this.timeFilterChange = setTimeout(() => {

            this.inFilter = el.value.length > 0;

            const contentServiceList = el.closest('.contentServiceList');
            if (!contentServiceList) return;

            const all = contentServiceList.querySelectorAll('li');
            all.forEach((li: any) => {

                const name = li.nameFilter ? li.nameFilter : '******';
                const inp = el.value.toLocaleLowerCase();

                if (name.indexOf(inp) >= 0) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            })

        }, 500);

    }

    private async getFiles() {

        try {
            const arraySf: mls.stor.IFileInfo[] = await this.getFilesProject();
            this.files = [...arraySf];
        } catch (e) {
            console.info(e);
        }

    }

    private validFileByLevel(sf: mls.stor.IFileInfo): boolean {

        const ext = '.defs.ts';

        if (
            sf.project !== mls.actualProject ||
            sf.level !== 2 ||
            sf.extension !== ext
        ) return false;

        return true;

    }

    private async getFilesProject(): Promise<mls.stor.IFileInfo[]> {

        if (!window['mls']) return [];
        const arraySf: mls.stor.IFileInfo[] = [];

        for (const i of Object.keys(mls.stor.files)) {

            const sf = mls.stor.files[i];
            if (!this.validFileByLevel(sf)) continue;
            this.info.tot++;
            arraySf.push(sf);
        }

        arraySf.sort((a, b) => a.shortName.localeCompare(b.shortName));

        return arraySf;

    }

    private dataDifBaseTemplate: Record<string, boolean> = {};
    private verifyDifBaseTemplate(file: mls.stor.IFileInfo): boolean {

        const { folder, shortName, project, extension } = file;
        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, extension);

        if (this.dataDifBaseTemplate[key] === undefined) return file.inLocalStorage;

        return this.dataDifBaseTemplate[key];

    }

    private initObserverResize() {

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width < 515) {
                    this.classList.add('breakContent');
                } else {
                    this.classList.remove('breakContent');
                }
            }
        });
        this.resizeObserver.observe(this);
    }

}

enum ISceneries {
    'IMindMap' = 0
}