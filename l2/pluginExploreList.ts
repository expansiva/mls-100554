/// <mls shortName="pluginExploreList" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { selectLevel, forceServiceInstance, getBaseTemplate } from './_100554_libCommom';
import { cloneAllFiles, deleteAllFiles, renameAllFiles, undoAllFiles } from './_100554_collabLibStor';
import { createAllModels, readProjectTypescriptAndCompile } from './_100554_collabLibModel';
import { ServiceBase } from './_100554_serviceBase';
import './_100554_serviceListFilesAdd';

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

export const pluginData: mls.plugin.IPluginData = {
    title: "List",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

export class PluginExploreList extends PluginBaseModule {

    public async createModels(stor: mls.stor.IFileInfo) {
        await createAllModels(stor);
    }

    private resizeObserver: ResizeObserver | undefined;

    private myDep: number[] = [];

    private msg: MessageType = messages['en'];

    public service: ServiceBase | undefined;

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property() mode: string = 'list';

    @property() refresh: string = '';

    @property() position: string = 'left';

    @property() levelFiles: number = 2;

    @property() project: number = 1; // -1: mode folder; 0: all project

    @property() modeView: number = 0; // 0: alphabetical; 1: folder

    @property() projectLabel: string = '1';

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property({ type: Array }) history: mls.stor.IFileInfo[] = [];

    @queryAll('li') lis: HTMLElement[] | undefined;

    constructor() {
        super();
        this.setEvents();
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

    private async showAdd() {
        await import('./_100554_serviceListFilesAdd');
        this.inFilter = false;
        this.mode = 'add';
    }

    private filesInLocal: mls.stor.IFileInfo[] = [];

    //--------EVENTS----------

    private setEvents() {

        mls.events.addEventListener([2, 5], ['ProjectSelected'], (ev) => {
            if (this.project === mls.actualProject) return;
            this.init();
        });

        mls.events.addListener(5, 'FileAction', (ev) => {

            if ((ev.type !== 'FileAction')) return;
            // if (this.visible === undefined || this.visible === null || (this.visible && this.visible === 'false')) return;
            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;
            if (!['projectListChanged'].includes(fileAction.action)) return;
            this.init();

        });

        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));

        mls.events.addListener(2, 'styleChanged' as any, (ev) => {
            this.changeList();
        });

        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));


    }

    private onlevelChange(ev: mls.events.IEvent) {
        this.changeList();
        this.showLoading(false);
    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (![1, 2, 3, 4, 5].includes(ev.level) || (ev.type !== 'FileAction')) return;
        const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

        if (
            !['statusOrErrorChanged', 'projectListChanged', 'new'].includes(fileAction.action) ||
            fileAction.project === 0
        ) return;

        setTimeout(() => {
            this.init();

        }, 1000);


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
        if (!this.autoPrepare) return;
        this.prepare();
        forceServiceInstance(2, '_100554_serviceSource');

    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
        if (propMode && this.mode === 'list') {
            this.init();
        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.mode === 'list') {
            return html`
            <div class="contentServiceList scroll-custom">
                ${this.renderHeader()}
                <ul>
                    ${this.renderHistory()}
                    ${this.modeView === 1 ? this.renderFolder() : this.renderList()}
                </ul>
            </div>
        `;
        } else {

            return html`${this.renderAdd()}`

        }

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
                    <input name="projectFilter" class="toolbar__search" type="text" placeholder="Filter" @input="${this.filterLiChange}">
                </div>

                <div class="toolbar__center">
                    <div class="toolbar__radio-group">
                        <label @click="${this.clickRadioProjectActual}" title="project">
                            <input type="radio" name="${this.position}project" value="${this.projectLabel}" checked />
                            <span>${this.projectLabel}</span>
                        </label>
                        <label @click="${this.clickRadioProject0}" title="all project">
                            <input type="radio" name="${this.position}project" value="0" />
                            <span>${this.msg.localProject}</span>
                        </label>
                    </div>

                    <div class="toolbar__radio-group">
                        <label @click="${this.clickRadioSortAlph}" title="sort alphabetical">
                            <input type="radio" name="${this.position}group"  value="alphabetical" checked />
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 576 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.6 469.6C177.5 476.2 169 480 160 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L128 365.7 128 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 301.7 32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 320c0-17.7 14.3-32 32-32l128 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9L429.3 416l50.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-128 0c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9L402.7 352 352 352c-17.7 0-32-14.3-32-32zM416 32c12.1 0 23.2 6.8 28.6 17.7l64 128 16 32c7.9 15.8 1.5 35-14.3 42.9s-35 1.5-42.9-14.3L460.2 224l-88.4 0-7.2 14.3c-7.9 15.8-27.1 22.2-42.9 14.3s-22.2-27.1-14.3-42.9l16-32 64-128C392.8 38.8 403.9 32 416 32zM395.8 176l40.4 0L416 135.6 395.8 176z"/></svg>
                            </span>
                        </label>
                        <label @click="${this.clickRadioSortFolder}" title="sort folder">
                            <input type="radio" name="${this.position}group" value="folder" />
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 576 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32l0 96L0 384c0 35.3 28.7 64 64 64l192 0 0-64L64 384l0-224 192 0 0-64L64 96l0-64zM288 192c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l-98.7 0c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4L320 0c-17.7 0-32 14.3-32 32l0 160zm0 288c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l-98.7 0c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4L320 288c-17.7 0-32 14.3-32 32l0 160z"/></svg></span>
                        </label>
                    </div>
                    <button class="toolbar__add-button" title="new file" @click="${this.showAdd}">+</button>
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

    renderHistory() {

        return html`
            ${this.history.length <= 0 ? '' :
                html`
                    <li class="headerTitle">
                        ${+this.project === 0 ? `${this.msg.history} (All Projects)` : `${this.msg.history}`}
                    </li>
                    ${repeat(
                    this.history,
                    ((item: mls.stor.IFileInfo) => 'h_' + item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)) as any
                )}
                `
            }
        `;
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
                                    ${this.renderLiItem(file, index, false)}
                                `
                        }

                        return this.renderLiItem(file, index, false)

                    }) as any
                )}
                `
            }
        `;
    }

    renderFolder() {

        const folders: Record<string, mls.stor.IFileInfo[]> = {};
        this.files.forEach((f) => {
            let folder = f.folder;
            let aux = this.project === 0 ? f.project + '/' : '';
            if (!f.folder) folder = 'root';

            const keyFolder = aux + folder;
            if (folders[keyFolder]) folders[keyFolder].push(f);
            else folders[keyFolder] = [f];
        });
        let keys = Object.keys(folders).sort();

        if (keys.length <= 0) return html``;

        return html`
        ${repeat(keys, ((item: string) => item) as any, ((key: string, index: any) => {

            return html`
                <li class="headerTitle">${key}</li>
                ${this.renderFolder2(folders[key])}
            `
        }) as any
        )}`


    }

    renderFolder2(files: mls.stor.IFileInfo[]) {

        return html`
            ${files.length <= 0 ? '' :
                html`
                    ${repeat(
                    files,
                    ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => {

                        return this.renderLiItem(file, index, false)

                    }) as any
                )}
                `
            }
        `;
    }

    getTitleInLocalStorage(ts: mls.stor.IFileInfo, html: mls.stor.IFileInfo, less: mls.stor.IFileInfo, test: mls.stor.IFileInfo, defs: mls.stor.IFileInfo) {


        const tsLocal = ts && ts.inLocalStorage && this.verifyDifBaseTemplate(ts);
        const htmlLocal = html && html.inLocalStorage && this.verifyDifBaseTemplate(html);
        const styleLocal = less && less.inLocalStorage && this.verifyDifBaseTemplate(less);
        const testLocal = test && test.inLocalStorage && this.verifyDifBaseTemplate(test);
        const defsLocal = defs && defs.inLocalStorage && this.verifyDifBaseTemplate(defs);

        let rc = '';
        if (tsLocal) rc = rc + '.ts ';
        if (htmlLocal) rc = rc + '.html ';
        if (styleLocal) rc = rc + '.less ';
        if (testLocal) rc = rc + '.test.ts ';
        if (defsLocal) rc = rc + '.defs.ts ';

        return rc;
    }

    renderLiItem(file: mls.stor.IFileInfo, index: number, inHistory: boolean) {

        const name = this.getAllName(file, inHistory);
        const nameFilter = inHistory ? '*******' : name.toLocaleLowerCase();

        let auxVersion = '';
        let auxStorage = '';
        let auxBug = '';
        let auxHtml = '';

        const keyHtml = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.html');
        const keyStyle = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.less');
        const keyTest = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.test.ts');
        const defsTest = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.defs.ts');

        const styleFile = mls.stor.files[keyStyle];
        const htmlFile = mls.stor.files[keyHtml];
        const testFile = mls.stor.files[keyTest];
        const defsFile = mls.stor.files[defsTest];

        const htmlError = htmlFile && htmlFile.hasError;
        const styleError = styleFile && styleFile.hasError;
        const testError = testFile && testFile.hasError;
        const defsError = defsFile && defsFile.hasError;


        const titleLocalStorage = this.getTitleInLocalStorage(file, htmlFile, styleFile, testFile, defsFile);
        if (titleLocalStorage) {
            auxStorage = `<span title=" ${titleLocalStorage} in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.hasError || styleError || htmlError || testError || defsError) {
            auxBug = `<span title="bug" class="fa fa-bug" style="color:rgb(169, 3, 3); height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.isLocalVersionOutdated) {
            auxVersion = `<span title="need conciliation" class="fa fa-unbalanced" style="color:orange; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        const style = this.inFilter && inHistory ? 'display:none' : '';
        const actualL2 = (mls.actual[2] as any)[this.position]?.shortName;
        const actualL2Folder = (mls.actual[2] as any)[this.position]?.folder;

        const validProject = this.project === 0 && mls.actualProject !== file.project && file.project !== 0 ? false : true;

        let auxValidProject = '';

        return html`
            <li @click="${this.clickOptOpen}" class="${file.shortName === actualL2 && file.folder === actualL2Folder ? 'selected' : ''}" style="${style}${auxValidProject}" .myFile=${file} .nameFilter="${nameFilter}" ?disabled=${!validProject}>
                <div class="elContent">
                    <div class="groupHiddenList" @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-undo" title="${this.msg.undo}" @click="${this.clickOptUndo}"></span>
                        <span class="mls-gpbtnslider-item fa fa-clone" title="${this.msg.clone}" @click="${this.clickOptClone}"></span>
                        <span class="mls-gpbtnslider-item fa fa-file-pen" title="${this.msg.rename}" @click="${this.clickOptRename}"></span>
                        <span class="mls-gpbtnslider-item fa fa-trash" title="${this.msg.delete}" @click="${this.clickOptDel}"></span>
                        <span class="mls-gpbtnslider-item fa-solid fa-shield-halved" title="${this.msg.security}" @click="${this.clickOptOpenSecurity}"></span> 
                    </div>
                    <span class="spanFileName ${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                    <div style="display:flex; gap:.5rem" .innerHTML="${auxStorage + auxBug + auxVersion + auxHtml}"></div>
                </div>
            </li>
        `;

    }

    renderAdd() {
        return html`<service-list-files-add-100554 level="${this.levelFiles}" position="${this.position}" .father="${this}"></service-list-files-add-100554>`
    }

    //------------ ACTIONS -----------------

    private getAllName(file: mls.stor.IFileInfo, isHistory = false): string {
        let name = '';
        const folder = file.folder ?  file.folder : '';
        if (this.modeView === 0 && this.project === 0) {
            name = '_' + file.project + '_' + folder + '/' + file.shortName
        } else if (this.modeView === 0 && this.project > 0) {
            name = folder ? folder + '/' + file.shortName : file.shortName;
        } else {
            name = file.shortName;
        }

        if (isHistory && folder) name = folder + '/' + file.shortName;
        if (isHistory && this.project === 0) name = file.project + '_' +folder + '/' + file.shortName;

        return name;
    }

    private showLoading(show: boolean) {
        if (this.service) this.service.loading = show;
    }

    private showError(error: string) {
        if (this.service) this.service.setError(error);
    }

    private closeAllMenus() {
        const all = this.querySelectorAll('.activegpbtnslider');
        Array.from(all).forEach((i) => i.classList.remove('activegpbtnslider'));
    }

    private async clickOptUndo(e: MouseEvent) {

        try {
            e.stopPropagation();
            const mfile = this.getMyFileInElement(e.target as HTMLElement);
            if (!mfile) return;
            await undoAllFiles(mfile);
            this.closeAllMenus();
            this.changeList();
        } catch (err: any) {
            this.showError(err.message);
        }

    }

    private async clickOptDel(e: MouseEvent) {

        try {
            e.stopPropagation();
            const mfile = this.getMyFileInElement(e.target as HTMLElement);
            if (!mfile) throw new Error('[clickOptDel] Not found file');
            await deleteAllFiles(mfile)
            this.closeAllMenus();
            this.changeList();
        } catch (err: any) {
            this.showError(err.message);
        }


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
        this.setHistory(mfile);
        if (mls.actualLevel != 1) selectLevel(2);
        this.fireEvents('open', mfile, {});

    }

    private async clickOptOpenSecurity(e: MouseEvent) {

        e.stopPropagation();
        const target = e.target as HTMLElement;
        const li = target.closest('li');
        this.lis?.forEach((l) => l.classList.remove('selected'));
        if (li) li.classList.add('selected');

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        this.setHistory(mfile);
        if (mls.actualLevel != 1) selectLevel(2);
        (window as any).securityMode = true;
        this.fireEvents('open', mfile, {});
        this.closeAllMenus();

    }

    private clickOptRename(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li');
        if (!li) {
            this.showError('[clickOptRename] Not found element');
            return;
        }
        const spanFileName = li.querySelector('.spanFileName') as HTMLElement;
        spanFileName.setAttribute('contentEditable', 'true');

        const oldValue = spanFileName.innerText;
        li.onclick = () => { };

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile || !spanFileName) {
            this.showError('[clickOptRename] Not found element rename');
            return;
        }

        spanFileName.onkeydown = (event: KeyboardEvent) => {

            if (event.key === "Enter") {
                event.preventDefault(); // evita quebra de linha
                const param = { project: mfile.project.toString(), name: spanFileName.innerText.trim(), mode: 'rename' };
                if (!this.isValidNewName(mfile, param)) {
                    this.showError('[rename] invalid name');
                    return;
                };
                this.renameFile(mfile, param);
            }
        }

        spanFileName.onblur = () => {

            spanFileName.innerText = oldValue;
            spanFileName.removeAttribute('contentEditable');
            this.changeList();
        }

        spanFileName.focus();

        this.closeAllMenus();

    }

    private clickOptClone(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const myfile = this.getMyFileInElement(el);
        if (!myfile) {
            this.showError('[clickOptClone] Not found file!');
            return;
        }

        this.cloneFile(myfile);
        this.closeAllMenus();
    }

    private async cloneFile(storFile: mls.stor.IFileInfo) {

        try {
            this.showLoading(true);

            let idx = 2;
            let isvalidName = false;
            let name = ''
            while (!isvalidName) {

                name = storFile.shortName + idx;
                const ret = this.isValidNewName(storFile, { project: storFile.project.toString(), name: name, mode: 'clone' });
                if (!ret) {
                    idx++;
                } else {
                    isvalidName = true;
                }
            }

            const file = await cloneAllFiles(storFile, storFile.project, name)
            if (!file.ts || file.ts instanceof Error) return;

            this.setHistory(file.ts);
            if (mls.actualLevel != 1) selectLevel(2);
            //this.fireEvents('open', file.ts, {});
            this.changeList(100);

        } catch (e: any) {

            this.showError(e.message);
            setTimeout(() => this.showLoading(false), 500);

        }


    }

    private async renameFile(storFile: mls.stor.IFileInfo, info: { project: string, name: string }) {

        try {
            this.showLoading(true);
            const file = await renameAllFiles(storFile, +info.project, info.name)
            if (!file.ts || file.ts instanceof Error) return;

            this.setHistory(file.ts);
            if (mls.actualLevel != 1) selectLevel(2);
            //this.fireEvents('open', file.ts, {});
            this.changeList(100);

        } catch (e: any) {

            this.showError(e.message);
            setTimeout(() => this.showLoading(false), 500);

        }


    }

    private async fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): Promise<void> {

        try {

            this.showLoading(true);
            const params = {} as mls.events.IFileAction;

            const files = await createAllModels(file);

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = this.position as ('right' | 'left');

            if (info && info.shortName) {
                params.newshortName = info.shortName;
                params.newProject = info.project;
                params.newfolder = file.folder;
            }

            if (['open'].includes(action)) {

                const lv = mls.actualLevel == 1 ? 1 : this.levelFiles;

                mls.actual[lv as any].setFullName(`_${file.project}_${file.shortName}`);
                mls.actual[lv as any][this.position as ('right' | 'left')] = file

            }

            if (mls.actualLevel == 1) {
                mls.events.fire([1], ['FileAction'], JSON.stringify(params), timeout);
            } else {
                mls.events.fire([(+(this.levelFiles as any) as any)], ['FileAction'], JSON.stringify(params), timeout);
            }

            if (['open'].includes(action)) return;
            this.showLoading(false);
            this.changeList(100);

        } catch (err: any) {

            this.showError('false');
            this.showError(err.message || '[fireEvents]: erro open');
            this.showLoading(false);
        }


    }

    private fireEventThisProject = 0;
    private fireEventLoadProject(): void {

        if (this.fireEventThisProject === mls.actualProject) return;
        this.fireEventThisProject = mls.actualProject as number;
        readProjectTypescriptAndCompile(mls.actualProject as number, '', true);
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

    private extensionLevel = {
        2: '.ts',
        4: '.html'
    }


    private async init() {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.project = mls.actualProject || 0;
        const prjs = mls.l5.getProjectDetails(this.project)?.prj_dependencies || []
        this.myDep = [...prjs];
        this.myDep.push(this.project);
        this.projectLabel = this.project.toString();
        this.fireEventLoadProject();
        await this.getFiles();

    }

    private getMyFileInElement(el: HTMLElement): mls.stor.IFileInfo | undefined {

        el = el.closest('li') as HTMLElement;
        if (!el || !(el as any)['myFile']) return;
        const mfile = (el as any)['myFile'] as mls.stor.IFileInfo
        return mfile;

    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        if (el.classList.contains('activegpbtnslider')) {
            const li = el.closest('li') as HTMLElement;
            const elContentAux = li.querySelector('.elContentAux') as HTMLElement;
            if (elContentAux) elContentAux.style.display = 'none';
        }
        el.classList.toggle('activegpbtnslider');

    }

    private clickHiddenAux(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const elContentAux = el.closest('.elContentAux') as HTMLElement;
        if (!elContentAux) return;

        const iptProj = elContentAux.querySelector('.spanPrj input') as HTMLInputElement;
        const iptName = elContentAux.querySelector('.spanName input') as HTMLInputElement;

        if (iptName) iptName.value = '';
        if (iptProj) iptProj.value = this.project.toString();

        elContentAux.style.display = 'none';

    }

    private clickOptStop(e: MouseEvent) {
        e.stopPropagation();
    }

    private async clickRadioProject0(e: MouseEvent) {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.project = 0;
        await this.getFiles();

    }

    private async clickRadioProject1(e: MouseEvent) {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.project = -1;
        await this.getFiles();

    }

    private clickRadioProjectActual(e: MouseEvent): void {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.project = mls.actualProject as number;
        this.getFiles();
    }

    private clickRadioSortAlph(e: MouseEvent): void {
        this.modeView = 0;
    }

    private clickRadioSortFolder(e: MouseEvent): void {
        this.modeView = 1;
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

    private async verifyChangeInList(e: MouseEvent) {
        try {
            await this.verifyChangeInList2(e);
        } catch (e) {

        }
    }

    private async verifyChangeInList2(e: MouseEvent) {

        try {

            e.stopPropagation();
            const el = e.target as HTMLElement;
            if (!el) return;

            const isClick = el.innerText === 'updated';
            if (isClick) return;
            el.innerText = 'updated';

            const ret = await mls.l2.typescript.compileAll(mls.actualProject as number);
            this.setFilesErros(ret);

            this.changeList(500);

            setTimeout(() => {
                if (!this) return;
                el.innerText = 'update list/ verify';
            }, 50000);

        } catch (e: any) {
            console.info('Error verifyChangeInList2:' + e.message);
        }

    }

    private setFilesErros(array: string[]) {

        const ret: mls.stor.IFileInfo[] = [];
        const itens = array.map(str => str.replace(/^--- Error compiling\s+/, ''));

        itens.forEach((f) => {

            let pr = f.substring(1).split("_")[0];
            let prID: number = Number(pr);
            if (isNaN(prID)) prID = 0; // error
            let path = f.substring(pr.length + 2);
            const key = mls.stor.getKeyToFiles(prID, 2, path, '', '.ts');
            if (mls.stor.files[key]) {
                mls.stor.files[key].hasError = true;
                ret.push(mls.stor.files[key]);
            }

        })

        return ret;

    }

    private async getFiles() {

        try {
            const arraySf: mls.stor.IFileInfo[] = await this.getFilesProject();
            const arraySfHistory: mls.stor.IFileInfo[] = await this.getFileHistory();
            this.files = [...arraySf];
            this.history = [...arraySfHistory];
        } catch (e) {
            console.info(e);
        }

    }

    private async getFilesProject(): Promise<mls.stor.IFileInfo[]> {

        if (!window['mls']) return [];
        this.filesInLocal = [];
        const arraySf: mls.stor.IFileInfo[] = [];
        const ext = (this.extensionLevel as any)[this.levelFiles as any] as string;

        for (const i of Object.keys(mls.stor.files)) {

            const sf = mls.stor.files[i];
            if (
                //sf.project !== this.project  ||
                !this.myDep.includes(sf.project) ||
                sf.level !== +(this.levelFiles as any) ||
                sf.extension !== ext
            ) continue;

            if (this.project === mls.actualProject && sf.project !== this.project) continue;

            if (this.project === -1 && sf.project !== mls.actualProject) continue;

            if (mls.actualLevel === 1 && !sf.shortName.startsWith('be')) {
                continue;
            }
            else if (mls.actualLevel === 3 && !sf.shortName.startsWith('page')) {
                continue;
            }
            else if ([2, 4, 5, 6, 7].includes(mls.actualLevel) && sf.shortName.startsWith('be')) {
                continue;
            } 

            const keyHtml = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.html');
            const keyStyle = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.less');
            const keyTestFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.test.ts');
            const keyDefsFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.defs.ts');

            const styleFile = mls.stor.files[keyStyle];
            const htmlFile = mls.stor.files[keyHtml];
            const testFile = mls.stor.files[keyTestFile];
            const defsFile = mls.stor.files[keyDefsFile];

 


            const htmlLocal = htmlFile && htmlFile.inLocalStorage && await this.isDifBaseTemplate(htmlFile);
            const styleLocal = styleFile && styleFile.inLocalStorage && await this.isDifBaseTemplate(styleFile);
            const testLocal = testFile && testFile.inLocalStorage && await this.isDifBaseTemplate(testFile);
            const defsLocal = defsFile && defsFile.inLocalStorage && await this.isDifBaseTemplate(defsFile); 

            const htmlError = htmlFile && htmlFile.hasError;
            const styleError = styleFile && styleFile.hasError 
            const testError = testFile && testFile.hasError;
            const defsError = defsFile && defsFile.hasError;

            this.info.tot++;

            if (sf.isLocalVersionOutdated) this.info.version++;
            if (sf.inLocalStorage || htmlLocal || styleLocal || testLocal || defsLocal) {
                this.filesInLocal.push(sf);
                this.info.storage++;
            }
            if (sf.hasError || htmlError || styleError || testError || defsError) this.info.error++;

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

    private async isDifBaseTemplate(file: mls.stor.IFileInfo): Promise<boolean> {

        if (!file.inLocalStorage || !file.getValueInfo) return false;

        const vl = await file.getValueInfo();
        const { folder, shortName, project, extension } = file;

        let source = '';
        switch (file.extension) {
            case ('.ts'):
                source = getBaseTemplate({ folder, shortName, project, extension: '.ts' }, '_100554_enhancementLit');
                break;
            case ('.html'):
                source = getBaseTemplate({ folder, shortName, project, extension: '.html' });
                break;
            case ('.less'):
                source = getBaseTemplate({ folder, shortName, project, extension: '.less' }, 'enhancementStyle');
                break;
            case ('.test.ts'):
                source = getBaseTemplate({ folder, shortName, project, extension: '.test.ts' });
                break;
            case ('.defs.ts'):
                source = getBaseTemplate({ folder, shortName, project, extension: '.defs.ts' });
                break;
        }

        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, extension);
        if (!this.dataDifBaseTemplate[key]) this.dataDifBaseTemplate[key] = vl.content !== source;

        return vl.content !== source;

    }

    private async getFileHistory() {

        try {
            if (!window['mls']) return [];
            let arraySfHistory: mls.stor.IFileInfo[] = [];
            const lh = this.getHistory();
            if (lh.length <= 0 || !window['mls']) {

                const diff = this.filesInLocal.filter(a =>
                    !arraySfHistory.some(b => b.shortName === a.shortName && b.folder === a.folder)
                );

                arraySfHistory = [...arraySfHistory, ...diff];
                return arraySfHistory;
            }

            for await (const i of lh) {

                let key = mls.stor.getKeyToFiles(i.project, this.levelFiles as any, i.shortName, i.folder, i.extension);

                if (!mls.stor.files[key] && +this.project === 0) {
                    await mls.stor.server.loadProjectInfoIfNeeded(i.project);
                    key = mls.stor.getKeyToFiles(i.project, this.levelFiles as any, i.shortName, i.folder, i.extension);
                }

                if (!mls.stor.files[key] || (i.project !== +this.project && +this.project !== 0)) continue;

                if (i.project !== mls.actualProject && !this.myDep.includes(i.project)) continue;

                if (mls.actualLevel == 1 && i.shortName.startsWith('be')) {
                    arraySfHistory.push(mls.stor.files[key]);
                }
                else if (mls.actualLevel == 3 && i.shortName.startsWith('page')) {
                    arraySfHistory.push(mls.stor.files[key]);
                }
                else if ([2, 4, 5, 6, 7].includes(mls.actualLevel) && !i.shortName.startsWith('be')) {
                    arraySfHistory.push(mls.stor.files[key]);
                }

            }

            const diff = this.filesInLocal.filter(a =>
                !arraySfHistory.some(b => b.shortName === a.shortName && b.folder === a.folder)
            );

            arraySfHistory = [...arraySfHistory, ...diff]

            return arraySfHistory.filter((obj, index, self) =>
                index === self.findIndex(o =>
                    o.project === obj.project &&
                    o.shortName === obj.shortName &&
                    o.folder === obj.folder
                )
            );

        }
        catch (e: any) {
            console.info('[pluginExploreList getFileHistory]', e);
            return [];
        }
    }

    private getHistory(): { project: number, shortName: string, extension: string, folder: string }[] {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.levelFiles as any);
        return info ? JSON.parse(info) : [];

    }

    private setHistory(file: mls.stor.IFileInfo): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.levelFiles as any);
        const res: any[] = info ? JSON.parse(info) : [];
        let idx = -1;
        res.forEach((i: any, index) => {
            if (i.project !== file.project || i.shortName !== file.shortName || i.folder !== file.folder) return;
            idx = index;
        });

        if (idx >= 0) {
            res.splice(idx, 1);
        }

        res.unshift({ project: file.project, shortName: file.shortName, extension: file.extension, folder: file.folder });

        if (res.length > 10) {
            for (let i = res.length - 1; i >= 0; i--) {
                if (res.length <= 10) break;
                res.splice(i, 1);
            }
        }

        localStorage.setItem('mlsInfoHistoryL' + this.levelFiles as any, JSON.stringify(res));

    }

    private validInputsAux(file: mls.stor.IFileInfo, action: { mode: string, project: string, name: string }): void {

        if (file.hasError && ['clone', 'rename'].includes(action.mode)) throw new Error('It is not possible to perform this action on files with an error.');

        if (action.mode === 'clone' && !action.name) {

            let idx = 2;
            let isvalidName = false;
            while (!isvalidName) {

                action.name = file.shortName + idx;
                const ret = this.isValidNewName(file, action);
                if (!ret) {
                    idx++;
                } else {
                    isvalidName = true;
                }

            }

            let elContentAux = this.querySelector('.elContentAux') as HTMLElement;
            const iptName = elContentAux.querySelector('.spanName input') as HTMLInputElement;
            if (iptName) iptName.value = action.name;

        }

        if (!this.isValidNewName(file, action)) throw new Error('Invalid name');

    }

    private isValidNewName(file: mls.stor.IFileInfo, action: { mode: string, project: string, name: string }): boolean {

        if (action.project === '' || action.name === '') return false;
        if (action.name.length === 0 || action.name.length > 255) return false;
        const invalidCharacters = /[_\/{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        if (invalidCharacters.test(action.name)) return false;
        const key = mls.stor.getKeyToFiles(+action.project, this.levelFiles as any, action.name, file.folder, file.extension);
        return !mls.stor.files[key];

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

if (!customElements.get('plugin-explore-list-100554')) {
    customElements.define('plugin-explore-list-100554', PluginExploreList);
}