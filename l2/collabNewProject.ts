/// <mls shortName="collabNewProject" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import {
    collab_pull_request,
    collab_commit,
    collab_arrows_rotate
} from './_100554_collabIcons';

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
    log_error_03: "Please wait, another user is creating; ",
    log_error_04: " There is a repository, but I was unable to validate the user",

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-new-project-100554')
export class CollabNewProject extends CollabLitElement {

    private msg: MessageType = messages['en'];
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    NEWREPONAME = 'mls-new';
    VALIDADEFILE = 'validate.json';

    @property() driverSelected: boolean = false;
    @property() orgSelected: boolean = false;
    @property() loadingAdd1Msg: string = '';
    @property() orgsLoaded: boolean = false;
    @property() actualOrgs: IOrg[] = [];
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
    newProjectUpdateMode: string = 'push';
    driverName: string = '';
    orgName: string = '';
    instanceDriver: any;
    login: string = '';

    private drivers: any = {
        'github': 'GitHub',
        'gitlab': 'GitLab',
    }

    private urls: any = {
        'github': 'https://github.com/',
        'gitlab': 'https://gitlab.com/',
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="add-container">
                <form>
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
                            <option value="github">gitHub</option>
                            <option value="gitlab">gitLab</option>
                        </select>
                        ${!!this.errorDriver ? html`<small class="error"> ${this.errorDriver}</small>` : ''}

                    </div>
                    ${this.driverSelected ? html`

                            ${!this.orgsLoaded ?
                    html`<div class="msg-loading">
                                ${this.loadingAdd1Msg}
                                <div>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>
                            </div>` :
                    html`
                                <div class="step step2">
                                        <h5>${this.msg.step2Title}</h5>
                                        <small>${this.msg.step2Msg}</small>
                                    <hr>
                                </div>
                                <div class="cards-update-mode">
                                    <div class="card-update-mode" @click=${(ev: MouseEvent) => this.onCardClick('push', ev)}>
                                        <input name="update_mode" type="radio" checked></input>
                                        <div>
                                            <div class="card-update-mode-title">
                                                <span>${collab_commit}</span>
                                                <span >Push</span>
                                            </div>
                                            <span>${this.msg.push}</span>
                                        </div>
                                    </div>
                                    <div class="card-update-mode" @click=${(ev: MouseEvent) => this.onCardClick('pullRequest', ev)}>
                                        <input name="update_mode" type="radio"></input>
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

                
                                ${this.orgSelected ? html`
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
                                
                                `: html``}
                                
                            `}
                    ` : html``}
            
                </form>

                ${this.logs.length > 0 ? html`
            
                    <div class="logs-container">
                        <div class="progress">
                            <div class="progress-line"></div>
                        </div>
                        ${this.logs.map((log) => html`<collab-log-line-100554 status=${log.status} text=${log.pre}:${log.log}></collab-log-line-100554>`)}
                    </div>` : ''
            }
            </div>
        `
    }

    private toogleForm(disabled: boolean) {
        if (this.form) {
            this.form.classList.toggle('form-disabled', disabled)
        }
    }

    private onSelectDriverChange(e: MouseEvent) {
        this.errorDriver = '';
        const value = (e.target as HTMLSelectElement).value;
        this.driverSelected = !!value;
        this.orgsLoaded = false;
        this.driverName = value;

        if (value) {
            this.loadOrgsByDriver(value)
        } else {
            this.orgSelected = false;
        }
    }

    private onOrgChanged(e: MouseEvent) {
        const value = (e.target as HTMLSelectElement).value;
        this.orgSelected = !!value;
        this.orgName = value;
        if (value) {
            this.loadTeamByOrg(value);
            setTimeout(() => this.step3?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    }

    private async loadOrgsByDriver(driver: string) {

        try {
            this.instanceDriver = mls.stor.others.getDriver(100529, driver);
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
        const orgs: IOrg[] = await this.instanceDriver.getOrganizations(user);
        orgs.unshift({ id: user, name: user, avatarUrl: '', visibility: 'public' });
        return orgs;
    }

    private loadTeamByOrg(org: string) {
        this.actualTeams = ['admin']
    }

    private async delay(time: number) {
        await new Promise((resolve) => setTimeout(resolve, time));
    }

    private async delay2() {
        return new Promise((resolve, reject) => {
            resolve('01');
        })
    }
    private async delayOk() {
        return new Promise((resolve, reject) => {
            resolve('Simulate ok');
        })
    }

    private async delayError() {
        return new Promise((resolve, reject) => {
            reject(new Error('Simulate error'));
        })
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

    private PROJECTFIXED = 100570;

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
        const userNameCollab = this.getLoginUser();

        this.simulate();
        return;


        try {
            let percent = 16.6;
            let newPercent = 0;
            this.setProgressError(false);
            this.setProgressFinished(false);
            this.setProgress(newPercent);

            const rc = await this.tryItem(async () => await this.instanceDriver.verifyRepositoryNew(this.login, this.NEWREPONAME, userNameCollab), `${this.msg.log_0} ${this.NEWREPONAME}`);
            if (rc === ECheckRepo.RepositoryAlreadyExist) percent = 25;
            newPercent += percent;
            this.setProgress(newPercent);

            if (rc === ECheckRepo.RepositoryInvalid || rc === ECheckRepo.RepositoryInUse) {
                const obj: any = {
                    '03': this.msg.log_error_03,
                    '04': this.msg.log_error_04,
                }
                this.addLog({ pre: this.msg.log_error, log: obj[rc], status: "error" });
                this.toogleForm(false);
                return;
            }

            if (rc === ECheckRepo.RepositoryNonexistent) {
                await this.tryItem(async () => await this.instanceDriver.createRepository(this.login, this.NEWREPONAME, this.orgName, 'new project in collab.codes', 'PUBLIC'), `${this.msg.log_1} ${this.NEWREPONAME} `);
                newPercent += percent;
                this.setProgress(newPercent);

                await this.tryItem(async () => await this.instanceDriver.createFileInRepo(this.orgName, this.NEWREPONAME, this.VALIDADEFILE, `{ "users": [ "${userNameCollab}" ] }`), `${this.msg.log_2} ${this.VALIDADEFILE} `);
                newPercent += percent;
                this.setProgress(newPercent);
            }

            const newProjectId = await this.tryItem(async () =>
                await mls.api.cbeSaveNewPrj(
                    {
                        orgName: this.orgName,
                        info: {
                            project: this.newProjectNumber,
                            projectDriver: this.drivers[this.driverName],
                            projectURL: `${this.urls[this.driverName]}main/${this.orgName}/mls-new/`
                        },
                        settings: {
                            id: 0,
                            name: this.newProjectName,
                            owner: userNameCollab,
                            userAuth: this.newProjectVisibility
                        }
                    })
                , `${this.msg.log_3}`);

            newPercent += percent;
            this.setProgress(newPercent);

            if (this.newProjectVisibility === 'private') await this.tryItem(async () => await this.instanceDriver.alterVisibility(this.orgName, this.NEWREPONAME, 'PRIVATE'), `${this.msg.log_4}`);
            newPercent += percent;
            this.setProgress(newPercent);

            const newProjectName = `mls-${newProjectId}`;
            await this.tryItem(async () => await this.instanceDriver.renameRepository(this.orgName, this.NEWREPONAME, newProjectName), `${this.msg.log_5}`);
            newPercent += percent;
            this.setProgress(newPercent);

            const newUrlProject = `${this.urls[this.driverName]}main/${this.orgName}/${newProjectName}/`
            await this.tryItem(async () => { await this.createConfigFile(newProjectId, this.newProjectName, this.driverName, newUrlProject, this.newProjectUpdateMode); }, `${this.msg.log_6}`);
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

    private async simulate() {
        try {
            let percent = 16.6;
            let newPercent = 0;
            this.setProgressError(false);
            this.setProgressFinished(false);
            this.setProgress(newPercent);
            const rc = await this.tryItem(async () => await this.delay2(), this.msg.log_0);
            if (rc === ECheckRepo.RepositoryAlreadyExist) percent = 25;

            newPercent += percent;
            this.setProgress(newPercent);

            if (rc === ECheckRepo.RepositoryInvalid || rc === ECheckRepo.RepositoryInUse) {
                const obj: any = {
                    '03': this.msg.log_error_03,
                    '04': this.msg.log_error_04,
                }
                this.addLog({ pre: this.msg.log_error, log: obj[rc], status: "error" });
                this.setProgressError(true);
                this.toogleForm(false);
                return;
            }

            if (rc === ECheckRepo.RepositoryNonexistent) {
                await this.tryItem(async () => await this.delay(2000), `${this.msg.log_1} ${this.NEWREPONAME} `);
                newPercent += percent;
                this.setProgress(newPercent);

                await this.tryItem(async () => await this.delay(2000), `${this.msg.log_2} ${this.VALIDADEFILE} `);
                newPercent += percent;
                this.setProgress(newPercent);
            }

            await this.tryItem(async () => await this.delay(2000), `${this.msg.log_4}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.tryItem(async () => await this.delay(200), `${this.msg.log_5}`);
            newPercent += percent;
            this.setProgress(newPercent);

            await this.tryItem(async () => await this.delay(2000), `${this.msg.log_6}`);
            newPercent += percent;
            this.setProgress(newPercent);

        } catch (err: any) {
            this.toogleForm(false);
            return;
        }

