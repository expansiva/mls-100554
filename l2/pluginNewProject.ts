/// <mls shortName="pluginNewProject" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import {
    template_package,
    template_build,
    template_tsconfig,
    template_ds,
    template_l5Project,
    template_coreIndex,
    template_l2Project
} from './_100554_pluginNewProjectTemplate';

import {
    collab_pull_request,
    collab_commit,
    collab_arrows_rotate
} from './_100554_collabIcons';

import './_100554_pluginNewProjectLog';

/// **collab_i18n_start**
const message_pt = {
    btnCreateProject: 'Criar projeto',
    btnRefreshOrg: 'Atualizar',
    push: 'Permite que os desenvolvedores façam push diretamente para a branch principal.',
    pullRequest: 'Exige que todas as mudanças sejam feitas através de Pull Requests, permitindo revisões de código e aprovação antes da integração na branch principal.',
    projectNameLabel: 'Nome do projeto',
    errorProjectName: 'Por favor, entre com um nome de projeto valido',
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
    log_init: "Processando",
    log_error: "Erro",
    log_ok: "Concluido",
    log_0: "Verificando repositório",
    log_1: "Criando repositório",
    log_2: "Criando arquivo de validação",
    log_3: "Criando projeto no collab.codes",
    log_4: "Configurando visibilidade do projeto",
    log_5: "Renomeando projeto",
    log_6: "Criando arquivo de configuração",
    log_7: "Projeto criado com sucesso!",
    log_8: "Criando arquivo inicial README.md",
    log_9: "Criando arquivo inicial package.json",
    log_10: "Criando arquivo inicial build.yml",
    log_11: "Criando arquivo inicial tsconfig.json",
    log_12: "Criando arquivo inicial project.json file",
    log_13: "Criando arquivo inicial designSystem.ts file",
    log_14: "Setando permissão ao action",
    log_15: "Setando variavel no action",
    log_16: "Criando arquivo inicial pluginCollabCoreIndex.ts file",
    log_17: "Criando arquivo project.ts file",
    log_error_03: "Por favor espere, outro usuário esta utilizando o repositório.",
    log_error_04: "Existe um repositório, mas não foi possível validar o usuário",
}

