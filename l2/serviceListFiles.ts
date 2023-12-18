/// <mls shortName="serviceListFiles" project="100554" enhancement="_100541_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';
import { IMenu } from './_100554_mlsToolbarService';

@customElement('service-list-files-100554')
export class ServiceListFiles extends ServiceBase {

    get actualLevel(): number { return 2 };

    @property() project: number = 0;

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property({ type: Array }) history: mls.stor.IFileInfo[] = [];

    private info = {
        tot: 0,
        version: 0,
        storage: 0,
        error: 0,
    }

    public details: IService = {
        icon: '&#xf15b',
        name: 'List',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'List Files',
        className: undefined,
        tags: [],
        levels: [2, 4]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAbout') return true;
        if (this.menu.setMode) this.onServiceClick(true, true);
        return false;
    }

    public menu: IMenu = {
        title: 'List Files',
        actions: {
            opAbout: 'About',
        },
        icons: {},
        actionDefault: 'opPlugins', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {

        }

    }

    async connectedCallback() {
        super.connectedCallback();
        // set loading
        await this.getFiles();
        // remove loading
    }

    render() {
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
    }

    private renderHeader() {

        let auxV = '';
        let auxE = '';
        let auxS = '';

        if (this.info.version > 0) {

            auxV = `<b>[${this.info.version}]</b> <span class="fa fa-unbalanced"></span> <b>files changed on the server, </b>`;
        }

        if (this.info.error > 0) {

            auxE = `<b>[${this.info.error}]</b> <span class="fa fa-bug"></span><b>files with errors,</b>`;
        }

        if (this.info.storage > 0) {

            auxS = `<b>[${this.info.storage}]</b> <span class="fa fa-location-dot"></span> <b>files in local storage.</b>`;
        }

        return html`
        <div class="groupHeader">
            <div class="groupAction">
                <a> update list/ verify</a>
                <a> add new file</a>
            </div>
            <div class="groupFilter">
                <div class="groupFilterRadio">
                    <input id="radioProjectActual" name="projectFind" type="radio" checked="checked" value="${this.project}">
                    <label for="radioProjectActual">${this.project}</label>
                    <input id="radioProjectZero" name="projectFind" type="radio" value="0">
                    <label for="radioProjectZero">Local project</label>
                </div>
                <input type="text" placeholder="Filter">
            </div>
            <div class="groupInfo">
                <span style="margin-right:10px">
                    [${this.info.tot}]
				    <span class="fa fa-file"></span> 
                    total files
                </span>
                ${auxV ? html`<span .innerHTML="${auxV}" style="margin-right:10px"></span>` : ''}
                ${auxE ? html`<span .innerHTML="${auxE}" style="margin-right:10px"></span>` : ''}
                ${auxS ? html`<span .innerHTML="${auxS}" style="margin-right:10px"></span>` : ''}
            </div>
        </div>
        `;
    }

    private renderHistory() {

        return html`
            ${this.history.length <= 0 ? '' :
                html`
                    <li class="headerTitle">
                        ${+this.project === 0 ? 'History (All Projects)' : 'History'}
                    </li>
                    ${repeat(
                    this.history,
                    ((item: mls.stor.IFileInfo) => item.shortName) as any,
                    ((file: mls.stor.IFileInfo, index: any) => this.createLiItem(file, index, true)) as any
                )}
                `
            }
        `;
    }

