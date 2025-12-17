/// <mls shortName="pluginProjectInfo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, repeat } from 'lit';
import { query, property, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { collab_trash, collab_lock, collab_lock_open, collab_arrow_up_long, collab_arrow_down_long } from '/_100554_/l2/collabIcons.js';

/// **collab_i18n_start**
const message_pt = {
    detailsResume: 'Resumo',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
    fork: 'Galhos',
    deps: 'Dependências',
    files: 'Arquivos',
    detailsInfo: 'Info',
    name: 'Nome',
    projectDriver: 'Driver',
    projectOrg: 'Organização',
    projectOwner: 'Proprietário',
    projectCreatedAt: 'Criado em',
    projectURL: 'URL do Projeto',
    save: 'Salvar',
    successSavingDeps: 'Dependências atualizadas',
    errorDepNull: "Informe o ID da dependência.",
    errorDepSame: "Não é permitido adicionar o próprio projeto como dependência.",
    errorDepAlreadyAdded: "Esta dependência já foi adicionada.",
    errorDepInvalid: "Este projeto não existe.",
    btnAddDep: "Adicionar",
    btnOpenDep: "Adicionar nova dependência",
    placeholderDep: "ID da dependência"
}

const message_en = {
    designSystems: 'Design systems',
    lastModified: 'Last Modified',
    detailsResume: 'Resume',
    fork: 'Forks',
    deps: 'Dependencies',
    files: 'Files',
    detailsInfo: 'Info',
    name: 'Name',
    projectDriver: 'Project Driver',
    projectOrg: 'Organization',
    projectOwner: 'Owner',
    projectCreatedAt: 'CreatedAt',
    projectURL: 'Project URL',
    save: 'Save',
    successSavingDeps: 'Dependencies updated',
    errorDepNull: "Please enter the dependency ID.",
    errorDepSame: "You cannot add the project itself as a dependency.",
    errorDepAlreadyAdded: "This dependency has already been added.",
    errorDepInvalid: "This project does not exist.",
    btnAddDep: "Add",
    btnOpenDep: "Add new dependency",
    placeholderDep: "Dependency ID"

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Info",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

export class PluginProjectInfo extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property() project: number | undefined;
    @property() projectName: string | undefined;
    @property() projectDriver: string | undefined;
    @property() projectOrg: string | undefined;
    @property() projectOwner: string | undefined;
    @property() projectCreatedAt: string | undefined;
    @property() projectURL: string | undefined;
    @property() forks: mls.stor.others.IFork[] | undefined;
    @property() branches: mls.stor.others.IBranch[] | undefined;
    @state() deps: IDependenciesInfo[] = [];
    @property() isSavingDeps: boolean = false;
    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() labelErrorDeps: string = '';
    @property() isAddingDep = false;
    @property() newDepId: number | null = null;


    @query('.plugin-body') body: HTMLDivElement | undefined;
    private projectDetails: mls.cbe.IPrj_settings | undefined;

    async prepare() {
        await this.init();
    }


    //------COMPONENT------

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();

    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';

        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderBody()}
            </div>
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body">
            ${this.renderInfo()}
            ${this.renderDependencies()}

        </div>`;
    }

    renderInfo(): TemplateResult {
        return html`
            <div class="details-card">

                <details open>
                    <summary>${this.msg.detailsInfo}</summary>
                    <div>
                        <ul class="listInfo">
                            <li>
                                <b>${this.msg.name}:</b> 
                                ${this.projectName}
                            </li>
                            <li>
                                <b>${this.msg.projectOrg}:</b> 
                                ${this.projectOrg}
                            </li>
                                <li>
                                <b>${this.msg.projectOwner}:</b> 
                                ${this.projectOwner}
                            </li>
                                <li>
                                <b>${this.msg.projectCreatedAt}:</b> 
                                ${this.projectCreatedAt}
                            </li>
                            <li style="display:flex">
                                <b>${this.msg.projectDriver}:</b> 
                                ${this.projectDriver}
                            </li>
                            <li>
                                <b>${this.msg.projectURL}:</b>
                                ${this.projectURL}
                            </li>
                        </ul>
                    </div>
                </details>
            </div>
        `
    }

    renderDependencies(): TemplateResult {
        return html`

        <div class="details-card">
            <details open>
                <summary>${this.msg.deps}</summary>
                <div>
                    <ul class="deps-details-list">
                        ${this.deps.map((dep, index) => {

            return html`
                                <li>
                                    <span> ${dep.name}(${dep.id})</span>
                                    <div class="deps-details-tags">
                                        <span>
                                            <i>${dep.auth === 'public' ? collab_lock_open : collab_lock}</i>
                                            <span>${dep.auth}</span>
                                        </span>
                                    </div>
                                    <div class="deps-details-actions">
                                        <span @click=${() => this.moveDepUp(index)}>${collab_arrow_up_long}</span>
                                        <span @click=${() => this.moveDepDown(index)}>${collab_arrow_down_long}</span>
                                        <span @click=${() => {
                    this.deps.splice(index, 1);
                    this.requestUpdate();
                }}>
                                            ${collab_trash}
                                        </span>
                                    </div>

                                </li>
                            `
        })}
        
                    <li class="li-add" @click=${this.toggleAddDep}>
                        <span>${this.msg.btnOpenDep}</span>
                    </li>
                    </ul>
                    <div class="add-dep-wrapper ${this.isAddingDep ? 'open' : ''}">
                    <div class="add-dep-content">
                        <input
                            type="number"
                            placeholder=${this.msg.placeholderDep}
                            .value=${this.newDepId ?? ''}
                            @input=${(e: any) => this.newDepId = Number(e.target.value)}
                        />

                        <button @click=${this.addDependency}>
                            ${this.msg.btnAddDep}
                        </button>
                    </div>

                    ${this.labelErrorDeps ? html`<small class="saving-error">${this.labelErrorDeps}<small>` : ''}      

                    </div>
                    <div class="deps-action">
                        <button
                            ?disabled=${this.isSavingDeps}
                            @click=${this.handleSaveDeps}
                        >
                            ${this.isSavingDeps ? html`<span class="loader"></span>` : this.msg.save}
                        </button>
                    </div>
                    ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
                    ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}      
                </div>
            </details>
        </div>
    
        `
    }


    //-------IMPLEMENTS-----------

    private moveDepUp(index: number) {
        if (index === 0) return;
        const deps = [...this.deps];
        [deps[index - 1], deps[index]] = [deps[index], deps[index - 1]];
        this.deps = deps;
    }

    private moveDepDown(index: number) {
        if (index === this.deps.length - 1) return;
        const deps = [...this.deps];
        [deps[index], deps[index + 1]] = [deps[index + 1], deps[index]];
        this.deps = deps;
    }

    toggleAddDep() {
        this.isAddingDep = !this.isAddingDep;
        if (this.isAddingDep) {
            this.newDepId = null;
            this.labelErrorDeps = '';
        }
    }

    private addDependency() {
        if (this.newDepId === null) {
            this.labelErrorDeps = this.msg.errorDepNull;
            return;
        }

        if (this.newDepId === this.project) {
            this.labelErrorDeps = this.msg.errorDepSame;
            return;
        }

        const exists = this.deps.some(dep => dep.id === this.newDepId);
        if (exists) {
            this.labelErrorDeps = this.msg.errorDepAlreadyAdded;
            return;
        }

        const depDetails = mls.l5.getProjectDetails(this.newDepId);

        if (!depDetails) {
            this.labelErrorDeps = this.msg.errorDepInvalid;
            return;
        }

        this.deps = [
            ...this.deps,
            {
                id: this.newDepId,
                name: depDetails.name,
                auth: depDetails.userAuth
            }
        ];

        this.newDepId = null;
        this.isAddingDep = false;
        this.labelErrorDeps = '';
    }

    private async handleSaveDeps() {
        this.labelError = '';
        this.labelOk = '';
        this.isSavingDeps = true;
        try {
            await this.saveDeps();
            this.isSavingDeps = false;
            this.labelOk = `${this.msg.successSavingDeps}`;

        } catch (error: any) {
            console.error('Error on update perfil:', error);
            this.labelError = error.message;
            this.isSavingDeps = false;
        }

    }

    private async saveDeps() {
        if (!this.project) throw new Error(`Project not found`);
        if (!this.projectDetails) throw new Error(`Project details ${this.project} not found`);
        this.projectDetails.prj_dependencies = this.deps.map((item) => item.id);
        mls.api.cbeSavePrjSettings(this.project);        
    }

    private async init() {

        try {

            const project = this.project ? +this.project : mls.actualProject;
            if (!project) return;
            this.setInfos(project);
            this.deps = this.getDependencies();

        } catch (err: any) {
            console.info(err);
        }

    }

    private getDependencies(): IDependenciesInfo[] {

        const project = this.project ? +this.project : mls.actualProject;
        let deps: number[] = [];
        if (project) deps = mls.l5.getProjectDependencies(project, false);
        const allDependencies: IDependenciesInfo[] = [];

        deps.forEach((id: number) => {
            const depPrjDetails = mls.l5.getProjectDetails(id);
            const objDep: IDependenciesInfo = {} as IDependenciesInfo;

            if (depPrjDetails) {
                objDep.name = depPrjDetails.name;
                objDep.id = depPrjDetails.id;
                objDep.auth = depPrjDetails.userAuth;
            } else {
                objDep.name = `Unknown - Project don't exists or deleted`
                objDep.id = id;
                objDep.auth = '';
                objDep.unknown = true;
            }

            allDependencies.push(objDep);

        });

        return allDependencies;

    }

    private setInfos(project: number) {

        this.project = project;
        let settings = mls.l5.getProjectSettings(project);
        this.projectDetails = mls.l5.getProjectDetails(project);
        if (!this.projectDetails || !settings) return;
        this.projectName = this.projectDetails.name;
        this.projectDriver = settings.projectDriver;
        this.projectCreatedAt = new Date(this.projectDetails.created_at).toLocaleString();
        this.projectOwner = this.projectDetails.owner;
        this.projectDriver = settings.projectDriver;
        this.projectURL = settings.projectURL;
        if (mls.l5.actualOrg) {
            this.projectOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg]
        }
    }



}

interface IDependenciesInfo {
    id: number,
    name: string,
    auth: string,
    unknown?: boolean,
}

if (!customElements.get('plugin-project-info-100554')) {
    customElements.define('plugin-project-info-100554', PluginProjectInfo);
}
