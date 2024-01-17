/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-save-100554')
export class ServiceSave extends ServiceBase {

    @property() itens: any = undefined; 

    @property() error: string = ''; 

    constructor() {
        super();
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf0c7',
        name: 'Save',
        mode: 'B',
        position: 'all',
        readOnly: false,
        tooltip: 'Save',
        className: undefined,
        tags: [],
        levels: [5]
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

        if (this.error !== '') return html`${this.error}`;
        return html` ${this.itens
            ? html`<sectionsaveheader> ${this.renderHeader()} </sectionsaveheader>${this.renderItens()}` : this.renderNoItens()}
            
        `
    }

    renderHeader() {
        return html`
            <i class="fa fa-floppy-o"></i>
            <span>${this.myMsg.updateChanges}</span>    
        
        `
    }

    renderNoItens() {
        return html`
            <sectionnosave>
                <span>${this.myMsg.noItemsToSave}</span> 
            </sectionnosave>  
        
        `
    }

    renderItens() {

        const keys = Object.keys(this.itens);
        return html`
            <sectionsave>
                <div id="Save_menu_action" style="display:flex;">
                    <div style="width:calc(100% - 85px);" >
                        <h4 class="mt-3">${this.myMsg.comments}:</h4>
                        <textarea id="commitMessage" class="form-control" style="width:95%;" rows="2" maxlength="50"></textarea>
                    </div>
                    <div id="div_btn_save" class="text-right" style="width:79px; display: flex; align-items: self-end;">
                        <button id="btn_save" style="width:78px" class="btn btn-sm btn-primary" @click="${this.onSave}">${this.myMsg.update}</button>
                    </div>
                </div>
                <h4 class="mt-3" data-mlsline="23">${this.myMsg.fileChanges}</h4>
                <ul>
                    ${keys.map((key, index) => { return this.renderProject(key, index); })}
                </ul>
            </sectionsave>  
        
        `
    }

    renderProject(project: string, index: number) {

        const keys = Object.keys(this.itens[project]);

        return html`
        <li>
            <div>
                <span class="fatv fa-caret-righttv" @click="${this.openMe}"></span>
                <input type="checkbox" id="l0-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${index}">${project}</label>
            </div>
            <ul>
                ${keys.map((key, indexl) => {
            return this.renderLevels(key, project, index, indexl);

        })}
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
                <span class="fatv fa-caret-righttv" @click="${this.openMe}"></span>
                <input type="checkbox" id="l0-${project}-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${project}-${index}">l${level}</label>
            </div>
            <ul>
                ${keys.map((key, index3) => {
            const objL = objP[level];
            const objDS = objL[key];
            const itens = objDS ? objDS as [] : [];
            return html`
                        <li>
                            <div>
                                <span class="fatv fa-caret-righttv" @click="${this.openMe}"></span>
                                <input type="checkbox" id="l0-${project}-${index}-${index3}" @click="${this.clickSetValueAllChilds}">
                                <label for="l0-${project}-${index}-${index3}">${key}</label>
                            </div>
                            <ul>
                                ${itens.map((item, indexI) => {
                return this.renderItem(item, indexP, index, indexI);
            })}
                            </ul>
                        </li>
                    `
        })}
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
                <span class="fatv fa-caret-righttv" @click="${this.openMe}"></span>
                <input type="checkbox" id="l0-${project}-${index}" @click="${this.clickSetValueAllChilds}">
                <label for="l0-${project}-${index}">l${level}</label>
            </div>
            <ul>
                ${itens.map((item, indexI) => {
            return this.renderItem(item, indexP, index, indexI);
        })}
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
        this.updateMyMessages();
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
                if (!file.inLocalStorage || file.status === 'nochange' || file.project === 0) continue;

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

            if (Object.keys(objProjects).length > 0) this.itens = objProjects;
            else this.itens = undefined;

        } catch {

            this.itens = undefined;
            // setar error;

        }

    }

    private oIcon = {
        nochange: { icon: '&#xf1c0', title: 'Local' },
        changed: { icon: '&#xf303', title: 'Edited' },
        renamed: { icon: '&#xf0c5', title: 'Renamed' },
        deleted: { icon: '&#xf068', title: 'Deleted' },
        //deleted: { icon: '&#xf1f8', title: 'Deleted' },f068
        //new: { icon: '&#xf006', title: 'New' }2b
        new: { icon: '&#x2b', title: 'New' }
    };

    private async configItem(item: mls.stor.IFileInfo) {

        let mountText = item.shortName + item.extension;

        let disabled = false;

        let span = `<span style="font-size: 12px; color: #7678a6; margin-left: 5px;" class="fa" title="${this.oIcon[item.status].title}">${this.oIcon[item.status].icon}</span>`;

        if (item.hasError && item.status !== 'deleted') {
            span = '<span style="font-size: 12px; color: #ff0000; margin-left: 5px;" class="fa" title="Error">&#xf188</span>';
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

    private openMe(e: MouseEvent) {

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

    private async onSave(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLButtonElement;
        if (!el) return;
        const father = el.closest('sectionsave') as HTMLDivElement;
        if (!father) return;

        const txt = father.querySelector('textarea')
        const array: mls.stor.IFileInfo[] = this.getAllFileToSave(father);
        console.info(array);
        this.showLoader(true);
        const msg = txt ? txt.value : '';

        setTimeout(async () => {

            try {

                await this.onSavenew(array, msg);
                await this.setInfos();
                this.showLoader(false);

            } catch (e: any) {
                this.error = e.message;
                this.showLoader(false);
            }

        }, 500);

    }

    private getAllFileToSave(father: HTMLElement): mls.stor.IFileInfo[] {

        const ar: mls.stor.IFileInfo[] = [];
        const els = father.querySelectorAll('input[type="checkbox"][onlyStatusFather]:checked');

        els.forEach((el: any) => {
            if (el.instance) ar.push(el.instance);
        })

        return ar;
    }

    private async onSavenew(ar: mls.stor.IFileInfo[], msg: string) {

        if (ar.length <= 0) return;
        try {

            ar.forEach((i) => {

                i.inLocalStorage = false;
                if (!i.onAction) i.onAction = (action: mls.stor.IFileInfoAction) => this.afterUpdate(i);

            });

            await mls.stor.setContents(ar, msg);

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

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.updateChanges) this.myMsg.updateChanges = m.updateChanges;
        if (m.comments) this.myMsg.comments = m.comments;
        if (m.update) this.myMsg.update = m.update;
        if (m.fileChanges) this.myMsg.fileChanges = m.fileChanges;
        if (m.noItemsToSave) this.myMsg.noItemsToSave = m.noItemsToSave;

    }

    private myMsg = {
        updateChanges: 'Update Changes',
        comments: 'Comments',
        update: 'Update',
        fileChanges: 'File Changes',
        noItemsToSave: 'No items to save'
    }

}

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    span: string;
    onlyFather: boolean,
    disabled: boolean,
}