    private renderList() {

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
                                    ${this.createLiItem(file, index, false)}
                                `
                            }

                            return this.createLiItem(file, index, false)

                        }) as any    
                    )}
                `
            }
        `;
    }

    private renderAuxEdit() {
        return html`
            <div class="elContentAux" style="display:none" @click="${this.clickOptStop}">
                <div class="elContentAux2">
                    <span class="spanPrj">
                        <input style="width: 80px;" .value="${this.project}" @click="${this.clickOptStop}">
                    </span>
                    <span class="spanName">
                        <input @click="${this.clickOptStop}">
                    </span>
                    <button class="btnActCloneRename fa fa-file-pen"></button>
                    <button class="fa fa-ban" title="cancel" @click="${this.clickHiddenAux}"></button>
                </div>
                <div class="showError"style="color: red; font-size: 10px;">${this.errorAux}</div>
            </div>
        `;
    }

    private extensionLevel = {
        2: '.ts',
        4: '.html'
    }

    private createLiItem(file: mls.stor.IFileInfo, index: number, inHistory: boolean) {

        const name = this.project === 0 && inHistory ? '_' + file.project + '_' + file.shortName : file.shortName;

        let auxVersion = '';
        let auxStorage = '';
        let auxBug = '';

        if (file.inLocalStorage || (file as any)['statusHtml']) {

            auxStorage = `<span title="in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
            if ((file as any)['statusHtml']) delete (file as any)['statusHtml'];
        }

        if (file.hasError) {

            auxBug = `<span title="bug" class="fa fa-bug" style="color:rgb(169, 3, 3); height: 14px; display: flex; justify-content: center; align-items: center;"></span>`

        }

        if (file.isLocalVersionOutdated) {

            auxVersion = `<span title="need conciliation" class="fa fa-unbalanced" style="color:orange; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`

        }

        return html`
            <li @click="${this.clickOptOpen}" .myFile=${file}>
                <div class="elContent">
                    <div class="groupHiddenList" @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-undo" title="undo"></span>
                        <span class="mls-gpbtnslider-item fa fa-clone" title="clone" @click="${this.clickOptClone}"></span>
                        <span class="mls-gpbtnslider-item fa fa-file-pen" title="rename" @click="${this.clickOptRename}"></span>
                        <span class="mls-gpbtnslider-item fa fa-trash" title="delete"></span>
                    </div>
                    <span class="${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                    <div .innerHTML="${auxStorage + auxBug + auxVersion}"></div>
                </div>
            </li>
        `;

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

    private clickOptOpen(e: MouseEvent) {

        e.stopPropagation();
        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;

        console.info('open', mfile);

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

    private clickOptRenameClone(el: HTMLElement, mode:string) {

        if (!el) return;

        const myfile = this.getMyFileInElement(el);
        if (!myfile) return;

        const father = el.closest('.contentServiceList') as HTMLElement;
        const li = el.closest('li') as HTMLElement;
        if (!father || !li) return;

        const elContentAux = father.querySelector('.elContentAux') as HTMLElement;
        const btnActCloneRename = father.querySelector('.btnActCloneRename') as HTMLElement;
        if (!father || !li) return;

        li.appendChild(elContentAux);
        elContentAux.style.display = '';
        btnActCloneRename.onclick = (e2: MouseEvent) => {

            try {

                e2.stopPropagation();
                const iptProj = elContentAux.querySelector('.spanPrj input') as HTMLInputElement;
                const iptName = elContentAux.querySelector('.spanName input') as HTMLInputElement;

                this.validInputsAux(myfile, { mode: mode, project: iptProj.value, name: iptName.value });

                console.info(mode, myfile);

            } catch (er:any) {

                this.errorAux = er.message;
                setTimeout(() => {this.errorAux = ''}, 2000);

            }

        }

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

        const key = mls.stor.getKeyToFiles(+action.project, this.actualLevel, action.name, file.folder, file.extension);

        return !mls.stor.files[key];

    }


    private async getFiles() {

        try {

            const arraySf: mls.stor.IFileInfo[] = this.getFilesProject();
            const arraySfHistory: mls.stor.IFileInfo[] = await this.getFileHistory();

            this.files = arraySf;
            this.history = arraySfHistory;


        } catch (e) {

            console.info(e);

        }

    }

    private getFilesProject(): mls.stor.IFileInfo[] {

        const arraySf: mls.stor.IFileInfo[] = [];
        const ext = (this.extensionLevel as any)[this.actualLevel] as string;
        for (const i of Object.keys(mls.stor.files).sort()) {

            const sf = mls.stor.files[i];

            if (
                sf.project !== +this.project ||
                sf.level !== this.actualLevel ||
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

        const arraySfHistory: mls.stor.IFileInfo[] = [];
        const lh = this.getHistory();
        if (lh.length <= 0 || !window['mls']) return [];

        for await (const i of lh) {

            let key = mls.stor.getKeyToFiles(i.project, this.actualLevel, i.shortName, i.folder, i.extension);

            if (!mls.stor.files[key] && +this.project === 0) {

                await mls.stor.server.loadProjectInfoIfNeeded(i.project);
                key = mls.stor.getKeyToFiles(i.project, this.actualLevel, i.shortName, i.folder, i.extension);

            }

            if (!mls.stor.files[key] || (i.project !== +this.project && +this.project !== 0)) continue;
            arraySfHistory.push(mls.stor.files[key]);

        }

        return arraySfHistory;

    }

    private getHistory(): { project: number, shortName: string, extension: string, folder: string }[] {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.actualLevel);
        return info ? JSON.parse(info) : [];

    }

    private setHistory(file: mls.stor.IFileInfo): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.actualLevel);
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

        if (res.length > 10) res.length = 10;
        localStorage.setItem('mlsInfoHistoryL' + this.actualLevel, JSON.stringify(res));

    }

}
