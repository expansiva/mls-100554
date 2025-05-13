/// <mls shortName="collabMessagesConnect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { collab_chevron_left, collab_user_plus, collab_gear, collab_translate } from './_100554_collabIcons';
import { createAgent } from './_100554_agentPlanner1';
import { getTemporaryContext, formatTimestamp } from './_100554_aiAgentHelper';
import { addOrUpdateTask, addMessages, addMessage, updateThread, updateUsers, updateThreads, getMessagesByThreadId } from './_100554_msgDBController';
import { loadChatPreferences } from './_100554_collabMessageHelper';

import './_100554_widgetAiInteraction';
import './_100554_widgetAiTask';
import './_100554_collabMessagesPrompt';
import './_100554_collabMessagesAvatar';
import './_100554_collabMessagesThreadDetails';
import './_100554_collabMessagesAddParticipant';

import { IChatPreferences } from './_100554_collabMessageHelper';
import { StateLitElement } from './_100554_stateLitElement';
import { CollabMessagesPrompt100554 } from './_100554_collabMessagesPrompt';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    btnAddParticipant: 'Adicionar participante',
    threadDetails: 'Detalhes da sala'
}

const message_en = {
    loading: 'Loading...',
    btnAddParticipant: 'Add Participant',
    threadDetails: 'Thread details'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-messages-connect-100554')
export class CollabMessagesConnect100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @query('collab-messages-prompt-100554') collabMessagesPrompt: CollabMessagesPrompt100554 | undefined;
    @query('#unread') private unreadEl!: HTMLDivElement | undefined;
    @query('.chat-container') private messageContainer!: HTMLDivElement | undefined;

    @state() userPreferenceChat?: IChatPreferences;
    @state() isLoadingThread: boolean = false;

    @property() userId: string | undefined;
    @property() activeScenerie: IScenery = 'list';
    @property() actualThread: IThreadInfo | undefined;
    @property() actualTask: mls.msg.TaskData | undefined;
    @property() actualMessages: IMessage[] = [];
    @property() actualMessagesParsed: IMessageGrouped = {};
    @property() isLoadingMessages: boolean = false;

    @property({ attribute: false }) userThreads: IThread = {
        CONNECT: [{ "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }, "users": [{ "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "threads": ["20250417133813.1000", "20250417180232.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "threads": ["20250417135645.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] }]
    };

    private savedScrollTop = 0;

    private hasMoreMessages = true;
    private messagesLimit = 10;
    private messagesOffset = 0;
    private isLoadingMoreMessages = false;

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);

        if (this.unreadEl) {
            this.unreadEl.scrollIntoView({ behavior: 'auto', block: 'center' });
            return;
        }

        if (changedProperties.has('activeScenerie')
            && (changedProperties.get('activeScenerie') === 'task'
                || changedProperties.get('activeScenerie') === 'addParticipant'
                || changedProperties.get('activeScenerie') === 'threadDetails'
            )
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

        window.addEventListener('task-change', async (e) => {
            const customEvent = e as CustomEvent;
            await this.updateMessageAI(customEvent.detail.context, false, customEvent.detail.oldContextCreateAt);
            if (customEvent.detail.context.task) {
                await addOrUpdateTask(customEvent.detail.context.task);
            }
        });

        window.addEventListener('task-details-close', async (e) => {
            this.onTitleClick();
        });

        window.addEventListener('thread-change', async (e) => {
            const customEvent = e as CustomEvent;
            await this.updateMessageAI(customEvent.detail, false);
            const thread = customEvent.detail as mls.msg.Thread;
            const threadUpdated = this.userThreads.CONNECT.find((th) => th.thread.threadId === thread.threadId);
            if (threadUpdated) threadUpdated.thread = { ...threadUpdated.thread, ...thread };
            else if (thread.group === 'CONNECT') {
                this.userThreads.CONNECT = [...this.userThreads.CONNECT, { thread, users: [] }];
            }
            this.requestUpdate();
        });

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
                        <span @click=${this.onThreadDetailsClick}>${collab_gear}</span>
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
            case 'threadDetails':
                return html`
                <div class="header">
                    <span @click=${this.onTitleClick}>${collab_chevron_left} ${this.msg.threadDetails}</span>
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
            case 'threadDetails':
                return this.renderThreadDetails();
            default:
                return null;
        }
    }


    private renderChatMessages() {

        this.userPreferenceChat = loadChatPreferences();

        const sortedEntries = Object.entries(this.actualMessagesParsed)
            .map(([date, value]) => [date.trim(), value])
            .sort(([a], [b]) => new Date(a as string).getTime() - new Date(b as string).getTime());

        const sortedObj: IMessageGrouped = Object.fromEntries(sortedEntries);

        return html`
            <div @scroll=${this.onChatScroll} class="chat-container">    
                ${Object.keys(sortedObj).map((key) => {
            const threadMessages = sortedObj[key];
            const messageTime = this.parseLocalDate(key);
            return html`
                    <div class="message-time">${messageTime.date}</div>
                            ${threadMessages.map((message) => {

                const dateFormated = formatTimestamp(message.createAt);
                const userName = this.actualThread?.users.find((user) => user.userId === message.senderId)?.name || message.senderId;
                const userAvatar = this.actualThread?.users.find((user) => user.userId === message.senderId)?.avatar_url || '';
                const cls = message.senderId === this.userId ? 'user' : 'system';
                const isSame = message.isSame;

                return html`
                    <div class="message ${cls} ${isSame ? 'same' : ''}">
                        <div class="message-group">
                            <div class="message-row">
                                <div class="message-card ${cls} ${isSame ? 'same' : ''}">
                                    ${!isSame ? html`<div class="message-title">@${userName}</div>` : ``}
                                    ${this.renderMessageByLanguage(message)}
                                    ${message.isLoading ? html`<span class="loader"></span>` : ''}
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
                                ${cls === 'system' && !isSame ? html`<collab-messages-avatar-100554 avatar=${userAvatar}></collab-messages-avatar-100554>` : ''} 
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

    private renderMessageByLanguage(message: mls.msg.Message) {

        const mode = this.userPreferenceChat?.translationMode || 'icon';

        if (!this.userPreferenceChat || mode === 'none' || !message.translations) {
            return html`<div class="message-content">${message.content}</div>`
        }

        const { language } = this.userPreferenceChat;
        const messageByLanguagePref = message.translations ? message.translations[language] : '';
        const isSameLanguege = language === message.language_detected;

        switch (mode) {
            case 'icon':
                return html`
                <div class="message-content">${messageByLanguagePref || message.content} ${!isSameLanguege ? collab_translate : ''}</div>`;
            case 'text':
                return html`
                <div class="message-content">${messageByLanguagePref || message.content}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${message.content}</small>` : ''}`;
            case 'iconText':
                return html`
                <div class="message-content">${messageByLanguagePref || message.content} ${!isSameLanguege ? collab_translate : ''}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${message.content}</small>` : ''}`;
            case 'trace':
                return html`
                <div class="message-content trace">
                    <div><b>[LanguageDetected: ${message.language_detected}]</b> ${message.content}</div>
                    ${Object.keys(message.translations).map((key) => {
                    if (key === 'language_detected') return ''
                    if (key === message.language_detected) return ''
                    return html`<div><b>[${key}]</b> ${message.translations ? message.translations[key] : ''}</div>`
                })}
                </div>
                
                `
            default:
                return null;
        }

    }

    private renderPrompt() {
        return html`<collab-messages-prompt-100554 .allUsers=${this.actualThread?.users || []} .onSend=${this.handleSend.bind(this)} ></collab-messages-prompt-100554>`
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
            </ul>
            ${this.isLoadingThread ? html`<div>${this.msg.loading}</div>` : ''}
            `
    }

    private renderTaskDetails() {
        return html`
            <widget-ai-interaction-100554 .task=${this.actualTask} taskId=${this.actualTask?.PK}></widget-ai-interaction-100554>`
    }

    private renderThreadDetails() {
        return html`<collab-messages-thread-details-100554 userId=${this.userId} .threadDetails=${{ ...this.actualThread }}></collab-messages-thread-details-100554>`
    }

    private renderAddParticipant() {
        return html`<collab-messages-add-participant-100554 userId=${this.userId} .actualThread=${{ ...this.actualThread }}></collab-messages-add-participant-100554>`;
    }


    private async onChatScroll(e: Event) {
        const container = e.target as HTMLElement;

        if (
            container.scrollTop === 0 &&
            !this.isLoadingMoreMessages &&
            this.actualThread &&
            this.hasMoreMessages
        ) {
            this.isLoadingMoreMessages = true;

            const previousHeight = container.scrollHeight;

            const newOffset = this.messagesOffset + this.messagesLimit;
            const newMessages = await getMessagesByThreadId(
                this.actualThread.thread.threadId,
                this.messagesLimit,
                newOffset
            );

            if (newMessages.length > 0) {
                this.messagesOffset = newOffset;
                this.actualMessages = [...newMessages, ...this.actualMessages];
                this.actualMessagesParsed = this.parseMessages(this.actualMessages);
                await this.updateComplete;
                const newHeight = container.scrollHeight;
                container.scrollTop = newHeight - previousHeight;
            } else {

                this.hasMoreMessages = false;
            }

            this.isLoadingMoreMessages = false;
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

        return this.groupMessages(groupedByDay);
    }

    private groupMessages(groupedByDay: IMessageGrouped): IMessageGrouped {
        const result: IMessageGrouped = {};

        Object.keys(groupedByDay).forEach((key) => {
            result[key] = groupedByDay[key].map((msg, index, arr) => {
                const isSame = index > 0 && msg.senderId === arr[index - 1].senderId;
                return { ...msg, isSame };
            });
        });

        return result;
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

    private mergeMessages(
        array1: mls.msg.Message[],
        array2: mls.msg.Message[]
    ): mls.msg.Message[] {

        const map = new Map<string, mls.msg.Message>();
        for (const item of array1) {
            map.set(`${item.threadId}/${item.createAt}`, item);
        }

        for (const item of array2) {
            map.set(`${item.threadId}/${item.createAt}`, { ...map.get(`${item.threadId}/${item.createAt}`), ...item });
        }

        return Array.from(map.values());
    }

    private async onThreadClick(threadInfo: IThreadInfo) {

        this.activeScenerie = 'loading';
        this.messagesOffset = 0;
        this.hasMoreMessages = true;
        this.actualThread = threadInfo;

        //const messagesInDb = await getAllMessagesByThreadId(threadInfo.thread.threadId);
        const messagesInDb = await getMessagesByThreadId(this.actualThread.thread.threadId, this.messagesLimit, 0);

        this.actualMessages = messagesInDb;
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.activeScenerie = 'details';

        this.isLoadingMessages = true;
        try {

            const messages = await this.getMessages(threadInfo.thread, threadInfo.thread.lastMessageTime || '');
            addMessages(messages);

            this.actualMessages = this.mergeMessages(this.actualMessages, messages);
            this.actualMessagesParsed = this.parseMessages(this.actualMessages);

            const keys = Object.keys(this.actualMessagesParsed).sort(); // cria uma nova lista ordenada
            const lastKey = keys.length > 0 ? keys[keys.length - 1] : null;
            const lastArray = lastKey ? this.actualMessagesParsed[lastKey] : [];
            const lastMessage = lastArray.length > 0 ? lastArray[lastArray.length - 1] : undefined;

            // const lastMessage = this.actualMessages.length > 0 ? this.actualMessages[this.actualMessages.length - 1] : undefined;

            if (!this.userId || !this.actualThread.thread.threadId) return;
            const threadByServer = await this.getThreadInfo(this.actualThread.thread.threadId, this.userId)
            await updateThreads([threadByServer.thread]);

            if (lastMessage && threadByServer) {
                const thread = await updateThread(threadByServer.thread.threadId, threadByServer.thread, lastMessage.content, lastMessage.createAt, 0);
                threadInfo.thread = thread;
            }

            threadInfo.users = threadByServer.users;
            updateUsers(threadInfo.users);


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
        if (this.activeScenerie === 'addParticipant' || this.activeScenerie === 'threadDetails') {
            this.activeScenerie = 'details';
            return;
        }
    }

    private onAddParticipantClick() {
        this.saveScrollPosition();
        this.activeScenerie = 'addParticipant';
    }

    private onThreadDetailsClick() {
        this.saveScrollPosition();
        this.activeScenerie = 'threadDetails';
    }

    private async handleSend(value: string, opt: { isSpecialMention: boolean }) {

        try {
            if (!opt.isSpecialMention) {
                await this.addMessage(value);
            } else {
                await this.addMessageIA(value);
            }
        } catch (err: any) {
            throw new Error(err.message);
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

        const message: mls.msg.Message = this.createTempMessage(prompt, this.userId, this.actualThread.thread.threadId);
        const response = await mls.api.msgAddMessage(params);
        this.updateMessage2(false, message, response.message);

    }

    private async addMessageIA(prompt: string) {
        if (!this.userId || !this.actualThread) return;
        const context = getTemporaryContext(this.actualThread.thread.threadId, this.userId, prompt)
        const agent = createAgent();

        const message: mls.msg.Message = this.createTempMessage(prompt, this.userId, this.actualThread.thread.threadId);
        context.message = message;
        await agent.beforePrompt(context);

    }

    private async updateMessageAI(context: mls.msg.ExecutionContext, updateThreadDB: boolean, oldContextCreateAt?: string) {

        if (!context.message && !context.task) return;
        const { content, createAt, orderAt, senderId, threadId, taskId } = context.message;
        const createAt2 = oldContextCreateAt ? oldContextCreateAt : createAt;

        let messageAdded = this.actualMessages.find((item) =>
            item.content === content &&
            item.senderId === senderId &&
            item.createAt === createAt2 &&
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

            if (updateThreadDB && this.actualThread) {
                const thread = await updateThread(threadId, this.actualThread.thread, content, createAt, 0);
                if (this.actualThread) this.actualThread.thread = thread;
            }

            if (taskId) newMessage.taskId = taskId;
            this.actualMessages.push({ context, lastChanged: new Date().getTime(), ...newMessage });
            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            await addMessage(newMessage);
            this.requestUpdate();

        } else {
            messageAdded.content = content;
            messageAdded.senderId = senderId;
            messageAdded.createAt = createAt;
            messageAdded.threadId = threadId;
            messageAdded.orderAt = orderAt;
            messageAdded.context = context;
            messageAdded.isLoading = false;
            messageAdded.lastChanged = new Date().getTime();
            if (taskId) messageAdded.taskId = taskId;

            const cloned = structuredClone(messageAdded);
            delete cloned.context;
            delete cloned.isLoading;
            delete cloned.lastChanged;

            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            await addMessage(cloned);
            this.requestUpdate();
        }

    }


    private createTempMessage(content: string, senderId: string, threadId: string, taskId?: string) {

        const now = new Date();

        const formattedDate = now.getFullYear().toString()
            + String(now.getMonth() + 1).padStart(2, '0')
            + String(now.getDate()).padStart(2, '0')
            + String(now.getHours() + 3).padStart(2, '0')
            + String(now.getMinutes()).padStart(2, '0')
            + String(now.getSeconds()).padStart(2, '0')
            + "." + Math.floor(1000 + Math.random() * 9000);

        const newMessage: IMessage = {
            content,
            createAt: formattedDate,
            orderAt: formattedDate,
            senderId,
            threadId,
            isLoading: true
        }

        if (taskId) newMessage.taskId = taskId;
        this.actualMessages.push(newMessage);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.requestUpdate();
        return newMessage;

    }

    private async updateMessage2(updateThreadDB: boolean, oldMessage: IMessage, newMessage: mls.msg.Message) {

        if (updateThreadDB && this.actualThread) {
            const thread = await updateThread(newMessage.threadId, this.actualThread.thread, newMessage.content, newMessage.createAt, 0);
            if (this.actualThread) this.actualThread.thread = thread;
        }

        this.actualMessages = this.actualMessages.map(item =>
            item.content === oldMessage.content &&
                item.senderId === oldMessage.senderId &&
                item.createAt === oldMessage.createAt &&
                item.threadId === oldMessage.threadId
                ? { ...newMessage, isSame: oldMessage.isSame }
                : item
        );

        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        addMessage(newMessage);
        this.requestUpdate();

    }

    private async onTaskClick(taskId: string, messageId: string, threadId: string,) {
        this.saveScrollPosition();
        this.activeScenerie = 'loading';
        const task = await this.getTaskUpdate(taskId, threadId, messageId);
        addOrUpdateTask(task);
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

    private async getThreadInfo(threadId: string, userId: string): Promise<IThreadInfo> {
        try {
            const response = await mls.api.msgGetThreadUpdate({
                threadId,
                userId
            });
            return response;
        } catch (err: any) {
            throw new Error(err.message)
        }
    }

    private saveScrollPosition() {
        if (this.messageContainer) {
            this.savedScrollTop = this.messageContainer.scrollTop;
        }
    }

    private async restoreScrollPosition() {
        if (this.messageContainer) {
            await this.updateComplete;
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
    isSame?: boolean,
    isLoading?: boolean,
}

type IMessageGrouped = { [key: string]: IMessage[] }
type IThread = { CONNECT: IThreadInfo[] }
type IScenery = 'list' | 'details' | 'loading' | 'task' | 'addParticipant' | 'threadDetails'
