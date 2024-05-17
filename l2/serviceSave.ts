/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    updateChanges: 'Atualizar alterações',
    comments: 'Comentários',
    update: 'Atualizar',
    fileChanges: 'Alterações de arquivos',
    noItemsToSave: 'Nenhum item para salvar'
}

const message_en = {
    updateChanges: 'Update Changes',
    comments: 'Comments',
    update: 'Update',
    fileChanges: 'File Changes',
    noItemsToSave: 'No items to save'
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
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
        },
        icons: {},
        actionDefault: 'opSave', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    private showInitial(): boolean {
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
        return html` ${this.itens
            ? html`<sectionsaveheader> ${this.renderHeader()} </sectionsaveheader>${this.renderItens()}` : this.renderNoItens()}
            
        `
    }

    renderHeader() {
        return html`
            <i class="fa fa-floppy-disk"></i>
            <span>${this.myMessage.updateChanges}</span>    
        
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

    private async init() {

        this.showLoader(true);
        await this.setInfos();
        this.showLoader(false);

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

        } catch (e) {

            console.info('Error onSave');

        }


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

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    span: string;
    onlyFather: boolean,
    disabled: boolean,
}