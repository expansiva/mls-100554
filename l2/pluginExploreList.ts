/// <mls shortName="pluginExploreList" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { selectLevel, forceServiceInstance } from './_100554_libCommom';
import './_100554_serviceListFilesAdd';

/// **collab_i18n_start**

const message_pt = {
    updateListVerify: "atualizar lista/verificar",
    update: "atualizar",
    addNewFile: "adicionar novo arquivo",
    filter: "Filtrar",
    localProject: "Projeto local",
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
    localProject: 'Local project',
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

    private resizeObserver: ResizeObserver | undefined;

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property() mode: string = 'list';

    @property() refresh: string = '';

    @property() position: string = 'left';

    @property() levelFiles: number = 2;

    @property() project: number = 1;

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
            if (this.project === mls.actual[5].project) return;
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
        if (changedProperties.has('mode') && this.mode === 'list') {
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
                    ${this.renderList()}
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
        //verifyChangeInList
        return html`
        <div class="groupHeader">
            <div class="groupAction"> 
                <a @click="${this.verifyChangeInList}" id="${this.position}listUpdateFiles">${this.msg.updateListVerify}</a>
                ${this.position === 'left' ? html`<a @click="${this.showAdd}">${this.msg.addNewFile}</a>` : ''}
            </div>
            <div class="groupFilter">
                
                    <form>
                        <div class="groupFilterRadio">
                            <input id="${this.position}radioProjectActual" name="projectFind" type="radio" checked="checked" value="${this.projectLabel}" @click="${this.clickRadioProjectActual}">
                            <label for="${this.position}radioProjectActual">${this.projectLabel}</label>
                            <input id="${this.position}radioProjectZero" name="projectFind" type="radio" value="0" @click="${this.clickRadioProject0}">
                            <label for="${this.position}radioProjectZero">${this.msg.localProject}</label>
                        </div>
                    </form>
                <input name="projectFilter" type="text" placeholder="Filter" @input="${this.filterLiChange}">
            </div>
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
        `;
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
                    ((item: mls.stor.IFileInfo) => item.shortName) as any,
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
                    ((item: mls.stor.IFileInfo) => item.shortName) as any,
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

    getTitleInLocalStorage(ts: mls.stor.IFileInfo, html: mls.stor.IFileInfo, less: mls.stor.IFileInfo, test: mls.stor.IFileInfo, defs: mls.stor.IFileInfo) {
        const tsLocal = ts && ts.inLocalStorage;
        const htmlLocal = html && html.inLocalStorage;
        const styleLocal = less && less.inLocalStorage;
        const testLocal = test && test.inLocalStorage;
        const defsLocal = defs && defs.inLocalStorage;

        let rc = '';
        if (tsLocal) rc = rc + '.ts ';
        if (htmlLocal) rc = rc + '.html ';
        if (styleLocal) rc = rc + '.less ';
        if (testLocal) rc = rc + '.test.ts ';
        if (defsLocal) rc = rc + '.defs.ts ';

        return rc;
    }

    renderLiItem(file: mls.stor.IFileInfo, index: number, inHistory: boolean) {

        const name = this.project === 0 && inHistory ? '_' + file.project + '_' + file.shortName : file.shortName;
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

        const validProject = this.project === 0 && mls.actual[5].project !== file.project && file.project !== 0 ? false : true;

        let auxValidProject = '';
        if (!validProject) auxValidProject = ';user-select: none; pointer-events: none; opacity: .5;';

        return html`
            <li @click="${this.clickOptOpen}" class="${file.shortName === actualL2 ? 'selected' : ''}" style="${style}${auxValidProject}" .myFile=${file} .nameFilter="${nameFilter}" ?disabled=${!validProject}>
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
    private clickOptUndo(e: MouseEvent) {

        e.stopPropagation();
        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        this.fireEvents('undo', mfile, {});

    }

    private clickOptDel(e: MouseEvent) {

        e.stopPropagation();
        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        this.fireEvents('delete', mfile, {});

    }

    private async clickOptOpen(e: MouseEvent) {

        e.stopPropagation();
        const target = e.target as HTMLElement;
        const li = target.closest('li');
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

    }

    private clickOptRename(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        this.clickOptRenameClone(el, 'rename')

    }

    private clickOptClone(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        this.clickOptRenameClone(el, 'clone');

    }

    private clickOptRenameClone(el: HTMLElement, mode: string) {

        if (!el) return;

        const myfile = this.getMyFileInElement(el);
        if (!myfile) return;

        const father = el.closest('.contentServiceList') as HTMLElement;
        const li = el.closest('li') as HTMLElement;
        if (!father || !li) return;

        let elContentAux = father.querySelector('.elContentAux') as HTMLElement;

        if (!elContentAux)
            elContentAux = this.createElContentAux();

        if (!father || !li) return;

        li.appendChild(elContentAux);

        const btnActCloneRename = father.querySelector('.btnActCloneRename') as HTMLElement;
        const iptProj = elContentAux.querySelector('.spanPrj input') as HTMLInputElement;
        const iptName = elContentAux.querySelector('.spanName input') as HTMLInputElement;
        const errorDivAux = elContentAux.querySelector('#errorDivAux ') as HTMLInputElement;

        elContentAux.style.display = '';
        iptProj.value = mls.actual[5].project as any;
        iptName.value = '';

        btnActCloneRename.classList.remove('fa-file-pen');
        btnActCloneRename.classList.remove('fa-clone');
        btnActCloneRename.title = mode;
        if (mode === 'clone') btnActCloneRename.classList.add('fa-clone');
        else btnActCloneRename.classList.add('fa-file-pen');

        btnActCloneRename.onclick = async (e2: MouseEvent) => {

            try {

                e2.stopPropagation();
                this.validInputsAux(myfile, { mode: mode, project: iptProj.value, name: iptName.value });
                this.fireEvents(mode, myfile, { project: +iptProj.value, shortName: iptName.value });
                elContentAux.style.display = 'none';
                const all = this.shadowRoot?.querySelectorAll('.activegpbtnslider');
                Array.from(all as any).forEach((i: any) => i.classList.remove('activegpbtnslider'))

            } catch (er: any) {

                errorDivAux.innerText = er.message;
                setTimeout(() => { errorDivAux.innerText = ''; }, 2000);

            }

        }

    }


    private createElContentAux() {
        const container = document.createElement("div");
        container.className = "elContentAux";
        container.style.display = "none";
        container.onclick = (e) => this.clickOptStop(e);
        const inner = document.createElement("div");
        inner.className = "elContentAux2";

        // form
        const form = document.createElement("form");
        form.style.display = "flex";
        form.style.gap = ".5rem";
        const spanPrj = document.createElement("span");
        spanPrj.className = "spanPrj";
        const inputPrj = document.createElement("input");
        inputPrj.name = "projectEdit1";
        inputPrj.style.width = "80px";
        inputPrj.value = this.project.toString();
        inputPrj.onclick = (e) => this.clickOptStop(e);
    
        spanPrj.appendChild(inputPrj);
        const spanName = document.createElement("span");
        spanName.className = "spanName";
        const inputName = document.createElement("input");
        inputName.name = "projectEdit2";
        inputName.onclick = (e) => this.clickOptStop(e);
    
        spanName.appendChild(inputName);
        form.appendChild(spanPrj);
        form.appendChild(spanName);

        // buttons
        const btnClone = document.createElement("button");
        btnClone.className = "btnActCloneRename fa fa-file-pen";
        btnClone.style.margin = "4px 0px";
        const btnCancel = document.createElement("button");
        btnCancel.className = "fa fa-ban";
        btnCancel.title = "cancel";
        btnCancel.style.margin = "4px 0px";
        btnCancel.onclick = (e) => this.clickHiddenAux(e);

        // montar
        inner.appendChild(form);
        inner.appendChild(btnClone);
        inner.appendChild(btnCancel);

        // erro
        const errorDiv = document.createElement("div");
        errorDiv.className = "showError";
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "10px";
        errorDiv.id = 'errorDivAux';
        errorDiv.textContent = this.errorAux;
        container.appendChild(inner);
        container.appendChild(errorDiv);
        
        return container;
    }

    private fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): void {

        const params = {} as mls.events.IFileAction;

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
            (mls.actual[lv as any] as any)[this.position as any] = {
                project: file.project,
                shortName: file.shortName,
                extension: file.extension,
                folder: file.folder,
            } as any;

        }

        if (mls.actualLevel == 1) {
            mls.events.fire([1], ['FileAction'], JSON.stringify(params), timeout);
        } else {
            mls.events.fire([(+(this.levelFiles as any) as any)], ['FileAction'], JSON.stringify(params), timeout);
        }

        if (['open'].includes(action)) return;
        this.changeList(100);

    }

    private fireEventThisProject = 0;
    private fireEventLoadProject(): void {

        if (this.fireEventThisProject === mls.actual[5].project) return;
        this.fireEventThisProject = mls.actual[5].project as number;

        const info = {} as mls.events.IProjectLoaded;
        info.project = mls.actual[5].project as number;
        info.level = 2;
        info.needCompile = true;

        mls.events.fire([(+(this.levelFiles as any) as any)], ['ProjectLoaded'], JSON.stringify(info), 0);

    }

    private changeListTimeout: number = 0;
    public changeList(time: number = 500): void {

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
        this.project = mls.actual[5].project || 0;
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

    private clickRadioProjectActual(e: MouseEvent): void {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.project = mls.actual[5].project as number;
        this.getFiles();
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

            /*await mls.stor.server.loadProjectInfoIfNeeded(mls.actual[5].project as number, true);
            const key = Object.keys(mls.stor.files)?.filter((item) => item.indexOf((mls.actual[5].project as number).toString()) >= 0);

            if (key.length > 0) {
                this.fireEvents('projectListChanged', mls.stor.files[key[0]], {}, 500);
                mls.events.fireFileAction('updatedOnServer', mls.stor.files[key[0]], 'left', undefined, undefined, undefined, undefined, 600);
            }*/

            const ret = await mls.l2.typescript.compileAll(mls.actual[5].project as number);
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
            const arraySf: mls.stor.IFileInfo[] = this.getFilesProject();
            const arraySfHistory: mls.stor.IFileInfo[] = await this.getFileHistory();
            this.files = [...arraySf];
            this.history = [...arraySfHistory];
        } catch (e) {
            console.info(e);
        }

    }

    private getFilesProject(): mls.stor.IFileInfo[] {

        if (!window['mls']) return [];
        this.filesInLocal = [];
        const arraySf: mls.stor.IFileInfo[] = [];
        const ext = (this.extensionLevel as any)[this.levelFiles as any] as string;
        for (const i of Object.keys(mls.stor.files).sort()) {

            const sf = mls.stor.files[i];
            if (
                sf.project !== this.project ||
                sf.level !== +(this.levelFiles as any) ||
                sf.extension !== ext
            ) continue;

            if (mls.actualLevel === 1 && !sf.shortName.startsWith('be')) {
                continue;
            }
            else if (mls.actualLevel === 3 && !sf.shortName.startsWith('page')) {
                continue;
            }
            else if ([2, 4, 5, 6, 7].includes(mls.actualLevel) && sf.shortName.startsWith('be')) {
                continue;
            }

            this.info.tot++;

            const keyHtml = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.html');
            const keyStyle = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.less');
            const keyTestFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.test.ts');
            const keyDefsFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.defs.ts');

            const styleFile = mls.stor.files[keyStyle];
            const htmlFile = mls.stor.files[keyHtml];
            const testFile = mls.stor.files[keyTestFile];
            const defsFile = mls.stor.files[keyDefsFile];

            const htmlLocal = htmlFile && htmlFile.inLocalStorage;
            const styleLocal = styleFile && styleFile.inLocalStorage;
            const testLocal = testFile && testFile.inLocalStorage;
            const defsLocal = defsFile && defsFile.inLocalStorage;

            const htmlError = htmlFile && htmlFile.hasError;
            const styleError = styleFile && styleFile.hasError;
            const testError = testFile && testFile.hasError;
            const defsError = defsFile && defsFile.hasError;


            if (sf.isLocalVersionOutdated) this.info.version++;
            if (sf.inLocalStorage || htmlLocal || styleLocal || testLocal || defsLocal) {
                this.filesInLocal.push(sf);
                this.info.storage++;
            }
            if (sf.hasError || htmlError || styleError || testError || defsError) this.info.error++;

            arraySf.push(sf);
        }

        return arraySf;

    }

    private async getFileHistory() {

        try {
            if (!window['mls']) return [];
            let arraySfHistory: mls.stor.IFileInfo[] = [];
            const lh = this.getHistory();
            if (lh.length <= 0 || !window['mls']) {

                const diff = this.filesInLocal.filter(a =>
                    !arraySfHistory.some(b => b.shortName === a.shortName)
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
                !arraySfHistory.some(b => b.shortName === a.shortName)
            );

            arraySfHistory = [...arraySfHistory, ...diff];
            return arraySfHistory;

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
            if (i.project !== file.project || i.shortName !== file.shortName) return;
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
                /*const key = mls.stor.getKeyToFiles(res[i].project, this.levelFiles, res[i].shortName, res[i].folder, res[i].extension);
                if (!mls.stor.files[key]) {
                    res.splice(i, 1);
                } else if (mls.stor.files[key] && mls.stor.files[key].status === 'nochange' && mls.stor.files[key].shortName !== file.shortName) {
                    res.splice(i, 1);
                }*/
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