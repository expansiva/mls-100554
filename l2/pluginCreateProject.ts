/// <mls shortName="pluginCreateProject" project="100554" enhancement="_100554_enhancementLit" />

import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { createAllFiles, IReqCreateAllFiles } from './_100554_collabLibStor';
import { createConfigFile } from './_100554_libProjectConfig';
import { createModel } from './_100554_collabLibModel';
import { addMessage, createThread } from './_100554_collabMessageHelper';
import { getThreadByName } from './_100554_msgDBController';
import { setProjectDetails, checkIfHasLocalProject, setLocalProjectName, isValidProjectName } from './_100554_libCommom';

import {
  template_ds,
  template_l5Project,
  template_l2Project
} from './_100554_pluginNewProjectTemplate';

/// **collab_i18n_start**
const message_pt = {
  createProjectTitle: 'Criar projeto',
  createProjectHelper: 'Por favor escolha o tipo de projeto abaixo e pressione continuar.',
  labelName: 'Nome do projeto',
  optionBlank: 'Projeto em branco',
  optionPrompt: 'Iniciar com prompt',
  promptPlaceholder: 'Digite seu prompt aqui...',
  banner: `Seu projeto de teste será criado aqui no navegador. 😊
Ele não terá controle de versão, backup ou compartilhamento, mas você pode explorar e testar tudo localmente à vontade.
Quando estiver pronto, poderá salvar o projeto no GitHub, GitLab ou em outro repositório, de acordo com o seu plano.
⚠️ Atenção: use apenas para testes. Não utilize em produção antes de salvar e fazer backup.`,
  btnCancel: 'Cancelar',
  btnCreate: 'Criar projeto',
  errorPrjNameBlank: 'O nome do projeto deve ser preenchido',
  errorPrjNameInvalid: 'O nome do projeto só pode conter letras, números e _ , e deve começar com uma letra',
  errorPrjPrompt: 'O prompt deve ser preenchido',
  alreadyHasProjectLocal: 'Um projeto de teste já existe, não é possível criar outro.',
  projectOk1: 'Projeto local criado com sucesso',
  projectOk2: 'Agora você pode começar a alterar seu novo projeto',
  btnContinue: 'Continuar',

};

const message_en = {
  createProjectTitle: 'Create project',
  createProjectHelper: 'Please choose your project type below and press continue.',
  labelName: 'Project name',
  optionBlank: 'Blank project',
  optionPrompt: 'Start with prompt',
  promptPlaceholder: 'Type your prompt here...',
  banner: `Your test project will be created right here in the browser. 😊
It won't have version control, backup, or sharing, but you can freely explore and test everything locally.
When you're ready, you can save the project to GitHub, GitLab, or another repository, depending on your plan.
⚠️ Warning: for testing only. Do not use in production before saving and creating a backup.`,
  btnCancel: 'Cancel',
  btnCreate: 'Create Project',
  errorPrjNameBlank: 'Project name must be filled in',
  errorPrjNameInvalid: 'The project name can only contain letters, numbers and _, and must start with a letter',
  errorPrjPrompt: 'Prompt must be filled in',
  alreadyHasProjectLocal: 'A test project already exists, you cannot create another one.',
  projectOk1: 'Local project created successfully',
  projectOk2: 'Now you can start editing your new project',
  btnContinue: 'Continue',

};

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  en: message_en,
  pt: message_pt
};
/// **collab_i18n_end**

@customElement('plugin-create-project-100554')
export class PluginCreateProject extends CollabLitElement {
  private msg: MessageType = messages['pt']; // default pt

  @property({ type: String }) currentScenario: IScenaries = 'select';

  @state() projectName: string = '';
  @state() projectType: 'blank' | 'prompt' = 'prompt';
  @state() projectPrompt: string = '';
  @state() errorName: string = '';
  @state() errorPrompt: string = '';
  @state() alreadyHasProjectLocal: boolean = false;
  @state() isLoading: boolean = false;
  @state() projectCreatedSucessfully: boolean = false;

  private projectNumber = mls.stor.LOCALPROJECTNUMBER;
  private agentName = 'agentGeneratePrototype';

  firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProperties);
    this.alreadyHasProjectLocal = checkIfHasLocalProject()
  }

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    return html`
      <section class="plugin-create-project-100554">
        ${this.renderScenario()}
      </section>
    `;
  }

  private renderScenario() {
    switch (this.currentScenario) {
      case 'select':
        return this.renderSelect();
    }
  }

  private renderSelect() {

    if (this.alreadyHasProjectLocal) {
      return html`
        <div>
            ${this.msg.alreadyHasProjectLocal}
        </div>
      `
    }

    if (this.projectCreatedSucessfully) {
      return html`
        ${this.renderProjectCreatedOk()}
      `
    }
    return html`
      <h2>${this.msg.createProjectTitle}</h2>
      <p>${this.msg.createProjectHelper}</p>

      <label>
        ${this.msg.labelName}
        <input 
          type="text" 
          .value=${this.projectName} 
          @input=${(e: Event) => this.projectName = (e.target as HTMLInputElement).value} 
        />
      </label>
       ${this.errorName
        ? html`<div class="error">${this.errorName}</div>`
        : ''}
        
      <div class="options">
        <label>
          <input 
            type="radio" 
            name="projectType" 
            value="prompt"
            ?checked=${this.projectType === 'prompt'}
            @change=${() => this.projectType = 'prompt'}
          />
          ${this.msg.optionPrompt}
        </label>

        <label>
          <input 
            type="radio" 
            name="projectType" 
            value="blank"
            ?checked=${this.projectType === 'blank'}
            @change=${() => this.projectType = 'blank'}
          />
          ${this.msg.optionBlank}
        </label>


      </div>

      ${this.projectType === 'prompt' ? html`
        <textarea 
          placeholder=${this.msg.promptPlaceholder}
          .value=${this.projectPrompt}
          @input=${(e: Event) => this.projectPrompt = (e.target as HTMLTextAreaElement).value}
        ></textarea>
        ${this.errorPrompt ? html`<div class="error">${this.errorPrompt}</div>` : ''}
      ` : ''}

      <div class="banner">
        <pre>${this.msg.banner}</pre>
      </div>

      <div class="actions">
        <button @click=${this.handleCancel}>${this.msg.btnCancel}</button>
        <button
          class="primary"
          @click=${this.handleCreate}
          ?disabled=${this.isLoading}
          >
            ${this.isLoading ? html`<span class="loader"></span>` : this.msg.btnCreate}
        </button>
      </div>
    `;
  }

  private renderProjectCreatedOk() {
    return html`
      <div class="container-success">
            <div class="text-center">
                <div class="success-icon">
                    <div class="success-icon__tip"></div>
                    <div class="success-icon__long"></div>
                </div>
                <h1>${this.msg.projectOk1}</h1>
                <h5 class="text-muted">${this.msg.projectOk2}</h5>
            </div>
            <div class="actions">
                <button
                  type="button"
                  class="continue"
                  @click=${() => { window.location.reload() }}
                >${this.msg.btnContinue}</button>
            </div>
        </div>
    
    `
  }

  private handleCancel() {
    console.log("Cancel clicked");
  }

  private validateForm(): boolean {
    let valid = true;
    this.errorName = '';
    this.errorPrompt = '';

    const validName: boolean = isValidProjectName(this.projectName);

    if (!validName) {
      this.errorName = this.msg.errorPrjNameInvalid;
      valid = false;
    }

    if (!this.projectName.trim()) {
      this.errorName = this.msg.errorPrjNameBlank;
      valid = false;
    }

    if (this.projectType === 'prompt' && !this.projectPrompt.trim()) {
      this.errorPrompt = this.msg.errorPrjPrompt;
      valid = false;
    }

    return valid;
  }

  private async handleCreate() {

    if (!this.validateForm()) {
      console.warn("Form invalid");
      return;
    }

    this.isLoading = true;
    try {
      await this.createFiles();
    }
    catch (err: any) {
      console.info(err.message)
    } finally {
      this.isLoading = false;
    }
  }

  private setProjectActual(project: number) {
    mls.setActualProject(project);
    setProjectDetails(project);
  }

  private async createFiles() {
    await this.createInitialProject(this.projectNumber);
    await this.createInitialDSFile(this.projectNumber);
    await this.createInitialConfigL5File(this.projectNumber);

    this.setProjectActual(this.projectNumber);
    setLocalProjectName(this.projectName);

    if (this.projectType === 'prompt') {
      const threadProjectName = `_${this.projectNumber}_${this.projectName}`
      let thread = await getThreadByName(threadProjectName);
      if (!thread) {
        thread = await createThread(threadProjectName, [], 'company');
      }
      const messageForAgent = `@@${this.agentName} ${this.projectPrompt}`;
      if (!thread) {
        throw new Error('No find thread, try again');
      }
      await addMessage(thread.threadId, messageForAgent);
      mls.events.fire([mls.actualLevel], 'collabMessages' as any, JSON.stringify({ threadId: thread.threadId, taskId: 'last', type: 'thread-open' }))
    }

    this.projectCreatedSucessfully = true;
  }

  private async createInitialProject(project: number) {

    const fileName = 'project';
    const content = template_l2Project.template.trim().replace(/\[project\]/g, project.toString());
    await this.createNewFileL2(fileName, content);
    const key = mls.stor.getKeyToFiles(project, 2, fileName, '', '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) throw new Error('Invalid stor file');
    createModel(storFile, true, true);
  }

  private async createInitialConfigL5File(project: number) {
    await createConfigFile(project);
  }

  private async createInitialDSFile(project: number) {
    const fileName = 'designSystem';
    const content = template_ds.template.trim().replace(/\[project\]/g, project.toString());
    await this.createNewFileL2(fileName, content);
    const key = mls.stor.getKeyToFiles(project, 2, fileName, '', '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) throw new Error('Invalid stor file');
    createModel(storFile, true, true);
  }

  private async createNewFileL2(shortName: string, content: string) {

    const folder: string = '';
    const enhancement: string = '_blank';
    const param = {
      shortName: shortName,
      project: this.projectNumber,
      folder,
      enhancement,
      level: 2,
      tsSource: content
    } as IReqCreateAllFiles;
    await createAllFiles(param, false, false);
  }

}

type IScenaries = 'select';
