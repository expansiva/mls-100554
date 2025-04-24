/// <mls shortName="collabMessagesConnect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { collab_chevron_left, collab_arrow_up_long } from './_100554_collabIcons';
import { createAgent } from './_100554_agentPlanner1';
import { getTemporaryContext } from './_100554_aiAgentHelper';
import { addTask, syncTask, addMessages, addMessage, getMessagesByThreadId, updateThread } from './_100554_msgDBController';
import { formatTimestamp } from './_100554_iaChatBase';
import {
    collab_user_plus
} from './_100554_collabIcons';

import './_100554_widgetAiInteraction';
import './_100554_widgetAiTask';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    btnAddParticipant: 'Adicionar participante',
    labelUserId: 'Nome do usuario ou Id',
    labelPermission: 'Autoridade:',
    errorFieldsAddParticipant: 'Preencha todos os campos!',
    successAddParticipant: 'Usuário adicionado com sucesso',
}

const message_en = {
    loading: 'Loading...',
    btnAddParticipant: 'Add Participant',
    labelUserId: 'User id or name',
    labelPermission: 'Auth:',
    errorFieldsAddParticipant: 'Fill in all fields!',
    successAddParticipant: 'User added sucessfully'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('collab-messages-connect-100554')
export class CollabMessagesConnect100554 extends IcaLitElement {

    private msg: MessageType = messages['en'];

    @query('#prompt_input') promptInput: HTMLTextAreaElement | undefined;
    @query('#unread') private unreadEl!: HTMLDivElement | undefined;
    @query('.chat-container') private messageContainer!: HTMLDivElement | undefined;

    @property() userId: string | undefined;

    @property() activeScenerie: IScenery = 'list';
    @property() actualThread: IThreadInfo | undefined;
    @property() actualTask: mls.msg.TaskData | undefined;
    @property() actualMessages: IMessage[] = [];
    @property() actualMessagesParsed: IMessageGrouped = {};
    @property() isSending: boolean = false;
    @property() isLoadingMessages: boolean = false;

    @property() isAddParticipant: boolean = false;
    @property() labelOkAddParticipant: string = '';
    @property() labelErrorAddParticipant: string = '';
    @property() userIdOrName = '';
    @property() auth: mls.msg.UserAuth = 'write';


    @state() private text: string = '';


    @property({ attribute: false }) userThreads: IThread = {
        CONNECT: [{ "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }, "users": [{ "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "threads": ["20250417133813.1000", "20250417180232.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "threads": ["20250417135645.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] }]
    };

    private savedScrollTop = 0;

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);

        if (this.unreadEl) {
            this.unreadEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (changedProperties.has('activeScenerie')
            && (changedProperties.get('activeScenerie') === 'task' || changedProperties.get('activeScenerie') === 'addParticipant')
            && this.activeScenerie === 'details') {
            this.restoreScrollPosition();
        }

        if (changedProperties.has('actualMessagesParsed') && changedProperties.get('actualMessagesParsed') !== undefined) {
            if (this.messageContainer) {
                this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
            }
        }
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.activeScenerie === 'loading') {
            return html`<div class="loading">${this.msg.loading}</div>`;
        }

        return html`
        ${this.renderHeader()}
        ${this.renderContent()}
    `;
    }

    private renderHeader() {
        switch (this.activeScenerie) {
            case 'task':
                return html`
                <div class="header">
                    <span @click=${this.onTitleClick}>${collab_chevron_left} Task: ${this.actualTask?.PK || ''}</span>
                </div>`;
            case 'details':
                return html`
                <div class="header">
                    <span @click=${this.onTitleClick}>${collab_chevron_left} Thread: ${this.actualThread?.thread.name || this.actualThread?.thread.threadId}</span>
                    <div class="header-actions">
                        <span @click=${this.onAddParticipantClick}>${collab_user_plus}</span>
                    </div>
                </div>`;
            case 'list':
                return html`<div class="header">Threads</div>`;
            case 'addParticipant':
                return html`
                <div class="header">
                    <span @click=${this.onTitleClick}>${collab_chevron_left} ${this.msg.btnAddParticipant}</span>
                </div>`;
            default:
                return null;
        }
    }

    private renderContent() {
        switch (this.activeScenerie) {
            case 'list':
                return this.renderListThreads();
            case 'details':
                return this.renderChatMessages();
            case 'task':
                return this.renderTaskDetails();
            case 'addParticipant':
                return this.renderAddParticipant();
            default:
                return null;
        }
    }


    private renderChatMessages() {
        return html`
            <div class="chat-container">    
                ${Object.keys(this.actualMessagesParsed).map((key) => {
            const threadMessages = this.actualMessagesParsed[key];
            const messageTime = this.parseLocalDate(key);
            return html`
                    <div class="message-time">${messageTime.date}</div>
                            ${threadMessages.map((message) => {
                const dateFormated = formatTimestamp(message.createAt);
                const userName = this.actualThread?.users.find((user) => user.userId === message.senderId)?.name || message.senderId;
                const cls = message.senderId === this.userId ? 'user' : 'system';
                return html`
                    <div class="message ${cls}">
                        <div class="message-group">
                            <div class="message-row">
                                <div class="message-card ${cls}">
                                    <div class="message-title">@${userName}</div>
                                    <div class="message-content">${message.content}</div>
                                    <div class="message-footer">${dateFormated?.time}</div>
                    ${message.taskId
                        ? html`
                            <div class="message-ai">
                                <widget-ai-task-100554 
                                    messageId=${message.createAt}
                                    .context= ${message.context}
                                    lastChanged= ${message.lastChanged}
                                    taskId=${message.taskId}
                                    @taskclick=${() => this.onTaskClick(message?.taskId || '', message.threadId, message.createAt)}
                                    >
                                </widget-ai-task-100554>
                            </div>                                            `
                        : html``}
                                    </div>        
                                </div>    
                            </div>
                    </div>`
            })}`
        })}
        ${this.isLoadingMessages ? html`<div class="unread-messages" id="unread">Loading messages...</div>` : html``}
        </div> 

        ${this.renderPrompt()}
                `
    }

    private renderPrompt() {
        return html`
        </div> 
            <div class="wrapper">
                <textarea
                    .value=${this.text}
                    @input=${this.handleInput}
                    @keydown=${this.handleKeyDown}
                    id="prompt_input"
                    ?readonly=${this.isSending}
                    placeholder="Digite aqui... (@ para menções)">
                </textarea>
                <button 
                    @click=${this.handleSend} 
                    ?disabled=${this.isSending}
                    >
                    ${this.isSending ? html`<span class="loader"></span>` : collab_arrow_up_long}
                </button>
        </div>`
    }

    private renderListThreads() {

        const unreadCount = 1;
        return html` <ul class="thread-list">
                ${this.userThreads.CONNECT.map((item) => {
            return html`
                        <li @click=${() => this.onThreadClick(item)} class="thread-item">
                            <div class="thread-content">
                                <div class="thread-item-header">
                                    <span class="thread-name">${item.thread.name || item.thread.threadId}</span>
                                    <span class="last-update">${item.thread.lastMessageTime ? formatTimestamp(item.thread.lastMessageTime)?.date : formatTimestamp(item.thread.history[0].timestamp)?.date}</span>
                                </div>
                                <div class="thread-summary">
                                    <span class="last-message">${item.thread.lastMessage || ''}</span>
                                    ${unreadCount > 0 ? html`<span class="unread-count">${unreadCount}</span>` : ''}
                                </div>
                            </div>
                        </li>
                    `;
        })}
            </ul>`
    }

    private renderTaskDetails() {
        return html`
            <widget-ai-interaction-100554 .task=${this.actualTask} taskId=${this.actualTask?.PK} .payloads=${this.actualTask?.iaCompressed?.nextSteps}></widget-ai-interaction-100554>
        `
    }



    private renderAddParticipant() {
        return html`
        <div class="add-participant">
            <label>
                ${this.msg.labelUserId}
                <input 
                    type="text"
                    .value=${this.userIdOrName}
                    @input=${(e: Event) => this.userIdOrName = (e.target as HTMLInputElement).value}
                />
            </label>

            <label>
                ${this.msg.labelPermission}
                <select
                    .value=${this.auth}
                    @change=${(e: Event) => (this.auth as string) = (e.target as HTMLSelectElement).value}
                >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="none">None</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                </select>
            </label>

            <button
                @click=${this.onSubmitAddParticipant}
                ?disabled=${this.isAddParticipant}
            >
                ${this.isAddParticipant ? html`<span class="loader"></span>` : this.msg.btnAddParticipant}
            </button>
            
            ${this.labelOkAddParticipant ? html`<small class="add-participant-ok">${this.labelOkAddParticipant}<small>` : ''}
            ${this.labelErrorAddParticipant ? html`<small class="add-participant-error">${this.labelErrorAddParticipant}<small>` : ''}
        </div>
    `;
    }

    private async onSubmitAddParticipant() {

        this.labelErrorAddParticipant = '';
        this.labelOkAddParticipant = '';

        if (!this.actualThread || !this.userId) {
            return;
        }
        if (!this.userIdOrName || !this.auth) {
            this.labelErrorAddParticipant = this.msg.errorFieldsAddParticipant
            return;
        }

        this.isAddParticipant = true;

        try {
            const response = await mls.api.msgAddUserInThread({
                auth: this.auth,
                userIdOrName: this.userIdOrName,
                threadId: this.actualThread?.thread.threadId,
                userId: this.userId,
            });

            if (response.statusCode !== 200) {
                this.labelErrorAddParticipant = `${response.msg}`;
                this.isAddParticipant = false;
                return;
            }
            this.labelOkAddParticipant = `${this.msg.successAddParticipant}`;
            this.userIdOrName = '';
            this.auth = 'write';
            this.isAddParticipant = false;

        } catch (error: any) {
            console.error('Error on add user:', error);
            this.labelErrorAddParticipant = error.message;
            this.isAddParticipant = false;
        }
    }

    private async getMessages(thread: mls.msg.Thread, lastOrderAt: string = ''): Promise<mls.msg.Message[]> {

        if (!this.userId) {
            return [];
        }

        const response = await mls.api.msgGetNextMessages({
            lastOrderAt,
            threadId: thread.threadId,
            userId: this.userId
        });

        return response.data
    }

    private parseMessages(rawData: mls.msg.Message[]): IMessageGrouped {
        const groupedByDay: IMessageGrouped = {};

        rawData.forEach(msg => {

            const dateKey = msg.createAt.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            if (!groupedByDay[dateKey]) {
                groupedByDay[dateKey] = [];
            }
            groupedByDay[dateKey].push(msg);
        });

        for (const day in groupedByDay) {
            groupedByDay[day].sort((a, b) => a.orderAt.localeCompare(b.orderAt));
        }

        return groupedByDay;
    }

    private parseLocalDate(dateString: string) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        return {
            dateObject: date,
            datafull: date.toLocaleString(),      // Ex: "22/04/2025 00:00:00"
            date: date.toLocaleDateString(),     // Ex: "22/04/2025"
            time: date.toTimeString().split(' ')[0] // Ex: "00:00:00"
        };
    }

    private async onThreadClick(threadInfo: IThreadInfo) {

        this.activeScenerie = 'loading';
        this.actualThread = threadInfo;
        const messagesInDb = await getMessagesByThreadId(threadInfo.thread.threadId);
        this.actualMessages = messagesInDb;
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.activeScenerie = 'details';

        this.isLoadingMessages = true;
        try {

            const messages = await this.getMessages(threadInfo.thread, threadInfo.thread.lastMessageTime || '');
            //this.actualMessages = [...this.actualMessages, ...messages];
            this.actualMessages = this.mergeMessages(this.actualMessages, messages);
            addMessages(messages);

            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            const lastMessage = this.actualMessages.length > 0 ? this.actualMessages[this.actualMessages.length - 1] : undefined;

            if (lastMessage) {
                const thread = await updateThread(threadInfo.thread.threadId, lastMessage.content, lastMessage.createAt, 0);
                threadInfo.thread = thread;
            }

            console.info({
                actual: this.actualThread,
                actualMessages: this.actualMessages,
                actualMessagesParsed: this.actualMessagesParsed
            });

        } catch (err: any) {
            throw new Error('Error on loading messages: ' + err.message);
        } finally {
            this.isLoadingMessages = false;
        }

    }

    private mergeMessages(
        array1: mls.msg.Message[],
        array2: mls.msg.Message[]
    ): mls.msg.Message[] {

        const map = new Map<string, mls.msg.Message>();
        for (const item of array1) {
            map.set(`${item.createAt}/${item.threadId}`, item);
        }

        for (const item of array2) {
            map.set(`${item.createAt}/${item.threadId}`, { ...map.get(`${item.createAt}/${item.threadId}`), ...item });
        }

        return Array.from(map.values());
    }

    private onTitleClick() {
        if (this.activeScenerie === 'task') {
            this.activeScenerie = 'details';
            return;
        }
        if (this.activeScenerie === 'details') {
            this.activeScenerie = 'list';
            return;
        }
        if (this.activeScenerie === 'addParticipant') {
            this.activeScenerie = 'details';
            return;
        }
    }

    private onAddParticipantClick() {
        this.saveScrollPosition();
        this.activeScenerie = 'addParticipant';
    }

    private handleInput(e: Event) {

        const target = e.target as HTMLTextAreaElement;
        const cursorPos = target.selectionStart;
        const value = target.value;
        const textBeforeCursor = value.slice(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];

        if (currentLine === '@@') {
            const afterText = value.slice(cursorPos);
            const newText = value.slice(0, cursorPos - 2) + '@@ ' + afterText;
            this.text = newText;
            requestAnimationFrame(() => {
                target.value = this.text;
                const newCursorPos = cursorPos + 1;
                target.selectionStart = target.selectionEnd = newCursorPos;
            });
        } else {
            this.text = value;
        }
    }

    private async handleSend() {

        if (this.isSending) return;
        const trimmed = this.text.trim();
        const mentionMatch = trimmed.match(/^@@\s?(.*)/);
        const mention = mentionMatch ? mentionMatch[1].trim() : null;
        if (!this.text) return;
        this.isSending = true;

        try {
            if (!mention) {
                await this.addMessage(this.text);
            } else {
                await this.addMessageIA(this.text);
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey && !this.isSending) {
            e.preventDefault();
            this.handleSend();
        }
    }

    private async addMessage(prompt: string) {
        if (!this.userId || !this.actualThread) return;

        const params: mls.msg.RequestAddMessage = {
            action: 'addMessage',
            content: prompt,
            threadId: this.actualThread.thread.threadId,
            userId: this.userId
        };

        const response = await mls.api.msgAddMessage(params);
        const { content, createAt, orderAt, senderId, threadId } = response.message;
        this.updateMessage(content, createAt, orderAt, senderId, threadId);
        this.isSending = false;

    }


    private async addMessageIA(prompt: string) {
        if (!this.userId || !this.actualThread) return;

        const text = this.preparePromptIA(prompt);

        const context = getTemporaryContext(this.actualThread.thread.threadId, this.userId, text, async (ctx) => {
            await this.updateMessageAI(ctx);
            if (ctx.task) {
                await addTask(ctx.task);
            }
        });

        const agent = createAgent();
        await agent.beforePrompt(context);

        // const { content, createAt, orderAt, senderId, threadId, taskId } = context.message;
        // if (context.task) await addTask(context.task);
        //this.updateMessage(content, createAt, orderAt, senderId, threadId, taskId);

    }

    private async updateMessageAI(context: mls.msg.ExecutionContext) {

        if (!context.message && !context.task) return;
        const { content, createAt, orderAt, senderId, threadId, taskId } = context.message;

        let messageAdded = this.actualMessages.find((item) =>
            item.content === content &&
            item.senderId === senderId &&
            item.createAt === createAt &&
            item.threadId === threadId
        )

        if (!messageAdded) {
            const newMessage: mls.msg.Message = {
                content,
                createAt,
                orderAt,
                senderId,
                threadId,
            }
            const thread = await updateThread(threadId, content, createAt, 0);
            if (this.actualThread) this.actualThread.thread = thread;
            if (taskId) newMessage.taskId = taskId;
            this.actualMessages.push({ context, lastChanged: new Date().getTime(), ...newMessage });
            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            this.text = '';
            await addMessage(newMessage);
            this.isSending = false;
            this.requestUpdate();

        } else {
            messageAdded.content = content;
            messageAdded.senderId = senderId;
            messageAdded.createAt = createAt;
            messageAdded.threadId = threadId;
            messageAdded.orderAt = orderAt;
            messageAdded.context = context;
            messageAdded.lastChanged = new Date().getTime();

            const cloned = structuredClone(messageAdded);
            delete cloned.context;
            delete cloned.lastChanged;

            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            await addMessage(cloned);
            this.requestUpdate();
        }

    }

    private async updateMessage(content: string, createAt: string, orderAt: string, senderId: string, threadId: string, taskId?: string) {

        const newMessage: mls.msg.Message = {
            content,
            createAt,
            orderAt,
            senderId,
            threadId,
        }

        const thread = await updateThread(threadId, content, createAt, 0);
        if (this.actualThread) this.actualThread.thread = thread;
        if (taskId) newMessage.taskId = taskId;
        this.actualMessages.push(newMessage);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.text = '';
        addMessage(newMessage);
        this.requestUpdate();

    }

    private preparePromptIA(prompt: string) {
        return prompt.replace('@@', '');
    }

    private async onTaskClick(taskId: string, messageId: string, threadId: string,) {
        this.saveScrollPosition();
        this.activeScenerie = 'loading';
        const task = await this.getTaskUpdate(taskId, threadId, messageId);
        syncTask(task);
        this.actualTask = task;
        this.activeScenerie = 'task';
    }

    private async getTaskUpdate(taskId: string, threadId: string, createdAt: string) {

        if (!taskId || !createdAt || !threadId) throw new Error('Invalid args');
        if (!this.userId) throw new Error('Invalid userId');

        const taskData = await mls.api.msgGetTaskUpdate(
            {
                taskId,
                messageId: `${createdAt}/${threadId}`,
                userId: this.userId
            }
        );

        if (taskData.statusCode !== 200) throw new Error("error on AI get taskUpdate , stoped");

        return taskData.task;
    }

    private saveScrollPosition() {
        if (this.messageContainer) {
            this.savedScrollTop = this.messageContainer.scrollTop;
        }
    }

    private restoreScrollPosition() {
        if (this.messageContainer) {
            this.messageContainer.scrollTop = this.savedScrollTop;
        }
    }

}

export interface CollbaMessagesConnectResponse {
    ok: boolean,
    msg?: string,
    data?: mls.msg.Thread
}

interface IThreadInfo {
    thread: mls.msg.ThreadPerformanceCache,
    users: mls.msg.User[]
}
interface IMessage extends mls.msg.Message {
    context?: mls.msg.ExecutionContext,
    lastChanged?: number,
}

type IMessageGrouped = { [key: string]: IMessage[] }
type IThread = { CONNECT: IThreadInfo[] }
type IScenery = 'list' | 'details' | 'loading' | 'task' | 'addParticipant'
