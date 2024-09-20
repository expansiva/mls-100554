/// <mls shortName="pluginProjectInfo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { getConfigProject } from './_100554_libProjectConfig';

/// **collab_i18n_start**
const message_pt = {
    detailsResume: 'Resumo',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
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

    @query('.plugin-body') body: HTMLDivElement | undefined;


    async prepare() {

        const  project  = this.project ? +this.project : mls.actual[5].project;
        if (!project) return;
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

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';
        //this.style.width = '100%';
        //this.style.height = '100%';
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
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
        return html`<div class="plugin-body">
            ${this.renderInfo()}
        </div>`;
    }

    private renderInfo() {
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


    static styles = css`
    
        :host {
            font-family: @font-family-primary;
            display: block;
            
            overflow: auto;
            background: @bg-primary-color;
            font-size: @font-size-16;
        }

        .plugin-body{
            height:100%;
            width: -webkit-fill-available;
            padding:1rem;
            overflow:hidden;
        }
        .plugin-container {
            padding: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            height:100%;
            width:100%;
        }

        header {
            margin-left: 16px;
        }
        
        header > div{
            display:flex;
            gap:.5rem;
        }

        icon {
            margin-right: 10px;
        }

        h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
            color: #333;
        }

        small {
            color: #888;
            margin-left: auto;
            font-size: 14px;
        }

        p {
            font-size: 16px;
            color: #555;
        }
        .details-card{
            margin-top: 1rem;
            border: 1px solid var(--grey-color-light);
            padding: 1rem;
            border-radius: 10px;
        }

        .listInfo{
            list-style: none;
            margin: 0px;
            padding: 0px;
            padding-left: .5rem;
            margin-bottom: 2rem;
            ul{
                list-style: none;

            }
        }

        details{
            margin-bottom: 1rem;
            >div{
                padding-left: 2rem;
            }
        }
    `;


}

if (!customElements.get('plugin-project-info-100554')) {
    customElements.define('plugin-project-info-100554', PluginProjectInfo);
}
