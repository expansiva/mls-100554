/// <mls shortName="pluginCreateProjectLocalToDriver" project="100554" enhancement="_100554_enhancementLit" />

import { html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { gitHubLogin, gitLabLogin, isProviderConnected, gitlabIcon, githubIcon } from '/_100554_/l2/libProviders.js';
import { replaceTripleslashAndTag, createStorFile, IReqCreateStorFile } from '/_100554_/l2/collabLibStor.js';
import { getLocalProjectName, isValidProjectName, setProjectDetails, deleteLastOpenedFiles
 } from '/_100554_/l2/libCommom.js';

import {
  collab_arrows_rotate
} from '/_100554_/l2/collabIcons.js';

import {
  template_package,
  template_build,
  template_tsconfig,
} from '/_100554_/l2/pluginNewProjectTemplate.js';

import '/_100554_/l2/pluginNewProjectLog.js';


/// **collab_i18n_start**
const message_pt = {

  github: 'GitHub',
  gitlab: 'GitLab',
  connect: 'Conectar',
  connected: 'Conectado',
  btnCancel: 'Cancelar',
  btnContinue: 'Continuar',
  btnRefreshOrg: 'Atualizar',

  step1Msg: `Percebemos que seu projeto ainda não está conectado a um gerenciador de versões. 
  Mas não se preocupe, isso é bem simples. 😉
  Basta fazer login com sua conta do GitHub ou GitLab (se ainda não fez) e depois clicar em Continuar.
  Assim, vamos iniciar o projeto diretamente no provedor que você escolher abaixo:`,
  step2Msg: 'Agora selecione a organização e o modo de atualização.',
  step3Msg: 'Finalmente, selecione a equipe e a visibilidade do projeto.',

  errorNeedConnect: 'Você precisa conectar sua conta do {provider} antes de continuar.',
  projectNameLabel: 'Nome do projeto',
  organizationLabel: 'Organização',
  visibilityLabel: 'Visibilidade do projeto',
  visibilityPublicOption: 'Público - Qualquer pessoa pode ver este repositório.',
  visibilityPrivateOption: 'Privado - Você escolhe quem pode ver.',
  teamLabel: 'Time',

  errorPrjNameInvalid: 'O nome do projeto só pode conter letras, números e _ , e deve começar com uma letra',
  errorPrjNameBlank: 'O nome do projeto deve ser preenchido',
  errorOrgNameBlank: 'A organização deve ser selecionada',

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
  log_14: "Setando permissão ao action",
  log_15: "Setando variavel no action",
  log_16: "Renomeando arquivos locais",
  log_error_03: "Por favor espere, outro usuário esta utilizando o repositório.",
  log_error_04: "Existe um repositório, mas não foi possível validar o usuário",
  projectOk1: 'Projeto {project} criado com sucesso',
  projectOk2: 'Agora você pode salvar o seu projeto',
};

const message_en = {
  github: 'GitHub',
  gitlab: 'GitLab',
  connect: 'Connect',
  connected: 'Connected',
  btnCancel: 'Cancel',
  btnContinue: 'Continue',
  btnRefreshOrg: 'Refresh',

  step1Msg: `We noticed your project is not yet connected to a version manager. 
  Don't worry, it's very simple. 😉
  Just log in with your GitHub or GitLab account (if you haven't already) and then click Continue.
  This way, we will start the project directly in the provider you choose below:`,
  step2Msg: 'Now select the organization and the update mode.',
  step3Msg: 'Finally select the team and the visibility of the project.',

  errorNeedConnect: 'You need to connect your {provider} account before continuing.',
  projectNameLabel: 'Project name',
  organizationLabel: 'Organization',
  visibilityLabel: 'Project visibility',
  visibilityPublicOption: 'Public - Anyone can see this repository.',
  visibilityPrivateOption: 'Private - You choose who can see.',
  teamLabel: 'Team',
  errorPrjNameBlank: 'Project name must be filled in',
  errorPrjNameInvalid: 'The project name can only contain letters, numbers and _, and must start with a letter',
  errorOrgNameBlank: 'The organization must be selected',

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
  log_14: "Setting permission to action",
  log_15: "Setting variable in action",
  log_16: "Renaming local files",
  log_error_03: "Please wait, another user is creating; ",
  log_error_04: " There is a repository, but I was unable to validate the user",
  projectOk1: 'Project {project} created sucessfully',
  projectOk2: 'Now you can saving your project',
};

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  en: message_en,
  pt: message_pt
};
/// **collab_i18n_end**

