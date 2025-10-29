/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IServiceMenu } from './_100554_serviceBase';
import { collab_branch } from './_100554_collabIcons';
import { undoFile } from './_100554_collabLibStor';
import { initServiceSaveaddBranch } from './_100554_saveAddBranch';
import { getMyKeysBranch, calculateTotalStringSize } from './_100554_libCommom';
import { getConfigProject, updateConfigProject } from './_100554_libProjectConfig';
import { readProjectTypescriptAndCompile } from './_100554_collabLibModel';
import './_100554_pluginCreateProjectLocalToDriver';

initServiceSaveaddBranch();

/// **collab_i18n_start**
const message_pt = {
    openPullrequest: 'Pull request Abertos',
    needComment: 'Precisa de um comentario para o pullrequest',
    updateChanges: 'Atualizar alterações',
    comments: 'Comentários',
    update: 'Atualizar',
    fileChanges: 'Alterações de arquivos',
    noItemsToSave: 'Sem itens para salvar.',
    msgPullRequest: 'Este projeto utiliza pull requests, todas as alterações serão salvas no branch do seu usuário, para criar um pull request clique no botão',
    createPullRequest: "Criar pull request",
    create: 'Criar',
    cancel: 'Cancelar',
    title: 'Titulo',
    errorCreatePull: 'Erro ao tentar criar pull request',
    msgBlockAll: 'Você não tem acesso a este repositorio, por fvor entre em contato com o admin do projeto',
    msgBlock: 'Você não tem acesso de escrita neste repositorio, caso deseje criar um fork clique no botão abaixo',
    pullrequestOk: 'Pull request realizado com sucesso',
    errorVerify: 'Foi encontrado arquivos com erros',
    obsVerify: 'O salvamento só será permitido se não houver arquivos com erros ou se a verificação for cancelada!',
    msgTotFile: 'Tamanho total dos arquivos selecionados:',
    msgErroTotFile: 'Excedeu o tamanho total permitido'
}
const message_en = {
    openPullrequest: 'Open pull requests',
    needComment: 'Need a comment for the pullrequest',
    updateChanges: 'Update Changes',
    comments: 'Comments',
    update: 'Update',
    fileChanges: 'File Changes',
    noItemsToSave: 'No items to save',
    msgPullRequest: 'This project uses pull requests, all changes will be saved in your user\'s branch, to create a pull request click the button',
    createPullRequest: "Create pull request",
    create: 'Create',
    cancel: 'Cancel',
    title: 'Title',
    errorCreatePull: 'Error when trying to create pull request',
    msgBlockAll: 'You do not have access to this repository, please contact the project admin',
    msgBlock: 'You do not have write access to this repository, if you wish to create a fork click the button below',
    pullrequestOk: 'Pull request completed successfully',
    errorVerify: 'Files with errors were found',
    obsVerify: 'Saving will only be allowed if there are no files with errors, or the check is cancelled!',
    msgTotFile: 'Total size of selected files:',
    msgErroTotFile: 'Exceeded the total size allowed'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-save-100554')
export class ServiceSave extends ServiceBase {

    private myMessage: MessageType = messages['en'];
    private mainowner: string = '';
    private mainrepo: string = '';
    private mainbranch: string = '';
    private owner: string = '';
    private repo: string = '';
    private branch: string = '';
    private scenery: string = 'save';
    private exceededLimit: boolean = false;

    @state() freeToSave: { ts: boolean, less: boolean, hasDS: boolean } = { ts: false, less: false, hasDS: false };

    @property() isFreeToSave: boolean = false;
    @property() itens: IDefItem | undefined = undefined;
    @property() otherProjects: number[] = [];
    @property() error: string = '';
    @property() totFileSize: string = '';

    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        readProjectTypescriptAndCompile(mls.actualProject as number, '', true);
        this.setEvents();
    }

    //---------SERVICE-------------
    public details: IService = {
        icon: '&#xf0c7',
        state: 'background',
        position: 'left',
        tooltip: 'Save',
        visible: true,
        widget: '_100554_serviceSave',
        level: [5]
    }

    public onClickMain(op: string) {
        if (op === 'opBranch') this.showBranche();
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: this.onClickMain.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean) {
        if (visible && reinit) {
            this.updateList();
        } else if (visible && !reinit) {
            this.updateList();
        }
    }

    // -------------- EVENTS -------------------
    private async setEvents() {
        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(3, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(5, 'ProjectSelected', (ev) => { this.init(); });
        mls.events.addListener(5, 'ProjectCompilationComplete', this.onFreeToSave.bind(this));
        mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['LevelChanged'] as unknown as mls.events.TypeEvent[], this.onLevelchange.bind(this));
    }

    private onLevelchange: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (!ev.desc) return;
        const data: { to: number, from: number } = JSON.parse(ev.desc);
        if (data.to === 5) this.verifyExitFileChanged();
    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.type !== 'FileAction') return;
        const fileAction = JSON.parse(ev.desc as string) as mls.events.IFileAction;
        if (!['changed', 'delete', 'new', 'rename'].includes(fileAction.action)) return;
        this.scenery = 'save';
        if (this.isServiceVisible()) {
            this.init();
        }
        this.toogleBadge(true, '_100554_serviceSave');
    }

    private onFreeToSave: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {
        if (ev.type !== ('ProjectCompilationComplete' as mls.events.TypeEvent)) return;
        const v = JSON.parse(ev.desc as string);
        if (v.tsFree === false) {
            this.setError(this.myMessage.errorVerify);
            return;
        } else if (v.tsFree) {
            this.freeToSave.ts = true;
        }

        if (v.lessFree === false) {
            this.setError(this.myMessage.errorVerify);
            return;
        } else if (v.lessFree) {
            this.freeToSave.less = true;
        }

        this.isFreeToSave = this.freeToSave.hasDS ? this.freeToSave.ts && this.freeToSave.less : this.freeToSave.ts;
    }

    private isServiceVisible(): boolean {
        return this.visible === 'true';
    }

    private verifyExitFileChanged(): void {
        if (!mls.stor.files) return;
        const array = Object.keys(mls.stor.files);
        let exist = false;
        for (let i of array) {
            const f = mls.stor.files[i];
            if (!f) continue;
            if (f.project === mls.actualProject && f.status !== 'nochange')
                exist = true;
            if (exist) break;
        }
        if (!exist) return;
        this.toogleBadge(true, '_100554_serviceSave');
    }

    // ------------- WEBCOMPONENT -------------
    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang];


        if (mls.actualProject === mls.stor.LOCALPROJECTNUMBER) {
            return html`<plugin-create-project-local-to-driver-100554
            
            @project-local-created=${() => { this.init(); }}
            ></plugin-create-project-local-to-driver-100554>`
        }


        if (this.error !== '') {
            setTimeout(() => this.error = '', 3000);
            return html`${unsafeHTML(this.error)}`;
        }
        if (this.scenery !== 'save') {
            return this.renderBlockScenery();
        }
        if (this.itens) {
            return html`
                ${this.renderHeader()}
                ${this.renderItens()}
                ${this.renderOthersProjects()}
            `;
        } else if (this.otherProjects.length > 0) {
            return html`
                ${this.renderHeader()}
                ${this.renderOthersProjects()}
            `
        } else {
            return html`
                ${this.renderHeader()}
                ${this.renderNoItens()}
            `
        }
    }

    renderBlockScenery() {
        if (this.scenery === 'blockAll') {
            return html`<h4 style="margin-top:1rem; text-align:center">${this.myMessage.msgBlockAll}</h4>`;
        }

        return html`
            <h4 style="margin-top:1rem; text-align:center">${this.myMessage.msgBlock}</h4>
            <div class="block-scenery">
                <button class="btn-service-save" @click="${this.createFork}">
                    <svg width="16" height="16" fill="#fff" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>
                    Fork
                </button>
            </div>
        `;
    }

    renderHeader() {
        return html`
            <div class="header-save">
                <div>
                    <span style="font-weight:600">Owner:</span>
                    <span>${this.owner}</span>
                </div>
                <div>
                    <span style="font-weight:600">Repo:</span>
                    <span>${this.repo}</span>
                </div>
                <div>
                    <span style="font-weight:600">Branch:</span>
                    <span>${this.branch}</span>
                </div>

                <button class="btn-service-save" style=" display: none; justify-content: center; align-items: center; margin: 0px; padding: 5px; height: 23px; " @click="${() => { if (this.menu.setMenuActive) this.menu.setMenuActive('opBranch') }}">
                    ${collab_branch} Change
                </button>
            </div>
        `
    }

    renderNoItens() {
        return html`
        <sectionnosave style="padding:1rem">
            <span>${unsafeHTML(this.myMessage.noItemsToSave)}</span>
        </sectionnosave>
    `
    }

    renderOthersProjects() {
        this.filterOtherProject();
        return html`
        <sectionsave>
            <ul>
                ${repeat(this.otherProjects, ((key: string) => key) as any, ((k: number, index: any) => { return this.renderOthersProjectsItens(k) }) as any)}
            </ul>
        </sectionsave>`
    }

    renderOthersProjectsItens(project: number) {
        return html`
        <li style="cursor: not-allowed;opacity: .5;">
            <div style="cursor: not-allowed;">
                <span class="fatv fa-caret-righttv" style="cursor: not-allowed;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="fill: var(--collab-text-primary-color);"  height="1em" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                </span>
                <input type="checkbox" disabled style="cursor: not-allowed;">
                <label style="cursor: not-allowed;">${project}</label>
            </div>
        </li> `;
    }

    renderItens() {
        const keys = Object.keys(this.itens || {});
        return html`
            <sectionsave>
                <div id="Save_menu_action" style="display:flex;">
                    <div style="width:100%;" >
                        <h4 class="mt-3">${this.myMessage.comments}:</h4>
                        <div style="display:flex; gap:1rem; align-items:center;">
                            <textarea id="commitMessage" class="form-control" style="max-width:600px;" maxlength="50"></textarea>
                            <button id="btn_save" ?disabled=${!this.isFreeToSave} class="btn-service-save btnSave btn-sm btnSave-primary" @click="${this.onSave}">${this.myMessage.update}</button>
                        </div>
                        <small style="font-size:12px;font-weight:bold">*${this.myMessage.obsVerify}</small>
                    </div>
                </div>
                <h4 class="mt-3" data-mlsline="23">${this.myMessage.fileChanges}</h4>
                <small style="font-size:12px">${this.totFileSize ? this.totFileSize : this.myMessage.msgTotFile}</small> 
                <ul>
                    ${repeat(keys, ((key: any) => key) as any, ((k: any, index: any) => { return this.renderProject(k, index); }) as any)}
                </ul>
            </sectionsave>
        `
    }

    renderProject(project: string, index: number) {

        if (!this.itens) return html``;

        const keys = Object.keys(this.itens[+project]);
        return html`
            <li class="open">
                <div>
                    <span class="fatv fa-caret-righttv rotate" @click="${this.openMeList}">
                        <svg xmlns="http://www.w3.org/2000/svg" style="fill: var(--collab-text-primary-color);"  height="1em" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                    </span>
                    <input type="checkbox" id="l0-${index}" @click="${this.clickSetValueAllChilds}">
                    <label for="l0-${index}">${project}</label>
                </div>
                <ul>
                    ${repeat(keys, ((key: any) => key) as any, ((k: any, indexl: any) => { return this.renderLevels(k, project, index, indexl); }) as any)}
                </ul>
            </li>
        `;
    }

    renderLevels(level: string, project: string, indexP: number, index: number) {
        if (!this.itens) return html``;

        const objP = this.itens[+project];
        let item = objP[+level] as Ifile;

        const keys = Object.keys(item);
        return html`
            <li class="open">
                <div>
                    <span class="fatv fa-caret-righttv rotate" @click="${this.openMeList}" > 
                        <svg xmlns="http://www.w3.org/2000/svg" style="fill: var(--collab-text-primary-color);"  height="1em" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                    </span>
                    <input type = "checkbox" id = "l1-${indexP}-${index}" @click="${this.clickSetValueAllChilds}"/>
                    <label for= "l1-${indexP}-${index}" > l${level} </label>
                </div>
                <ul>
                    ${repeat(keys, ((item: string) => item) as any, ((i: string, indexF: number) => { return this.renderFilesDefault(i, level, project, indexP, index, indexF); }) as any)}
                </ul>
            </li>
        `;
    }

    renderFilesDefault(file: string, level: string, project: string, indexPP: number, indexP: number, index: number) {

        if (!this.itens) return html``;

        const objP = this.itens[+project];
        const fileInfo = objP[+level] as Ifile;
        let itens = fileInfo[file];
        let forceError = itens.filter((i) => i.file.hasError === true).length > 0;
        itens = itens.sort((a, b) => a.text.localeCompare(b.text));
        return html`
            <li class="">
                <div>
                    <span class="fatv fa-caret-righttv" @click="${this.openMeList}" > 
                        <svg xmlns="http://www.w3.org/2000/svg" style="fill: var(--collab-text-primary-color);"  height="1em" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
                    </span>
                    <input type = "checkbox" ?disabled=${forceError} id = "l2-${indexPP}-${indexP}-${index}" @click="${this.clickSetValueAllChilds}"/> 
                    <label for= "l2-${indexPP}-${indexP}-${index}" > ${file} </label>
                </div>
                <ul>
                    ${repeat(itens, ((item: any) => item) as any, ((i: any, indexI: any) => { return this.renderItem(i, indexPP, indexP, index, indexI, forceError); }) as any)}
                </ul>
            </li>
        `;
    }


    renderItem(item: Iitem, indexP: number, indexL: number, indexM: number, index: number, forceError: boolean) {

        return html`
            <li style="padding-left: 1.1rem;" class="${item.errorLocal ? 'errorLocal' : ''}">
                <div style="align-items: center;">
                    ${item.disabled || item.onlyFather || item.errorLocal || forceError
                ? html`<input type="checkbox" id="l3-${indexP}-${indexL}-${indexM}-${index}" disabled onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}" .instance=${item.file}>`
                : html`<input type="checkbox" id="l3-${indexP}-${indexL}-${indexM}-${index}" onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}" .instance=${item.file}>`
            }
                    <label for= "l3-${indexP}-${indexL}-${indexM}-${index}" >
                        ${item.text}
                        ${unsafeHTML(item.span)}
                    </label>
                    ${this.renderAuxActionsItem(item)}
                    
                </div>
            </li>
        `;
    }

    renderAuxActionsItem(item: Iitem) {

        if (item.errorLocal) return html``;

        if (['new', 'rename'].includes(item.file.status)) {

            return html`
                <span class="mls-gpbtnslider-item fa fa-undo" title="undo" @click="${() => this.undoFile(item.file)}" style="font-size: 13px; color: #7678a6; margin-left: 2px; height: 13px; cursor:pointer"></span>
            `;

        } else {

            return html`
            <span @click="${this.clickHistory}" .item=${item} style="font-size: 13px; color: #7678a6; margin-left: 2px; height: 13px; cursor:pointer" class="fa-regular fa-clock" title="History"></span>
            <span class="mls-gpbtnslider-item fa fa-undo" title="undo" @click="${() => this.undoFile(item.file)}" style="font-size: 13px; color: #7678a6; margin-left: 2px; height: 13px; cursor:pointer"></span>
            `;

        }

    }

    //-------- IMPLEMENTATION --------
    private async clickHistory(e: MouseEvent) {
        try {
            e.stopPropagation();

            let el = e.target as HTMLElement;
            if (!el.classList.contains('fa-clock')) {
                el = el.closest('.fa-clock') as HTMLElement;
            }

            if (!(el as any).item) return;

            const f = ((el as any).item.file as mls.stor.IFileInfo);
            const h = await f.getHistory();
            if (!h || h.length <= 0) return;

            const obj = {
                project: f.project,
                shortName: f.shortName,
                extension: f.extension,
                position: 'left',
                level: f.level,
                folder: f.folder,
                hashOriginal: h[0].ref,
                hashModified: 'local',
            }
            mls.events.fire([5], 'HistoriesSelected' as mls.events.TypeEvent, JSON.stringify(obj), 0);

        } catch (err: any) {
            this.setError(err.message);
        }
    }

    private filterOtherProject() {
        const find = (f: number | undefined) => {
            let i = -1;
            this.otherProjects.forEach((prj, idx) => {
                if (prj === f) i = idx;
            });
            return i;
        }
        let f = find(mls.actualProject);
        if (f >= 0) this.otherProjects.splice(f, 1);
        f = find(0);
        if (f >= 0) this.otherProjects.splice(f, 1);
    }

    private async init(isSetInfoProject: boolean = true) {
        this.showLoader(true);
        this.totFileSize = `${this.myMessage.msgTotFile} 0B`
        this.scenery = 'save';
        if (isSetInfoProject) await this.initInfoProject();
        await this.setInfos();
        this.showLoader(false);
    }

    private async initInfoProject() {
        const prj = mls.actualProject;
        if (!prj || prj === mls.stor.LOCALPROJECTNUMBER) return;
        const info = getMyKeysBranch(prj);
        if (!info) return;
        this.branch = info.branch;
        this.owner = info.owner;
        this.repo = info.repo;
        this.mainbranch = info.branch;
        this.mainowner = info.owner;
        this.mainrepo = info.repo;
    }

    private showLoader(loader: boolean): void {
        this.loading = loader;
    }

    private showBranche(): boolean {
        this.menu.title = 'Branchs';
        if (this.menu.updateTitle) this.menu.updateTitle();
        const div = document.createElement('div');
        const el = document.createElement('save-add-branch-100554');
        (el as any).callBack = (obj: any) => {
            if (obj.nameWithOwner) {
                const ret = obj.nameWithOwner.split('/');
                this.owner = ret[0];
                this.repo = ret[1];
                this.branch = obj.defaultBranchRef.name
            } else {
                this.branch = obj.name;
            }
            if (this.menu.setMenuActive) this.menu.setMenuActive('initial');
            this.requestUpdate();
        };
        div.appendChild(el);
        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
    }

    private async setInfos() {
        try {

            const objProjects: any = {};
            const filesKeys = Object.keys(mls.stor.files);
            this.otherProjects = await mls.stor.localDB.getAllProjects();

            for (const fKey of filesKeys) {
                const file = mls.stor.files[fKey] as mls.stor.IFileInfo;
                if (!file ||
                    (!file.inLocalStorage && file.status !== 'deleted') ||
                    file.project === 0 ||
                    file.project !== mls.actualProject
                ) continue;

                const obj = this.setProjectLevelShortName(objProjects, file.project, file.level, file.folder, file.shortName);

                obj.push(await this.configItem(file));

            }

            if (Object.keys(objProjects).length > 0) {
                this.itens = objProjects;
            }
            else {
                this.itens = undefined;
                this.toogleBadge(false, '_100554_serviceSave');
            }

        } catch (e: any) {
            this.itens = undefined;
            this.error = e.message;
            this.setError(e.message);
        }
    }

    private setProjectLevelShortName(obj: any, prj: number, level: number, folder: string, shortname: string): any[] {

        if (!obj[prj]) obj[prj] = { [level]: {} };
        const pj = obj[prj];

        if (!pj[level]) pj[level] = {};
        const l = pj[level];

        const key = folder ? folder + '/' + shortname : shortname;
        if (!l[key]) l[key] = [];

        return l[key];
    }

    private oIcon = {
        nochange: { icon: 'fa-file-pen', title: 'Edited' },
        changed: { icon: 'fa-file-pen', title: 'Edited' },
        renamed: { icon: 'fa-clone', title: 'Renamed' },
        deleted: { icon: 'fa-xmark', title: 'Deleted' },
        new: { icon: 'fa-plus', title: 'New' }
    };

    private async configItem(item: mls.stor.IFileInfo) {
        let mountText = item.shortName + item.extension;
        let disabled = false;
        let errorLocal = false;
        let span = `<span style = "font-size: 12px; color: #7678a6; margin-left: 5px;" class="fa ${this.oIcon[item.status].icon}" title = "${this.oIcon[item.status].title}" > </span>`;
        if (item.hasError && item.status !== 'deleted') {
            span = '<span style="font-size: 12px; color: #ff0000; margin-left: 5px; height: 16px;" class="fa fa-bug" title="Error"></span>';
            disabled = true;
        }
        if (item.isLocalVersionOutdated) {
            span = '<span style="font-size: 12px; color: #ff0000; margin-left: 5px;" class="fa fa-unbalanced" title="Version block"></span>';
            disabled = true;
        }
        if (item.status === 'renamed' && item.getValueInfo) {
            const itemNew = await item.getValueInfo();
            mountText = `${itemNew.originalShortName + item.extension} to ${mountText} `;
        }

        errorLocal = !(await mls.stor.localDB.existFile({ project: item.project, extension: item.extension, shortName: item.shortName, folder: item.folder, level: item.level }));

        if (errorLocal) span = '<span> Error: the file does not exist in the database<span>';

        return {
            file: item,
            text: mountText,
            span: span,
            onlyFather: false,
            disabled: disabled,
            errorLocal
        }
    }

    private openMeList(e: MouseEvent) {
        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const li = el.closest('li') as HTMLElement;
        if (!li) return;
        li.classList.toggle('open');

        const fa = li.querySelector('.fa-caret-righttv');
        if (fa) fa.classList.toggle('rotate');

    }

    private clickSetValueAllChilds(e: MouseEvent): void {
        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;
        this.setValueAllChilds(el);
        clearTimeout(this.timeSumTotal);
        this.timeSumTotal = setTimeout(() => this.sumTotalSize(), 300);
    }

    private setValueAllChilds(el: HTMLInputElement): void {
        const father = el.closest('li');
        if (!father) return;
        const subList = father.querySelector('ul');
        if (!subList) return;
        const all = subList.querySelectorAll('input');
        all.forEach((i) => {
            const onlyStatusFather = i.getAttribute('onlyStatusFather') === 'true';
            if (i.disabled && !onlyStatusFather) return;
            i.checked = el.checked;
        });
        if (all.length === 1 && all[0].disabled) el.checked = false;
    }

    private timeSumTotal = 0;
    private clickVerifyStatusFather(e: MouseEvent): void {
        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;
        this.verifyStatusFather(el);
        clearTimeout(this.timeSumTotal);
        this.timeSumTotal = setTimeout(() => this.sumTotalSize(), 300);
    }

    private async sumTotalSize() {

        const array: mls.stor.IFileInfo[] = this.getAllFileToSave(this);
        let txt = '';
        for await (const file of array) {
            if (file.status !== 'deleted') {
                txt = txt + '\n' + await file.getContent() as string;
            }
        }

        const ret = calculateTotalStringSize(txt, 1000000);
        this.exceededLimit = ret.exceededLimit;
        this.totFileSize = `${this.myMessage.msgTotFile} ${ret.sizeFormatted}`;

    }

    private verifyStatusFather(el: HTMLInputElement): void {
        const father = el.closest('ul');
        if (!father) return;
        const grandfather = father.closest('li');
        if (!grandfather) return;
        const inpMain = grandfather.querySelector('input');
        if (!inpMain) return
        if (el.checked) {
            inpMain.checked = true;
            return;
        }
        let needDisable = true;
        const all = father.querySelectorAll('input');
        all.forEach((i) => {
            if (i.checked) needDisable = false;
        });

        if (needDisable) inpMain.checked = false;
    }

    private async updateList() {
        try {
            this.showLoader(true);
            this.backChecked();
            this.fireEventsDetails();
            await this.setInfos();
            this.showLoader(false);
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
        }
    }

    private async fireOnPullrequest(e: MouseEvent) {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            this.showLoader(true);
            const driver = mls.stor.others.getDefaultDriver(prj);
            const opt = {
                owner: this.owner,
                repo: this.repo,
                branch: this.branch,
                title: 'Pull request',
                description: 'Pull request'
            }
            const ret = await driver.createPullRequest(opt);
            if (!ret) throw new Error('Error Pull request');
            this.showLoader(false);
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
            console.info('Error fireOnPullrequest');
        }
    }

    private async createFork(e: MouseEvent) {
        try {
            e.stopPropagation();
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            this.showLoader(true);
            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj);
            if (!info || !info.login) {
                const user = await driver.getUserInfo();
                info.login = user.login;
                this.setLocalHIstoryCurrentInfoDriver(user.login);
            }
            const ret = await driver.createFork(info.login, info.repo, info.owner, info.login);
            if (!ret) throw new Error('Error create fork');
            this.owner = info.login;
            this.repo = info.repo;
            this.branch = 'main';
            this.setLocalHIstoryCurrentInfoDriver();
            this.init(false)
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
            console.info('Error onCreateFork');
        }
    }

    private forceSaveL5ProjectFile: boolean = false;
    private arrayRollback: mls.stor.IFileInfo[] = [];
    //Sempre que salvar vai gerar um novo branch no usuario e solicitar um pullrequest.
    private async onSave(e: MouseEvent) {
        try {
            e.stopPropagation();
            const el = e.target as HTMLButtonElement;
            if (!el) return;

            if (this.exceededLimit) {
                this.setError(this.myMessage.msgErroTotFile);
                return;
            }


            const father = el.closest('sectionsave') as HTMLDivElement;
            if (!father) return;

            const txt = father.querySelector('textarea') as HTMLTextAreaElement;
            if (!txt.value) {
                throw new Error(this.myMessage.needComment);
            }

            this.showLoader(true);
            if (!mls.l5.actualOrg) throw new Error('No organization selected');

            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');

            const actualOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg];
            const config = await getConfigProject(prj, true);
            if (!config) throw new Error('Not found config file in this project');

            const configOrg = config.orgName;
            if (actualOrg !== configOrg) {
                config.orgName = actualOrg;
                await updateConfigProject(prj, config);
                this.forceSaveL5ProjectFile = true;
            }

            const msg = txt.value;
            const array: mls.stor.IFileInfo[] = this.getAllFileToSave(father);
            this.verifyNeedSelectDS(array);
            this.arrayRollback = array;
            const oldOwner = this.owner;
            const oldRepo = this.repo;
            const oldBranch = this.branch;
            this.isRemovedFork = false;

            await this.fireCreateForkOrUpdate();
            console.info('gerou o fork');

            await this.fireCreateNewBranch();
            console.info('gerou o branche');

            await this.onSavenewPullrequest(array, msg);
            console.info('gerou o push');

            await this.firePullrequest(msg);
            console.info('gerou o pullrequest');

            this.backChecked();

            await this.afterSave(array);
            txt.value = '';

            this.clearLocalHIstoryCurrentInfoDriver();
            this.owner = oldOwner;
            this.repo = oldRepo;
            this.branch = oldBranch;

            this.totFileSize = `${this.myMessage.msgTotFile} 0B`

            await this.setInfos();
            this.fireEvents();
            window.collabMessages.add(this.myMessage.pullrequestOk, 'information', { timeToClose: 5000, autoClose: true });
            this.showLoader(false);

        } catch (err: any) {
            this.arrayRollback.forEach((i) => {
                if (!i.inLocalStorage) i.inLocalStorage = true;
            });
            this.error = err.message;
            this.setError(err.message);
            this.backChecked();
            this.showLoader(false);
            console.info('Error onSave:', err);
        }
    }

    private verifyNeedSelectDS(array: mls.stor.IFileInfo[]) {

        if (!this.freeToSave.hasDS) return;
        const has = array.filter((a) => a.project === mls.actualProject && a.shortName === 'designSystem' && a.extension === '.ts' && a.folder === '').length > 0;

        if (!has) throw new Error('Design system needs to be saved along with upcoming changes!');

    }

    private async afterSave(fileInfos: mls.stor.IFileInfo[]) {
        try {
            for await (const f of fileInfos) {
                if (f.onAction) {
                    await f.onAction('aftersave');
                }
            }
        } catch (e: any) {
            console.info('Erro onAftersave:' + e.message);
        }
    }

    private async onSavenewPullrequest(ar: mls.stor.IFileInfo[], msg: string) {
        if (ar.length <= 0) return;
        try {
            const arrSet: mls.stor.IFileInfo[] = [];
            ar.forEach((i) => {
                i.inLocalStorage = false;
                if (!i.onAction) i.onAction = (action: mls.stor.IFileInfoAction) => {
                    return this.afterUpdate(i);
                }
                arrSet.push(i);
            });
            if (arrSet.length > 0) {
                await mls.stor.setContents(arrSet, msg);
            }
            return;
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
        }
    }

    private isRemovedFork: boolean = false;
    private async fireCreateForkOrUpdate() {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');

            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();

            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);

            if (!isForkExist) {
                console.info('criou um novo fork');
                const ret = await driver.createFork(info.login, this.repo, this.owner, info.login);
                if (!ret) throw new Error('Error create fork');
                this.owner = info.login;
                this.branch = 'main';
            } else {
                console.info('atualizou fork');
                const opt = {
                    repoOrigin: this.repo,
                    ownerOrigin: this.owner,
                    branchOrigin: 'main',
                    repoDest: this.repo,
                    ownerDest: info.login,
                    branchDest: 'main',
                }
                const ret = await (driver as any).syncFork(opt);
                if (!ret) throw new Error('Error sync fork');
                this.owner = info.login;
            }

        } catch (e: any) {
            if (!this.isRemovedFork) {
                await this.removeFork();
                return;
            }
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
            console.info('Error fireCreateForkOrUpdate: ' + e.message);
            throw new Error(e.message + ' in: fireCreateForkOrUpdate');
        }
    }

    private async removeFork() {
        try {
            this.isRemovedFork = true;
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();
            info.login = user.login;
            const isForkExist = await (driver as any).checkForkIO(this.owner, this.repo, info.login);
            if (!isForkExist) throw new Error('removeFork: Not found fork for delet');
            await driver.deleteRepository(this.repo, info.login);
            console.info('deletou o fork');
            await this.fireCreateForkOrUpdate();
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
            console.info('Error removeFork: ' + e.message);
            throw new Error(e.message + ' in: removeFork');
        }
    }

    private async fireCreateNewBranch() {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const driver = mls.stor.others.getDefaultDriver(prj);
            const user = await driver.getUserInfo();
            const login = user.login;
            const newBranch = login + '_' + Date.now().toString();
            const ret = await driver.createNewBranch({ owner: this.owner, repo: this.repo, branch: this.branch, newBranch: newBranch });
            if (!ret) throw new Error('Error create Branch');
            this.branch = newBranch;
            this.setLocalHIstoryCurrentInfoDriver();
        } catch (err: any) {
            throw new Error(err.message + ' in: fireCreateNewBranch')
        }
    }

    private async firePullrequest(msg: string) {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const driver = mls.stor.others.getDefaultDriver(prj);
            const opt = {
                owner: this.owner,
                repo: this.repo,
                branch: this.branch,
                title: msg,
                description: msg
            }
            const ret = await driver.createPullRequest(opt);
            if (!ret) throw new Error('Error Pull request');
        } catch (err: any) {
            throw new Error(err.message + ' in: firePullrequest');
        }
    }

    //Manter para no futuro implementarmos o modo de salvar direto no repo.
    private async onSave_withOutPullRequest(e: MouseEvent) {
        try {
            e.stopPropagation();
            const el = e.target as HTMLButtonElement;
            if (!el) return;
            const father = el.closest('sectionsave') as HTMLDivElement;
            if (!father) return;
            this.showLoader(true);
            if (!mls.l5.actualOrg) throw new Error('No organization selected');
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const actualOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg];
            const config = await getConfigProject(prj, true);
            if (!config) throw new Error('Not found config file in this project');
            const configOrg = config.orgName;
            if (actualOrg !== configOrg) {
                config.orgName = actualOrg;
                await updateConfigProject(prj, config);
                this.forceSaveL5ProjectFile = true;
            }
            const txt = father.querySelector('textarea')
            const array: mls.stor.IFileInfo[] = this.getAllFileToSave(father);
            const msg = txt ? txt.value : '';
            setTimeout(async () => {
                try {
                    this.setLocalHIstoryCurrentInfoDriver();
                    const p = await this.veriFyPermission();
                    if (p.read && !p.write) {
                        this.scenery = 'block';
                        this.showLoader(false);
                        this.requestUpdate();
                        return;
                    } else if (!p.read && !p.write) {
                        this.scenery = 'blockAll';
                        this.showLoader(false);
                        this.requestUpdate();
                        return;
                    }
                    //await this.verifyVersionBlock(array);
                    await this.onSave_old(array, msg);
                    await this.setInfos();
                    this.fireEvents();
                    this.showLoader(false);
                } catch (e: any) {
                    this.error = e.message;
                    this.setError(e.message);
                    this.showLoader(false);
                }
            }, 500);
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
            this.showLoader(false);
            console.info('Error onSave');
        }
    }

    private backChecked() {
        const els = this.querySelectorAll('input[type="checkbox"]:checked')
        Array.from(els).forEach((i) => (i as HTMLInputElement).checked = false);
    }

    private async veriFyPermission(): Promise<IPermission> {
        try {
            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project actual');
            const info = this.getLocalHIstoryCurrentInfoDriver();
            const driver = mls.stor.others.getDefaultDriver(prj)
            if (!info || !info.login) {
                const user = await driver.getUserInfo();
                info.login = user.login;
                this.setLocalHIstoryCurrentInfoDriver(user.login);
            }
            const p = (driver as any).verifyPermission(info.owner, info.repo, info.login) as IPermission;
            return p;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    private clearLocalHIstoryCurrentInfoDriver(): void {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        if (info[prj]) delete info[prj];
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private setLocalHIstoryCurrentInfoDriver(user: string | undefined = undefined): void {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        info[prj] = {
            owner: this.owner,
            repo: this.repo,
            branch: this.branch,
            login: user ? user : info.login
        }
        localStorage.setItem('InfoCurrentDriver', JSON.stringify(info));
    }

    private getLocalHIstoryCurrentInfoDriver(): { owner: string, repo: string, branch: string, login: string } {
        const prj = mls.actualProject;
        if (!prj) throw new Error('Not found project actual');
        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';
        const info: any = JSON.parse(str);
        if (info[prj]) return info[prj]
        return {} as any;
    }

    private getAllFileToSave(father: HTMLElement): mls.stor.IFileInfo[] {
        const ar: mls.stor.IFileInfo[] = [];
        if (this.forceSaveL5ProjectFile) {
            const allChecks = father.querySelectorAll('input[type="checkbox"][onlyStatusFather]');
            allChecks.forEach((item: any) => {
                if (item.instance
                    && item.instance.level === 5
                    && item.instance.shortName === 'project'
                    && item.instance.extension === '.json') {
                    item.checked = true;
                }
            });
            this.forceSaveL5ProjectFile = false;
        }
        const els = father.querySelectorAll('input[type="checkbox"][onlyStatusFather]:checked');
        els.forEach((el: any) => {
            if (el.instance) {
                ar.push(el.instance);
                const info = el.instance as mls.stor.IFileInfo
                if (info.extension === '.ts' && info.status === 'deleted') {
                    const key = mls.stor.getKeyToFiles(info.project, info.level, info.shortName, info.folder, '.html');
                    const fl = mls.stor.files[key];
                    if (!fl || fl.status === 'new') return;
                    fl.status = 'deleted';
                    ar.push(fl);
                }
            }
        })

        const unics = Array.from(
            new Map(
                ar.map(item => [`${item.project}_${item.shortName}_${item.folder}_${item.extension}`, item])
            ).values()
        );

        return unics;
    }

    private async onSave_old(ar: mls.stor.IFileInfo[], msg: string) {
        if (ar.length <= 0) return;
        try {
            let versionBLock = 0;
            const arrSet: mls.stor.IFileInfo[] = [];
            ar.forEach((i) => {
                if (i.isLocalVersionOutdated && !['new', 'deleted'].includes(i.status)) {
                    versionBLock++;
                    return;
                }
                i.inLocalStorage = false;
                if (!i.onAction) i.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(i);
                arrSet.push(i);
            });
            if (arrSet.length > 0) {
                await mls.stor.setContents(arrSet, msg);
                await this.uppVersionAfterSave(arrSet);
                await this.afterSave(arrSet);
                this.fireEvents(800);
            }
            if (versionBLock > 0) {
                (window as any).collabMessages.add(`File ${versionBLock} was changed in server, file was not save`, 'information');
            }
            return;
        } catch (e: any) {
            this.error = e.message;
            this.setError(e.message);
        }
    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {
        const mmodel: mls.editor.IModels | undefined = mls.editor.getModels(storFile.project, storFile.shortName, storFile.folder);
        storFile.inLocalStorage = false;
        if (storFile.status === 'deleted') {
            await this.deleteFile(storFile);
            return;
        }
        if (storFile.status === 'renamed' && mmodel && mmodel.ts) {
            mmodel.ts.originalProject = undefined;
            mmodel.ts.originalShortName = undefined;
            mmodel.ts.originalCRC = mls.common.crc.crc32(mmodel.ts.model.getValue()).toString(16);
        }
        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        storFile.status = 'nochange';
    }

    private async uppVersionAfterSave(array: mls.stor.IFileInfo[]) {
        try {
            const driver = mls.stor.others.getDefaultDriver(mls.actualProject as number);
            if (!driver || !(driver as any).getVersionFromFiles) return;

            const info = await (driver as any).getVersionFromFiles(this.owner, this.repo, this.branch, array);
            if (!info) return;

            for await (const a of array) {
                const key = mls.stor.getKeyToFiles(a.project, a.level, a.shortName, a.folder, a.extension);
                if (!mls.stor.files[key] || !info[key]) continue;
                mls.stor.files[key].versionRef = info[key];
                mls.stor.files[key].isLocalVersionOutdated = false;
                mls.stor.files[key].newVersionRefIfOutdated = undefined;
                await mls.stor.localStor.setContent(mls.stor.files[key], { contentType: 'string', content: null });
            }

        } catch (e) {
            console.info(e);
            return;
        }
    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {

        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

        if (storFile.inLocalStorage) {

            await mls.stor.cache.setContent(storFile, null);
            mls.editor.deleteModels(storFile.project, storFile.shortName, storFile.folder, true, storFile.level);
        }

        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];
    }

    private fireEvents(time: number = 0): void {
        const params = {} as mls.events.IFileAction;
        params.action = 'projectListChanged';
        params.level = 5;
        params.project = mls.actualProject as number;
        params.position = this.position as ('right' | 'left');
        mls.events.fire([5], ['FileAction'], JSON.stringify(params), time);
        this.fireEventsDetails();
    }

    private fireEventsDetails() {

        this.isFreeToSave = false;
        this.freeToSave = { ts: false, less: false, hasDS: false };
        const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'designSystem', '', '.ts');
        const file = mls.stor.files[key];
        let aux = '';
        if (file && file.inLocalStorage) {
            this.freeToSave.hasDS = true;
            aux = '<plugin-verify-error-design-system-100554 autoPrepare="true"></plugin-verify-error-design-system-100554>'
        }

        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<plugin-pullrequest-100554 autoPrepare="true"></plugin-pullrequest-100554><plugin-verify-error-100554 autoPrepare="true"></plugin-verify-error-100554>' + aux
        }
        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );
    }

    private async undoFile(storFile: mls.stor.IFileInfo) {
        /*const params = {} as mls.events.IFileAction;
        params.action = 'undo';
        params.level = storFile.level;
        params.project = storFile.project;
        params.shortName = storFile.shortName;
        params.extension = storFile.extension;
        params.folder = storFile.folder;
        params.position = this.position as ('right' | 'left');
        (params as any).undoType = storFile.extension;
        mls.events.fire([2], ['FileAction'], JSON.stringify(params), 0);*/
        await undoFile(storFile);
        setTimeout(async () => {
            await this.setInfos();
            this.backChecked();
            this.requestUpdate();
        }, 500);
    }
}

interface IPermission {
    write: boolean,
    read: boolean,
    create: boolean,
    delete: boolean,
}

interface IDefItem {
    [key: number]: IDefItemLevel
}

interface IDefItemLevel {
    [key: number]: Ifile
}

interface Ifile {
    [key: string]: Iitem[]
}

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    span: string;
    onlyFather: boolean,
    disabled: boolean,
    errorLocal: boolean
}
