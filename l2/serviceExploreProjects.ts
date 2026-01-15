/// <mls shortName="serviceExploreProjects" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, queryAll, query } from 'lit/decorators.js';
import { setProjectDetails, getProjectDetails } from '/_100554_/l2/libCommom.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
//import './_100554_pluginCreateNewProject'

/// **collab_i18n_start**
const message_pt = {
    select: 'Selecionar',
    detail: 'Detalhe',
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
    btnAddNewProject: 'Criar novo projeto',
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
    select: 'Select',
    detail: 'Detail',
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
    btnAddNewProject: 'Create new Project',
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

    @property() projectCreated: boolean = false;
    @property() state: IServiceList = { history: [], orgs: [], projectSelected: undefined };
    @property() lastPrjId: string | null | undefined;
    @queryAll('.serviceListProjects .serviceListList li') list: NodeListOf<HTMLElement> | undefined;
    @queryAll('.serviceListProjects .serviceListTitle') titleList: NodeListOf<HTMLElement> | undefined;
    @query('.l5-project-list-history') historieEl: HTMLElement | undefined;

    @property() activeTab: string = 'IMyProject';
    //----------CONFIG SERVICE------------------

    public details: IService = {
        icon: '&#xf0b1',
        state: 'background',
        position: 'left',
        tooltip: 'Projects',
        visible: true,
        widget: '_100554_serviceExploreProjects',
        level: [6]
    }

    public onClickMain(op: string) {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public onClickTabs(index: number) {
        this.activeTab = ETabs[index];
    }

    public menu: IServiceMenu = {
        title: '',
        main: {},
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: [
                { text: 'Explore', icon: 'f542' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            this.requestUpdate();
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
        this.getLastProject();
    }

    createRenderRoot() {
        return this;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]

        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'IExplore':
                return this.renderSelectProject();
            default:
                return html``;
        }
    }

    renderExplore() {
        if (this.visible === 'true') this.firedetail('<projects-100554></projects-100554>');
        return html`<h3 style="padding:2rem">Explore others projects , in development</h3>`
    }

    renderSelectProject() {
        if (this.visible === 'true') this.firedetail('<projects-100554></projects-100554>');
        
        this.getOrgsAndProjects(); 
        this.state.history = this.loadHistory();
        return html`
            <div class="scroll-custom l5-project-list">
                <div class="filter-container" style="display:flex">
                    <input style="width:100%" type="text" placeholder="Filter" @input=${this._filterProjects}>
                </div>
                ${this.renderHistory()}
                ${this.renderList()}
                
            </div>
        `
    }

    renderHistory() {
        return html`
            <div class="l5-project-list-history" style="${this.state.history.length === 0 ? 'display:none' : 'display: block'}">
                <div class="serviceListTitle">History</div>
                <ul class="serviceListList">
                    ${this.state.history.map(
            (his) => html`
                        <li ?disabled=${!his.doSelect} class=${this.lastPrjId && +this.lastPrjId === his.project ? "selected" : ""} >
                            <div>
                                <span>${his.name + ' (' + his.project.toString() + ')'}</span>
                            </div>
                            <div style="display:flex; gap:1rem;font-size:.8rem">
                                <span class="linkItem" @click=${() => { this.onHistoryClick(his) }}>
                                    ${this.msg.select}
                                </span>
                            </div>
                        </li>
                    `)}
                </ul>
            </div>
        `;
    }

    renderList() {
        return html`
            <div class="serviceListProjects">
                ${this.state.orgs.map((org) => {
            return html`
                    <div class="serviceListTitle">${org.key}</div>
                    <ul class="serviceListList">
                        ${org.projects.map((prj) => html`
                            <li ?disabled=${!prj.doSelect} class=${this.lastPrjId && +this.lastPrjId === prj.project ? "selected" : ""} >
                                <div>
                                    <span>${prj.name + ' (' + prj.project.toString() + ')'}</span>
                                </div>
                                <div style="display:flex; gap:1rem;font-size:.8rem">
                                    <span class="linkItem" @click=${() => this.onProjectClick(prj)}>
                                        ${this.msg.select}
                                    </span>
                                </div>
                            </li>
                        `)}
                    </ul>
                `})}
    
            </div>
        `;
    }


    //----------IMPLEMENTS------------------

    private async firedetail(msg: string) {

        mls.events.fire(
            6,
            'PluginDetails' as any,
            JSON.stringify(
                {
                    htmlText: `<div>${msg}</div>`

                }
            ),
            0
        );
    }

    private getLastProject() {
        const info = getProjectDetails();
        if (info) this.lastPrjId = info.project.toString();
        else this.lastPrjId = localStorage.getItem('l5-last-project');
        return this.lastPrjId;
    }

    private getOrgsAndProjects() {

        this.clearState();
        Object.keys(mls.stor.orgs).forEach((org, index) => {
            const { name, description, created_at, projects } = mls.stor.orgs[org].sett;
            const prj: IInfoPrj[] = [];
            projects.forEach((p: any) => {
                try {
                    const json = JSON.parse(p.value);
                    if (!p.id) return;
                    const info = mls.l5.getProjectSettings(p.id);
                    let doSelect = true;

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

                    if (!info || !info.projectDriver || !info.projectURL) doSelect = false;

                    if(doSelect) prj.push({
                        project: p.id,
                        name: p.name,
                        doSelect
                    });

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

    private KeyHistory = 'serviceExploreProjects'
    private loadHistory(): IHistory[] {
        const lcHistory = localStorage.getItem(this.KeyHistory);
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



    private async onHistoryClick(item: IHistory) {
        if (!item.doSelect) return;
        this.setProjectActual(item.project);
        this.setOrgActual(item.project);
        this.addOnHistory(item);
        window.location.reload();

        // this._fireEventProjectSelected(item.project);
        // this.changeScenario('select');
        // await this.loadProjectActual(item.project);
        // await mls.stor.server.unzipSourcesIfNeeded(item.project);
        // this.openExplore()
    }

    private async onProjectClick(item: IInfoPrj) {

        if (!item.doSelect) return;
        this.setProjectActual(item.project);
        this.setOrgActual(item.project);
        this.addOnHistory(item);
        window.location.reload();

        //this._fireEventProjectSelected(item.project);
        // this.changeScenario('details');
        // await this.loadProjectActual(item.project);
        // await mls.stor.server.unzipSourcesIfNeeded(item.project);
        // this.openExplore()
    }


    private openExplore() {
        this.selectLevel(5)
        mls.events.fire([5], ['ProjectSelected'], '');
    }


    private setProjectActual(project: number) {
        mls.setActualProject(project);
        this.state.projectSelected = project;
        setProjectDetails(project);
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


    private addOnHistory(item: IInfoPrj) {
        const indexInHistory = this.state.history.findIndex((his) => his.name === item.name && his.project === item.project);
        if (indexInHistory > -1) this.state.history.splice(indexInHistory, 1);
        const historyItem: IHistory = {
            project: item.project,
            name: item.name,
            doSelect: item.doSelect
        };
        this.state.history.unshift(historyItem);
        if (this.state.history.length > 9) this.state.history.pop();
        localStorage.setItem(this.KeyHistory, JSON.stringify(this.state.history));
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

enum ETabs {
    'IExplore' = 0,
}

interface IStateOrg {
    key: string,
    name: string,
    created_at: string,
    description: string,
    projects: IInfoPrj[]
}

interface IInfoPrj {
    project: number,
    name: string,
    doSelect: boolean,
}

interface IServiceList {
    history: IHistory[],
    orgs: IStateOrg[],
    projectSelected: number | undefined
}

interface IHistory {
    project: number,
    name: string,
    doSelect: boolean,
}
interface IParamsEvent {
    emitter: 'right' | 'left',
    value: number
}
