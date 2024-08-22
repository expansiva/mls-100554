/// <mls shortName="serviceExploreProjects" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, queryAll, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import * as icons from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    inDevelopment: 'Em Desenvolvimento',
    noProjectSelected: 'Nenhum projeto selecionado!',
    detailsResume: 'Resumo',
    detailsConnections: 'Conexão',
    detailsBranchs: 'Branchs',
    detailsFiles: 'Arquivos Iniciais',
    detailsFilesDesc: 'Atualiza os arquivos iniciais do projeto, que irão servir para compilar o projeto inicialmente, estes arquivos são criados automaticamente na criação do projeto',
    detailsInfo: 'Info',
    name: 'Nome',
    projectDriver: 'Driver',
    projectOrg: 'Organização',
    projectOwner: 'Proprietário',
    projectCreatedAt: 'Criado em',
    projectURL: 'URL do Projeto',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
    files: 'Arquivos',
    keyGithub: 'Chave do GitHub',
    project: 'Projeto',
    noProject: 'Nenhum projeto selecionado, por favor selecione.',
    selectProject: 'Selecione o projeto',
    btnChange: 'Alterar',
    btnUpdate: 'Atualizar',
    btnAddNewProject: 'Adicionar novo projeto',
    btnCreateProject: 'Criar projeto',
    btnRefreshOrg: 'Atualizar',
    btnOpenProject: 'Abrir projeto',
    addProject: 'Novo projeto',
    placeholderFilter: 'Filtro',
    push: 'Permite que os desenvolvedores façam push diretamente para a branch principal.',
    pullRequest: 'Exige que todas as mudanças sejam feitas através de Pull Requests, permitindo revisões de código e aprovação antes da integração na branch principal.',
    projectNameLabel: 'Nome do projeto',
    driverNameLabel: 'Driver',
    organizationLabel: 'Organização',
    visibilityLabel: 'Visibilidade do projeto',
    visibilityPublicOption: 'Público - Qualquer pessoa pode ver este repositório.',
    visibilityPrivateOption: 'Privado - Você escolhe quem pode ver.',
    teamLabel: 'Time',
    loadingAddText1: 'Buscando informações do usuário',
    loadingAddText2: 'Buscando organizações do usuário',
    step1Title: 'Passo 1',
    step2Title: 'Passo 2',
    step3Title: 'Passo 3',
    step1Msg: 'Escolha o driver para carregar suas organizações existentes.',
    step2Msg: 'Agora selecione a organização e o modo de atualização.',
    step3Msg: 'Finalmente, selecione a equipe e a visibilidade do projeto.'
}

