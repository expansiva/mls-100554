/// <mls shortName="pluginProjectInfo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult, repeat } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { getConfigProject } from './_100554_libProjectConfig';

/// **collab_i18n_start**
const message_pt = {
    detailsResume: 'Resumo',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
    fork: 'Galhos',
    files: 'Arquivos',
    detailsInfo: 'Info',
    name: 'Nome',
    projectDriver: 'Driver',
    projectOrg: 'Organização',
    projectOwner: 'Proprietário',
    projectCreatedAt: 'Criado em',
    projectURL: 'URL do Projeto',
}

const message_en = {
    designSystems: 'Design systems',
    lastModified: 'Last Modified',
    detailsResume: 'Resume',
    fork: 'Forks',
    files: 'Files',
    detailsInfo: 'Info',
    name: 'Name',
    projectDriver: 'Project Driver',
    projectOrg: 'Organization',
    projectOwner: 'Owner',
    projectCreatedAt: 'CreatedAt',
    projectURL: 'Project URL',
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
    @property() project: string | undefined;
    @property() projectName: string | undefined;
    @property() projectDriver: string | undefined;
    @property() projectOrg: string | undefined;
    @property() projectOwner: string | undefined;
    @property() projectCreatedAt: string | undefined;
    @property() projectURL: string | undefined;
    @property() forks: mls.stor.others.IFork[] | undefined;
    @property() branches: mls.stor.others.IBranch[] | undefined;

    @query('.plugin-body') body: HTMLDivElement | undefined;


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
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html``;
        return html`
            <header>
                <div>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </div>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        //${this.renderInfoFork()}
        return html`<div class="plugin-body">
            ${this.renderInfo()}
            
            
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

    renderInfoFork(): TemplateResult {
        return html`
        <div class="details-card">
            <details close>
                <summary>${this.msg.fork}</summary>
                <div>
                    ${this.renderForksItem()}
                </div>
            </details>
        </div>
        `
    }

    renderForksItem(): TemplateResult{

        if (!this.forks && !this.branches ) return html`No fork of this project`;

        const forks = this.forks ? html`<ul>
            ${repeat(this.forks,
                ((fk: mls.stor.others.IFork) => fk.nameWithOwner) as any,
                ((f: mls.stor.others.IFork, index: any) => {

                    return html`<li>${f.nameWithOwner}</li>`;

                }) as any
            )}</ul>` : html``
        ;

        const branches = this.branches ? html`<ul>
            ${repeat(this.branches,
                ((br: mls.stor.others.IBranch) => br.name) as any,
                ((b: mls.stor.others.IBranch, index: any) => {

                    return html`<li>${b.name}</li>`;

                }) as any
            )}</ul>` : html``
        ;

        return html`${forks}${branches}`
    }

    //-------IMPLEMENTS-----------

    private async init() {

        try {

            const project = this.project ? +this.project : mls.actual[5].project;
            if (!project) return;

            this.setInfos(project);
            await this.getForks(project);


        } catch (err: any) {
            console.info(err);
        }

    }

    private setInfos(project: number) {

        let settings = mls.l5.getProjectSettings(project);
        let details = mls.l5.getProjectDetails(project);
        if (!details || !settings) return;
        this.projectName = details.name;
        this.projectDriver = settings.projectDriver;
        this.projectCreatedAt = new Date(details.created_at).toLocaleString();
        this.projectOwner = details.owner;
        this.projectDriver = settings.projectDriver;
        this.projectURL = settings.projectURL;
        if (mls.l5.actualOrg) {
            this.projectOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg]
        }
    }

    private async getForks(project: number) {

        const driver = mls.stor.others.getDefaultDriver(project);
        const dB = this.getMyKeysBranch(project);
        const forks = await driver.listForks(dB.owner, dB.repo);
        const branches = await driver.listBranches(dB.owner, dB.repo);
        this.forks = forks;
        this.branches = branches;

    }

    private getMyKeysBranch(project: number): { branch: string, owner: string, repo: string } {

		try {

			const obj = mls.l5.getProjectDetails(project);
			if (!obj || !obj.value) throw new Error('Error getProjectDetails in:' + project);

			const json = JSON.parse(obj.value);
			if (!json) throw new Error('Error getProjectDetails .value json in:' + project);

			let info = '';

			if (!json.projectURL && json.l5_actionPrjSettings) {

				info = json.l5_actionPrjSettings.projectURL;

			} else if (json.projectURL) {

				info = json.projectURL;

			} else {
				throw new Error('Error project info:' + project);
			}

			if (info.endsWith('/')) {
				info = info.substring(0, info.length - 1);
			}

			const array = info.split('/');

			if (array.length < 3) {
				throw new Error('Insufficient information to progress');
			}

			return { branch: array[array.length - 3], owner: array[array.length - 2], repo: array[array.length - 1] };

		} catch (e:any) {

			throw new Error('Error get info branch: ' + e.message);

		}

	}

}

if (!customElements.get('plugin-project-info-100554')) {
    customElements.define('plugin-project-info-100554', PluginProjectInfo);
}
