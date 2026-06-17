/// <mls fileReference="_100554_/l2/serviceExploreProjects.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, css } from 'lit';
import { customElement, property, queryAll, query, state } from 'lit/decorators.js';
import { setProjectDetails, getProjectDetails } from '/_102027_/l2/libCommom.js';
import { loadProjectHistory, saveProjectHistory } from '/_102027_/l2/libHistoriesRecents.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_102027_/l2/serviceBase.js';

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
    step3Msg: 'Finalmente, selecione a equipe e a visibilidade do projeto.',
    orgsTot: 'Total de organizações'
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
    orgsTot: 'Total organizations'
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

    @state() scenary = 'list';
    @state() inFilter = false;
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
        this.getOrgsAndProjects(); 
        this.state.history = loadProjectHistory();
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
                return this.scenary === 'list' ? this.renderSelectProject() : this.renderScenaryOrg();
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
        
        
        return html`
            <div class="scroll-custom l5-project-list">
                <div class="filter-container" style="display:flex">
                    <input style="width:100%" type="text" placeholder="Filter" @input=${this._filterProjects}>
                </div>
                ${this.renderHistory()} 
                ${this.renderList()}
                ${this.renderTotsOrgs()}
            </div>
        `
    }

    renderHistory() {

        
        return html`
            <div class="l5-project-list-history" style="${this.state.history.length === 0 ? 'display:none' : 'display: block'}">
                <div class="serviceListTitle">History</div>
                <ul class="serviceListList">
                    ${this.state.history.map(
                        (his) => {
                            const name = his.name.length > 22 ? his.name.substring(0, 22) + '...' : his.name;

                            return html`
                        <li ?disabled=${!his.doSelect} class=${this.lastPrjId && +this.lastPrjId === his.project ? "selected" : ""} title="${his.name}" @click=${() => { this.onHistoryClick(his) }}>
                            <div>
                                <span>${name + ' (' + his.project.toString() + ')'}</span>
                            </div>
                            <div style="display:flex; gap:1rem;font-size:.8rem">
                                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
                                
                            </div>
                        </li>
                    `})}
                </ul>
            </div>
        `;
    }

    renderList() {
        return html`
            <div class="serviceListProjects">
                ${this.state.orgs.map((org) => {
                    return html`
                    <div style="display:${org.selected || this.inFilter ? '' : 'none'}">
                        <div class="serviceListTitle">
                            <span>Org: ${org.key}</span>
                            <span @click=${()=> this.fireDetails(org.projects.length > 0 ? org.projects[0].project : 0)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>
                            </span> 
                        </div>
                        <ul class="serviceListList">
                            ${org.projects.map((prj) => {

                                const name = prj.name.length > 22 ? prj.name.substring(0, 22) + '...' : prj.name;

                                return html`
                                <li ?disabled=${!prj.doSelect} class=${this.lastPrjId && +this.lastPrjId === prj.project ? "selected" : ""} title="${prj.name}" @click=${() => this.onProjectClick(prj)}>
                                    <div>
                                        <span>${name + ' (' + prj.project.toString() + ')'}</span>
                                    </div>
                                    <div style="display:flex; gap:1rem;font-size:.8rem">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
                                    </div>
                                </li>
                        `}) }
                        </ul>
                    </div>
                `})}
    
            </div>
        `;
    }

    renderTotsOrgs() {
        if (this.state.orgs.length <= 1) return '';
        return html`
            <div class="linkItem" style="margin-top:1rem; float:right; padding-right: .7rem;" @click="${this.goToOrgs}">${this.msg.orgsTot} (${this.state.orgs.length})</div>
        `
    }

    renderScenaryOrg() {
        return html`
            <div class="scroll-custom l5-project-list">
                <div class="filter-container" style="display:flex">
                    <input style="width:100%" type="text" placeholder="Filter" @input=${this._filterOrgs}>
                </div>
                ${this.renderListOrgs()}
            </div>
        `
    }

    renderListOrgs() {
        return html`
            <div class="serviceListProjects">
                <div class="serviceListTitle">Orgs:</div>
                <ul class="serviceListList">
                    ${this.state.orgs.map((org) => {
                    return html`    
                        <li  @click=${() => this.onOrgClick(org)}>
                            <div>
                                <span>Org: ${org.key}</span>
                                
                            </div>
                            <div style="display:flex; gap:1rem;font-size:.8rem">
                                <svg xmlns="http://www.w3.org/2000/svg" style="width:15px" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
                            </div>
                        </li>
                    `})}
                </ul>
    
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

            const selected = !!prj.find((i) => this.lastPrjId && +this.lastPrjId === i.project);

            const obj: IStateOrg = {
                name,
                created_at,
                description,
                key: org,
                projects: prj,
                selected
            };

            this.state.orgs.push(obj);

        });
    }

    private clearState() {
        this.state.history = [];
        this.state.orgs = [];
    }


    private filterTimeout: number = 0;
    private _filterProjects(ev: InputEvent): void {
        const filterText = (ev.target as HTMLInputElement).value;
        if (this.filterTimeout) window.clearTimeout(this.filterTimeout);
        this.filterTimeout = window.setTimeout(() => {
            if (filterText) {
                this.titleList?.forEach((item) => { item.style.display = 'none'; });
                if (this.historieEl) this.historieEl.style.display = 'none';
            } else {
                this.titleList?.forEach((item) => { item.style.display = ''; });
                if (this.historieEl) this.historieEl.style.display = 'block';
            }

            this.inFilter = !!filterText;
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
    }

    private async onProjectClick(item: IInfoPrj) {
        if (!item.doSelect) return;
        this.setProjectActual(item.project);
        this.setOrgActual(item.project);
        this.addOnHistory(item);
        window.location.reload();
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
        saveProjectHistory(this.state.history);
    }

    private onOrgClick(org: IStateOrg) {
        this.state.orgs.forEach((o) => o.selected = o.key === org.key);
        this.requestUpdate();
        this.scenary = 'list'
    }

    private goToOrgs() {
        this.scenary = 'orgs'
    }

    
    private _filterOrgs(ev: InputEvent): void {
        const filterText = (ev.target as HTMLInputElement).value;
        if (this.filterTimeout) window.clearTimeout(this.filterTimeout);
        this.filterTimeout = window.setTimeout(() => {
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

    private fireDetails(project: number) {

        if (project === 0) return;
        
        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<collab-org-manager-100554 project="'+project+'" ></collab-org-manager-100554>'
        }
        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );
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
    projects: IInfoPrj[],
    selected:boolean,
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
