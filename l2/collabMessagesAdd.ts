/// <mls shortName="collabMessagesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { addThread, updateThread } from './_100554_msgDBController';
import { notifyThreadChange, notifyThreadCreate, getTemporaryContext } from './_100554_aiAgentHelper';
import { CollabInputTag } from './_100554_collabInputTag';
import { getUserId, getDmThreadByUsers, addMessage, createThreadDM } from './_100554_collabMessageHelper';
import { IAgent } from './_100554_aiAgentBase'
import './_100554_collabInputTag';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    threadType: 'Tipo de thread',
    threadName: 'Nome da thread',
    dmUser: 'Usuário (DM)',
    channelTemplate: 'Template do canal',
    visibility: 'Visibilidade',
    visibilityPublic: 'Pública',
    visibilityPrivate: 'Privada',
    visibilityCompany: 'Empresa',
    visibilityTeam: 'Time',
    group: 'Grupo',
    languages: 'Tradução automática nos idiomas',
    languagesHint: 'A cada mensagem será verificado o idioma da mensagem e feito a tradução para os idiomas acima, deixe em branco para não gastar créditos.',
    validateFormError: 'Preencha todos os campos obrigatórios.',
    userError: 'ID de usuário inválido.',
    btnAdd: 'Adicionar thread',
    advanced: 'Configurações avançadas',
    successSaving: 'Alterações salvas com sucesso!',
    dmValidationError: "Usuário inválido",
    channelValidationError: "O nome do canal deve começar com '#'.",
    selectAgent: 'Escolha um AgentBot (opcional)',
    noneAgent: 'Nenhum – Sem agente automático',
    initialMessage: 'Mensagem inicial (opcional)',
    placeholderMessage: 'Escreva aqui uma mensagem de abertura...',
    suggestions: ['Mensagem de boas-vindas', 'Regras do canal', 'Links de ajuda'],
    topics: 'Tópicos iniciais',
    agentConfig: 'Configuração do agente',
    placeholderConfig: 'Explique como o agente deve funcionar...',
    back: 'Voltar',
    save: 'Salvar Detalhes',
    threadDmAlreadyExist: 'Já existe uma conversa direta com este usuário.',
    placeholderMessageAvatar: 'Digite aqui sua descrição..',
    avatarUrl: 'Gerar avatar com IA (opcional)',
    detailsBot: 'Instalar bot ',
    detailsInitialMessage: 'Configurar mensagem inicial',
    detailsIcon: 'Configurar ícone',
    threadNameInvalid: 'O nome deve começar com #',
    selectUser: 'Selecione um usuário',
}

