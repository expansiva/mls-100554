/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-list-files-add-100554')
export class ServiceListFilesAdd100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private myDefinitions: any = {};

    @property() arEnhacements: { text: string, value: string }[] = [];

    @property() level: number = -1;

    @property() error: string = '';

    @property() position: string = '';

    @property() father: HTMLElement | undefined;

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {
        return html`
            ${this.renderDefinition()}
            ${this.renderInfo()}
        `;
    }

    renderDefinition() {

        return html`
        <sectionListAddDef>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.project}:</label>
                <input type="text" disabled value="${mls.actual[5].project?.toString()}"/>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.shortName}:</label>
                <input type="text" id="iptShortName"/>
                <span>${this.error}</span>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.type}:</label>
                <select style="height:100px" multiple="multiple" @change="${this.changeEnhancement}">
                    <option value="blank">Blank</option>
                    ${repeat(
            this.arEnhacements,
            ((item: any) => item.value) as any,
            ((i: any, index: any) => {

                return this.renderOpt(i)

            }) as any
        )}
                </select>
            </div>
            <div class="grpInputServiceListNewFile">
                <label>${this.myMsg.group}:</label>
                <input value="other" type="text" id="iptGroup"/>
            </div>
            <div class="grpButtonServiceListNewFile">
                <button class="btnCancelServiceListNewFile" @click="${this.clickCancel}">${this.myMsg.cancel}</button>
                <button class="btnAddServiceListNewFile" @click="${this.add}">${this.myMsg.add}</button>
            </div>
        </sectionListAddDef>
        `
    }

    renderInfo() {

        return html`
        <sectionListInfoDef>
            <fieldset>
                <legend>${this.myMsg.description}:</legend>
                <div id="fsDescServiceListNewFile" style="height:120px"></div>
            </fieldset>
            <fieldset>
                <legend>${this.myMsg.example}:</legend>
                <textarea id="fsExServiceListNewFile" disabled style="width:100%;" rows="5" ></textarea>
            </fieldset>
        </sectionListInfoDef>
        
        `

    }

    renderOpt(opt: { text: string, value: string }) {
        return html`<option value="${opt.value}"> ${opt.text}</option>`
    }

    //--------------- IMPLEMENTS----------------

    private async init() {

        try {

            this.showLoader(true);
            this.updateMyMessages();
            this.setEnhacement();
            this.showLoader(false);

        } catch (e) {

            this.showLoader(false);

        }


    }

    private showLoader(loader: boolean): void {

        if (!this.father) return
        (this.father as any).loader = loader;

    }

    private clickCancel(): void {
        if (!this.father) return;
        (this.father as any).mode = 'list';
    }

    private async add() {

        try {

            if (!this.shadowRoot) return;

            const sel = this.shadowRoot.querySelector('select') as HTMLSelectElement;
            const name = this.shadowRoot.querySelector('#iptShortName') as HTMLInputElement;

            if (sel.value === "") {
                throw new Error('Please select an type ');
            }

            this.showLoader(true);
            const newName = this.getNewNameAndValid(mls.actual[5].project as any, name.value);

            const params = {} as mls.events.IFileAction;

            const fEnh = mls.stor.files[sel.value];
            if (!fEnh && sel.value !== 'blank') {
                this.showLoader(false);
                throw new Error('Not found file:' + sel.value);
            };

            const ts = await this.createMyTs(fEnh, sel.value, name.value);

            params.action = 'new' as typeof params.action;
            params.level = +this.level;
            params.project = mls.actual[5].project as any;
            params.newProject = mls.actual[5].project;
            params.shortName = newName;
            params.newshortName = newName;
            params.folder = '';
            params.newfolder = '';
            params.newEnhancement = fEnh ? `_${fEnh.project}_${fEnh.shortName}` : '_blank';
            params.extension = '.ts';
            params.newTSSource = ts;

            this.fireComunication(params);
            this.saveLocalHistory(params.project, params.shortName, params.extension, params.folder);
            this.showLoader(false);

        } catch (e: any) {

            console.info(e);
            this.showLoader(false);
            this.error = e.message;
            (this.father as any).setError(e.message);

        }

    }

    private createMyTs(fEnh: mls.stor.IFileInfo, enhaName: string, name: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            if (!this.shadowRoot) {
                resolve('');
                return;
            }

            const iptGroup = this.shadowRoot.querySelector('#iptGroup') as HTMLInputElement;

            if (!fEnh || !this.myDefinitions || !this.myDefinitions[enhaName] || !iptGroup) {
                resolve('');
                return;
            }

            const mFEnh = mls.l2.editor.get({ project: fEnh.project, shortName: fEnh.shortName });
            if (!mFEnh) {
                resolve('');
                return;
            }

            const mmodule = this.myDefinitions[enhaName];
            let ret = '';

            let grp = iptGroup.value;
            grp = !grp ? 'other' : grp;


            ret = `/// <mls shortName="${name}" project="${mls.actual[5].project}" enhancement="_${fEnh.project}_${fEnh.shortName}" groupName="${grp}" />\n${mmodule.example}\n`;

            ret = this.changeTagName(ret, this.convertFileNameToTag(`_${mls.actual[5].project}_${name}`));

            resolve(ret);


        });

    }

    private saveLocalHistory(project: number, shortName: string, extension: string, folder: string): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.level);
        const res: any[] = info ? JSON.parse(info) : [];
        let idx = -1;
        res.forEach((i: any, index) => {

            if (i.project !== project || i.shortName !== shortName) return;
            idx = index;

        });

        if (idx >= 0) {
            res.splice(idx, 1);
        }

        res.unshift({ project, shortName, extension, folder });
        if (res.length > 10) res.length = 10;
        localStorage.setItem('mlsInfoHistoryL' + this.level, JSON.stringify(res));

    }


    private changeTagName(source: string, tagName: string): string {

        const regex = /@customElement\(['"](.+?)['"]\)/;
        const match = source.match(regex);

        if (match) {
            const originalTag = match[1];
            const replacedSource = source.replace(originalTag, tagName);
            return replacedSource;
        }

        return source;

    }

    private convertFileNameToTag(widget: string) {

        const regex = /_([0-9]+)_?(.*)/;
        const match = widget.match(regex);
        if (match) {
            const [, number, rest] = match;
            const convertedSrc = rest.replace(/([A-Z])/g, '-$1').toLowerCase();
            widget = `${convertedSrc}-${number}`;
        }
        return widget;

    }

    private getNewNameAndValid(prj: number, name: string): string {

        if (name === '' || !name || name === null) {

            throw new Error('Invalid name ');

        }

        if (!this.isValidNewName({ shortName: name, project: prj, level: +this.level, folder: '', extension: '.ts' })) {

            throw new Error('Invalid name ');

        }

        return name;

    }

    private isValidNewName(obj: { shortName: string, project: number, level: number, extension: string, folder: string }): boolean {

        if (obj.shortName === '') return false;

        if (obj.shortName.length === 0 || obj.shortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        if (invalidCharacters.test(obj.shortName)) return false;
        const key = mls.stor.getKeyToFiles(obj.project, obj.level, obj.shortName, obj.folder, obj.extension);
        return !mls.stor.files[key];

    }

    private setEnhacement(): void {

        const array: { text: string, value: string }[] = [];
        const keys = Object.keys(mls.stor.files);
        keys.forEach((i) => {

            const f = mls.stor.files[i];
            if (f.level !== +this.level || !f.shortName.startsWith('enhancement') || f.extension !== '.ts') return;

            const opt = {
                text: `${f.project}_${f.shortName}`,
                value: i
            }

            array.push(opt);

        });

        this.arEnhacements = [...array];

    }

    private changeEnhancement(e: MouseEvent): void {

        const func = async (e: MouseEvent) => {

            try {

                e.stopPropagation();
                const el = e.target as HTMLSelectElement;
                if (!el || !this.shadowRoot) return;

                const desc = this.shadowRoot.querySelector('#fsDescServiceListNewFile') as HTMLTextAreaElement;

                const ex = this.shadowRoot.querySelector('#fsExServiceListNewFile') as HTMLTextAreaElement;

                desc.innerHTML = '';
                ex.value = '';

                if (this.myDefinitions[el.value]) {

                    desc.innerHTML = this.myDefinitions[el.value].description;
                    ex.value = this.myDefinitions[el.value].example;
                    return;

                }

                const f = mls.stor.files[el.value];
                if (!f) return;

                const mfile = mls.l2.editor.get({ project: f.project, shortName: f.shortName });

                if (!mfile) {

                    if (this.isFire < 5) {
                        await this.loadMyMFiles(el.value, f.project, e);

                    }
                    return;

                }

                this.isFire = 0;

                const obj = await mls.l2.enhancement.getEnhancementModule(mfile);
                if (!obj) return;

                desc.innerHTML = obj.description;
                ex.value = obj.example;
                this.myDefinitions[el.value] = obj;

            } catch (e) {
                console.info(e);
            }

        };

        func(e);

    }

    private isFire = 0;

    private async loadMyMFiles(key: string, project: number, e: MouseEvent) {

        console.info('tentou carregar mfiles');
        if (this.isFire === 0) {

            const params = {} as mls.events.IFileAction;

            const fEnh = mls.stor.files[key];
            if (!fEnh) return;

            params.action = 'preLoadProject' as typeof params.action;
            params.level = +this.level;
            params.project = project;
            params.newProject = project;

            this.fireComunication(params);

        } else {

            const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            await sleep(300);

        }

        this.isFire += 1;

        if (this.isFire < 5) {
            this.changeEnhancement(e);
        }

    }

    private fireComunication(obj: any): void {

        obj.position = this.position;
        mls.actual[this.level].setFullName('_' + obj.project + '_' + obj.shortName);

        mls.events.fire([+this.level as any], ['FileAction'], JSON.stringify(obj));

    }

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.project) this.myMsg.project = m.project;
        if (m.shortName) this.myMsg.shortName = m.shortName;
        if (m.type) this.myMsg.type = m.type;
        if (m.group) this.myMsg.group = m.group;
        if (m.cancel) this.myMsg.cancel = m.cancel;
        if (m.add) this.myMsg.add = m.add;
        if (m.description) this.myMsg.description = m.description;
        if (m.example) this.myMsg.example = m.example;

    }

    private myMsg = {
        project: 'Project',
        shortName: 'Short Name',
        type: 'Type',
        group: 'Group',
        cancel: 'Cancel',
        add: 'Add',
        description: 'Description',
        example: 'Example'
    }

}