const message_en = {
    inDevelopment: 'in development',
    noProjectSelected: 'No project selected!',
    detailsResume: 'Resume',
    detailsConnections: 'Connection',
    detailsBranchs: 'Branchs',
    detailsFiles: 'Files initials',
    detailsFilesDesc: 'Updates the project initial files, which we will use to compile the project initially, these files are created automatically when the project is created',
    detailsInfo: 'Info',
    name: 'Name',
    projectDriver: 'Project Driver',
    projectOrg: 'Organization',
    projectOwner: 'Owner',
    projectCreatedAt: 'CreatedAt',
    projectURL: 'Project URL',
    designSystems: 'Design systems',
    lastModified: 'Last Modified',
    files: 'Files',
    keyGithub: 'Key Github',
    project: 'Project',
    noProject: 'No project selected, please select',
    selectProject: 'Select project',
    btnChange: 'Change',
    btnUpdate: 'Update',
    btnAddNewProject: 'Add new Project',
    btnCreateProject: 'Create project',
    btnRefreshOrg: 'Refresh',
    btnOpenProject: 'Open project',
    addProject: 'New project',
    placeholderFilter: 'Filter',
    push: 'Allows developers to push directly to the main branch.',
    pullRequest: 'Requires all changes to be made through Pull Requests, allowing code reviews and approval before integration into the main branch.',
    projectNameLabel: 'Project name',
    driverNameLabel: 'Driver',
    organizationLabel: 'Organization',
    visibilityLabel: 'Project visibility',
    visibilityPublicOption: 'Public - Anyone can see this repository.',
    visibilityPrivateOption: 'Private - You choose who can see.',
    teamLabel: 'Team',
    loadingAddText1: 'Loading user informations',
    loadingAddText2: 'Loading user organizations',
    step1Title: 'Step 1',
    step2Title: 'Step 2',
    step3Title: 'Step 3',
    step1Msg: 'Choose the driver to load your existing organizations.',
    step2Msg: 'Now select the organization and the update mode.',
    step3Msg: 'Finally select the team and the visibility of the project.',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-explore-projects-100554')
export class ServiceExploreProjects100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    private inFullscreen: boolean = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() projectCreated: boolean = false;
    @property() state: IServiceList = { history: [], orgs: [], projectSelected: undefined };
    @property() lastPrjId: string | null | undefined;
    @property({ type: String }) currentScenario: IScenaries = 'select';

    @queryAll('.serviceListProjects .serviceListList li') list: NodeListOf<HTMLElement> | undefined;
    @queryAll('.serviceListProjects .serviceListTitle') titleList: NodeListOf<HTMLElement> | undefined;
    @query('.l5-project-list-history') historieEl: HTMLElement | undefined;

    //----------CONFIG SERVICE------------------

    public details: IService = {
        icon: '&#xf0b1',
        state: 'background',
        position: 'left',
        tooltip: 'Explore Projects',
        visible: true,
        widget: '_100554_serviceExploreProjects',
        level: [6]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Explore Projects',
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

        if (visible) {

            if (!this.inFullscreen) {
                this.setFullScreen(6, 'left')
                this.inFullscreen = true;
            }

        } else if (!visible) {

            if (this.inFullscreen) {
                this.setFullScreen(6, 'default')
                this.inFullscreen = false;
            }

        }

    }

    //----------EVENTS---------------------

    private setEvents() {
        mls.events.addEventListener([6], ['ProjectExplore'] as any, (details) => {
            this.openService('_100554_serviceExploreProjects', 'left', 6);
        });
    }


    //----------COMPONENT------------------

    connectedCallback() {
        super.connectedCallback();
        this.setEvents();
    }

    render() {
        this.getLastProject();
        switch (this.currentScenario) {
            case 'select':
                return html`
                    ${this.renderSelectProject()}
                `
            case 'add':
                return html`
                    ${this.renderAdd()}
                `
        }
    }

    renderSelectProject() {
        
        this.getOrgsAndProjects();
        this.state.history = this.loadHistory();
        return html`
            <div class="scroll-custom l5-project-list">
                <div class="filter-container" style="display:flex">
                    <input style="width:calc(100% - 160px)" type="text" placeholder="Filter" @input=${this._filterProjects}>
                    <button style="margin-left:5px; width:150px;" @click=${this.onAddNewProjectClick}>${this.msg.btnAddNewProject}</button>
                </div>
                <div class="l5-project-list-history" style="${this.state.history.length === 0 ? 'display:none' : 'display: block'}">
                    <div class="serviceListTitle">History</div>
                    <ul class="serviceListList">
                        ${this.state.history.map((his) => html`
                            <li class=${this.lastPrjId && +this.lastPrjId === his.project ? "selected" : ""} @click=${() => { this.onHistoryClick(his) }}>
                                <div>
                                    <span>${his.name + ' (' + his.project.toString() + ')'}</span>
                                </div>
                                <span>${icons.collab_chevron_right}</span>
                            </li>
                        `)}
                    </ul>
                </div>
                <div class="serviceListProjects">
                    ${this.state.orgs.map((org) => {
            return html`
                            <div class="serviceListTitle">${org.key}</div>
                            <ul class="serviceListList">
                                ${org.projects.map((prj) => html`
                                <li class=${this.lastPrjId && +this.lastPrjId === prj.id ? "selected" : ""} @click=${() => this.onProjectClick(prj)}>
                                    <div>
                                        <span>${prj.name + ' (' + prj.id.toString() + ')'}</span>
                                    </div>
                                <span>${icons.collab_chevron_right}</span>
                                </li>
                            `)}
                            </ul>
                            `
        })}
                
                </div>
            </div>
        `
    }


    renderAdd() {
        return html`
        <collab-new-project-100554 @collab-new-project=${this.onProjectCreated}></collab-new-project-100554>
        <div style="display:flex; justify-content:center;">
            ${this.projectCreated ? html`<button id="button-see-project" >${this.msg.btnOpenProject}</button>` : ''}
        </div>
        `
    }

    //----------IMPLEMENTS------------------

    private getLastProject() {
        this.lastPrjId = localStorage.getItem('l5-last-project');
        return this.lastPrjId;
    }

    private getOrgsAndProjects() {

        this.clearState();
        Object.keys(mls.stor.orgs).forEach((org, index) => {
            const { name, description, created_at, projects } = mls.stor.orgs[org].sett;
            const prj: any[] = [];
            projects.forEach((p: any) => {
                try {
                    const json = JSON.parse(p.value);
                    let projectDriver = '';
                    let projectURL = '';

                    if (!json.projectURL && json.l5_actionPrjSettings) {

                        projectDriver = json.l5_actionPrjSettings.projectDriver || '';
                        projectURL = json.l5_actionPrjSettings.projectURL || '';

                    } else if (json.projectURL) {

                        projectDriver = json.projectDriver || '';
                        projectURL = json.projectURL || '';

                    }

                    if (!projectDriver || !projectURL || projectDriver === 'mls') return;

                    /*if (
                        !json.l5_actionPrjSettings ||
                        !json.l5_actionPrjSettings.projectDriver ||
                        json.l5_actionPrjSettings.projectDriver === 'mls') return;*/

                    prj.push(p);

                } catch (e) {
                    //console.info('Erro to parse' + p.name);
                }
            });

            if (prj.length <= 0) return;

            const obj: IStateOrg = {
                name,
                created_at,
                description,
                key: org,
                projects: prj
            };

            this.state.orgs.push(obj);

        });
    }

    private clearState() {
        this.state.history = [];
        this.state.orgs = [];
    }

    private loadHistory(): IHistory[] {
        const lcHistory = localStorage.getItem('l5-projects-history');
        let rc: IHistory[] = [];
        if (!lcHistory) return rc;
        try {
            rc = JSON.parse(lcHistory);
        } catch (err) {
            throw new Error('Error on load l5 project history');
        }
        return rc;
    }

    private filterTimeout: number = 0;
    private _filterProjects(ev: InputEvent): void {
        const filterText = (ev.target as HTMLInputElement).value;
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
            if (filterText) {
                this.titleList?.forEach((item) => { item.style.display = 'none'; });
                if (this.historieEl) this.historieEl.style.display = 'none';
            } else {
                this.titleList?.forEach((item) => { item.style.display = ''; });
                if (this.historieEl) this.historieEl.style.display = 'block';
            }
            this.list?.forEach((li: HTMLElement) => {
                li.style.display = '';
                const text = li.querySelector('span')?.innerText;
                if (text && text.toLowerCase().indexOf(filterText.toLowerCase()) < 0) li.style.display = 'none';
            });
        }, 100);
    }

    private onAddNewProjectClick() {
        this.changeScenario('add');
    }

    private async changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario;
    }

    private async onHistoryClick(item: IHistory) {
        this.setProjectActual(item.project);
        this.setOrgActual(item.project);
        this._fireEventProjectSelected(item.project);
        this.changeScenario('select');
        await this.loadProjectActual(item.project);
        await mls.stor.server.unzipSourcesIfNeeded(item.project)
        this.openExplore()
    }

    private async onProjectClick(item: any) {
        this.setProjectActual(item.id);
        this.setOrgActual(item.id);
        this.addOnHistory(item);
        this._fireEventProjectSelected(item.id);
        this.changeScenario('details');
        await this.loadProjectActual(item.id);
        await mls.stor.server.unzipSourcesIfNeeded(item.id);
        this.openExplore()
    }


    private openExplore() {
        this.selectLevel(5)
        mls.events.fire([5], ['ProjectSelected'], '');    
    }

    private setProjectActual(project: number) {
        mls.actual[5].project = project;
        this.state.projectSelected = project;
        localStorage.setItem('l5-last-project', project.toString());
    }

    private setOrgActual(project: number) {
        const orgIndex = mls.l5.getProjectOrgIndex(project);
        mls.l5.setActualOrg(orgIndex);
    }

    private _fireEventProjectSelected(project: number) {
        const params: IParamsEvent = {
            emitter: 'left',
            value: project
        };
        mls.events.fire(5, ['ProjectSelected'], JSON.stringify(params));
    }

    private async loadProjectActual(project: number) {
        await mls.stor.server.loadProjectInfoIfNeeded(project);
    }

    
    private addOnHistory(item: any) {
        const indexInHistory = this.state.history.findIndex((his) => his.name === item.name && his.project === item.id);
        if (indexInHistory > -1) this.state.history.splice(indexInHistory, 1);
        const historyItem: IHistory = {
            project: item.id,
            name: item.name
        };
        this.state.history.unshift(historyItem);
        if (this.state.history.length > 9) this.state.history.pop();
        localStorage.setItem('l5-projects-history', JSON.stringify(this.state.history));
    }

    private projectCreatedNumber: number = 100554;
    private async onProjectCreated(ev: CustomEvent) {
        this.projectCreated = true;
        this.projectCreatedNumber = ev.detail;
        /*setTimeout(() => {
            if (this.buttonSeePrj) this.buttonSeePrj.scrollIntoView();
        }, 150);*/
    }

}

type IScenaries = 'details' | 'select' | 'add';

interface IProjectSelectedParams {
    emitter: 'left' | 'right',
    value: number
}

export interface IProjectDetails {

}

interface IStateOrg {
    key: string,
    name: string,
    created_at: string,
    description: string,
    projects: any[]
}

interface IServiceList {
    history: IHistory[],
    orgs: IStateOrg[],
    projectSelected: number | undefined
}

interface IHistory {
    project: number,
    name: string
}
interface IParamsEvent {
    emitter: 'right' | 'left',
    value: number
}