@customElement('plugin-create-project-local-to-driver-100554')
export class PluginCreateProject extends CollabLitElement {
  private msg: MessageType = messages['pt'];

  @state() private selectedProvider?: mls.cbe.Provider;
  @state() private githubConnected = true;
  @state() private gitlabConnected = false;
  @state() private errorMessage: string | null = null;
  @state() actualOrgs: mls.stor.others.IOrg[] = [];
  @state() actualTeams: string[] = [];
  @state() orgSelected: boolean = false;
  @state() isLoadingOrgs = false;
  @state() activeScenerie: IScenerie = 'select';
  @state() logs: ILogs[] = [];
  @state() errorName: string = '';
  @state() errorOrg: string = '';


  @query('.logs-container') logsContainer: HTMLDivElement | undefined;
  @query('.progress-line') progress: HTMLDivElement | undefined;
  @query('form') form: HTMLFormElement | undefined;

  private instanceDriver: mls.stor.others.DriverIOBase | undefined;
  private login: string = '';
  private secret: string = '';
  private orgName: string = '';
  private projectLocalNumber: number = mls.stor.LOCALPROJECTNUMBER;
  private newProjectName: string = getLocalProjectName() || `project${Date.now()}`;
  private newProjectNumber: number = 102014;
  private newProjectTeam: string = 'admin';
  private newProjectVisibility: string = 'public';

  private NEWREPONAME = 'mls-new';
  private VALIDADEFILE = 'validate.json';

  private drivers: Record<string, "GitHub" | "GitLab" | "local" | "mls"> = {
    'github': 'GitHub',
    'gitlab': 'GitLab',
  }

  private urls: Record<string, string> = {
    'github': 'https://github.com/',
    'gitlab': 'https://gitlab.com/',
  }


