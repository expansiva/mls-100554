/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { collab_branch } from './_100554_collabIcons';
import { initServiceSaveaddBranch } from './_100554_saveAddBranch';
import { getMyKeysBranch } from './_100554_libCommom';

initServiceSaveaddBranch();
/// **collab_i18n_start**
const message_pt = {
    updateChanges: 'Atualizar alterações',
    comments: 'Comentários',
    update: 'Atualizar',
    fileChanges: 'Alterações de arquivos',
    noItemsToSave: 'Nenhum item para salvar',
    msgPullRequest: 'Este projeto utiliza pull requests, todas as alterações serão salvas no branch do seu usuário, para criar um pull request clique no botão',
    createPullRequest: "Criar pull request",
    create: 'Criar',
    cancel: 'Cancelar',
    title: 'Titulo',
    errorCreatePull: 'Erro ao tentar criar pull request',
    msgBlockAll: 'Você não tem acesso a este repositorio, por fvor entre em contato com o admin do projeto',
    msgBlock: 'Você não tem acesso de escrita neste repositorio, caso deseje criar um fork clique no botão abaixo',

}

const message_en = {
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

    private owner: string = '';
    private repo: string = '';
    private branch: string = '';

    private scenery: string = 'save';

    @property() itens: any = undefined;
    @property() error: string = '';


    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf0c7',
        state: 'background',
        position: 'left',
        tooltip: 'Save',
        visible: true,
        widget: '_100554_serviceSave',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opSave') return this.showInitial();
        if (op === 'opBranch') return this.showBranche();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
            opBranch: ''
        },
        icons: {},
        actionDefault: 'opSave', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    private showInitial(): boolean {
        return true;
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

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {
            this.updateList();
        } else if (visible && !reinit) {
            this.updateList();
        }
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(3, 'FileAction', this.onMLSEvents.bind(this));
        mls.events.addListener(5, 'ProjectSelected', (ev) => { this.init(); });
        this.verifyExitFileChanged();

    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (ev.type !== 'FileAction') return;
        const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

        if (!['changed', 'delete', 'new', 'rename'].includes(fileAction.action)) return;

        this.scenery = 'save';
        if (this.isServiceVisible()) {
            this.init();
        }

        this.toogleBadge(true, '_100554_serviceSave');

    }

    private isServiceVisible(): boolean {

        return this.visible === 'true';

    }

    private verifyExitFileChanged(): void {

        if (!mls.stor.files) return;

        const array = Object.keys(mls.stor.files);
        let exist = false;
        array.forEach((i) => {

            const f = mls.stor.files[i];
            if (!f) return;
            if (f.project === mls.actual[5].project && f.status !== 'nochange')
                exist = true;

        });

        if (!exist) return;
        this.toogleBadge(true, '_100554_serviceSave');


    }

    // -------------  WEBCOMPONENT -------------

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }



    render() {

        const lang = this.getMessageKey(messages);
        this.myMessage = messages[lang]

        if (this.error !== '') {

            setTimeout(() => this.error = '', 3000);
            return html`${this.error}`;

        }

        if (this.scenery !== 'save') {
            return this.renderBlockScenery();
        }

        if (this.itens) {

            return html`
                ${this.renderHeader()}
                ${this.renderItens()}
            `;

        } else {

            return html`
                ${this.renderNoItens()}
            `

        }
    }

    renderBlockScenery() {

        if (this.scenery === 'blockAll') {

            return html`
            <h4 style="margin-top:1rem; text-align:center">${this.myMessage.msgBlockAll}</h4>
            
        `;

        }
        return html`
            <h4 style="margin-top:1rem; text-align:center">${this.myMessage.msgBlock}</h4>
            <div style=" display: flex; justify-content: center; align-items: center; margin-top:1rem">
                <button @click="${this.createFork}" style=" display: flex; justify-content: center; align-items: center; margin: 0px; padding: 10px; height: 30px; background: #007bff; color: #fff;">
                    <svg width="16" height="16" fill="#fff" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>
                    Fork
                </button>
            </div>
        `;
    }

    renderHeader() {
        return html`
            <div style="display:flex; gap:1rem; font-size:.95rem; border-bottom: 1px solid #e2e1e1; padding-bottom: .5rem; position: relative">

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

                <button style=" display: flex; justify-content: center; align-items: center; margin: 0px; padding: 5px; height: 23px; " @click="${() => { if (this.menu.setMenuActive) this.menu.setMenuActive('opBranch') }}">
                    ${collab_branch} Change
                </button>

                <button style=" display: flex; justify-content: center; align-items: center; margin: 0px; padding: 5px; height: 23px; background: #007bff; color: #fff; position: absolute; right: 0px;">
                    <svg width="16" height="16" fill="#fff" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>
                    Pull request
                </button>

            </div>
        `
    }

    renderNoItens() {
        return html`
            <sectionnosave>
                <span>${this.myMessage.noItemsToSave}</span> 
            </sectionnosave>  
        
        `
    }

    renderItens() {

        const keys = Object.keys(this.itens);
        return html`
            <sectionsave>
                <div id="Save_menu_action" style="display:flex;">
                    <div style="width:100%;" >
                        <h4 class="mt-3">${this.myMessage.comments}:</h4>
                        <textarea id="commitMessage" class="form-control" style="width:95%;" rows="2" maxlength="50"></textarea>
                    </div>
                    <div id="div_btn_save" class="text-right" style="width:79px; display: flex; align-items: self-end;">
                        <button id="btn_save" class="btnSave btn-sm btnSave-primary" @click="${this.onSave}">${this.myMessage.update}</button>
                    </div>
                </div>
                <h4 class="mt-3" data-mlsline="23">${this.myMessage.fileChanges}</h4>
                <ul>
                    ${repeat(
            keys,
            ((key: any) => key) as any,
            ((k: any, index: any) => {

                return this.renderProject(k, index);

            }) as any
        )}
                </ul>
            </sectionsave>  
        
        `
    }

    renderProject(project: string, index: number) {

        const keys = Object.keys(this.itens[project]);

        return html`
        <li>
            <div>
                <span class="fatv fa-caret-righttv" @click="${this.openMeList}"></span>
                <input type="checkbox" id="l0-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${index}">${project}</label>
            </div>
            <ul>
                ${repeat(
            keys,
            ((key: any) => key) as any,
            ((k: any, indexl: any) => {

                return this.renderLevels(k, project, index, indexl);

            }) as any
        )}
            </ul>
        </li>
        `;

    }

    renderLevels(level: string, project: string, indexP: number, index: number) {

        if (level === '3') {
            return this.renderLevel3(level, project, indexP, index);
        } else {
            return this.renderLevelsDefault(level, project, indexP, index);
        }

    }

    renderLevel3(level: string, project: string, indexP: number, index: number) {

        const objP = this.itens[project];
        const keys = Object.keys(objP[level]);

        return html`
        <li>
            <div>
                <span class="fatv fa-caret-righttv" @click="${this.openMeList}"></span>
                <input type="checkbox" id="l0-${project}-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${project}-${index}">l${level}</label>
            </div>
            <ul>
                ${repeat(
            keys,
            ((key: any) => key) as any,
            ((k: any, index3: any) => {
                const objL = objP[level];
                const objDS = objL[k];
                const itens = objDS ? objDS as [] : [];
                return html`
                                <li>
                                    <div>
                                        <span class="fatv fa-caret-righttv" @click="${this.openMeList}"></span>
                                        <input type="checkbox" id="l0-${project}-${index}-${index3}" @click="${this.clickSetValueAllChilds}">
                                        <label for="l0-${project}-${index}-${index3}">${k}</label>
                                    </div>
                                    <ul>                        
                                        ${repeat(
                    itens,
                    ((item: any) => item) as any,
                    ((i: any, indexI: any) => {

                        return this.renderItem(i, indexP, index, indexI);

                    }) as any
                )}
                                    </ul>
                                </li>
                            `

            }) as any
        )}
            </ul>
        </li>
        `;

    }


    renderLevelsDefault(level: string, project: string, indexP: number, index: number) {

        const objP = this.itens[project];
        const itens = objP[+level] as [];

        return html`
        <li>
            <div>
                <span class="fatv fa-caret-righttv" @click="${this.openMeList}"></span>
                <input type="checkbox" id="l0-${project}-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${project}-${index}">l${level}</label>
            </div>
            <ul>
                ${repeat(
            itens,
            ((item: any) => item) as any,
            ((i: any, indexI: any) => {

                return this.renderItem(i, indexP, index, indexI);

            }) as any
        )}
            </ul>
        </li>
        `;

    }

    renderItem(item: Iitem, indexP: number, indexL: number, index: number) {

        return html`
        <li style="padding-left: 1.1rem;" > 
            <div>
                ${item.disabled || item.onlyFather
                ? html`<input type="checkbox" id="l0-${indexP}-${indexL}-${index}" disabled onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}" .instance=${item.file}>`
                : html`<input type="checkbox" id="l0-${indexP}-${indexL}-${index}" onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}" .instance=${item.file}>`
            }
                
                <label for="l0-${indexP}-${indexL}-${index}">
                
                    ${item.text}
                    ${unsafeHTML(item.span)}
                
                </label>
            </div>
        </li>
        `;

    }

    //-------- IMPLEMENTATION --------

    private async init(isSetInfoProject: boolean = true) {

        this.showLoader(true);
        this.scenery = 'save';
        if (isSetInfoProject) await this.initInfoProject();
        await this.setInfos();
        this.showLoader(false);

    }

    private async initInfoProject() {

        const prj = mls.actual[5].project;
        if (!prj) return;

        const info = getMyKeysBranch(prj);
        if (!info) return;

        this.branch = info.branch;
        this.owner = info.owner;
        this.repo = info.repo;
    }


    private showLoader(loader: boolean): void {

        this.loading = loader;

    }

    private async setInfos() {

        try {

            const objProjects: any = {};
            const filesKeys = Object.keys(mls.stor.files);

            for (const fKey of filesKeys) {

                const file = mls.stor.files[fKey] as mls.stor.IFileInfo;
                if (
                    /*(!file.inLocalStorage && file.status === 'nochange') ||
                    file.status === 'nochange' ||*/
                    (!file.inLocalStorage && file.status !== 'deleted') ||
                    file.project === 0 ||
                    file.project !== mls.actual[5].project) continue;

                const pj = file.project;
                const level = file.level;

                if (!objProjects[pj]) objProjects[pj] = {};
                const obj = objProjects[pj];
                if (!obj[level] && level === 3) {

                    const nNivel = file.folder.split('/');
                    if (nNivel.length >= 2) {
                        obj[level] = { [nNivel[1]]: [await this.configItem(file)] }
                    }

                } else if (!obj[level]) {
                    obj[level] = [await this.configItem(file)];

                } else if (obj[level] && level === 3) {

                    const nNivel = file.folder.split('/');
                    const obj3 = obj[level];
                    if (nNivel.length >= 2 && obj3[nNivel[1]]) {

                        obj3[nNivel[1]].push(await this.configItem(file))
                    }

                } else {
                    obj[level].push(await this.configItem(file));
                }

            }

            if (Object.keys(objProjects).length > 0) {
                this.itens = objProjects;
            }
            else {
                this.itens = undefined;
                this.toogleBadge(false, '_100554_serviceSave');
            }

        } catch {

            this.itens = undefined;
            // setar error;

        }

    }

    private oIcon = {
        nochange: { icon: 'fa-file-pen', title: 'Edited' },
        changed: { icon: 'fa-file-pen', title: 'Edited' },
        renamed: { icon: 'fa-clone', title: 'Renamed' },
        deleted: { icon: 'fa-xmark', title: 'Deleted' },
        //deleted: { icon: '&#xf1f8', title: 'Deleted' },f068
        //new: { icon: '&#xf006', title: 'New' }2b
        new: { icon: 'fa-plus', title: 'New' }
    };

    private async configItem(item: mls.stor.IFileInfo) {

        let mountText = item.shortName + item.extension;

        let disabled = false;

        let span = `<span style="font-size: 12px; color: #7678a6; margin-left: 5px;" class="fa ${this.oIcon[item.status].icon}" title="${this.oIcon[item.status].title}"></span>`;

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

        return {
            file: item,
            text: mountText,
            span: span,
            onlyFather: item.level === 3,
            disabled: disabled,
        }


    }

    private openMeList(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li') as HTMLElement;
        if (!li) return;
        li.classList.toggle('open');


    }

    private clickSetValueAllChilds(e: MouseEvent): void {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;

        this.setValueAllChilds(el);

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

    private clickVerifyStatusFather(e: MouseEvent): void {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;

        this.verifyStatusFather(el);

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
            await this.setInfos();
            this.showLoader(false);

        } catch (e: any) {
            this.error = e.message;
            this.showLoader(false);
        }
    }

    /*private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }*/

    private createArrayInfoVersion(array: mls.stor.IFileInfo[]): { name: string, version: string, file: mls.stor.IFileInfo }[] {

        const ret: any = [];
        array.forEach((i) => {

            ret.push({
                name: `l${i.level}/${i.folder ? i.folder + '/' : ''}${i.shortName}${i.extension}`,
                version: i.versionRef,
                file: i
            })

        })
        return ret;
    }

    private async uppVersionAfterSave(array: mls.stor.IFileInfo[]) {

        const driver = mls.stor.others.getDefaultDriver(mls.actual[5].project as number);
        const retArray = await driver.loadFilesInfo(mls.actual[5].project as number);

        const arrayVersion = this.createArrayInfoVersion(array);

        retArray.forEach(async (i) => {

            const file = arrayVersion.filter((f) => f.name === i.ShortPath);
            if (!file || file.length <= 0 || (file && file.length >= 1 && file[0].version === i.versionRef)) return;

            if (file[0].version !== i.versionRef) {
                //file[0].file.isLocalVersionOutdated = true;
                //file[0].file.newVersionRefIfOutdated = i.versionRef;
                file[0].file.versionRef = i.versionRef;
                file[0].file.isLocalVersionOutdated = false;
                file[0].file.newVersionRefIfOutdated = undefined;
                await mls.stor.localStor.setContent(file[0].file, { contentType: 'string', content: null });

            }

        });

        mls.stor.localDB.savePrjInfo(mls.actual[5].project as number, retArray); // save cache, dont await

    }

    private async verifyVersionBlock(array: mls.stor.IFileInfo[]) {

        try {

            if (array.length <= 0) return;
            const ret = await mls.stor.server.loadProjectInfoIfNeeded(mls.actual[5].project as number, true);

        } catch (e: any) {
            console.info('Error save verifyVersionBlock:' + e.message);
        }

    }

    private async createFork(e: MouseEvent) {

        try {

            e.stopPropagation();

            const prj = mls.actual[5].project;
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
            this.showLoader(false);
            console.info('Error onCreateFork');

        }
    }

    private async onSave(e: MouseEvent) {

        try {

            e.stopPropagation();
            const el = e.target as HTMLButtonElement;
            if (!el) return;
            const father = el.closest('sectionsave') as HTMLDivElement;
            if (!father) return;

            this.showLoader(true);

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

                    await this.verifyVersionBlock(array);
                    await this.onSavenew(array, msg);
                    await this.setInfos();
                    this.fireEvents();
                    this.showLoader(false);

                } catch (e: any) {
                    this.error = e.message;
                    this.showLoader(false);
                }

            }, 500);

        } catch (e: any) {

            this.error = e.message;
            this.showLoader(false);
            console.info('Error onSave');

        }


    }

    private async veriFyPermission(): Promise<IPermission> {

        try {

            const prj = mls.actual[5].project;
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

    private setLocalHIstoryCurrentInfoDriver(user: string | undefined = undefined): void {

        const prj = mls.actual[5].project;
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

        const prj = mls.actual[5].project;
        if (!prj) throw new Error('Not found project actual');

        let str = localStorage.getItem('InfoCurrentDriver');
        if (!str) str = '{}';

        const info: any = JSON.parse(str);
        if (info[prj]) return info[prj]

        return {} as any;

    }

    private getAllFileToSave(father: HTMLElement): mls.stor.IFileInfo[] {

        const ar: mls.stor.IFileInfo[] = [];
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

        return ar;
    }

    private async onSavenew(ar: mls.stor.IFileInfo[], msg: string) {

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
                this.fireEvents(800);
            }

            if (versionBLock > 0) {
                window.collabMessages.add(`File ${versionBLock} was changed in server, file was not save`, 'information');
            }

            return;

        } catch (e: any) {

            this.error = e.message;

        }

    }

    private async afterUpdate(storFile: mls.stor.IFileInfo) {

        const mmodel: mls.l2.editor.IMFile | undefined = mls.l2.editor.get(storFile);

        if (storFile.status === 'deleted') {
            this.deleteFile(storFile);
            return;
        }
        if (storFile.status === 'renamed' && mmodel) {

            mmodel.originalProject = undefined;
            mmodel.originalShortName = undefined;
            mmodel.originalCRC = mls.common.crc.crc32(mmodel.model.getValue()).toString(16);

        }

        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });

        storFile.status = 'nochange';

    }

    private async deleteFile(storFile: mls.stor.IFileInfo) {

        await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
        mls.l2.editor.remove(storFile);
        const keyFiles = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, storFile.extension);
        delete mls.stor.files[keyFiles];

    }

    private fireEvents(time: number = 0): void {

        const params = {} as mls.events.IFileAction;

        params.action = 'projectListChanged';
        params.level = 5;
        params.project = mls.actual[5].project as number;
        params.position = this.position as ('right' | 'left');

        mls.events.fire([5], ['FileAction'], JSON.stringify(params), time);

    }


}

interface IPermission {
    write: boolean,
    read: boolean,
    create: boolean,
    delete: boolean,
}

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    span: string;
    onlyFather: boolean,
    disabled: boolean,
}