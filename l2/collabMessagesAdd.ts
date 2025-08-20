/// <mls shortName="collabMessagesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { addThread, getThread } from './_100554_msgDBController';
import { notifyThreadChange } from './_100554_aiAgentHelper';
import { CollabInputTag } from './_100554_collabInputTag';
import { getUserId } from './_100554_collabMessageHelper';
import { IAgent } from './_100554_aiAgentBase'
import { addMessage } from "./_100554_collabMessageHelper";

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
    linkSelecionarTemplate: 'Selecionar template',
    successSaving: 'Alterações salvas com sucesso!',
    dmValidationError: "O usuário DM deve começar com '@'.",
    channelValidationError: "O nome do canal deve começar com '#'.",

    // Novas chaves para taskDetails
    selectAgent: 'Escolha um AgentBot',
    noneAgent: 'Nenhum – Sem agente automático',
    initialMessage: 'Mensagem inicial (opcional)',
    placeholderMessage: 'Escreva aqui uma mensagem de abertura...',
    suggestions: ['Mensagem de boas-vindas', 'Regras do canal', 'Links de ajuda'],
    topics: 'Tópicos iniciais',
    agentConfig: 'Configuração do agente',
    placeholderConfig: 'Explique como o agente deve funcionar...',
    back: 'Voltar',
    save: 'Salvar Detalhes'
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
    linkSelecionarTemplate: 'Select template',
    btnAdd: 'Add thread',
    successSaving: 'Saved successfully!',
    dmValidationError: "DM user must start with '@'.",
    channelValidationError: "Channel name must start with '#'.",

    // Novas chaves para taskDetails
    selectAgent: 'Select an AgentBot',
    noneAgent: 'None – No automatic agent',
    initialMessage: 'Initial message (optional)',
    placeholderMessage: 'Write an opening message here...',
    suggestions: ['Welcome message', 'Rules', 'Help links'],
    topics: 'Initial topics',
    agentConfig: 'Agent configuration',
    placeholderConfig: 'Explain how the agent should work...',
    back: 'Back',
    save: 'Save Details'
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
    @state() private dmUser: string = '';

    @state() private users: {
        userId: string;
        name: string;
    }[] = [];

    @state() agentsBots: IAgentsBots[] = [];
    @state() _selectedAgent: string = 'none';
    @state() _initialMessage: string = '';
    @state() _topics: string[] = [];
    @state() _agentConfig: string = '';

    @state() private view: 'add' | 'templates' = 'add';

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
        if (this.view === 'add') {
            return this._renderAdd();
        } else {
            return this._renderTaskDetails();
        }
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
                <label>${this.msg.dmUser}
                    <input type="text" placeholder="@usuario" 
                        .value=${this.dmUser}
                        list="user-suggestions"
                        pattern="^@.*" 
                        @input=${(e: Event) => this.dmUser = (e.target as HTMLInputElement).value}>
                </label>
                 <datalist id="user-suggestions">
                    ${this.users.map(user => html`<option value="@${user.name}"></option>`)}
                </datalist>
            ` : ''}

            ${this.threadType === 'channel' ? html`
                <label>${this.msg.threadName}
                    <input type="text" placeholder="#nome-do-canal"
                        .value=${this.threadName}
                         pattern="^#.*"
                        @input=${(e: Event) => this.threadName = (e.target as HTMLInputElement).value}>
                </label>

                <label>${this.msg.channelTemplate}:</label>
                <a href="#" @click=${this.openTemplateScenario}>
                    ${this._selectedAgent ? `Template: ${this._selectedAgent}` : this.msg.linkSelecionarTemplate}
                </a>
            ` : ''}

            <!-- visibilidade -->
            <br>
            <br>
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
            
            <!-- grupo -->
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

            <!-- idiomas -->
            <label> ${this.msg.languages}
                <collab-input-tag-100554 
                    pattern="^[a-z]{2}$|^[a-z]{2}-[A-Z]{2}$"
                    .value=${this.languages.join(',')}
                    .onValueChanged=${(value: string) => this.languages = value.split(',')}
                    id="languageInput"
                ></collab-input-tag-100554>
                <small> ${this.msg.languagesHint}</small>
            </label>

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

    private _renderTaskDetails() {

        return html`
        <div class="section-thread-details">
            
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

            <label>${this.msg.initialMessage}</label>
            <textarea 
                rows="5" 
                .value=${this._initialMessage}
                placeholder=${this.msg.placeholderMessage}
                @input=${(e: Event) => this._initialMessage = (e.target as HTMLTextAreaElement).value}
            ></textarea>

            <label>${this.msg.topics}</label>
            <collab-input-tag-100554
                .value=${this._topics.join(',')}
                .onValueChanged=${(value: string) => this._topics = value.split(',')}
            ></collab-input-tag-100554>

            ${this._selectedAgent && this._selectedAgent !== 'none' ? html`
                <label>${this.msg.agentConfig}</label>
                <textarea 
                    rows="5" 
                    .value=${this._agentConfig}
                    placeholder=${this.msg.placeholderConfig}
                    @input=${(e: Event) => this._agentConfig = (e.target as HTMLTextAreaElement).value}
                ></textarea>
            ` : ''}

            <div class="actions">
                <button @click=${this._backToAdd}>${this.msg.back}</button>
                <button @click=${this._saveTaskDetails}>${this.msg.save}</button>
            </div>
        </div>
    `;
    }
    private _backToAdd() {
        this.view = 'add';
    }

    private _saveTaskDetails() {
        this.view = 'add';
    }

    private openTemplateScenario(e: MouseEvent) {
        e.preventDefault();
        this.view = 'templates';
    }

    private validateForm(): boolean {
        if (this.threadType === 'dm') {
            if (!this.dmUser.trim()) return false;
            if (!this.dmUser.startsWith('@')) {
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

        const params: mls.msg.RequestAddThread = {
            action: 'addThread',
            name: this.threadType === 'dm' ? this.dmUser : this.threadName,
            group: this.group,
            languages: this.languages,
            userId: this.userId,
            visibility: this.threadType === 'dm' ? 'private' : this.visibility,
            status: 'active',
            avatar_url,
            wellcomeMessage: this.threadType === 'channel' ? this._initialMessage : '',
            defaultTopics: this._topics || [],
        };

        this.isLoading = true;

        try {
            const response = await mls.api.msgAddThread(params);

            if (this.threadType === 'dm') {
                const responseAddUsuer = await mls.api.msgAddUserInThread({
                    auth: 'admin',
                    userIdOrName: this.dmUser.replace('@', ''),
                    threadId: response.thread.threadId,
                    userId: this.userId,
                });

                this.labelOk = `${this.msg.successSaving}`;
                if (responseAddUsuer.thread) {
                    const thr = await addThread(response.thread);
                    notifyThreadChange(thr);
                    if (this.onAddSuccess) this.onAddSuccess();
                }
            }

            if (this.threadType === 'channel') {
                if (response.thread) {
                    const thr = await addThread(response.thread);
                    if (this._selectedAgent && this._selectedAgent !== 'none') {
                        const botSelected = this.agentsBots.find((item) => item.id === this._selectedAgent);
                        if (!botSelected || !botSelected.info) return;
                        await addMessage(response.thread.threadId, `@@BotInstall {"projectId":${botSelected.info.project}, "shortName":"${botSelected.info.shortName}", "folder":${botSelected.info.folder || '""'}}`);

                        if (this._agentConfig) {

                            const threadWithBot = await mls.api.msgGetThreadUpdate({
                                threadId: response.thread.threadId,
                                userId: this.userId
                            });

                            if (threadWithBot && threadWithBot.thread.bots) {
                                const botInfo = threadWithBot.thread.bots.find((bot) => bot.botId === botSelected.id);
                                if (botInfo) {
                                    mls.api.msgAddOrUpdateThreadBot({
                                        botId: botSelected.id,
                                        config: { 'agentConfiguration': this._agentConfig },
                                        llmPrompt: botInfo.llmPrompt,
                                        status: 'active',
                                        threadId: response.thread.threadId,
                                        userId: this.userId
                                    })
                                }

                            }

                        }

                    }
                    notifyThreadChange(thr);
                    if (this.onAddSuccess) this.onAddSuccess();
                }
            }

        } catch (err: any) {
            console.error(err);
            this.labelError = err.message;
        } finally {
            this.isLoading = false;
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

