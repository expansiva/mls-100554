/// <mls shortName="serviceListFiles" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["service-list-files-add-100554"]
 * }
 */

//version = 3

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initServiceListFilesAdd } from './_100554_serviceListFilesAdd';

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
    history: "HistÛrico",
    undo: "desfazer",
    clone: "clonar",
    rename: "renomear",
    delete: "excluir"
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
    delete: 'delete',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-list-files-100554')
export class ServiceListFiles extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    @property() mode: string = 'list';

    @property() project: number = 1;

    @property() projectLabel: string = '1';

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property({ type: Array }) history: mls.stor.IFileInfo[] = [];

    constructor() {
        super();
        initServiceListFilesAdd();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private info = {
        tot: 0,
        version: 0,
        storage: 0,
        error: 0,
    }

    public details: IService = {
        icon: '&#xf15b',
        state: 'background',
        position: 'all',
        tooltip: 'Select',
        visible: true,
        widget: '_100554_serviceListFiles',
        level: [2, 4],
        customConfiguration: {
            2: {
                tooltip: 'Select Widget'
            },
            4: {
                tooltip: 'Select Page'
            }
        }
    }

    public onClickLink = (op: string): boolean => {
        //if (this.menu.setMode) this.onServiceClick(true, true);

        return false;
    }

    public menu: IMenu = {
        title: 'List Files',
        actions: {
        },
        icons: {},
        actionDefault: 'opPlugins', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        this.mode = 'list';
        if (visible && reinit) {

            this.init();
            this.firstTimeVerifyProject();

        }

    }

    private firstTimeVerifyProject(): void {

        if ((window as any).updateFile && (window as any).updateFile.includes(mls.actual[5].project)) {
            return;
        }
        setTimeout(() => {

            if (!(window as any).updateFile) {

                (window as any).updateFile = [mls.actual[5].project]

            } else {

                (window as any).updateFile.push(mls.actual[5].project);

            }

            const keys = Object.keys(mls.stor.files);
            let info;
            for (const key of keys) {
                info = mls.stor.files[key];
                if (info.project !== mls.actual[5].project) continue;
                break;
            }

            mls.events.fireFileAction('updatedOnServer', info, 'left', undefined, undefined, undefined, undefined, 600);

        }, 5000)
    }

    private showAdd() {
        this.inFilter = false;
        this.mode = 'add';
        this.menu.setMode
        return true;
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addEventListener([2, 5], ['ProjectSelected'], (ev) => {

            if (this.project === mls.actual[5].project) return;
            this.init();

        });

        mls.events.addListener(5, 'FileAction', (ev) => {

            if ((ev.type !== 'FileAction')) return;

            if (this.visible === undefined || this.visible === null || (this.visible && this.visible === 'false')) return;

            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

            if (!['projectListChanged'].includes(fileAction.action)) return;

            this.init();

        });

        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));

    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (this.visible === undefined || this.visible === null || (this.visible && this.visible === 'false')) return;

        if (ev.level !== +(this.level as any) || (ev.type !== 'FileAction')) return;

        const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

        if (
            fileAction.position !== this.position ||
            !['statusOrErrorChanged', 'projectListChanged'].includes(fileAction.action) ||
            fileAction.project === 0
        ) return;

        this.init();

    }


    // -------------  WEBCOMPONENT -------------

    connectedCallback() {
        super.connectedCallback();
        this.init();

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
                ${this.renderAuxEdit()}
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
            <div class="groupAction"> 
                <a @click="${this.verifyChangeInList}" id="listUpdateFiles">${this.msg.updateListVerify}</a>
                <a @click="${this.showAdd}">${this.msg.addNewFile}</a>
            </div>
            <div class="groupFilter">
                <div class="groupFilterRadio">
                    <input id="radioProjectActual" name="projectFind" type="radio" checked="checked" value="${this.projectLabel}" @click="${this.clickRadioProjectActual}">
                    <label for="radioProjectActual">${this.projectLabel}</label>
                    <input id="radioProjectZero" name="projectFind" type="radio" value="0" @click="${this.clickRadioProject0}">
                    <label for="radioProjectZero">${this.msg.localProject}</label>
                </div>
                <input type="text" placeholder="Filter" @input="${this.filterLiChange}">
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

    renderAuxEdit() {
        return html`
            <div class="elContentAux" style="display:none" @click="${this.clickOptStop}">
                <div class="elContentAux2">
                    <span class="spanPrj">
                        <input style="width: 80px;" .value="${this.project}" @click="${this.clickOptStop}">
                    </span>
                    <span class="spanName">
                        <input @click="${this.clickOptStop}">
                    </span>
                    <button class="btnActCloneRename fa fa-file-pen" style="margin: 4px 0px;"></button>
                    <button class="fa fa-ban" title="cancel" @click="${this.clickHiddenAux}" style="margin: 4px 0px;"></button>
                </div>
                <div class="showError"style="color: red; font-size: 10px;">${this.errorAux}</div>
            </div>
        `;
    }

    renderLiItem(file: mls.stor.IFileInfo, index: number, inHistory: boolean) {

        const name = this.project === 0 && inHistory ? '_' + file.project + '_' + file.shortName : file.shortName;

        const nameFilter = inHistory ? '*******' : name.toLocaleLowerCase();
        let auxVersion = '';
        let auxStorage = '';
        let auxBug = '';
        let auxHtml = '';
        const keyHtml = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.html');

        const htmlLocal = mls.stor.files[keyHtml] && mls.stor.files[keyHtml].inLocalStorage; 

        if (file.inLocalStorage) {

            auxStorage = `<span title=".ts${ htmlLocal ? ', .html' : ''} in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
            
        }else if (htmlLocal) {

            auxStorage = `<span title=".html in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
            
        }

        if (file.hasError) {

            auxBug = `<span title="bug" class="fa fa-bug" style="color:rgb(169, 3, 3); height: 14px; display: flex; justify-content: center; align-items: center;"></span>`

        }

        if (file.isLocalVersionOutdated) {

            auxVersion = `<span title="need conciliation" class="fa fa-unbalanced" style="color:orange; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`

        }

        const style = this.inFilter && inHistory ? 'display:none' : '';

        return html`
            <li @click="${this.clickOptOpen}" style="${style}" .myFile=${file} .nameFilter="${nameFilter}">
                <div class="elContent">
                    <div class="groupHiddenList" @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-undo" title="${this.msg.undo}" @click="${this.clickOptUndo}"></span>
                        <span class="mls-gpbtnslider-item fa fa-clone" title="${this.msg.clone}" @click="${this.clickOptClone}"></span>
                        <span class="mls-gpbtnslider-item fa fa-file-pen" title="${this.msg.rename}" @click="${this.clickOptRename}"></span>
                        <span class="mls-gpbtnslider-item fa fa-trash" title="${this.msg.delete}" @click="${this.clickOptDel}"></span>
                    </div>
                    <span class="${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                    <div style="display:flex; gap:.5rem" .innerHTML="${auxStorage + auxBug + auxVersion + auxHtml}"></div>
                </div>
            </li>
        `;

    }

    renderAdd() {
        return html`<service-list-files-add-100554 level="${this.level}" position="${this.position}" .father="${this}"></service-list-files-add-100554>`
    }

    //------------ EVENTOS -----------------
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

    private clickOptOpen(e: MouseEvent) {
        e.stopPropagation();
        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        this.setHistory(mfile);
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

        const elContentAux = father.querySelector('.elContentAux') as HTMLElement;

        const btnActCloneRename = father.querySelector('.btnActCloneRename') as HTMLElement;

        const iptProj = elContentAux.querySelector('.spanPrj input') as HTMLInputElement;
        const iptName = elContentAux.querySelector('.spanName input') as HTMLInputElement;
                
        if (!father || !li) return;

        li.appendChild(elContentAux);
        elContentAux.style.display = '';
        iptProj.value = mls.actual[5].project as any;
        iptName.value = '';
        btnActCloneRename.onclick = async (e2: MouseEvent) => {
    
            try {

                e2.stopPropagation();
                
                this.validInputsAux(myfile, { mode: mode, project: iptProj.value, name: iptName.value });

                this.fireEvents(mode, myfile, { project: +iptProj.value, shortName: iptName.value });

                elContentAux.style.display = 'none';
                const all = this.shadowRoot?.querySelectorAll('.activegpbtnslider');

                Array.from(all as any).forEach((i: any) => i.classList.remove('activegpbtnslider'))

            } catch (er: any) {

                this.showLoader(false);
                this.errorAux = er.message;
                setTimeout(() => { this.errorAux = '' }, 2000);

            }

        }

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

            mls.actual[this.level as any].setFullName(`_${file.project}_${file.shortName}`);
            (mls.actual[this.level as any] as any)[this.position as any] = {
                project: file.project,
                shortName: file.shortName,
                extension: file.extension,
                folder: file.folder,
            } as any;

        }

        mls.events.fire([(+(this.level as any) as any)], ['FileAction'], JSON.stringify(params), timeout);

        if (['open'].includes(action)) return;
        this.changeList(100);

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
        this.project = mls.actual[5].project as number;
        this.projectLabel = this.project.toString();
        this.showLoader(true);
        await this.getFiles();
        this.showLoader(false);

    }

    private setLoader = -1;
    private showLoader(loader: boolean): void {

        clearTimeout(this.setLoader);
        this.setLoader = setTimeout(() => {
            this.loading = loader;
        }, 200)


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

            //this.shomMyError(e.message);

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

            await mls.stor.server.loadProjectInfoIfNeeded(mls.actual[5].project as number, true);

            const key = Object.keys(mls.stor.files)?.filter((item) => item.indexOf((mls.actual[5].project as number).toString()) >= 0);

            if (key.length > 0) {

                this.fireEvents('projectListChanged', mls.stor.files[key[0]], {}, 500);
                mls.events.fireFileAction('updatedOnServer', mls.stor.files[key[0]], 'left', undefined, undefined, undefined, undefined, 600);

            }

            this.changeList(500);

            setTimeout(() => {

                if (!this) return;
                el.innerText = 'update list/ verify';

            }, 50000);

            /*mls.stor.server.loadProjectInfoIfNeeded(mls.actual[5].project as number, true).then(() => {

                const key = Object.keys(mls.stor.files)?.filter((item) => item.indexOf((mls.actual[5].project as number).toString()) >= 0);
                if (key.length > 0) {

                    this.fireEvents('projectListChanged', mls.stor.files[key[0]], {}, 3000);
                    mls.events.fireFileAction('updatedOnServer', mls.stor.files[key[0]], 'left', undefined, undefined, undefined, undefined, 3500);

                }

                this.changeList(3000);

            });

            setTimeout(() => {

                if (!this) return;
                el.innerText = 'update list/ verify';

            }, 50000);*/

        } catch (e) {

            //this.shomMyError(e.message);

        }

    }

    private async verifyChangeInList3() {



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
        const arraySf: mls.stor.IFileInfo[] = [];
        const ext = (this.extensionLevel as any)[this.level as any] as string;
        for (const i of Object.keys(mls.stor.files).sort()) {

            const sf = mls.stor.files[i];

            if (
                sf.project !== this.project ||
                sf.level !== +(this.level as any) ||
                sf.extension !== ext
            ) continue;

            this.info.tot++;

            if (sf.isLocalVersionOutdated) this.info.version++;
            if (sf.inLocalStorage) this.info.storage++;
            if (sf.hasError) this.info.error++;

            arraySf.push(sf);

        }

        return arraySf;

    }

    private async getFileHistory() {

        if (!window['mls']) return [];
        const arraySfHistory: mls.stor.IFileInfo[] = [];
        const lh = this.getHistory();
        if (lh.length <= 0 || !window['mls']) return [];

        for await (const i of lh) {

            let key = mls.stor.getKeyToFiles(i.project, this.level as any, i.shortName, i.folder, i.extension);

            if (!mls.stor.files[key] && +this.project === 0) {

                await mls.stor.server.loadProjectInfoIfNeeded(i.project);
                key = mls.stor.getKeyToFiles(i.project, this.level as any, i.shortName, i.folder, i.extension);

            }

            if (!mls.stor.files[key] || (i.project !== +this.project && +this.project !== 0)) continue;
            arraySfHistory.push(mls.stor.files[key]);

        }

        return arraySfHistory;

    }

    private getHistory(): { project: number, shortName: string, extension: string, folder: string }[] {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.level as any);
        return info ? JSON.parse(info) : [];

    }

    private setHistory(file: mls.stor.IFileInfo): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.level as any);
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
                const key = mls.stor.getKeyToFiles(res[i].project, this.level, res[i].shortName, res[i].folder, res[i].extension);
                if (!mls.stor.files[key]) {
                    res.splice(i, 1);
                }else if (mls.stor.files[key] && mls.stor.files[key].status === 'nochange' && mls.stor.files[key].shortName !== file.shortName) {
                    res.splice(i, 1);
                }
            }

        }

        localStorage.setItem('mlsInfoHistoryL' + this.level as any, JSON.stringify(res));

    }

    private validInputsAux(file: mls.stor.IFileInfo, action: { mode: string, project: string, name: string }): void {

        if (file.hasError && ['clone', 'rename'].includes(action.mode)) throw new Error('It is not possible to perform this action on files with an error.');

        if (!this.isValidNewName(file, action)) throw new Error('Invalid name');

    }

    private isValidNewName(file: mls.stor.IFileInfo, action: { mode: string, project: string, name: string }): boolean {

        if (action.project === '' || action.name === '') return false;

        if (action.name.length === 0 || action.name.length > 255) return false;

        const invalidCharacters = /[_\/{}\[\]\*$@#=\-+!|?,<>=.;^~∫∞""''``·‡‚„ÈËÍÌÔÛÙıˆ˙ÁÒ¡¿¬√…»Õœ”‘’÷⁄«—]/;
        if (invalidCharacters.test(action.name)) return false;

        const key = mls.stor.getKeyToFiles(+action.project, this.level as any, action.name, file.folder, file.extension);

        return !mls.stor.files[key];

    }

}
