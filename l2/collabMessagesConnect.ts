/// <mls shortName="collabMessagesConnect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { collab_chevron_left, collab_arrow_up_long } from './_100554_collabIcons';
import { createAgent } from './_100554_agentPlanner1';
import { getTemporaryContext } from './_100554_aiAgentHelper';
import { addTask, syncTask, addMessages, addMessage, getMessagesByThreadId, updateThread } from './_100554_msgDBController';
import { formatTimestamp } from './_100554_iaChatBase';

import './_100554_widgetAiInteraction';
import './_100554_widgetAiTask';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
}

const message_en = {
    loading: 'Loading...',
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

    @property() userId: string | undefined;

    @property() activeScenerie: IScenery = 'list';
    @property() actualThread: IThreadInfo | undefined;
    @property() actualTask: mls.msg.TaskData | undefined;
    @property() actualMessages: mls.msg.Message[] = [];
    @property() actualMessagesParsed: IMessageGrouped = {};
    @property() isSending: boolean = false;
    @property() isLoadingMessages: boolean = false;

    @state() private text: string = '';
    @state() private suggestions: string[] = [];
    @state() private mentionList = ['collabIA'];
    @state() private showSuggestions = false;

    @property({ attribute: false }) userThreads: IThread = {
        CONNECT: [{ "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }, "users": [{ "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "threads": ["20250417133813.1000", "20250417180232.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "threads": ["20250417135645.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] }]
    };

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);

        if (this.unreadEl) {
            this.unreadEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.activeScenerie === 'loading') {
            return html`<div class="loading">${this.msg.loading}</div>`
        }

        return html`
            <div class="header">
                ${this.activeScenerie === 'task'
                ? html`<span @click=${this.onTitleClick}>${collab_chevron_left} Task: ${this.actualTask?.PK || ''}</span>`
                : this.activeScenerie === 'details'
                    ? html`<span @click=${this.onTitleClick}>${collab_chevron_left} Thread: ${this.actualThread?.thread.name || this.actualThread?.thread.threadId}</span>`
                    : this.activeScenerie === 'list'
                        ? html`Threads`
                        : ''
            }
                </div>

                ${this.activeScenerie === 'list'
                ? this.renderListThreads()
                : this.activeScenerie === 'details'
                    ? this.renderChatMessages()
                    : this.activeScenerie === 'task'
                        ? this.renderTaskDetails()
                        : ''
            }
        `
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
                                                <div class="message-footer">${dateFormated.time}</div>
                                                ${message.taskId
                        ? html`
                                                    <div class="message-ai">
                                                            <widget-ai-task-100554 
                                                                messageId=${message.createAt}
                                                                taskId=${message.taskId}
                                                                @taskclick=${() => this.onTaskClick(message?.taskId || '', message.threadId, message.createAt)}
                                                                >
                                                            </widget-ai-task-100554>
                                                    </div>
                                                                        `
                        : html``}
                                            </div>
                                                
                                        </div>
                            
                                </div>
                            </div> 
                    `

            })}`


        })}

                ${this.isLoadingMessages
                ? html`<div class="unread-messages" id="unread">Loading messages...</div>`
                : html``
            }
                </div> 
                   <div class="wrapper">
                        <textarea
                            .value=${this.text}
                            @input=${this.handleInput}
                            id="prompt_input"
                            ?readonly=${this.isSending}
                            placeholder="Digite aqui... (@ para menções)"
                        >
                        </textarea>
                        ${this.showSuggestions
                ? html`
                                <div class="suggestions">
                                    ${this.suggestions.map(
                    (s) => html`
                                        <div class="suggestion" @click=${() => this.selectSuggestion(s)}>
                                        ${s}
                                        </div>
                                    `
                )}
                                </div>
                                `
                : null}
                        <button 
                            @click=${this.handleSend} 
                            ?disabled=${this.isSending}
                            >
                            ${this.isSending
                ? html`<span class="loader"></span>`
                : collab_arrow_up_long
            }
                            </button>

                    </div>
                `
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
                                    <span class="last-update">${item.thread.lastMessageTime ? formatTimestamp(item.thread.lastMessageTime).date : formatTimestamp(item.thread.history[0].timestamp).date}</span>
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

        //stepId=${this.stepIdSelected}
        return html`
            <widget-ai-interaction-100554 .task=${this.actualTask} taskId=${this.actualTask?.PK} .payloads=${this.actualTask?.iaCompressed?.nextSteps}></widget-ai-interaction-100554>
        `
    }


    private async getMessages(thread: mls.msg.Thread, lastOrderAt: string = ''): Promise<mls.msg.Message[]> {

        if (!this.userId) {
            return [];
        }

        const response = await mls.api.msgGetNextMessages({
            action: 'getNextMessages',
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
            this.actualMessages = [...this.actualMessages, ...messages];
            //this.actualMessages = messages;
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

    private onTitleClick() {
        if (this.activeScenerie === 'task') {
            this.activeScenerie = 'details';
            return;
        }
        if (this.activeScenerie === 'details') {
            this.activeScenerie = 'list';
            return;
        }

    }

    private handleInput(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.text = target.value;

        const cursorPos = target.selectionStart;
        const textBeforeCursor = this.text.slice(0, cursorPos);

        if (textBeforeCursor.startsWith('@')) {
            const match = textBeforeCursor.match(/^@(\w*)$/);

            if (match) {
                const query = match[1].toLowerCase();
                this.suggestions = this.mentionList.filter(opt =>
                    opt.toLowerCase().startsWith(query)
                );
                this.showSuggestions = this.suggestions.length > 0;
            } else {
                this.showSuggestions = false;
            }
        } else {
            this.showSuggestions = false;
        }
    }

    private selectSuggestion(option: string) {
        const textarea = this.renderRoot.querySelector('textarea');
        if (!textarea) return;

        const cursorPos = textarea.selectionStart;
        const textBefore = this.text.slice(0, cursorPos);
        const match = textBefore.match(/@(\w*)$/);
        const beforeMention = this.text.slice(0, match?.index);
        const afterText = this.text.slice(cursorPos);
        this.text = `${beforeMention}@${option} ${afterText}`;
        this.showSuggestions = false;
        textarea.value = this.text;
        textarea.focus();
    }

    private async handleSend() {

        if (this.isSending) return;
        const trimmed = this.text.trim();
        const mentionMatch = trimmed.match(/^@(\w+)/);
        const mention = mentionMatch ? mentionMatch[1] : null;
        if (!this.text) return;
        this.isSending = true;

        try {
            if (!mention) {
                await this.addMessage(this.text);
            }
            else if (mention && mention === 'collabIA') {
                await this.addMessageIA(this.text);
            }
        } catch (err: any) {
            throw new Error(err.message)
        } finally {
            this.isSending = false;
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

    }

    private async addMessageIA(prompt: string) {
        if (!this.userId || !this.actualThread) return;

        const text = this.preparePromptIA(prompt);

        const context = getTemporaryContext(this.actualThread.thread.threadId, this.userId, text);
        const agent = createAgent();
        await agent.beforePrompt(context);

        const { content, createAt, orderAt, senderId, threadId, taskId } = context.message;
        if (context.task) await addTask(context.task);
        this.updateMessage(content, createAt, orderAt, senderId, threadId, taskId);

    }

    private preparePromptIA(prompt: string) {
        return prompt.replace('@collabIA', '');
    }

    private async updateMessage(content: string, createAt: string, orderAt: string, senderId: string, threadId: string, taskId?: string) {
        const newMessage: mls.msg.Message = {
            content,
            createAt,
            orderAt,
            senderId,
            threadId,
        }

        if (taskId) newMessage.taskId = taskId;
        this.actualMessages.push(newMessage);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.text = '';
        addMessage(newMessage);
        this.requestUpdate();

    }

    private async onTaskClick(taskId: string, messageId: string, threadId: string,) {
        this.activeScenerie = 'loading';
        const task = await this.getTaskUpdate(taskId, threadId, messageId);

        task.status
        syncTask(task);
        this.actualTask = task;
        this.activeScenerie = 'task';
    }

    private async getTaskUpdate(taskId: string, threadId: string, createdAt: string) {

        if (!taskId || !createdAt || !threadId) throw new Error('Invalid args');
        if (!this.userId) throw new Error('Invalid userId');

        const taskData = await mls.api.msgGetTaskUpdate(
            {
                action: 'getTaskUpdate',
                taskId,
                messageId: `${createdAt}/${threadId}`,
                userId: this.userId
            }
        );

        if (taskData.statusCode !== 200) throw new Error("error on AI get taskUpdate , stoped");
        return taskData.task;
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

type IMessageGrouped = { [key: string]: mls.msg.Message[] }
type IThread = { CONNECT: IThreadInfo[] }
type IScenery = 'list' | 'details' | 'loading' | 'task'