const message_en = {
    btnCreateProject: 'Create project',
    btnRefreshOrg: 'Refresh',
    push: 'Allows developers to push directly to the main branch.',
    pullRequest: 'Requires all changes to be made through Pull Requests, allowing code reviews and approval before integration into the main branch.',
    projectNameLabel: 'Project name',
    errorProjectName: 'Please, enter with a valid project name',
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
    log_init: "Processing",
    log_error: "Error",
    log_ok: "Completed",
    log_0: "Verify repository",
    log_1: "Creating repository",
    log_2: "Creating validation file",
    log_3: "Creating project on collab.codes",
    log_4: "Setting project visibility",
    log_5: "Renaming project",
    log_6: "Creating configuration file",
    log_7: "Project created successfully!",
    log_8: "Creating initial README.md file",
    log_9: "Creating initial package.json file",
    log_10: "Creating initial build.yml file",
    log_11: "Creating initial tsconfig.json file",
    log_12: "Creating initial project.json file",
    log_13: "Creating initial designSystem.ts file",
    log_14: "Setting permission to action",
    log_15: "Setting variable in action",
    log_16: "Creating initial pluginCollabCoreIndex.ts file",
    log_17: "Creating initial project.ts file",
    log_error_03: "Please wait, another user is creating; ",
    log_error_04: " There is a repository, but I was unable to validate the user",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-new-project-100554')
export class CollabNewProject extends CollabLitElement {

    private msg: MessageType = messages['en'];

    NEWREPONAME = 'mls-new';
    VALIDADEFILE = 'validate.json';

    @property() driverSelected: boolean = false;
    @property() orgSelected: boolean = false;
    @property() loadingAdd1Msg: string = '';
    @property() orgsLoaded: boolean = false;
    @property() actualOrgs: mls.stor.others.IOrg[] = [];
    @property() actualTeams: string[] = [];
    @property() isValidProjectName: boolean = true;
    @property() errorDriver: string = '';

    @property() logs: ILogs[] = [];

    @query('#input_project_name') inputProjectName: HTMLInputElement | undefined;
    @query('form') form: HTMLFormElement | undefined;
    @query('.logs-container') logsContainer: HTMLDivElement | undefined;

    @query('.step1') step1: HTMLDivElement | undefined;
    @query('.step2') step2: HTMLDivElement | undefined;
    @query('.step3') step3: HTMLDivElement | undefined;

    @query('.progress-line') progress: HTMLDivElement | undefined;

    newProjectName: string = '';
    newProjectNumber: number = 0;
    newProjectTeam: string = 'admin';
    newProjectVisibility: string = 'public';
    newProjectUpdateMode: string = 'pullRequest';
    driverName: string = '';
    orgName: string = '';
    instanceDriver: mls.stor.others.DriverIOBase | undefined;
    login: string = '';
    secret: string = '';

    private drivers: any = {
        'github': 'GitHub',
        'gitlab': 'GitLab',
    }

    private urls: any = {
        'github': 'https://github.com/',
        'gitlab': 'https://gitlab.com/',
    }

    //-------COMPONENT------------

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="add-container">
                <form>
                    ${this.renderStep1()}  
                    ${this.renderStep2()} 
                    ${this.renderStep3()}
                </form>
                ${this.renderLogs()}
            </div>
        `
    }

    renderStep1() {
        return html`
            <div class="step step1">
                <h5>${this.msg.step1Title}</h5>
                <small>${this.msg.step1Msg}</small>
                <hr>
            </div>
            <div>
                <label>${this.msg.projectNameLabel}</label>
                <input id="input_project_name" type="text" @input=${(e: KeyboardEvent) => { this.newProjectName = (e.target as HTMLInputElement).value }}>
                ${!this.isValidProjectName ? html`<small class="error"> ${this.msg.errorProjectName}</small>` : ''}
            </div>

            <div>
                <label>${this.msg.driverNameLabel}</label>
                <select @change=${this.onSelectDriverChange}>
                    <option value=""></option>
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                </select>
                ${!!this.errorDriver ? html`<small class="error"> ${this.errorDriver}</small>` : ''}

            </div>

        `
    }

    renderStep2() {

        if (!this.driverSelected) return html``;
        if (!this.orgsLoaded) {
            return html`
                <div class="msg-loading">
                    ${this.loadingAdd1Msg}
                    <div>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            `
        }

        return html`
            <div class="step step2">
                <h5>${this.msg.step2Title}</h5>
                <small>${this.msg.step2Msg}</small>
                <hr>
            </div>
            <div class="cards-update-mode">
                <div style="display:none" class="card-update-mode" @click=${(ev: MouseEvent) => this.onCardClick('push', ev)}>
                    <input name="update_mode" type="radio" ></input>
                    <div>
                        <div class="card-update-mode-title">
                            <span>${collab_commit}</span>
                            <span >Push</span>
                        </div>
                        <span>${this.msg.push}</span>
                    </div>
                </div>
                <div class="card-update-mode" @click=${(ev: MouseEvent) => this.onCardClick('pullRequest', ev)}>
                    <input name="update_mode" type="radio" checked></input>
                    <div>
                        <div class="card-update-mode-title">
                            <span>${collab_pull_request}</span>
                            <span>Pull Request</span>
                        </div>
                        <span> ${this.msg.pullRequest}</span>
                    </div>
                </div>
            </div>
            <div>
                <label>${this.msg.organizationLabel}</label>
                <div class="orgs-select">
                    <select @change=${this.onOrgChanged}>
                        <option></option>
                        ${this.actualOrgs.map((org) => html`<option value="${org.id}">${org.name}</option>`)}
                    </select>
                    <button @click=${this.onRefreshOrgsClick}>${this.msg.btnRefreshOrg} ${collab_arrows_rotate}</button>
                </div>
                
            </div>
        `;


    }

    renderStep3() {

        if (!this.driverSelected || !this.orgSelected || !this.orgName) return html``;

        return html`
            <div class="step step3">
                <h5>${this.msg.step3Title}</h5>
                <small>${this.msg.step3Msg}</small>
                <hr>
            </div>
            <div>
                <label>${this.msg.teamLabel}</label>
                <select @change=${(e: MouseEvent) => { this.newProjectTeam = (e.target as HTMLSelectElement).value }}>
                    ${this.actualTeams.map((team) => html`<option value="${team}">${team}</option>`)}
                </select>
            </div>
            <div>
                <label>${this.msg.visibilityLabel}</label>
                <select @change=${(e: MouseEvent) => { this.newProjectVisibility = (e.target as HTMLSelectElement).value }}>
                    <option value="public">${this.msg.visibilityPublicOption}</option>
                    <option value="private">${this.msg.visibilityPrivateOption}</option>
                </select>
            </div>

            <div class="actions-btn">
                <button @click=${this.onCreateProjectClick}>
                    ${this.msg.btnCreateProject}
                </button>
            </div>
        `;


    }

    renderLogs() {

        if (this.logs.length <= 0) return html``;

        return html`
        <div class="logs-container">
            <div class="progress">
                <div class="progress-line"></div>
            </div>
            ${this.logs.map((log) => html`<plugin-new-project-log-100554 status=${log.status} text=${log.pre}:${log.log}></plugin-new-project-log-100554>`)}
        </div>
        `;
    }

    //------IMPLEMENTATION-----------

    private toogleForm(disabled: boolean) {
        if (this.form) {
            this.form.classList.toggle('form-disabled')
        }
    }

    private onSelectDriverChange(e: MouseEvent) {
        this.errorDriver = '';
        const value = (e.target as HTMLSelectElement).value;
        this.driverSelected = !!value;
        this.orgsLoaded = false;
        this.orgName = '';
        this.driverName = value;

        if (value) {
            this.loadOrgsByDriver(value as mls.cbe.Provider)
        } else {
            this.orgSelected = false;
        }
    }

    private onOrgChanged(e: MouseEvent) {
        const value = (e.target as HTMLSelectElement).value;
        this.orgSelected = !!value;
        this.orgName = value;
        if (this.login !== this.orgName) {
            const ref = this.actualOrgs.find((o) => o.id === value);
            if (!ref) throw new Error('Not found orgName');
            this.orgName = ref.name;

        }

        if (value) {
            this.loadTeamByOrg(value);
            setTimeout(() => this.step3?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    }

    private async loadOrgsByDriver(driver: mls.cbe.Provider) {

        try {
            this.instanceDriver = mls.stor.others.getDriver(driver);
            if (!this.instanceDriver) throw new Error('Invalid driver instance');
            this.loadingAdd1Msg = this.msg.loadingAddText1;
            const userInfo = await this.instanceDriver.getUserInfo();
            this.loadingAdd1Msg = this.msg.loadingAddText2;
            if (!userInfo.login) throw new Error('Invalid user login');
            this.login = userInfo.login;
            this.actualOrgs = await this.getOrgsByUser(this.login);
            this.orgsLoaded = true;
            setTimeout(() => this.step2?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);

        } catch (err: any) {
            this.driverSelected = false;
            this.errorDriver = err.message;
            console.error(err.message)
        }
    }

    private async getOrgsByUser(user: string) {

        if (!this.instanceDriver) throw new Error('Invalid driver instance');
        const orgs: mls.stor.others.IOrg[] = await this.instanceDriver.getOrganizations(user);
        orgs.unshift({ id: user, name: user, avatarUrl: '', visibility: 'public' });
        return orgs;
    }

    private loadTeamByOrg(org: string) {
        this.actualTeams = ['admin']
    }

    private addLog(log: ILogs) {
        this.logs.push(log);
        this.requestUpdate();
    }

    private changeStatusLastLog(status: string, msg?: string) {
        const lastLog = this.logs[this.logs.length - 1];
        if (lastLog) {
            lastLog.status = status;
            lastLog.pre = status === 'finish' ? this.msg.log_ok : this.msg.log_error;
            if (msg) lastLog.log = msg;
            this.requestUpdate();
        }
    }

    private async tryItem(fc: Function, log: string) {
        try {
            this.addLog({ pre: this.msg.log_init, log, status: "inprogress" });
            setTimeout(() => this.logsContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            const rc = await fc();
            if (rc && rc.statusCode === 400) {
                this.changeStatusLastLog('error', 'Error statuscode 400');
                this.setProgressError(true);
                throw new Error('Error statuscode 400');
            }
            if (rc && rc.error) {
                const msg = log + ':' + rc.error;
                this.changeStatusLastLog('error', msg);
                this.setProgressError(true);
                throw new Error(rc.error);
            }
            this.changeStatusLastLog('finish');
            return rc;
        } catch (err: any) {
            const msg = log + ':' + err.message;
            this.changeStatusLastLog('error', msg);
            this.setProgressError(true);
            throw new Error(err.message);
        }
    }

    private setProgress(nr: number) {
        if (!this.progress) return;
        this.progress.style.width = Math.ceil(nr) + '%';
    }

    private setProgressError(enabled: boolean) {
        if (!this.progress) return;
        if (enabled) this.progress.classList.add('error')
        else this.progress.classList.remove('error')
    }

    private setProgressFinished(finished: boolean) {
        if (!this.progress) return;
        if (finished) this.progress.classList.add('finished')
        else this.progress.classList.remove('finished')
    }


    private checkIsValidProjectName(name: string): boolean {
        if (!name || name.length <= 3) return false;
        const projectNameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        return projectNameRegex.test(name);
    }

    private async onCreateProjectClick(e: MouseEvent) {
        e.preventDefault();
        this.logs = [];
        this.toogleForm(true);

        if (!this.checkIsValidProjectName(this.newProjectName)) {
            this.toogleForm(false);
            this.isValidProjectName = false;
            this.inputProjectName?.focus();
            this.inputProjectName?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        this.isValidProjectName = true;
        const userNameCollab: string = this.getLoginUser() as string;
        if (!userNameCollab) {
            this.addLog({ pre: 'Error', log: 'User name not found', status: "error" });
            this.toogleForm(false);
            this.setProgressError(true);
            this.setProgressFinished(true);
            return;
        }

        try {
            let percent = 6.25;
            let newPercent = 0;
            this.setProgressError(false);
            this.setProgressFinished(false);
            this.setProgress(newPercent);


            const rc = await this.tryItem(async () => await this.instanceDriver?.verifyRepositoryNew(this.login, this.NEWREPONAME, userNameCollab), `${this.msg.log_0} ${this.NEWREPONAME}`);

            if (rc === 'reuse') percent = 12.5;
            newPercent += percent;
            this.setProgress(newPercent);

            if (rc === 'error' || rc === 'wait') {
                const obj: any = {
                    'wait': this.msg.log_error_03,
                    'error': this.msg.log_error_04,
                }
                this.addLog({ pre: this.msg.log_error, log: obj[rc], status: "error" });
                this.toogleForm(false);
                return;
            }

            if (rc === 'free') {

                let orgName = this.orgName;
                if (this.login !== orgName) {
                    const ref = this.actualOrgs.find((o) => o.name === orgName);
                    if (!ref) {
                        this.changeStatusLastLog('error', 'Error not found org name');
                        this.setProgressError(true);
                        throw new Error('Error not found org name');
                    }
                    orgName = ref.id;

                }

                await this.tryItem(async () => await this.instanceDriver?.createRepository(this.login, this.NEWREPONAME, orgName, 'new project in collab.codes', 'PUBLIC'), `${this.msg.log_1} ${this.NEWREPONAME} `);
                newPercent += percent;
                this.setProgress(newPercent);

                await this.tryItem(async () => await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, this.VALIDADEFILE, `{ "users": [ "${userNameCollab}" ] }`), `${this.msg.log_2} ${this.VALIDADEFILE} `);
                newPercent += percent;
                this.setProgress(newPercent);
            }

            this.secret = this.getUniquePassword();

            const newProjectId = await this.tryItem(this.createProjecInCollab.bind(this), `${this.msg.log_3}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            if (this.newProjectVisibility === 'private') await this.tryItem(async () => await this.instanceDriver?.changeVisibility(this.orgName, this.NEWREPONAME, 'PRIVATE'), `${this.msg.log_4}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            const newProjectName = `mls-${newProjectId}`;
            await this.tryItem(async () => await this.instanceDriver?.renameRepository(this.orgName, this.NEWREPONAME, newProjectName), `${this.msg.log_5}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.setPermissionAction(this.orgName, newProjectName), `${this.msg.log_14}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.setVariableAction(this.orgName, newProjectName, this.secret), `${this.msg.log_15}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialReadMe(newProjectId), this.msg.log_8);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialBuildFile(newProjectId), this.msg.log_10);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            /*await this.tryItem(async () => await this.createInitialCoreIndex(newProjectId), this.msg.log_16);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);*/
            await this.tryItem(async () => await this.createInitialProject(newProjectId), this.msg.log_17);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialPackageFile(newProjectId), this.msg.log_9);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialTSConfigFile(newProjectId), this.msg.log_11);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialConfigL5File(newProjectId), this.msg.log_12);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.sleep(200);

            await this.tryItem(async () => await this.createInitialDSFile(newProjectId), this.msg.log_13);
            newPercent += percent;
            this.setProgress(newPercent);


        } catch (err: any) {
            this.toogleForm(false);
        }

        this.addLog({ pre: this.msg.log_ok, log: this.msg.log_7, status: "finish" });
        this.setProgressFinished(true);

        this.dispatchEvent(new CustomEvent('collab-new-project', {
            detail: this.newProjectNumber, bubbles: true, composed: true
        }));

    }

    private async createProjecInCollab() {

        const userNameCollab: string = this.getLoginUser() as string;

        const param: {
            orgName: string;
            info: mls.cbe.IProjectInfo;
            settings: mls.cbe.IPrj_settings;
        } =
        {
            orgName: this.orgName,
            info: {
                projectDriver: this.drivers[this.driverName],
                projectURL: `${this.urls[this.driverName]}main/${this.orgName}/mls-new/`,
            },
            settings: {
                id: 0,
                name: this.newProjectName,
                owner: userNameCollab,
                userAuth: this.newProjectVisibility as any,
                archived_at: '',
                created_at: '',
                prj_dependencies: [100554],
                value: '',
                repository_secret: this.secret

            }
        }

        try {
            const res = await mls.api.cbeSaveNewPrj(param);
            console.info({ res });
            return res;
        } catch (err:any) {
            throw new Error('Error on create project in collab' + err.message)
        }
    }

    private async setPermissionAction(org: string, repo: string) {

        if (this.driverName === 'gitlab' || !this.instanceDriver) return;

        return await (this.instanceDriver as any).setPermissionAction(org, repo, '')

    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async setVariableAction(org: string, repo: string, psw: string) {

        if (!this.instanceDriver) return;

        return await (this.instanceDriver as any).addVariable2(org, repo, 'COLLAB_TOKEN', psw);

    }

    private async createInitialReadMe(project: number) {
        const fileName = 'README.md';
        const content = `ReadMe: ${project}`;
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialBuildFile(project: number) {
        const fileName = '.github/workflows/build.yml';
        const content = template_build.template.trim().replace(/\[project\]/g, project.toString());
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialCoreIndex(project: number) {
        const fileName = 'l2/pluginCollabCoreIndex.ts';
        const content = template_coreIndex.template.trim().replace(/\[project\]/g, project.toString());
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialProject(project: number) {
        const fileName = 'l2/project.ts';
        const content = template_l2Project.template.trim().replace(/\[project\]/g, project.toString());
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialPackageFile(project: number) {
        const fileName = 'package.json';
        const content = template_package.template.replace(/\[project\]/g, project.toString()).trim();
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialTSConfigFile(project: number) {
        const fileName = 'tsconfig.json';
        const content = template_tsconfig.template.trim();
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialConfigL5File(project: number) {
        const fileName = 'l5/project.json';
        const content = template_l5Project.template.trim().replace(/\[org\]/g, this.orgName);
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private async createInitialDSFile(project: number) {
        const fileName = 'l2/designSystem.ts';
        const content = template_ds.template.trim().replace(/\[project\]/g, project.toString());
        await this.instanceDriver?.createFileInRepo(this.orgName, this.NEWREPONAME, fileName, content);
    }

    private onCardClick(opt: string, ev: MouseEvent) {
        const target = ev.target as HTMLElement;
        const input = target.closest('.card-update-mode')?.querySelector('input');
        if (input) input.checked = true;
        this.newProjectUpdateMode = opt;
    }

    private async onRefreshOrgsClick(ev: MouseEvent) {
        ev.preventDefault();
        this.actualOrgs = await this.getOrgsByUser(this.login);
        this.requestUpdate();
    }

    private getLoginUser() {
        const userNameCollab = mls.getActualUser();
        return userNameCollab;
    }

    private getUniquePassword() {

        const height = Math.floor(Math.random() * (15 - 6 + 1)) + 6;

        const caracters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        const encoder = new TextEncoder();
        const data = encoder.encode(Date.now().toString() + Math.random());
        const hashBuffer = (crypto.subtle as any).digestSync
            ? (crypto.subtle as any).digestSync('SHA-256', data)
            : null;

        const bytes = hashBuffer ? new Uint8Array(hashBuffer) : crypto.getRandomValues(new Uint8Array(32));

        let password = '';
        for (let i = 0; i < height; i++) {
            const idx = bytes[i % bytes.length] % caracters.length;
            password += caracters[idx];
        }

        return password;
    }

}

interface ILogs {
    pre: string,
    log: string,
    status: string
}

