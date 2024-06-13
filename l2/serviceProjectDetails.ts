/// <mls shortName="serviceProjectDetails" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property, queryAll, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu, IMenuTitle } from './_100554_serviceBase';
import * as icons from './_100554_collabIcons';


/// **collab_i18n_start**
const message_pt = {
    noProjectSelected: 'Nenhum projeto selecionado!',
    resume: 'Resumo',
    name: 'Nome',
    projectDriver: 'Driver do Projeto',
    projectURL: 'URL do Projeto',
    designSystems: 'Design systems',
    files: 'Arquivos',
    keyGithub: 'Chave do GitHub',
    project: 'Projeto',
    noProject: 'Nenhum projeto selecionado, por favor selecione.',
    selectProject: 'Selecione o projeto',
    btnChange: 'Alterar',
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
    noProjectSelected: 'No project selected!',
    resume: 'Resume',
    name: 'Name',
    projectDriver: 'ProjectDriver',
    projectURL: 'ProjectURL',
    designSystems: 'Design systems',
    files: 'Files',
    keyGithub: 'Key Github',
    project: 'Project',
    noProject: 'No project selected, please select',
    selectProject: 'Select project',
    btnChange: 'Change',
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

@customElement('service-project-details-100554')
export class ServiceProjectDetails100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    private showKey: boolean = false;

    @property() name: string | undefined;
    @property() projectDriver: string | undefined;
    @property() projectURL: string | undefined;
    @property() designSystems: number | undefined;
    @property() projectCreated: boolean = false;
    @property() files: number | undefined;
    @property() actualKeyDriver: string | null | undefined;
    @property() state: IServiceList = { history: [], orgs: [], projectSelected: undefined };
    @property() lastPrjId: string | null | undefined;
    @property({ type: String }) currentScenario: IScenaries = 'details';


    @queryAll('.serviceListProjects .serviceListList li') list: NodeListOf<HTMLElement> | undefined;
    @queryAll('.serviceListProjects .serviceListTitle') titleList: NodeListOf<HTMLElement> | undefined;
    @query('.l5-project-list-history') historieEl: HTMLElement | undefined;
    @query('#button-see-project') buttonSeePrj: HTMLButtonElement | undefined;

    constructor() {
        super();
        mls.events.addListener(5, 'ProjectSelected', (ev) => this.onProjectSelected(ev));
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;


    //------------ SERVICE -------------------
    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'left',
        tooltip: 'Project Details',
        visible: true,
        widget: '_100554_serviceProjectDetails',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickTitle = () => {
        this.changeScenario('select');
    }

    public menu: IMenu = {
        title: {
            icon: '&#xf053',
            text: ''
        },
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined,
        onClickTitle: this.onClickTitle
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    //---------- WEBCOMPONENT----------------------

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.getLastProject();
        return html`
            <section>
                ${this.renderScenario()}
            </section>
        `
    }

    renderScenario() {
        switch (this.currentScenario) {
            case 'details':
                return html`
                    ${this.renderDetails()}
                `
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

    renderDetails() {

        this.projectCreated = false;

        if (this.lastPrjId) this.getDetailsProject(+this.lastPrjId);
        else {
            this.changeScenario('select');
            return;
        }

        (this.menu.title as IMenuTitle).text = this.msg.project + ' : ' + this.lastPrjId;
        (this.menu.title as IMenuTitle).icon = '&#xf053';
        if (this.menu.updateTitle) this.menu.updateTitle();

        return html`
            ${!this.lastPrjId
                ?
                html`<h4> ${this.msg.noProjectSelected}</h4>`
                :
                html`
                <section class="section-details">
                    <h4>${this.msg.resume}</h4>
                    <ul class="listInfo">
                        <li>
                            <b>${icons.collab_file}${this.msg.name}:</b> 
                            ${this.name}
                        </li>
                        <li style="display:flex">
                            <div style="width:18px">${icons.collab_gear}</div>
                            <b>${this.msg.projectDriver}:</b> 
                            ${this.projectDriver}
                        </li>
                        <li>
                            <b>
                                ${icons.collab_folder_tree}
                                ${this.msg.projectURL}:
                            </b>
                            ${this.projectURL}
                        </li>
                        <li>
                            <b>${icons.collab_book}${this.msg.designSystems}:</b> 
                            ${this.designSystems}
                        </li>
                        <li>
                            <b>
                                ${icons.collab_file_signature}
                                ${this.msg.files}:
                            </b>
                            ${this.files}
                        </li>
                    </ul>

                    <details>
                        <summary>Config:</summary>
                        ${this.renderConfigKey()}
                    </details>

                    ${this.renderCreateTreeFork()}
                </section>
                
                
                `
            }`
    }

    private renderConfigKey() {
        if (!this.projectDriver && !(this.keyLocalHistory as any)[this.projectDriver as any]) return html``

        return html`
            <div class="section-config-github">
                <label>${(this.keyLocalHistory as any)[this.projectDriver as any]}</label>
                <div class="cls_key">
                    <input .value=${this.showString(this.actualKeyDriver, this.showKey)} @input="${this.handleInputChangeKey}"></input rows=4>
                    <button @click="${this.clickShowEye}">${this.showKey ? icons.collab_eye : icons.collab_eye_slash}</button>
                </div>
                <button @click=${this.handleChangeKey}>${this.msg.btnChange}</button>
            </div>
            `
    }

    private renderCreateTreeFork() {
        return html`
            <details>
                <summary>Branchs:</summary>
                <div class="grp_show_branches">
                    ${this.renderBranchs()}
                </div>
            </details>
        `
    }

    renderBranchs() {
        return html`
        <ul>
            ${repeat(this.branchMain, ((key: any) => key) as any,
            ((item: any, index: any) => {

                return this.renderItem(item, index);

            }) as any
        )}
        </ul>`;
    }

    renderItem(obj: { name: string }, index: number) {
        return html`
            <li .info=${obj}>
                <input type="radio" id="item-${index}" name="optBranch" value="${obj.name}">
                <label for="item-${index}">
                    ${obj.name}
                </label>
            
            </li>
        
        `
    }

    renderSelectProject() {
        (this.menu.title as IMenuTitle).text = this.msg.selectProject;
        (this.menu.title as IMenuTitle).icon = '';
        if (this.menu.updateTitle) this.menu.updateTitle();

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
        (this.menu.title as IMenuTitle).text = this.msg.addProject;
        (this.menu.title as IMenuTitle).icon = '';
        if (this.menu.updateTitle) this.menu.updateTitle();
        return html`
        <collab-new-project-100554 @collab-new-project=${this.onProjectCreated}></collab-new-project-100554>
        <div style="display:flex; justify-content:center;">
            ${this.projectCreated ? html`<button id="button-see-project" @click=${this.onSeeProjectClick}>${this.msg.btnOpenProject}</button>` : ''}
        </div>
        `
    }

    //------------- IMPLEMENTATION-----------------------

    private keyLocalHistory = {
        github: 'keyGitHub',
        gitlab: 'keyGitLab'
    }

    //-- braches
    private branchMain: { name: string }[] = [];

    private driver: mls.stor.others.DriverIOBase | undefined;
    private branch: string = '';
    private owner: string = '';
    private repo: string = '';

    private async setInfoInitial() {

        if (!(this.keyLocalHistory as any)[this.projectDriver as any]) {
            this.branchMain = [];
            return;
        }
        
        const prj = mls.actual[5].project;
        if (!prj) return;

        if (!this.driver)
            this.driver = mls.stor.others.getDefaultDriver(prj);

        const info = mls.l5.getProjectSettings(prj);

        let str = info.projectURL.split('/');
        str = str.filter((item: string) => item.trim() !== "");

        this.branch = str[0];
        this.owner = str[1];
        this.repo = str[2];

        this.getInfosRepo();
    }

    private async getInfosRepo() {

        if (!this.driver) {
            this.branchMain = [];
            return;
        }

        const ret = await this.driver.listBranches(this.owner, this.repo);

        this.branchMain = ret;
        this.requestUpdate()
    }

    //--

    private async changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario;
    }

    private async getDetailsProject(project: number) {

        let details = mls.l5.getProjectSettings(project);
        this.designSystems = details.designSystems ? details.designSystems.length : 0;
        this.name = details.name;
        this.projectDriver = details.projectDriver;
        this.projectURL = details.projectURL;
        this.files = Object.keys(mls.stor.files).filter((item => item.startsWith(project.toString()))).length;

        if ((this.keyLocalHistory as any)[details.projectDriver] ) {
            this.actualKeyDriver = localStorage?.getItem((this.keyLocalHistory as any)[details.projectDriver]);
        } 

        //await this.setInfoInitial();
        
    }

    private onProjectSelected(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IProjectSelectedParams = JSON.parse(ev.desc);
        this.getDetailsProject(data.value);
    }

    private getLastProject() {
        this.lastPrjId = localStorage.getItem('l5-last-project');
        return this.lastPrjId;
    }

    private handleChangeKey() {
        if (this.actualKeyDriver && this.projectDriver && (this.keyLocalHistory as any)[this.projectDriver]) {
            localStorage?.setItem((this.keyLocalHistory as any)[this.projectDriver], this.actualKeyDriver as string);
        }
    }

    private handleInputChangeKey(value: string) {
        this.actualKeyDriver = value;
    }

    
    private projectCreatedNumber: number = 100554;
    private async onProjectCreated(ev: CustomEvent) {
        this.projectCreated = true;
        this.projectCreatedNumber = ev.detail;
        setTimeout(() => {
            if (this.buttonSeePrj) this.buttonSeePrj.scrollIntoView();
        }, 150);
    }

    private async onSeeProjectClick() {
        this.setProjectActual(this.projectCreatedNumber);
        this._fireEventProjectSelected(this.projectCreatedNumber);
        this.changeScenario('details');
        await this.loadProjectActual(this.projectCreatedNumber);
        this.projectCreated = false;
    }

    // LIST
    private onAddNewProjectClick() {
        this.changeScenario('add');
    }

    private async onProjectClick(item: any) {
        this.setProjectActual(item.id);
        this.setOrgActual(item.id);
        this.addOnHistory(item);
        this._fireEventProjectSelected(item.id);
        this.changeScenario('details');
        await this.loadProjectActual(item.id);
    }

    private async onHistoryClick(item: IHistory) {
        this.setProjectActual(item.project);
        this.setOrgActual(item.project);
        this._fireEventProjectSelected(item.project);
        this.changeScenario('details');
        await this.loadProjectActual(item.project);
    }

    private async loadProjectActual(project: number) {
        await mls.stor.server.loadProjectInfoIfNeeded(project);
    }

    private setOrgActual(project: number) {
        const orgIndex = mls.l5.getProjectOrgIndex(project);
        mls.l5.setActualOrg(orgIndex);
    }

    private setProjectActual(project: number) {
        mls.actual[5].project = project;
        this.state.projectSelected = project;
        localStorage.setItem('l5-last-project', project.toString());
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

    private _fireEventProjectSelected(project: number) {
        const params: IParamsEvent = {
            emitter: 'left',
            value: project
        };
        mls.events.fire(5, ['ProjectSelected'], JSON.stringify(params));
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

    private getOrgsAndProjects() {

        this.clearState();
        Object.keys(mls.stor.orgs).forEach((org, index) => {
            const { name, description, created_at, projects } = mls.stor.orgs[org].sett;
            const prj: any[] = [];
            projects.forEach((p: any) => {
                try {
                    const json = JSON.parse(p.value);
                    if (
                        !json.l5_actionPrjSettings ||
                        !json.l5_actionPrjSettings.projectDriver ||
                        json.l5_actionPrjSettings.projectDriver === 'mls') return;
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


    private clickShowEye(e: MouseEvent) {
        e.stopPropagation();
        if (this.showKey) this.showKey = false;
        else this.showKey = true;
        this.requestUpdate();
    }

    private showString(input: string | null | undefined, show: boolean) {
        if (!input) return '';
        if (show) return input
        else return this.maskString(input);
    }

    private maskString(input: string) {
        return '*'.repeat(input.length);
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