  async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);
    this.githubConnected = isProviderConnected('github');
    this.gitlabConnected = isProviderConnected('gitlab');
  }

  private handleSelect(provider: 'github' | 'gitlab') {
    this.selectedProvider = provider;
  }

  private handleConnect(provider: 'github' | 'gitlab') {
    if (provider === 'github') {
      gitHubLogin()
    }
    if (provider === 'gitlab') {
      gitLabLogin()
    }
  }

  private async handleContinue() {

    this.errorMessage = '';
    if (!this.selectedProvider) return;

    const isConnected =
      this.selectedProvider === 'github'
        ? this.githubConnected
        : this.gitlabConnected;

    if (!isConnected) {
      const providerName =
        this.selectedProvider === 'github'
          ? this.msg.github
          : this.msg.gitlab;
      this.errorMessage = this.msg.errorNeedConnect.replace('{provider}', providerName);
      return;
    }
    this.isLoadingOrgs = true;
    await this.loadOrgsByDriver(this.selectedProvider);
    this.isLoadingOrgs = false;

    this.activeScenerie = 'form';

  }

  private async loadOrgsByDriver(driver: mls.cbe.Provider) {

    try {
      this.instanceDriver = mls.stor.others.getDriver(driver);
      if (!this.instanceDriver) throw new Error('Invalid driver instance');
      const userInfo = await this.instanceDriver.getUserInfo();
      if (!userInfo.login) throw new Error('Invalid user login');
      this.login = userInfo.login;
      this.actualOrgs = await this.getOrgsByUser(this.login);
    } catch (err: any) {
      // this.errorDriver = err.message;
      console.error(err.message)
    }
  }

  private async getOrgsByUser(user: string) {
    if (!this.instanceDriver) throw new Error('Invalid driver instance');
    const orgs: mls.stor.others.IOrg[] = await this.instanceDriver.getOrganizations(user);
    orgs.unshift({ id: user, name: user, avatarUrl: '', visibility: 'public' });
    return orgs;
  }

  private onOrgChanged(e: MouseEvent) {
    const value = (e.target as HTMLSelectElement).value;
    this.orgName = value;
    if (this.login !== this.orgName) {
      const ref = this.actualOrgs.find((o) => o.id === value);
      if (!ref) throw new Error('Not found orgName');
      this.orgName = ref.name;
    }

    if (value) {
      this.loadTeamByOrg(value);
    }
    this.orgSelected = !!value;

  }

  private async onRefreshOrgsClick(ev: MouseEvent) {
    ev.preventDefault();
    this.actualOrgs = await this.getOrgsByUser(this.login);
    this.requestUpdate();
  }

  private loadTeamByOrg(org: string) {
    this.actualTeams = ['admin']
  }

  private getLoginUser() {
    const userNameCollab = mls.getActualUser();
    return userNameCollab;
  }

  private addLog(log: ILogs) {
    this.logs.push(log);
    this.requestUpdate();
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

  private changeStatusLastLog(status: string, msg?: string) {
    const lastLog = this.logs[this.logs.length - 1];
    if (lastLog) {
      lastLog.status = status;
      lastLog.pre = status === 'finish' ? this.msg.log_ok : this.msg.log_error;
      if (msg) lastLog.log = msg;
      this.requestUpdate();
    }
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

  private toogleForm(disabled: boolean) {
    if (this.form) {
      this.form.classList.toggle('form-disabled')
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private onCancelStep2() {
    this.orgSelected = false;
    this.actualOrgs = [];
    this.activeScenerie = 'select';
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

  private async setPermissionAction(org: string, repo: string) {
    if (this.selectedProvider === 'gitlab' || !this.instanceDriver) return;
    return await (this.instanceDriver as any).setPermissionAction(org, repo, '')
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

  private async createPrjInfo(project: number) {

    const now = new Date().toISOString();

    this.addTempObject(project, {
      fileInfo: [],
      importsMap: '',
      indexModules: '',
      repository_lastModified: now
    });

    const dt = mls.l5.getProjectSettings(project);
    if (!dt) return;
    mls.stor.projects[project] = {
      project,
      projectDependencies: [100554, 102020],
      projectDriver: dt.projectDriver,
      projectURL: dt.projectURL
    };

  }

  private addTempObject(projectId: number, data: {
    fileInfo?: any[],
    importsMap?: string,
    indexModules?: string,
    repository_lastModified?: string,
  }) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("mlsDB", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("tempObjects")) {
          db.createObjectStore("tempObjects");
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction("tempObjects", "readwrite");
        const store = tx.objectStore("tempObjects");

        const key = `Prj_${projectId}`;
        const obj = {
          fileInfo: data.fileInfo ?? [],
          importsMap: data.importsMap ?? "",
          indexModules: data.indexModules ?? "",
          key,
          project: projectId,
          repository_lastModified: data.repository_lastModified ?? new Date().toISOString(),
        };

        const putReq = store.put(obj);

        putReq.onsuccess = () => {
          resolve(obj);
        };

        putReq.onerror = (e) => {
          reject((e.target as IDBRequest).error);
        };
      };

      request.onerror = (e) => {
        reject((e.target as IDBRequest).error);
      };
    });
  }

  private addFileInfoItem(projectId: number, newItem: any) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("mlsDB", 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction("tempObjects", "readwrite");
        const store = tx.objectStore("tempObjects");

        const key = `Prj_${projectId}`;
        const getReq = store.get(key);

        getReq.onsuccess = () => {
          let obj = getReq.result;

          if (!obj) {
            obj = {
              fileInfo: [],
              importsMap: "",
              indexModules: "",
              key,
              project: projectId,
              repository_lastModified: new Date().toISOString(),
            };
          }

          obj.fileInfo = obj.fileInfo || [];
          obj.fileInfo.push(newItem);

          const putReq = store.put(obj);

          putReq.onsuccess = () => resolve(obj);
          putReq.onerror = (e) => reject((e.target as IDBRequest).error);
        };

        getReq.onerror = (e) => reject((e.target as IDBRequest).error);
      };

      request.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  private async migrateAllFiles(storFile: mls.stor.IFileInfo, newProject: number, newShortName: string, newFolder: string, needCompile: boolean = true): Promise<Record<string, mls.stor.IFileInfo>> {

    const ret: Record<string, mls.stor.IFileInfo> = {};
    for await (let ext of ['.ts', '.html', '.less', '.test.ts', '.defs.ts', '.json']) {
      const key = mls.stor.getKeyToFiles(storFile.project, storFile.level, storFile.shortName, storFile.folder, ext);
      if (!mls.stor.files[key]) continue;
      ret[key] = await this.migrateFile(mls.stor.files[key], newProject, newShortName, newFolder, false);
    }
    return ret;
  }

  private async migrateFile(storFile: mls.stor.IFileInfo, newProject: number, newShortName: string, newFolder: string, needCompile: boolean = true): Promise<mls.stor.IFileInfo> {

    let source = await storFile.getContent() as string;
    if (!source) throw new Error('[migrateFile] Impossible rename this file:' + storFile.shortName);
    if (!newFolder) newFolder = storFile.folder;

    if (storFile.level === 2) {
      source = replaceTripleslashAndTag(storFile, newProject, newShortName, newFolder, source);
    }

    const param: IReqCreateStorFile = {
      shortName: newShortName,
      project: newProject,
      folder: newFolder,
      level: storFile.level,
      source: source,
      extension: storFile.extension,
      status: storFile.status === 'new' ? 'new' : 'renamed',
      fileInfo: {
        originalFolder: storFile.folder,
        originalProject: storFile.project,
        originalShortName: storFile.shortName
      }
    }

    const aux = param.level === 2 && param.shortName === 'designSystem';
    const file = await createStorFile(param, aux, aux, aux);

    if (file.level !== 2) {
      file.inLocalStorage = true;
    }
    await this.prepareToAddFileInfo(source.length, file);

    return file;
  }

  private async prepareToAddFileInfo(length: number, file: mls.stor.IFileInfo) {

    const shortPath = `l${file.level}/${file.folder ? file.folder + '/' : ''}${file.shortName}${file.extension}`;
    const data = {
      Length: length,
      shortPath,
      versionRef: file.versionRef
    };

    await this.addFileInfoItem(file.project, data);
  }


  private async deleteOldFiles() {

    const filesToDeleteCache: Set<string> = new Set();
    const keys = Object.keys(mls.stor.files).filter((key) => key.startsWith(`${mls.stor.LOCALPROJECTNUMBER}_`));
    for (let key of keys) {
      const storFile = mls.stor.files[key];
      mls.editor.deleteModels(storFile.project, storFile.shortName, storFile.folder, true, storFile.level);
      await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: null });
      const ext = storFile.extension.replace('.ts', '.js');
      let targetKey = `https://collab.codes/local/_${storFile.project}_${storFile.shortName}${ext}?v=`;
      if (storFile.folder) targetKey = `https://collab.codes/local/_${storFile.project}_${storFile.folder}/${storFile.shortName}${ext}?v=`;
      filesToDeleteCache.add(targetKey);
      delete mls.stor.files[key];
    }

    const cacheName = 'mls-v2';
    const cache = await caches.open(cacheName);
    const keysCache = await cache.keys();
    for (const request of keysCache) {
      for (const targetKey of filesToDeleteCache) {
        if (request.url.includes(targetKey)) {
          await cache.delete(request);
        }
      }
    }

  }

  private async migrateLocalFiles(oldProject: number, newProject: number) {

    await this.createPrjInfo(newProject);
    const keys = Object.keys(mls.stor.files).filter((key) => key.startsWith(`${oldProject}_`));

    const keyOldDesignSystem = `${oldProject}_2_designSystem`
    const keysFiltered = keys.filter(file => file.startsWith(`${oldProject}_5_`) || /\.ts$/.test(file) && !/\.defs\.ts$/.test(file) && !/\.test\.ts$/.test(file));

    const keyDs = keysFiltered.find((key) => key.startsWith(keyOldDesignSystem));
    if (!keyDs) throw new Error('Project must be design system file');
    const storFileDs = mls.stor.files[keyDs];
    if (!storFileDs) throw new Error('Project must be design system file');

    const keysOrdened = keysFiltered
      .filter(file => file.trim().startsWith(`${oldProject}_2_`) && file.trim().endsWith(".ts") || !file.trim().startsWith(`${oldProject}_2_`))
      .sort((a, b) => {
        if (a === `${oldProject}_2_designSystem`) return -1;
        if (b === `${oldProject}_2_designSystem`) return 1;
        return a.localeCompare(b);
      });


    for (let key of keysOrdened) {
      const storFile = mls.stor.files[key];
      const newStorFiles = await this.migrateAllFiles(storFile, newProject, storFile.shortName, storFile.folder, true);
      for (let mode of Object.keys(newStorFiles)) {
        const obj = newStorFiles[mode];
        if (obj && !(obj instanceof Error)) {
          const content = await obj.getContent();
          if (typeof content === 'string') {
            let newContent = '';
            if (obj.level === 5 && obj.shortName === 'project' && obj.extension === '.json') {
              newContent = content.replace(/\[org\]/g, this.orgName);
              await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: newContent });

            } else {
              newContent = await this.replaceSpecificProjectId(content, oldProject.toString(), newProject.toString());
              await mls.stor.localStor.setContent(storFile, { contentType: 'string', content: newContent });
            }
          }
        }
      }
    }

    await this.deleteOldFiles();


  }

  private replaceSpecificProjectId(code: string, oldProjectId: string, newProjectId: string): string {
    const regex = new RegExp(`(?<!\\d)${oldProjectId}(?!\\d)`, "g");
    return code.replace(regex, newProjectId);
  }

  private async createProjecInCollab() {

    if (!this.selectedProvider) {
      throw new Error('Error on create project in collab: invalid provider')
    }

    const userNameCollab: string = this.getLoginUser() as string;
    const param: {
      orgName: string;
      info: mls.cbe.IProjectInfo;
      settings: mls.cbe.IPrj_settings;
    } =
    {
      orgName: this.orgName,
      info: {
        projectDriver: this.drivers[this.selectedProvider],
        projectURL: `${this.urls[this.selectedProvider]}main/${this.orgName}/mls-new/`,
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
      return res;
    } catch (err: any) {
      throw new Error('Error on create project in collab' + err.message)
    }
  }


  private validateForm() {
    let valid = true;

    this.errorMessage = '';
    this.errorOrg = '';
    this.errorName = '';
    const validName: boolean = isValidProjectName(this.newProjectName);
    if (!validName) {
      this.errorName = this.msg.errorPrjNameInvalid;
      valid = false;
    }

    if (!this.newProjectName.trim()) {
      this.errorName = this.msg.errorPrjNameBlank;
      valid = false;
    }

    if (!this.orgName.trim()) {
      this.errorOrg = this.msg.errorOrgNameBlank;
      valid = false;
    }
    return valid;
  }

  private async onCreateProjectClickTest(e: MouseEvent) {
    e.preventDefault();

    if (!this.validateForm()) return;
    this.toogleForm(true);
    await this.updateComplete;

    this.logs = [];

    try {

      const rc: any = 'free';
      let percent = 7.69;
      let newPercent = 0;
      this.setProgressError(false);
      this.setProgressFinished(false);
      this.setProgress(newPercent);

      const simulateFc = async () => {
        await this.sleep(1000);
        return {
          statusCode: 200,
          error: ''
        }
      }

      await this.sleep(1000);
      if (rc === 'reuse') percent = 9.09;

      newPercent += percent;
      this.setProgress(newPercent);

      if (rc === 'error' || rc === 'wait') {
        const obj: any = {
          'wait': this.msg.log_error_03,
          'error': this.msg.log_error_04,
        }
        this.addLog({ pre: this.msg.log_error, log: obj[rc], status: "error" });
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
        }

        // createRepository
        await this.tryItem(simulateFc, `${this.msg.log_1}`);
        newPercent += percent;
        this.setProgress(newPercent);

        // createFileInRepo - validate
        await this.tryItem(simulateFc, `${this.msg.log_2}`);
        newPercent += percent;
        this.setProgress(newPercent);


      }

      this.secret = this.getUniquePassword();

      // createProjectInCollab
      await this.tryItem(simulateFc, `${this.msg.log_3}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // Alterando visibilidade
      await this.tryItem(simulateFc, `${this.msg.log_4}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // renomeando
      await this.tryItem(simulateFc, `${this.msg.log_5}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // adiconando permissao action
      await this.tryItem(simulateFc, `${this.msg.log_14}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // adicionando variavel action
      await this.tryItem(simulateFc, `${this.msg.log_15}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // criando readme
      await this.tryItem(simulateFc, `${this.msg.log_8}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // criando build file
      await this.tryItem(simulateFc, `${this.msg.log_10}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // criando package file
      await this.tryItem(simulateFc, `${this.msg.log_9}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // criando tsconfig file
      await this.tryItem(simulateFc, `${this.msg.log_11}`);
      newPercent += percent;
      this.setProgress(newPercent);

      // renomeando arquivos locais
      await this.tryItem(async () => await this.migrateLocalFiles(this.projectLocalNumber, this.newProjectNumber), this.msg.log_16);
      newPercent += percent;
      this.setProgress(newPercent);


      this.addLog({ pre: this.msg.log_ok, log: this.msg.log_7, status: "finish" });
      this.setProgressFinished(true);

      this.setProjectActual(this.newProjectNumber);
      this.setOrgActual(this.newProjectNumber);

      this.dispatchEvent(
        new CustomEvent('project-local-created', {
          bubbles: true,
          composed: true
        })
      );


    } catch (err: any) {
      this.toogleForm(false);
    }

  }

  private async onCreateProjectClick(e: MouseEvent) {

    e.preventDefault();
    if (!this.validateForm()) return;
    this.toogleForm(true);
    this.logs = [];

    const userNameCollab: string = this.getLoginUser() as string;
    if (!userNameCollab) {
      this.addLog({ pre: 'Error', log: 'User name not found', status: "error" });
      this.toogleForm(false);
      this.setProgressError(true);
      this.setProgressFinished(true);
      return;
    }

    try {
      let percent = 7.69;
      let newPercent = 0;
      this.setProgressError(false);
      this.setProgressFinished(false);
      this.setProgress(newPercent);

      const rc: "error" | "reuse" | "wait" | "free" = await this.tryItem(async () => await this.instanceDriver?.verifyRepositoryNew(this.login, this.NEWREPONAME, userNameCollab), `${this.msg.log_0} ${this.NEWREPONAME}`);
      if (rc === 'reuse') percent = 9.09;

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

      this.newProjectNumber = await this.tryItem(this.createProjecInCollab.bind(this), `${this.msg.log_3}`);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      if (this.newProjectVisibility === 'private') await this.tryItem(async () => await this.instanceDriver?.changeVisibility(this.orgName, this.NEWREPONAME, 'PRIVATE'), `${this.msg.log_4}`);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      const newProjectName = `mls-${this.newProjectNumber}`;
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
      await this.tryItem(async () => await this.createInitialReadMe(this.newProjectNumber), this.msg.log_8);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      await this.tryItem(async () => await this.createInitialBuildFile(this.newProjectNumber), this.msg.log_10);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      await this.tryItem(async () => await this.createInitialPackageFile(this.newProjectNumber), this.msg.log_9);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      await this.tryItem(async () => await this.createInitialTSConfigFile(this.newProjectNumber), this.msg.log_11);
      newPercent += percent;
      this.setProgress(newPercent);

      await this.sleep(200);
      await this.tryItem(async () => await this.migrateLocalFiles(this.projectLocalNumber, this.newProjectNumber), this.msg.log_16);
      newPercent += percent;
      this.setProgress(newPercent);


      this.setProjectActual(this.newProjectNumber);
      this.setOrgActual(this.newProjectNumber);
      this.deleteLastOpenedFileOnLocalStorage();

      this.dispatchEvent(
        new CustomEvent('project-local-created', {
          bubbles: true,
          composed: true
        })
      );


    } catch (err: any) {

      this.toogleForm(false);
    }

    this.addLog({ pre: this.msg.log_ok, log: this.msg.log_7, status: "finish" });
    this.setProgressFinished(true);

  }

  private setProjectActual(project: number) {
    mls.setActualProject(project);
    setProjectDetails(project);
  }

  private setOrgActual(project: number | undefined): void {
    if (!project) return;
    const orgIndex = mls.l5.getProjectOrgIndex(project);
    mls.l5.setActualOrg(orgIndex);
  }

  private deleteLastOpenedFileOnLocalStorage() {
    deleteLastOpenedFiles(mls.stor.LOCALPROJECTNUMBER)
  }

  private renderSelectProvider() {
    return html`
      <section class="container-select">
        <p class="banner">${this.msg.step1Msg}</p>

        <div class="providers">
          <label class="provider">
            <input
              type="radio"
              name="provider"
              .checked=${this.selectedProvider === 'github'}
              @change=${() => this.handleSelect('github')}
            />
            <span class="icon">
                ${githubIcon()}
            </span>
            <span>
              ${this.msg.github}
              ${this.githubConnected
        ? html`<span class="connected">(${this.msg.connected}) ✔️</span>`
        : html`<button type="button" class="connect-btn" @click=${() => this.handleConnect('github')}>${this.msg.connect}</button>`}
            </span>
          </label>

          <label class="provider">
            <input
              type="radio"
              name="provider"
              .checked=${this.selectedProvider === 'gitlab'}
              @change=${() => this.handleSelect('gitlab')}
            />
            <span class="icon">
              ${gitlabIcon()}
            </span>
            <span>
              ${this.msg.gitlab}
              ${this.gitlabConnected
        ? html`<span class="connected">(${this.msg.connected}) ✔️</span>`
        : html`<button type="button" class="connect-btn" @click=${() => this.handleConnect('gitlab')}>${this.msg.connect}</button>`}
            </span>
          </label>
        </div>

        <div class="actions">
          <button
            type="button"
            class="continue"
            ?disabled=${!this.selectedProvider || this.isLoadingOrgs}
            @click=${this.handleContinue}
          >
              ${this.isLoadingOrgs ? html`<span class="loader"></span>` : this.msg.btnContinue}
          </button>
        </div>

        ${this.errorMessage
        ? html`<p class="error-msg">${this.errorMessage}</p>`
        : null}
      </section>
    `
  }

  private renderCreateProject() {
    return html`
      <section class="container-create">
        <form>
        <div>
            <label>${this.msg.projectNameLabel}</label>
              <input 
              type="text" 
              .value=${this.newProjectName} 
              @input=${(e: Event) => this.newProjectName = (e.target as HTMLInputElement).value} 
            />
            ${this.errorName
        ? html`<div class="error-msg">${this.errorName}</div>`
        : ''}
            
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
            ${this.errorOrg
        ? html`<div class="error-msg">${this.errorOrg}</div>`
        : ''}
        </div>
        ${this.orgSelected ? html`
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
        `: ''}
        <div class="actions">
            <button
              type="button"
              class="cancel"
              @click=${this.onCancelStep2}
            >
            ${this.msg.btnCancel}
              
            </button>
            <button
              type="button"
              class="continue"
              @click=${this.onCreateProjectClick}
            >
            ${this.msg.btnContinue}
            </button>
          </div>
          </form>

          ${this.renderLogs()}


      </section>`
  }

  private renderLogs() {

    if (!this.logs || this.logs.length === 0) return html``;

    return html`
        <div class="container-logs">
            <div class="progress">
                <div class="progress-line"></div>
            </div>
            ${this.logs.map((log) => html`<plugin-new-project-log-100554 status=${log.status} text=${log.pre}:${log.log}></plugin-new-project-log-100554>`)}
        </div>
        `;
  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    return this.renderScenaries();
  }

  renderScenaries() {
    switch (this.activeScenerie) {
      case 'select':
        return this.renderSelectProvider();
      case 'form':
        return this.renderCreateProject();
      default:
        return html``;
    }
  }


}


interface ILogs {
  pre: string,
  log: string,
  status: string
}

type IScenerie = 'select' | 'form' 
