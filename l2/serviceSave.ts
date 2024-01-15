/// <mls shortName="serviceSave" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-save-100554')
export class ServiceSave extends ServiceBase {

    @property() itens: any = undefined;

    constructor() {
        super();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        name: 'Save',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Save',
        className: undefined,
        tags: [],
        levels: [5, 4, 2]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAbout') return this.showAbout();
        if (op === 'opSave') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
            opAbout: 'About',
        },
        icons: {},
        actionDefault: 'opSave', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    private showInitial(): boolean {
        return true;
    }

    private showAbout(): boolean {
        const div1 = document.createElement('div');
        div1.innerHTML = '<h1>About this Service</h1>'
        if (this.menu.setMode) this.menu.setMode('page', div1);
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {

        }
    }

    // -------------  WEBCOMPONENT -------------

    async connectedCallback() {
        super.connectedCallback();
        await this.setInfos();
    }

    render() {

        return html`
            <sectionsaveheader>
                ${html`${this.renderHeader()}`}
            </sectionsaveheader>
            ${this.itens ? this.renderItens() : this.renderNoItens()}
            
        `
    }

    renderHeader() {
        return html`
            <i class="fa fa-floppy-o"></i>
            <span>Update Changes</span>    
        
        `
    }

    renderNoItens() {
        return html`
            <sectionnosave>
                <span>No items to save</span> 
            </sectionnosave>  
        
        `
    }

    renderItens() {

        const keys = Object.keys(this.itens);
        return html`
            <sectionsave>
                <div id="Save_menu_action" style="display:flex;">
                    <div style="width:calc(100% - 68px);" >
                        <h4 class="mt-3">Comments:</h4>
                        <textarea id="commitMessage" class="form-control" style="width:95%;" rows="2" maxlength="50"></textarea>
                    </div>
                    <div id="div_btn_save" class="text-right" style="width:64px; display: flex; align-items: self-end;">
                        <button id="btn_save" class="btn btn-sm btn-primary">Update</button>
                    </div>
                </div>
                <h4 class="mt-3" data-mlsline="23">File changes</h4>
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
            return this.renderLevel3(level, project, indexP, index) ;
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
                    const itens = objDS ? objDS as [] : []  ;
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
                    ? html`<input type="checkbox" id="l0-${indexP}-${indexL}-${index}" disabled onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}">`
                    : html`<input type="checkbox" id="l0-${indexP}-${indexL}-${index}" onlyStatusFather="${item.onlyFather}" @click="${this.clickVerifyStatusFather}">`
                }
                
                <label for="l0-${indexP}-${indexL}-${index}">
                
                    ${item.text}
                    ${unsafeHTML(item.span)}
                
                </label>
            </div>
        </li>
        `;

    }

    private async setInfos() {

        try {

            const objProjects: any = {};
            const filesKeys = Object.keys(mls.stor.files);

            for (const fKey of filesKeys) {

                const file = mls.stor.files[fKey] as mls.stor.IFileInfo;
                if (!file.inLocalStorage || file.status === 'nochange' || file.project === 0 ) continue;

                const pj = file.project;
                const level = file.level;

                if (!objProjects[pj]) objProjects[pj] = {};
                const obj = objProjects[pj];
                if (!obj[level] && level === 3) {

                    const nNivel = file.folder.split('/');
                    if (nNivel.length >= 2) {
                        obj[level] = {[nNivel[1]] : [await this.configItem(file)]}
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

            this.itens = objProjects;
            console.info(this.itens)

        } catch {

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

}

interface Iitem {
    file: mls.stor.IFileInfo;
    text: string,
    span: string;
    onlyFather: boolean,
    disabled: boolean,
}