const message_en = {
    loading: 'Loading...',
    threadType: 'Thread type',
    threadName: 'Thread name',
    dmUser: 'User (DM)',
    channelTemplate: 'Channel template',
    visibility: 'Visibility',
    visibilityPublic: 'Public',
    visibilityPrivate: 'Private',
    visibilityCompany: 'Company',
    visibilityTeam: 'Team',
    group: 'Group',
    languages: 'Automatic translation in multiple languages',
    languagesHint: 'For each message, the language will be detected and translated into the languages above. Leave blank to avoid spending credits.',
    validateFormError: 'Please fill in all required fields.',
    userError: 'Invalid user ID.',
    advanced: 'Advanced settings',
    btnAdd: 'Add thread',
    successSaving: 'Saved successfully!',
    dmValidationError: "Invalid user",
    channelValidationError: "Channel name must start with '#'.",
    selectAgent: 'Select an AgentBot (opcional)',
    noneAgent: 'None – No automatic agent',
    initialMessage: 'Initial message (optional)',
    placeholderMessage: 'Write an opening message here...',
    suggestions: ['Welcome message', 'Rules', 'Help links'],
    topics: 'Initial topics',
    agentConfig: 'Agent configuration',
    placeholderConfig: 'Explain how the agent should work...',
    back: 'Back',
    save: 'Save Details',
    threadDmAlreadyExist: 'A direct message thread with this user already exists.',
    placeholderMessageAvatar: "Type your description here...",
    avatarUrl: 'Generate avatar with AI (opcional)',
    detailsBot: 'Install bot',
    detailsInitialMessage: 'Set up initial message',
    detailsIcon: 'Set up icon',
    threadNameInvalid: 'The name must start with #',
    selectUser: 'Select a user',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = { en: message_en, pt: message_pt };
/// **collab_i18n_end**

@customElement('collab-messages-add-100554')
export class CollabMessagesAdd100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @state() private threadType: 'dm' | 'channel' = 'dm';
    @state() private threadName: string = '';
    @state() private visibility: mls.msg.ThreadVisibility = 'private';
    @state() private group: mls.msg.ThreadGroup = 'CRM';
    @state() private languages: string[] = [];
    @state() private isLoading: boolean = false;
    @state() private dmUser: string = ''
    @state() private users: {
        userId: string;
        name: string;
    }[] = [];

    @state() agentsBots: IAgentsBots[] = [];
    @state() _selectedAgent: string = 'none';
    @state() _initialMessage: string = '';
    @state() _topics: string[] = [];
    @state() _agentConfig: string = '';
    @state() _promptToAvatar: string = '';

    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() userId: string | undefined;


    @query('#languageInput') languageInput?: CollabInputTag;

    onAddSuccess: Function | undefined;

    async firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        await this.loadUsersAvaliables();
        await this.loadAgentsBotsAvaliables();
    }

    render() {
        return this._renderAdd();
    }

    private async loadUsersAvaliables() {
        const userId = getUserId();
        if (!userId) return;
        const res = await mls.api.msgGetUsers({ status: "active", prefixName: "", userId });
        if (res.statusCode !== 200) return;
        this.users = res.users;
    }

    private async loadAgentsBotsAvaliables() {

        const agentsFiles = await this.getAgentsFiles();
        const agents = agentsFiles.map((data: IAgentsList) => {
            const { visibility, agentName, avatar_url, agentDescription, scope } = data.agent;
            const { project, folder, shortName } = data.storFile;

            if (agentName.startsWith('agentBot') && agentName !== 'agentBotInstall' && visibility === 'public') {
                return {
                    id: agentName, name: agentName, description: agentDescription, avatar_url: avatar_url, info: { project, folder, shortName }
                }
            }


        }).filter((item) => item !== undefined);

        this.agentsBots = [{ id: 'none', name: '', description: '', avatar_url: '' }].concat(agents as IAgentsBots[]);

    }

    private async getAgentsFiles(): Promise<IAgentsList[]> {
        const keys = Object.keys(mls.stor.files);
        const ret: IAgentsList[] = [];
        for await (const k of keys) {
            if (k.indexOf('agent') < 0) continue;
            const storFile = mls.stor.files[k];
            const path = storFile.folder ? `./_${storFile.project}_${storFile.folder}/${storFile.shortName}` : `./_${storFile.project}_${storFile.shortName}`;
            if (storFile.extension !== '.ts' || !storFile.shortName.startsWith('agent')) continue;
            try {
                const mdl = await import(path);
                if (!mdl.createAgent) continue;
                const agent = mdl.createAgent() as IAgent
                ret.push({ agent, storFile });
            } catch (err) {
                continue;
            }
        }
        return ret;
    }

    private _renderAdd() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <div class="section-add-thread">

            <label>${this.msg.threadType}
                <select 
                    .value=${this.threadType}
                    @change=${(e: Event) => this.threadType = (e.target as HTMLSelectElement).value as 'dm' | 'channel'}>
                    <option value="dm">DM</option>
                    <option value="channel">Channel</option>
                </select>
            </label>


            ${this.threadType === 'dm' ? html`
                <label>
                    ${this.msg.dmUser}
                    <select
                        .value=${this.dmUser}
                        @change=${(e: Event) => this.dmUser = (e.target as HTMLSelectElement).value}>
                        <option value="" disabled selected>${this.msg.selectUser}</option>
                        ${this.users.map(user => html`
                            <option value="${user.userId}">@${user.name}</option>
                        `)}
                    </select>
                </label>
            ` : ''}

            ${this.threadType === 'channel' ? html`
                <label>${this.msg.threadName}
                    <input type="text" placeholder="#nome-do-canal"
                        .value=${this.threadName}
                         pattern="^#.*"
                        @input=${(e: Event) => this.threadName = (e.target as HTMLInputElement).value}
                    >
                    <span class="field-thread-name-error">${this.msg.threadNameInvalid}</span>
                </label>
            ` : ''}

            ${this.threadType === 'channel' ? html`
                <label> ${this.msg.visibility}
                <select name="visibility" required
                    .value=${this.visibility}
                    @change=${(e: Event) => this.visibility = (e.target as HTMLSelectElement).value as mls.msg.ThreadVisibility}>
                      <option value="public">${this.msg.visibilityPublic}</option>
                    <option value="private">${this.msg.visibilityPrivate}</option>
                    <option value="company">${this.msg.visibilityCompany}</option>
                    <option value="team">${this.msg.visibilityTeam}</option>
                </select>
                </label>            
            `: ''}
            
            <label> ${this.msg.group}
                <select name="group" required
                    .value=${this.group}
                    @change=${(e: Event) => this.group = (e.target as HTMLSelectElement).value as mls.msg.ThreadGroup}>
                    <option value="CRM">CRM</option>
                    <option value="TASK">TASK</option>
                    <option value="DOCS">DOCS</option>
                    <option value="CONNECT">CONNECT</option>
                    <option value="APPS">APPS</option>
                </select>
            </label>

            <label> ${this.msg.languages}
                <collab-input-tag-100554 
                    pattern="^[a-z]{2}$|^[a-z]{2}-[A-Z]{2}$"
                    .value=${this.languages.join(',')}
                    .onValueChanged=${(value: string) => this.languages = value.split(',')}
                    id="languageInput"
                ></collab-input-tag-100554>
                <small> ${this.msg.languagesHint}</small>
            </label>

        
            ${this.threadType === 'channel' ? html`
                <div class="section-thread-details">
                    ${this.renderBotsConfig()}
                    ${this.renderInitialMessageConfig()}
                    ${this.renderIconConfig()}

                </div>
                <br>
                <br>
            ` : ''}

            <button
                @click=${this.addNewThread}
                ?disabled=${this.isLoading}
                >
                ${this.isLoading ? html`<span class="loader"></span>` : this.msg.btnAdd}
            </button>

            ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
            ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}   
        </div>`;
    }

    private renderBotsConfig() {
        return html`
            <details>
                <summary>${this.msg.detailsBot}</summary>
                <div>
                    <label>${this.msg.selectAgent}</label>
                    <select @change=${(e: Event) => this._selectedAgent = (e.target as HTMLSelectElement).value}>
                        ${this.agentsBots.map(agent => html`
                            <option 
                                value=${agent.id} 
                                ?selected=${this._selectedAgent === agent.id}>
                                ${agent.name}${agent.description ? ` - ${agent.description}` : ''}
                            </option>
                        `)}
                    </select>
                    ${this._selectedAgent && this._selectedAgent !== 'none' ? html`
                        <label>${this.msg.agentConfig}</label>
                        <textarea 
                            rows="5" 
                            .value=${this._agentConfig}
                            placeholder=${this.msg.placeholderConfig}
                            @input=${(e: Event) => this._agentConfig = (e.target as HTMLTextAreaElement).value}
                        ></textarea>
                ` : ''}
                </div>
            </details>
        `
    }

    private renderInitialMessageConfig() {
        return html`
            <details>
                <summary>${this.msg.detailsInitialMessage}</summary>
                <div>
                    <label>${this.msg.initialMessage}</label>
                    <textarea 
                        rows="5" 
                        .value=${this._initialMessage}
                        placeholder=${this.msg.placeholderMessage}
                        @input=${(e: Event) => this._initialMessage = (e.target as HTMLTextAreaElement).value}
                    ></textarea>
                </div>
            </details>            
        `
    }

    private renderIconConfig() {
        return html`
            <details>
                <summary>${this.msg.detailsIcon}</summary>
                <div>
                    <label>${this.msg.avatarUrl}</label>
                    <textarea 
                        rows="5" 
                        .value=${this._promptToAvatar}
                        placeholder=${this.msg.placeholderMessageAvatar}
                        @input=${(e: Event) => this._promptToAvatar = (e.target as HTMLTextAreaElement).value}
                    ></textarea>
                </div>
            </details>            
        `
    }

    private validateForm(): boolean {
        if (this.threadType === 'dm') {
            if (!this.dmUser.trim()) return false;
            const userValid = this.users.find((user) => user.userId === this.dmUser);
            if (!userValid) {
                this.labelError = this.msg.dmValidationError;
                return false;
            }
        }

        if (this.threadType === 'channel') {
            if (!this.threadName.trim()) return false;
            if (!this.threadName.startsWith('#')) {
                this.labelError = this.msg.channelValidationError;
                return false;
            }
        }

        if (!this.group) return false;
        if (!this.visibility) return false;

        return true;
    }

    private async addNewThread() {

        if (!this.validateForm() || this.languageInput?.hasError) {
            this.labelError = this.msg.validateFormError;
            this.isLoading = false;
            return;
        }

        if (!this.userId) {
            this.labelError = this.msg.userError;
            this.isLoading = false;
            return;
        }

        let avatar_url = '';

        if (this.threadType === 'channel' && this._selectedAgent !== 'none') {
            const botSelected = this.agentsBots.find((item) => item.id === this._selectedAgent);
            avatar_url = botSelected?.avatar_url || ''
        } else {
            this._topics = [];
            this._initialMessage = '';
            this._selectedAgent = '';
        }

        this.isLoading = true;

        if (this.threadType === 'dm') {

            const alreadyExistThread = await getDmThreadByUsers(this.userId, this.dmUser);
            if (alreadyExistThread) {
                this.labelError = this.msg.threadDmAlreadyExist;
                this.isLoading = false;
                return;
            }
        }

        const threadName = this.threadType === 'dm' ? `@${this.users.find((user) => user.userId === this.dmUser)?.name}` : this.threadName;

        if (this.threadType === 'dm') {
            try {
                const thread = await createThreadDM(threadName, this.dmUser, this.group);
                if (this.onAddSuccess) this.onAddSuccess();
            } catch (err: any) {
                console.error(err);
                this.labelError = err.message;
            } finally {
                this.isLoading = false;
            }

        }

        if (this.threadType === 'channel') {

            const params: mls.msg.RequestAddThread = {
                action: 'addThread',
                name: threadName,
                group: this.group,
                languages: this.languages,
                userId: this.userId,
                visibility: this.visibility,
                status: 'active',
                avatar_url,
                wellcomeMessage: this._initialMessage,
                defaultTopics: this._topics || [],
            };

            try {
                const response = await mls.api.msgAddThread(params);
                if (response.thread) {
                    const thr = await addThread(response.thread);
                    notifyThreadCreate(thr);
                    if (this._selectedAgent && this._selectedAgent !== 'none') {
                        await this.addBot(response.thread.threadId, this.userId);
                    }

                    if (this._promptToAvatar) {
                        await this.generateAvatar(response.thread.threadId, this.userId);

                    }
                    if (this.onAddSuccess) this.onAddSuccess();

                }

            } catch (err: any) {
                console.error(err);
                this.labelError = err.message;
            } finally {
                this.isLoading = false;
            }
        }


    }

    private async addBot(threadId: string, userId: string) {
        const botSelected = this.agentsBots.find((item) => item.id === this._selectedAgent);
        if (!botSelected || !botSelected.info) return;
        await addMessage(threadId, `@@BotInstall {"projectId":${botSelected.info.project}, "shortName":"${botSelected.info.shortName}", "folder":${botSelected.info.folder || '""'}}`);

        if (this._agentConfig) {

            const threadWithBot = await mls.api.msgGetThreadUpdate({
                threadId,
                userId
            });

            if (threadWithBot && threadWithBot.thread.bots) {
                const botInfo = threadWithBot.thread.bots.find((bot) => bot.botId === botSelected.id);
                if (botInfo) {
                    const res = await mls.api.msgAddOrUpdateThreadBot({
                        botId: botSelected.id,
                        config: { 'agentConfiguration': this._agentConfig },
                        llmPrompt: botInfo.llmPrompt,
                        status: 'active',
                        threadId,
                        userId
                    });
                    notifyThreadChange(res.thread);
                    if (this.onAddSuccess) this.onAddSuccess();
                }

            } else {
                notifyThreadChange(threadWithBot.thread);
                if (this.onAddSuccess) this.onAddSuccess();
            }

        }
    }

    private async generateAvatar(threadId: string, userId: string) {
        try {
            const agentName = '_100554_agentGenerateAvatarSvg';
            const moduleAgent = await import(`/${agentName}`);
            if (!moduleAgent?.createAgent || typeof moduleAgent.createAgent !== 'function') {
                throw new Error('Invalid agent');
            }

            const agent: IAgent = moduleAgent.createAgent();
            const context = getTemporaryContext(threadId, userId, this._promptToAvatar);
            await agent.beforePrompt(context);

            if (context.task &&
                context.task.iaCompressed &&
                context.task.iaCompressed.nextSteps &&
                context.task.iaCompressed.nextSteps[0] &&
                context.task.iaCompressed.nextSteps[0].interaction &&
                context.task.iaCompressed.nextSteps[0].interaction.payload &&
                context.task.iaCompressed.nextSteps[0].interaction.payload[0]

            ) {

                const svg: string = (context.task.iaCompressed?.nextSteps[0]?.interaction?.payload[0] as mls.msg.AIFlexibleResultStep).result
                if (svg && typeof svg === 'string') {
                    const args: mls.msg.RequestUpdateThread = {
                        action: 'updateThread',
                        threadId,
                        userId,
                        avatar_url: svg
                    };
                    const response = await mls.api.msgUpdateThread(args);
                    if (response.statusCode !== 200) {
                        this.labelError = `${response.msg}`;
                    } else {
                        const threadCache = await updateThread(threadId, response.thread)
                        notifyThreadChange(threadCache);
                    }
                }
            }

        } catch (err: any) {
            console.error("Erro ao gerar avatar via IA", err);
        }
    }
}

interface IAgentsBots {
    id: string,
    name: string,
    description: string,
    avatar_url: string
    info?: mls.cbe.IPath
}

interface IAgentsList {
    agent: IAgent,
    storFile: mls.stor.IFileInfo
}