        this.addLog({ pre: this.msg.log_ok, log: this.msg.log_7, status: "finish" });
        this.setProgressFinished(true);

        this.dispatchEvent(new CustomEvent('collab-new-project', {
            detail: this.PROJECTFIXED, bubbles: true, composed: true
        }));

    }


    private async createConfigFile(project: number, name: string, projectDriver: string, projectURL: string, projectSaveMode: string) {
        const newConfig: mls.l5.ProjectConfig = {
            name,
            projectDriver,
            projectURL,
            projectSaveMode,
            designSystems: [],
            languages: []
        };

        const content = JSON.stringify(newConfig);
        const params = {
            project,
            level: 5,
            shortName: 'project',
            extension: '.json',
            versionRef: '0',
            folder: ''
        };
        const file = await mls.stor.addOrUpdateFile(params);
        file.status = 'new';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType: 'string',
        };
        await mls.stor.localStor.setContent(file, fileInfo);
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
        const userNameCollab = localStorage.getItem('loginUser');
        return userNameCollab;
    }

}

enum ECheckRepo {
    'RepositoryNonexistent' = '01',
    'RepositoryAlreadyExist' = '02',
    'RepositoryInUse' = '03',
    'RepositoryInvalid' = '04'
}
// 01: free to create the repository
// 02: The repository already exists for the user, you can reuse it
// 03: Please wait, another user is creating; 
// 04: There is a repository, but I was unable to validate the user

interface ILogs {
    pre: string,
    log: string,
    status: string
}

interface IOrg {
    name: string,
    id: string,
    avatarUrl: string,
    visibility: string
}