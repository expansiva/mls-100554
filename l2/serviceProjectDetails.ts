/// <mls shortName="serviceProjectDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    noProjectSelected: 'Nenhum projeto selecionado!',
    resume: 'Resumo',
    name: 'Nome',
    projectDriver: 'Driver do Projeto',
    projectURL: 'URL do Projeto',
    designSystems: 'Sistemas de Design',
    files: 'Arquivos',
    keyGithub: 'Chave do GitHub'
}

const message_en = {
    noProjectSelected: 'No project selected!',
    resume: 'Resume',
    name: 'Name',
    projectDriver: 'ProjectDriver',
    projectURL: 'ProjectURL',
    designSystems: 'DesignSystems',
    files: 'Files',
    keyGithub: 'Key Github',
    
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-project-details-100554')
export class ServiceProjectDetails100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    constructor() {
        super();
        mls.events.addListener(5, 'ProjectSelected', (ev) => this.onProjectSelected(ev));

    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Project Details',
        visible: true,
        widget: '_100554_serviceProjectDetails',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Project',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    private actualProjectDetails: IProjectDetails | undefined;

    @property()
    private actualKeyGitHub: string | null | undefined;

    private getDetailsProject(project: number) {
        const details = mls.l5.getProjectSettings(project);
        if (!this.actualProjectDetails) this.actualProjectDetails = {} as IProjectDetails;
        this.actualProjectDetails.designSystems = details.designSystems ? details.designSystems.length : 0;
        this.actualProjectDetails.name = details.name;
        this.actualProjectDetails.projectDriver = details.projectDriver;
        this.actualProjectDetails.projectURL = details.projectURL;
        this.actualProjectDetails.files = Object.keys(mls.stor.files).filter((item => item.startsWith(project.toString()))).length;

        this.actualKeyGitHub = localStorage?.getItem('keyGitHub');

        this.requestUpdate();

    }

    private onProjectSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IProjectSelectedParams = JSON.parse(ev.desc);
        this.getDetailsProject(data.value);
    }

    private getLastProject() {
        const lastPrjId = localStorage.getItem('l5-last-project');
        if (lastPrjId) this.getDetailsProject(+lastPrjId);
    }

    private handleChangeKey() {
        if (this.actualKeyGitHub) {
            localStorage?.setItem('keyGitHub', this.actualKeyGitHub as string);    
        }    
    }

    private handleInputChangeKey(value: string) {
        this.actualKeyGitHub = value;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        this.getLastProject();
        return html`
            ${!this.actualProjectDetails
                ?
                html`<h4> ${this.msg.noProjectSelected}</h4>`
                :
                html`
                <section class="section-details">
                    <details open>
                        <summary>${this.msg.resume}</summary>
                        <ul>
                            <li>${this.msg.name}: ${this.actualProjectDetails.name}</li>
                            <li>${this.msg.projectDriver}: ${this.actualProjectDetails.projectDriver}</li>
                            <li>${this.msg.projectURL}: ${this.actualProjectDetails.projectURL}</li>
                            <li>${this.msg.designSystems}: ${this.actualProjectDetails.designSystems}</li>
                            <li>${this.msg.files}: ${this.actualProjectDetails.files}</li>
                        </ul>
                    </details>
                </section>
                <section
                    style=${this.actualProjectDetails.projectDriver === 'github' ? 'display: block' : 'display:none'} 
                    class="section-config-github">
                    <div>
                        <label>${this.msg.keyGithub}</label>
                        <textarea .value=${this.actualKeyGitHub} @input="${this.handleInputChangeKey}"></textarea rows=4>
                        <button @click=${this.handleChangeKey}>Alterar</button>
                    </div>
                </section>


                `
            }`
    }
}

interface IProjectSelectedParams {
    emitter: 'left' | 'right',
    value: number
}

export interface IProjectDetails {
    name: string,
    projectDriver: string,
    projectURL: string,
    designSystems: number,
    files: number,
}
