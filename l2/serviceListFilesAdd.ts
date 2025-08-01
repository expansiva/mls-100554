/// <mls shortName="serviceListFilesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit'
import { ServiceBase } from './_100554_serviceBase';
import { CollabLitElement } from './_100554_collabLitElement';
import { IDetails } from "./_100554_pluginNewFileBase";
import { propertyDataSource } from './_100554_collabDecorators';
import { getState, setState, initState } from './_100554_collabState';
import { loadPluginProject } from './_100554_libCommom';

/// **collab_i18n_start**
const message_pt = {
    labelProject: "Projeto",
    labelShortName: "Nome",
    invalidName: "Nome invalido",
    labelType: "Por favor, selecione um modelo abaixo ou clique",
    btnAdd: "Adicionar",
    btnCancel: "Cancelar",
    please: "Por facor selecione um projeto primeiro!",
    msgInitial: "Por favor, selecione um modelo",

}

const message_en = {
    labelProject: "Project",
    labelShortName: "Shortname",
    invalidName: "Invalid shortName",
    labelType: "Please select a template below or click",
    btnAdd: "Add",
    btnCancel: "cancel",
    please: "Please select a project first!",
    msgInitial: "Please select a template",

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-list-files-add-100554')
export class ServiceListFilesAdd100554 extends CollabLitElement {

    private baseProject = 100554;

    private msg: MessageType = messages['en'];

    @property() level: number = -1;
    @property() error: string = '';
    @property() position: string = '';
    @property() father?: ServiceBase | undefined;
    @property() plugins: IPlugins[] = [];
    @property({ type: Boolean, }) loading: boolean = true;
    @propertyDataSource() shortName: string | undefined;
    @query('#iptShortName') inputShortName: HTMLInputElement | undefined;

    async connectedCallback() {
        super.connectedCallback();
        initState('l2.addFile', { shortName: '', project: 0 });
        setState('l2.addFile.shortName', '');
        await this.init();
    }

    private async init() {
        const plugins = await this.getPlugins();
        this.plugins = await this.getPluginsInfo(plugins);
        this.loading = false;
    }

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        const options = {
            shortName: '',
            project: '',
            htmlText: `<div>${this.msg.msgInitial}</div>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
    }

    createRenderRoot() {
        return this;
    }

    render() {

        const lang = this.father?.getMessageKey(messages);
        this.msg = lang ? messages[lang] : message_en;

        const  project  = mls.actualProject || 0;
        setState('l2.addFile.project', project);

        return html`
            ${project !== undefined ? this.renderAdd(project)
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
                        <input value=${this.shortName} type="text" id="iptShortName" @input=${this.handleInputInput}/>
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
                this.plugins.map((template) => {
                    return html`
                        <div  class="template-item" @click=${() => { this.handleClickTemplate(template) }}>
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

    private handleInputInput(e: KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        if (!target) return;
        const project = mls.actualProject;
        if (project === undefined) throw new Error('No project selected');
        const name = this.inputShortName?.value || '';
        this.error = '';
        const isValidName = this.getNewNameAndValid(project as number, name);
        if (!isValidName) {
            this.error = this.msg.invalidName;
            return;
        }
        setState('l2.addFile.shortName', target.value);
    }

    private handleClickTemplate(plugin: IPlugins) {
        const { project, shortName, folder } = mls.l2.getPath(plugin.widget);
        const tag = convertFileNameToTag({project, shortName, folder});
        const options = {
            shortName,
            project,
            folder,
            htmlText: `<${tag} position=${this.position} project="{{ l2.addFile.project }}" shortName="{{ l2.addFile.shortName }}"></${tag}>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
    }

    //--------------- IMPLEMENTS----------------

    private clickCancel(): void {
        if (!this.father) return;
        const options = {
            shortName: '',
            project: '',
            htmlText: `<div></div>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
        (this.father as any).mode = 'list';
    }

    private getNewNameAndValid(prj: number, name: string): boolean {
        if (name === '' || !name || name === null) return false;
        const isValidName = this.isValidNewName({
            shortName: name,
            project: prj,
            level: +this.level,
            folder: '',
            extension: '.ts'
        });
        if (!isValidName) return false;
        return true;
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
    private async getPlugins(): Promise<mls.plugin.MenuAction[]> {
        let project = mls.actualProject;
        return await loadPluginProject(project || 0, 'l2NewFile');
    }

    private async getPluginsInfo(plugins: mls.plugin.MenuAction[]): Promise<IPlugins[]> {
        const rc: IPlugins[] = [];
        for await (const plugin of plugins) {
            const instance = await import(`./${plugin.widget}`);
            if (!instance.details ||
                typeof instance.details !== 'object' ||
                !['title', 'description', 'tags'].every(prop => prop in instance.details)
            ) continue;

            const details: IDetails = instance.details;
            const item: IPlugins = {
                ...details,
                widget: plugin.widget,
                category: plugin.category,
            }

            rc.push(item);

        }
        return rc;
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

interface IPlugins extends IDetails {
    widget: string,
    category: string | null
}


