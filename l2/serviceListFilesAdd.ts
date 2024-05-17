/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { ServiceBase } from './_100554_serviceBase';
import { getAttributeDefinitionsLit, getFormComponentsDescription } from './_100554_icaBaseDescription';

export const initServiceListFilesAdd = () => {
}

/// **collab_i18n_start**
const message_pt = {
    labelProject: "Projeto",
    labelShortName: "Nome curto",
    labelType: "Por favor, selecione um modelo abaixo ou clique",
    btnAdd: "Adicionar",
    btnCancel: "Cancelar",
    please: "Por facor selecione um projeto primeiro!"
}

const message_en = {
    labelProject: "Project",
    labelShortName: "Shortname",
    labelType: "Please select a template below or click",
    btnAdd: "Add",
    btnCancel: "cancel",
    please: "Please select a project first!"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-list-files-add-100554')
export class ServiceListFilesAdd100554 extends LitElement {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() level: number = -1;
    @property() error: string = '';
    @property() position: string = '';
    @property() father?: ServiceBase | undefined;
    @property() templates: ITemplateDetails[] = [];
    @property({ type: Boolean, }) loading: boolean = true;

    @query('#iptShortName') inputShortName: HTMLInputElement | undefined;

    private enhancementModules: IEnhancementModules | undefined = {};

    async connectedCallback() {
        super.connectedCallback();
        await this.getTemplates();
        this.loading = false;
    }

    render() {

        const lang = this.father?.getMessageKey(messages);
        this.msg = lang ? messages[lang] : message_en;

        const { project } = mls.actual[5];
        return html`
            ${project ? this.renderAdd(project as number)
                : html`${this.msg.please}`
            }
        `;
    }

    renderAdd(project: number) {

        return html`
            <div class="section-add">
                <div class="row-form">
                    <div>
                        <label>${this.msg.labelProject}:</label>
                        <input type="text" disabled value="${project.toString()}"/>
                    </div>
                    <div>
                        <label>${this.msg.labelShortName}:</label>
                        <input type="text" id="iptShortName"/>
                        <span>${this.error}</span>
                    </div>
                </div>
                <hr>
                <div class="row-form">
                    <div>
                        <label>${this.msg.labelType}</label> <button class="btn-cancel" @click="${this.clickCancel}">${this.msg.btnCancel}</button>
                         ${this.renderTemplates()}
                    </div>
                </div>
            </div>

        `
    }


    renderTemplates() {

        return html`
            <div class="template-container">
             ${this.loading
                ? html`<p>Loading...</p>`
                :
                this.templates.map((template) => {
                    return html`
                        <div  class="template-item" @click=${() => { this.add(template) }}>
                            <div class="template-item-content">
                                <div class="template-item-title">${template.title}</div>
                                <div class="template-item-body">
                                    ${template.description.split('\n').map((paragraph) => html`
                                        <p>${paragraph}</p>
                                    `)}
                                </div>
                                <div class="template-item-tags">
                                        Tags: ${template.tags.join(', ')}
                                </div>
                            </div>
                        </div>
                    `
                })}
            </div>
        `

    }

    //--------------- IMPLEMENTS----------------

    private async getTemplates() {
        const temp = await this.getAllEnhacementsTemplates();
        this.templates = [...temp];
    }

    private clickCancel(): void {
        if (!this.father) return;
        (this.father as any).mode = 'list';
    }

    private showLoader(loader: boolean): void {
        if (!this.father) return
        (this.father as any).loading = loader;
    }

    private async add(template: ITemplateDetails) {

        try {

            if (!this.shadowRoot) return;
            if (!this.inputShortName) return;
            const { project } = mls.actual[5];
            if (!project) throw new Error('No project selected');
            if (!this.enhancementModules) throw new Error('No modules enhancement loaded');

            const name = this.inputShortName.value
            const newName = this.getNewNameAndValid(project as number, name);
            const params = {} as mls.events.IFileAction;

            if (!template.enhancementKey) throw new Error('No enhancementKey in template');
            const fEnh = this.enhancementModules[template.enhancementKey];

            if (!fEnh) {
                this.showLoader(false);
                throw new Error('No enhancement founded');
            };

            this.showLoader(true);

            const ts = this.createContentNewFile(fEnh, template.example, name, project);

            params.action = 'new' as typeof params.action;
            params.level = +this.level;
            params.project = mls.actual[5].project as any;
            params.newProject = mls.actual[5].project;
            params.shortName = newName;
            params.newshortName = newName;
            params.folder = '';
            params.newfolder = '';
            params.newEnhancement = fEnh ? `_${fEnh.storFile.project}_${fEnh.storFile.shortName}` : '_blank';
            params.extension = '.ts';
            params.newTSSource = ts;

            mls.actual[this.level].setFullName('_' + params.project + '_' + params.shortName);
            (mls.actual[this.level as any] as any)[this.position as any] = {
                project: params.project,
                shortName: params.shortName
            } as any;

            await this.fireComunication(params);
            const posInv = this.position === 'left' ? 'right' : 'left';
            if (template.aimActionSuggest) {
                this.father?.openService('_100554_serviceAim', posInv, 2);
                const opInstance = this.father?.nav3Service?.getActiveInstance(posInv);
                if (opInstance) {
                    opInstance.setAttribute('actiontoopen', template.aimActionSuggest)
                }
            }

            this.showLoader(false);
            this.saveLocalHistory(params.project, params.shortName, params.extension, params.folder);

        } catch (e: any) {
            setTimeout(() => {
                this.showLoader(false);
                this.error = e.message;
            }, 200);
        }
    }

    private createContentNewFile(enhecementModule: IEnhancementModule, template: string, name: string, project: number): string {
        let ret = '';
        const grp = 'other'

        let newExample = '';

        newExample = this.checkIfAsIcaAndCreateIfNeeded(name, project);
        if (!newExample) {
            newExample = template;
            newExample = this.changeTagName(newExample, convertFileNameToTag(`_${project}_${name}`));
            newExample = this.changeClassName(newExample, project as number, name);
            newExample = this.changeWidget(newExample, project as number, name);
        }

        ret = `/// <mls shortName="${name}" project="${project}" enhancement="_${enhecementModule.storFile.project}_${enhecementModule.storFile.shortName}" groupName="${grp}" />\n${newExample}\n`;
        return ret;
    }

    private checkIfAsIcaAndCreateIfNeeded(name: string, project: number) {

        if (project !== 100554) return '';
        if (!name.startsWith('ica')) return '';
        if (!name.endsWith('Base')) return '';

        let parts = this.splitStringByUppercase(name.substring(0, name.length - 4));
        if (parts.length < 4) return '';

        parts = parts.map((part) => this.capitalizeFirstLetter(part));

        let ica, root, subgroup, finalgroup = ''

        ica = parts.shift() as string;
        root = parts.shift() as string;
        subgroup = parts.shift() as string;
        finalgroup = parts.join(' ') as string;

        const desc = getFormComponentsDescription(root, subgroup, finalgroup);
        if (!desc) return '';

        return this.createTemplateIca(root, subgroup, finalgroup);
    }

    private splitStringByUppercase(str: string) {
        return str.split(/(?=[A-Z])/);
    }

    private capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private createTemplateIca(root: string, subgroup: string, finalgroup: string) {

        const props = getAttributeDefinitionsLit(root, subgroup, finalgroup);
        const res = props.map(line => {
            let cleanedLine = line.replace(/@property\(\{.*\}\)\s*/, ''); // Remove "@property({...}) "
            cleanedLine = cleanedLine.replace(/=.+?;/, ';'); // Remove tudo após o "=" até o próximo ";"
            cleanedLine = 'abstract ' + cleanedLine;
            return cleanedLine;
        });

        const fg = finalgroup.replace(/\s/g, '');
        const className = `Ica${root}${subgroup}${fg}Base`;
        const extend = 'IcaLitElement';
        const extendFile = './_100554_icaLitElement';

        const interfaces = new Map();

        res.forEach((str: string, index: number) => {
            const matches = str.match(/abstract (\w+): ('.*?'(?: \| '.*?')*)/);
            if (matches && matches.length >= 3) {
                const propName = matches[1];
                const types = matches[2].match(/'[^']+'/g);
                if (types && types.length > 1) {
                    const interfaceName = `I${propName.charAt(0).toUpperCase() + propName.slice(1)}`;
                    interfaces.set(interfaceName, types);
                    res[index] = `abstract ${propName}: ${interfaceName} | undefined; // ${matches.input}`;
                }
            }
        });

        let interfaceString = '';
        interfaces.forEach((types, interfaceName) => {
            interfaceString += `export type ${interfaceName} = ${types.join(' | ')};\n`;
        });


        const temp = `
import { ${extend} } from '${extendFile}';

export abstract class ${className} extends ${extend} {
    
    ${res.join('\n\t')}

}

${[interfaceString].join('\n')}
`
        return temp;

    }


    private saveLocalHistory(project: number, shortName: string, extension: string, folder: string): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + this.level);
        const res: any[] = info ? JSON.parse(info) : [];
        let idx = -1;
        res.forEach((i: any, index) => {
            if (i.project !== project || i.shortName !== shortName) return;
            idx = index;
        });

        if (idx >= 0) res.splice(idx, 1);
        res.unshift({ project, shortName, extension, folder });
        if (res.length > 10) res.length = 10;
        localStorage.setItem('mlsInfoHistoryL' + this.level, JSON.stringify(res));

    }

    private getNewNameAndValid(prj: number, name: string): string {
        if (name === '' || !name || name === null) throw new Error('Invalid name ');
        const isValidName = this.isValidNewName({
            shortName: name,
            project: prj,
            level: +this.level,
            folder: '',
            extension: '.ts'
        });
        if (!isValidName) throw new Error('Invalid name ');
        return name;
    }

    private isValidNewName(obj: { shortName: string, project: number, level: number, extension: string, folder: string }): boolean {

        if (obj.shortName === '') return false;
        if (obj.shortName.length === 0 || obj.shortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        if (invalidCharacters.test(obj.shortName)) return false;

        const key = mls.stor.getKeyToFiles(obj.project, obj.level, obj.shortName, obj.folder, obj.extension);
        let find = false;
        const keys = Object.keys(mls.stor.files);
        for (const k of keys) {
            if (key.toLocaleLowerCase() === k.toLocaleLowerCase()) find = true;
        }
        return !mls.stor.files[key] && !find;

    }

    private changeClassName(source: string, project: number, shortname: string): string {
        const newClassName = shortname.charAt(0).toUpperCase() + shortname.substring(1, shortname.length) + project.toString();
        const outputString = source.replace(/\[className\]/g, newClassName);
        return outputString;
    }

    private changeWidget(source: string, project: number, shortname: string): string {
        const newWidget = `_${project.toString()}_${shortname}`;
        const outputString = source.replace(/\[widgetName\]/g, newWidget);
        return outputString;
    }

    private changeTagName(source: string, tagName: string): string {
        const outputString = source.replace(/\[tagName\]/g, tagName);
        return outputString;
    }

    private getEnhacementsDetails(): IEnhancementDetails[] {

        const array: IEnhancementDetails[] = [];
        const keys = Object.keys(mls.stor.files);
        keys.forEach((i) => {
            const f = mls.stor.files[i];
            if (f.level !== +this.level || !f.shortName.startsWith('enhancement') || f.extension !== '.ts') return;
            const opt: IEnhancementDetails = {
                key: `${f.project}_${f.shortName}`,
                value: i
            }
            array.push(opt);
        });

        mls.l2.enhancement.getEnhancementDetails
        return [...array];
    }

    private async getAllEnhacementsTemplates() {

        let templates: ITemplateDetails[] = [];
        const enhancementDetails = this.getEnhacementsDetails();
        this.enhancementModules = await this.getEnhacementsInstancies(enhancementDetails);

        if (!this.enhancementModules) return templates;

        Object.entries(this.enhancementModules).map((entry) => {
            const [entryKey, entryValue] = entry;

            if (!((entryValue.instance as any).getAddNewFileDetails)) return;
            const temp: ITemplateDetails[] = (entryValue.instance as any).getAddNewFileDetails();

            temp.forEach((t) => t.enhancementKey = entryKey);
            templates = [...templates, ...temp]
        });


        return templates;
    }

    private async getEnhacementsInstancies(enhancementDetails: IEnhancementDetails[]) {

        const enhancementModules: IEnhancementModules = {};

        for await (let details of enhancementDetails) {
            const { value, key } = details;
            const storFile = mls.stor.files[value];
            if (!storFile) return;
            const { project, shortName } = storFile;
            const mfile = mls.l2.editor.get({ project, shortName });
            if (!mfile) {
                await this.loadMyMFiles(value, project);
            }

            if (!mfile) throw new Error('Error on load mfile')
            let enhancementModule = await mls.l2.enhancement.getEnhancementModule(mfile);
            if (!enhancementModule) {
                await this.loadMyMFiles(value, project);
                enhancementModule = await mls.l2.enhancement.getEnhancementModule(mfile);
            };

            if (!enhancementModule) throw new Error('Error on load enhancementModule')

            enhancementModules[key] = {
                instance: enhancementModule,
                storFile: storFile
            }
        }

        return enhancementModules;
    }

    private async fireComunication(obj: any) {

        obj.position = this.position;
        await mls.events.fire([+this.level as any], ['FileAction'], JSON.stringify(obj), 0);

    }


    private async loadMyMFiles(key: string, project: number) {
        const params = {} as mls.events.IFileAction;
        const fEnh = mls.stor.files[key];
        if (!fEnh) return;
        params.action = 'preLoadProject' as typeof params.action;
        params.level = +this.level;
        params.project = project;
        params.newProject = project;
        await this.fireComunication(params);
    }

}

interface IEnhancementModules {
    [key: string]: IEnhancementModule
}

interface IEnhancementModule {
    storFile: mls.stor.IFileInfo,
    instance: mls.l2.enhancement.IEnhancementInstance
}

interface IEnhancementDetails {
    key: string,
    value: string
}

interface ITemplateDetails {
    title: string,
    description: string,
    tags: string[],
    example: string,
    aimActionSuggest: string,
    enhancementKey?: string,
}


