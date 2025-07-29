/// <mls shortName="collabMessagesChat" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { collab_chevron_left, collab_gear, collab_translate, collab_circle_exclamation } from './_100554_collabIcons';
import { IAgent } from './_100554_aiAgentBase';
import { getTemporaryContext, formatTimestamp, getNextResultStep, notifyThreadChange } from './_100554_aiAgentHelper';
import { addOrUpdateTask, addMessages, addMessage, updateThread, updateUsers, getMessage, getMessagesByThreadId } from './_100554_msgDBController';
import { loadChatPreferences, getBotsContext } from './_100554_collabMessageHelper';
import { collabImport } from './_100554_collabImport';

import './_100554_collabMessagesTaskInfo';
import './_100554_collabMessagesTask';
import './_100554_collabMessagesPrompt';
import './_100554_collabMessagesAvatar';
import './_100554_collabMessagesThreadDetails';

import { IChatPreferences, AGENTDEFAULT, PROJECTAGENTDEFAULT } from './_100554_collabMessageHelper';
import { StateLitElement } from './_100554_stateLitElement';
import { CollabMessagesPrompt100554 } from './_100554_collabMessagesPrompt';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    btnAddParticipant: 'Adicionar participante',
    threadDetails: 'Detalhes da sala',
    msgNotSend: 'Mensagem não enviada*',
    noThreads: 'Nenhuma sala disponível no momento.',
    placeholderSearch: 'Digite para filtrar',
}
const message_en = {
    loading: 'Loading...',
    btnAddParticipant: 'Add Participant',
    threadDetails: 'Thread details',
    msgNotSend: 'Message not sent*',
    noThreads: 'No threads available at the moment.',
    placeholderSearch: 'Type to filter',

}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('collab-messages-chat-100554')
export class CollabMessagesChat100554 extends StateLitElement {
    private msg: MessageType = messages['en'];
    @query('collab-messages-prompt-100554') collabMessagesPrompt: CollabMessagesPrompt100554 | undefined;
    @query('#unread') private unreadEl!: HTMLDivElement | undefined;
    @query('.chat-container') private messageContainer!: HTMLDivElement | undefined;

    @state() userPreferenceChat?: IChatPreferences;
    @state() isLoadingThread: boolean = false;
    @state() filteredThreads: IFilteredThreads[] = []

    @property() group: 'CONNECT' | 'APPS' | 'DOCS' | 'CRM' = 'CONNECT';
    @property() userId: string | undefined;
    @property() activeScenerie: IScenery = 'list';
    @property() actualThread: IThreadInfo | undefined;
    @property() actualTask: mls.msg.TaskData | undefined;
    @property() actualMessage: IMessage | undefined;
    @property() actualMessages: IMessage[] = [];
    @property() actualMessagesParsed: IMessageGrouped = {};
    @property() isLoadingMessages: boolean = false;
    @property() searchTerm: string = '';

    @property({ attribute: false }) userThreads: IThread = {
        CONNECT: [{ "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }, "users": [{ "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "threads": ["20250417133813.1000", "20250417180232.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "threads": ["20250417135645.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] }]
    };


    private isSystemChangeScroll: boolean = false;
    private savedScrollTop = 0;
    private hasMoreMessages = true;
    private messagesLimit = 10;
    private messagesOffset = 0;
    private isLoadingMoreMessages = false;
    private wasMessagesAtBottom: boolean = true;

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (this.unreadEl && this.messageContainer) {
            await this.updateComplete;
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
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
        if (changedProperties.has('actualMessagesParsed') && this.actualMessagesParsed !== undefined) {
            if (this.messageContainer && this.isSystemChangeScroll) {
                this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
                this.isSystemChangeScroll = false;
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('task-change', this.onTaskChange);
        window.removeEventListener('task-completed', this.onTaskCompleted);
        window.removeEventListener('task-details-close', this.onTaskDetailsClose);
        window.removeEventListener('thread-change', this.onThreadChange);
        window.removeEventListener('message-send', this.onMessageSend);
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        window.addEventListener('task-change', this.onTaskChange);
        window.addEventListener('task-completed', this.onTaskCompleted);
        window.addEventListener('task-details-close', this.onTaskDetailsClose);
        window.addEventListener('thread-change', this.onThreadChange);
        window.addEventListener('message-send', this.onMessageSend);
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.activeScenerie === 'loading') {
            return html`<div class="loading">${this.msg.loading}</div>`;
        }
        return html`
            ${this.renderHeader()}
            ${this.renderContent()}`;
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
                        </div>
                    </div>`;
            case 'list':
                return html`<div class="header">
                    ${this.renderThreadSearch()}
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
                const titleTranslated = this.getTitleMessageTranslated(message)

                return html`
                            <div class="message ${cls} ${isSame ? 'same' : ''}">
                                <div class="message-group">
                                    <div class="message-row">
                                        <div class="message-card ${cls} ${isSame ? 'same' : ''}">
                                            ${!isSame ? html`<div class="message-title">@${userName}</div>` : ``}
                                            ${this.renderMessageByLanguage(message)}
                                            ${message.isLoading ? html`<span class="loader"></span>` : ''}
                                            ${message.isFailed ? html`<div class="failed">
                                                <div>
                                                    <span>${collab_circle_exclamation}</span>
                                                    <small>${this.msg.msgNotSend}</small>
                                                </div>
                                                <small>${message.isFailedError}</small>
                                            </div>`: ''}
                                            ${message.taskId ? html`
                                                <div class="message-ai">
                                                    <collab-messages-task-100554
                                                        messageId=${message.createAt}
                                                        .context= ${message.context}
                                                        lastChanged= ${message.lastChanged}
                                                        taskId=${message.taskId}
                                                        title=${titleTranslated}
                                                        status=${message.taskStatus}
                                                        @taskclick=${() => this.onTaskClick(message?.taskId || '', message.createAt, message.threadId, message)}
                                                    >
                                                    </collab-messages-task-100554>
                                                </div> `: html``}
                                            ${this.renderMessageResultByLanguage(message)}
                                            ${this.renderMessageFooterResult(message)}
                                            <div class="message-footer">${dateFormated?.timeShort}</div>
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

    private renderMessageFooterResult(message: mls.msg.MessagePerformanceCache) {
        if (!message.footers || message.footers.length === 0) return html``;
        return html`<div class="message-result">
            ${message.footers?.map((footer) => {
            const content = footer.lines.join('\n').trim();
            if (!content) return html``;
            return html`
                <div class="message-result-text">
                    <b>${footer.title?.trim()}</b>
                    <div>
                        ${footer.lines.join('\n').trim()}
                    </div>
                </div>`
        })}
        </div>`
    }

    private renderMessageResultByLanguage(message: mls.msg.Message) {

        if (!message.taskResults || message.taskResults.length === 0 || message.taskStatus !== 'done' || !message.taskResultsTranslated) return html``;
        const mode = this.userPreferenceChat?.translationMode || 'icon';
        if (!this.userPreferenceChat || mode === 'none') {
            return html`<div class="message-content">${message.taskResults[0]}</div>`
        }
        const response = message.taskResults[0];
        const { language } = this.userPreferenceChat;
        const messageByLanguagePref = message.taskResultsTranslated ? message.taskResultsTranslated[language] : '';
        const isSameLanguege = language === message.taskResultsTranslated.language_detected;

        switch (mode) {
            case 'icon':
                return html`<div class="message-content">${messageByLanguagePref || response} ${!isSameLanguege ? collab_translate : ''}</div>`;
            case 'text':
                return html`
                <div class="message-content">${messageByLanguagePref || response}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${response}</small>` : ''}`;
            case 'iconText':
                return html`<div class="message-content">${messageByLanguagePref || response} ${!isSameLanguege ? collab_translate : ''}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${response}</small>` : ''}`;
            case 'trace':
                return html`<div class="message-content trace">
                <div><b>[LanguageDetected: ${message.language_detected}]</b> ${response}</div>
                ${Object.keys(message.taskResultsTranslated || {}).map((key) => {
                    if (key === 'language_detected') return ''
                    if (key === message.taskResultsTranslated?.language_detected) return ''
                    return html`<div><b>[${key}]</b> ${message.taskResultsTranslated ? message.taskResultsTranslated[key] : ''}</div>`
                })}
                </div>`
            default:
                return null;
        }
    }

    private getTitleMessageTranslated(message: mls.msg.Message) {
        const mode = this.userPreferenceChat?.translationMode || 'icon';
        if (!this.userPreferenceChat || mode === 'none' || !message.taskTitleTranslated) {
            return message.taskTitle;
        }
        const { language } = this.userPreferenceChat;
        const titleByLanguagePref = message.taskTitleTranslated ? (message.taskTitleTranslated[language] ? message.taskTitleTranslated[language] : message.taskTitle) : message.taskTitle;
        return titleByLanguagePref;
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
                return html`<div class="message-content">${messageByLanguagePref || message.content} ${!isSameLanguege ? collab_translate : ''}</div>`;
            case 'text':
                return html`
                <div class="message-content">${messageByLanguagePref || message.content}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${message.content}</small>` : ''}`;
            case 'iconText':
                return html`<div class="message-content">${messageByLanguagePref || message.content} ${!isSameLanguege ? collab_translate : ''}</div>
                ${!isSameLanguege ? html`<small class="message-content translate">${message.content}</small>` : ''}`;
            case 'trace':
                return html`<div class="message-content trace">
                <div><b>[LanguageDetected: ${message.language_detected}]</b> ${message.content}</div>
                ${Object.keys(message.translations).map((key) => {
                    if (key === 'language_detected') return ''
                    if (key === message.language_detected) return ''
                    return html`<div><b>[${key}]</b> ${message.translations ? message.translations[key] : ''}</div>`
                })}
                </div>`
            default:
                return null;
        }
    }

    private renderPrompt() {
        return html`
            <collab-messages-prompt-100554
                acceptAutoCompleteAgents="true"
                acceptAutoCompleteUser="true"
                threadId=${this.actualThread?.thread.threadId}
                .onSend=${this.handleSend.bind(this)}
                @textarea-resize=${this.handlePromptResize}
            ></collab-messages-prompt-100554>
        `;
    }

    private renderListThreads() {
        const unreadCount = 0;
        const imageUrls = [
            "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ];
        if (this.userThreads[this.group].length === 0 && !this.isLoadingThread) {
            return html`<div style="padding:1rem;">${this.msg.noThreads}</div>`;
        }

        const ordenedThreads: IFilteredThreads[] = this.getOrdenedThreads();
        this.filteredThreads = this.getFilteredThreads(ordenedThreads);

        return html`
        <ul class="thread-list">
            ${this.filteredThreads.map((item) => {
            const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

            const now = new Date();
            const isToday =
                item._lastMessageDate.dateObject.getFullYear() === now.getFullYear() &&
                item._lastMessageDate.dateObject.getMonth() === now.getMonth() &&
                item._lastMessageDate.dateObject.getDate() === now.getDate();

            const displayDate = isToday
                ? item._lastMessageDate.time
                : item._lastMessageDate.date;

            return html`
                    <li @click=${() => this.onThreadClick(item)} class="thread-item">
                        <div class="thread-item-avatar">
                            <img src="${randomImage}"></img>
                        </div>
                        <div class="thread-content">
                            <div class="thread-item-header">
                                <span class="thread-name">${item.thread.name || item.thread.threadId}</span>
                                <span class="last-update">${displayDate}</span>
                            </div>
                            <div class="thread-summary">
                                <span class="last-message">${item.thread.lastMessage || ''}</span>
                                ${unreadCount > 0 ? html`<span class="unread-count">${unreadCount}</span>` : ''}
                            </div>
                        </div>
                    </li>`;
        })}
        </ul>
        ${this.isLoadingThread ? html`<div>${this.msg.loading}</div>` : ''}
    `;
    }

    private renderThreadSearch() {
        return html`<div class="thread-search">
                <input type="search"
                    .value=${this.searchTerm}
                    placeholder=${this.msg.placeholderSearch} 
                    @input=${this.onSearchInput} 
                    type="text">
                </input>
        </div>`
    }

    private renderTaskDetails() {
        const messageId = `${this.actualThread?.thread.threadId}/${this.actualMessage?.createAt}`
        return html`<collab-messages-task-info-100554 messageId=${messageId} .task=${this.actualTask} .message=${this.actualMessage} taskId=${this.actualTask?.PK}></collab-messages-task-info-100554>`
    }

    private renderThreadDetails() {
        return html`<collab-messages-thread-details-100554 userId=${this.userId} .threadDetails=${{ ...this.actualThread }}></collab-messages-thread-details-100554>`
    }

    private onSearchInput(e: Event) {
        const target = e.target as HTMLInputElement;
        this.searchTerm = target.value.toLowerCase();
        const ordenedThreads: IFilteredThreads[] = this.getOrdenedThreads();
        this.filteredThreads = this.getFilteredThreads(ordenedThreads);
    }

    private async onChatScroll(e: Event) {
        if (this.isSystemChangeScroll) {
            this.isSystemChangeScroll = false;
            return;
        }
        const container = e.target as HTMLElement;
        this.savedScrollTop = container.scrollTop;

        const threshold = 5;
        this.wasMessagesAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;

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

    private getOrdenedThreads() {
        const ordenedThreads: IFilteredThreads[] = this.userThreads[this.group]
            .map((item) => {

                const lastTimestamp = item.thread.lastMessageTime
                    ? item.thread.lastMessageTime
                    : item.thread.history[0].timestamp;

                const formatedTimestamp = formatTimestamp(lastTimestamp).dateFull;
                const lastMessageDate = this.parseLocalDate(formatedTimestamp);

                return {
                    ...item,
                    _lastMessageDate: lastMessageDate,

                };
            })
            .sort((a, b) => b._lastMessageDate.dateObject.getTime() - a._lastMessageDate.dateObject.getTime())

        return [...ordenedThreads]
    }

    private getFilteredThreads(ordened: IFilteredThreads[]): IFilteredThreads[] {

        if (!this.searchTerm) return ordened;
        return ordened.filter(item => {
            const threadMatch = item.thread.name?.toLowerCase().includes(this.searchTerm);
            return threadMatch;
        });
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

    private parseMessages(rawData: mls.msg.MessagePerformanceCache[]): IMessageGrouped {
        const groupedByDay: IMessageGrouped = {};
        rawData.forEach(msg => {
            const formatted = formatTimestamp(msg.createAt);
            const dateKey = formatted?.date || msg.createAt.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
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

    private groupMessages2(groupedByDay: IMessageGrouped): IMessageGrouped {
        const result: IMessageGrouped = {};
        Object.keys(groupedByDay).forEach((key) => {
            result[key] = groupedByDay[key].map((msg, index, arr) => {
                const isSame = index > 0 && msg.senderId === arr[index - 1].senderId;
                return { ...msg, isSame };
            });
        });
        return result;
    }

    private groupMessages(groupedByDay: IMessageGrouped): IMessageGrouped {
        const result: IMessageGrouped = {};

        Object.keys(groupedByDay).forEach((key) => {
            let consecutiveCount = 0;
            let lastSenderId: string | null = null;

            result[key] = groupedByDay[key].map((msg, index, arr) => {
                let isSame = false;

                if (msg.senderId === lastSenderId) {
                    consecutiveCount++;
                    isSame = true;
                    if (consecutiveCount >= 3) {
                        consecutiveCount = 0;
                        isSame = false;
                    }

                } else {
                    consecutiveCount = 0;
                    isSame = false;
                    lastSenderId = msg.senderId;
                }

                return { ...msg, isSame };
            });
        });

        return result;
    }

    private parseLocalDate(dateString: string) {
        const normalized = dateString.includes(' ')
            ? dateString.replace(' ', 'T')
            : `${dateString}T00:00:00`;

        const date = new Date(normalized);

        return {
            dateObject: date,
            datafull: date.toLocaleString(),
            date: date.toLocaleDateString(),
            time: date.toTimeString().split(' ')[0]
        };
    }



    private mergeMessages(
        array1: mls.msg.MessagePerformanceCache[],
        array2: mls.msg.MessagePerformanceCache[]
    ): mls.msg.MessagePerformanceCache[] {
        const map = new Map<string, mls.msg.MessagePerformanceCache>();
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
        const messagesInDb = await getMessagesByThreadId(this.actualThread.thread.threadId, this.messagesLimit, 0);
        this.actualMessages = messagesInDb;
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.activeScenerie = 'details';
        this.isLoadingMessages = true;
        try {
            if (!this.userId) return;
            const threadByServer = await this.getThreadInfo(this.actualThread.thread.threadId, this.userId);
            await updateThread(threadByServer.thread.threadId, threadByServer.thread);
            await updateUsers(threadByServer.users);
            await this.loadAllMessages(threadInfo);
        } catch (err: any) {
            throw new Error('Error on loading messages: ' + err.message);
        } finally {
            this.isLoadingMessages = false;
        }
    }

    private async loadAllMessages(threadInfo: IThreadInfo): Promise<void> {
        const messages = await this.getMessages(threadInfo.thread, threadInfo.thread.lastMessageTime || '');
        if (!messages || messages.length === 0 || !this.actualThread || !this.userId) {
            return;
        }
        const newMessages: mls.msg.MessagePerformanceCache[] = [];
        for await (let mm of messages) {
            const messageId = `${mm.threadId}/${mm.createAt}`
            const messageOld = await getMessage(messageId);
            const tempMessage: mls.msg.MessagePerformanceCache = { ...mm, footers: messageOld?.footers || [] };
            newMessages.push(tempMessage);
        }

        await addMessages(newMessages);
        this.actualMessages = this.mergeMessages(this.actualMessages, newMessages);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        const keys = Object.keys(this.actualMessagesParsed).sort();
        const lastKey = keys.length > 0 ? keys[keys.length - 1] : null;
        const lastArray = lastKey ? this.actualMessagesParsed[lastKey] : [];
        const lastMessage = lastArray.length > 0 ? lastArray[lastArray.length - 1] : undefined;
        if (lastMessage) {
            const thread = await updateThread(
                threadInfo.thread.threadId,
                threadInfo.thread,
                lastMessage.content,
                lastMessage.createAt,
                0
            );
            threadInfo.thread = thread;
            notifyThreadChange(thread);
        }
        if (messages.length < 100) return;
        return this.loadAllMessages(threadInfo);
    }

    private async onTitleClick() {
        await this.updateComplete;
        if (this.activeScenerie === 'task') {
            this.activeScenerie = 'details';
            return;
        }
        if (this.activeScenerie === 'details') {
            this.activeScenerie = 'list';
            return;
        }
        if (this.activeScenerie === 'threadDetails') {
            this.activeScenerie = 'details';
            return;
        }
    }

    private onThreadDetailsClick() {
        this.saveScrollPosition();
        this.activeScenerie = 'threadDetails';
    }

    private async handleSend(value: string, opt: { isSpecialMention: boolean, agentName: string }) {
        this.isSystemChangeScroll = true;
        try {
            if (!opt.isSpecialMention) {
                await this.addMessage(value);
            } else {
                await this.addMessageIA(value, opt.agentName);
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    private handlePromptResize(e: CustomEvent) {
        if (this.wasMessagesAtBottom) {
            const chatEl = this.querySelector('.chat-container') as HTMLElement | null;
            if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
        }
    }

    private async addMessage(prompt: string) {
        if (!this.userId || !this.actualThread) return;

        const message: IMessage = this.createTempMessage(prompt, this.userId, this.actualThread.thread.threadId);
        try {
            const context: mls.msg.ExecutionContext = {
                message,
                task: undefined
            }
            const contextToBot = await getBotsContext(this.actualThread.thread, prompt, context);
            const params: mls.msg.RequestAddMessage = {
                action: 'addMessage',
                content: prompt,
                threadId: this.actualThread.thread.threadId,
                userId: this.userId,
            };
            if (contextToBot) params.contextToBot = contextToBot;
            const response = await mls.api.msgAddMessage(params);
            message.isFailed = false;
            message.isFailedError = '';
            this.updateMessage2(true, message, response.message, response.botOutputs);
        } catch (err: any) {
            message.isFailed = true;
            message.isFailedError = err.message;
            message.isLoading = false;
            this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            console.error('Error on send message:' + err.message);
        }
    }

    private async addMessageResponse(task: mls.msg.TaskData) {
        const stepResult = getNextResultStep(task);
        if (!stepResult) return;
        const value = typeof stepResult.result === 'object' ? JSON.stringify(stepResult.result) : stepResult.result;
        if (!addMessage || typeof value !== 'string') return;
        this.addMessage(`IA: ${value} `);
    }

    private async addMessageIA(prompt: string, agentName: string) {
        if (!this.userId || !this.actualThread) return;
        const context = getTemporaryContext(this.actualThread.thread.threadId, this.userId, prompt);
        let agentToCall = AGENTDEFAULT;
        if (agentName) agentToCall = agentName;
        const message: IMessage = this.createTempMessage(prompt, this.userId, this.actualThread.thread.threadId);
        try {
            // const moduleAgent = await import(`/_${PROJECTAGENTDEFAULT}_${agentToCall}`);
            const moduleAgent = await collabImport({ project: PROJECTAGENTDEFAULT, shortName: agentToCall, folder: '' });
            if (!moduleAgent || !moduleAgent.createAgent || typeof moduleAgent.createAgent !== 'function') throw new Error('Invalid agent')
            const agent: IAgent = moduleAgent.createAgent()
            context.message = message;
            await agent.beforePrompt(context);
        } catch (err: any) {
            console.error('Error on send message:' + err.message);
            if (message.isLoading) {
                message.isLoading = false;
                message.isFailed = true;
                message.isFailedError = err.message;
                this.actualMessagesParsed = this.parseMessages(this.actualMessages);
            }
        }
    }

    private async updateMessageAI(context: mls.msg.ExecutionContext, updateThreadDB: boolean, oldContextCreateAt?: string) {
        if (this.activeScenerie !== 'details') return;
        if (!context.message) return;

        const { content, createAt, orderAt, senderId, threadId, taskId, status, taskTitle, taskTitleTranslated, taskStatus,
            taskResults, taskResultsTranslated } = context.message;
        const createAt2 = oldContextCreateAt ? oldContextCreateAt : createAt;
        let messageAdded = this.actualMessages.find((item) =>
            item.content === content &&
            item.senderId === senderId &&
            item.createAt === createAt2 &&
            item.threadId === threadId
        )
        if (!messageAdded) {
            const newMessage: mls.msg.MessagePerformanceCache = {
                content,
                createAt,
                orderAt,
                senderId,
                threadId,
                footers: []
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
            if (status) messageAdded.status = status;
            if (taskTitle) messageAdded.taskTitle = taskTitle;
            if (taskTitleTranslated) messageAdded.taskTitleTranslated = taskTitleTranslated;
            if (taskStatus) messageAdded.taskStatus = taskStatus;
            if (taskResults) messageAdded.taskResults = taskResults;
            if (taskResultsTranslated) messageAdded.taskResultsTranslated = taskResultsTranslated;
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
            isLoading: true,
            isFailed: false,
            isFailedError: '',
            footers: []
        }
        if (taskId) newMessage.taskId = taskId;
        this.actualMessages.push(newMessage);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.requestUpdate();
        return newMessage;
    }

    private async updateMessage2(updateThreadDB: boolean, oldMessage: IMessage, newMessage: mls.msg.Message, outputs: mls.msg.BotOutput[] | undefined) {

        if (updateThreadDB && this.actualThread) {
            const thread = await updateThread(newMessage.threadId, this.actualThread.thread, newMessage.content, newMessage.createAt, 0);
            if (this.actualThread) this.actualThread.thread = thread;
            notifyThreadChange(this.actualThread.thread);
        }

        const footerData: IMessageFooter[] = [];

        outputs?.forEach((item) => {
            const footerItem: IMessageFooter = {
                title: item.botId,
                lines: [item.output]
            }
            footerData.push(footerItem)
        });

        const alreadyExist = this.actualMessages.find(item =>
            item.content === oldMessage.content &&
            item.senderId === oldMessage.senderId &&
            item.createAt === oldMessage.createAt &&
            item.threadId === oldMessage.threadId);
        if (alreadyExist) {
            this.actualMessages = this.actualMessages.map(item => {
                if (
                    item.content === oldMessage.content &&
                    item.senderId === oldMessage.senderId &&
                    item.createAt === oldMessage.createAt &&
                    item.threadId === oldMessage.threadId
                ) {
                    const { isLoading, isFailed, isFailedError, ...rest }: IMessage = { ...newMessage, isSame: oldMessage.isSame, footers: footerData };
                    return rest;
                }
                return item;
            });
        } else this.actualMessages.push({ ...newMessage, footers: footerData });
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);

        const m = newMessage as IMessage;
        delete m.isLoading;
        delete m.isFailed;
        delete m.isFailedError;
        delete m.isSame;
        if (outputs) m.footers = footerData;
        addMessage(m);
        this.isSystemChangeScroll = true;
        this.requestUpdate();
    }

    private async onTaskClick(taskId: string, messageId: string, threadId: string, message: IMessage) {
        this.saveScrollPosition();
        this.activeScenerie = 'loading';
        const task = await this.getTaskUpdate(taskId, messageId, threadId);
        addOrUpdateTask(task);
        this.actualTask = task;
        this.actualMessage = message;
        this.activeScenerie = 'task';
    }

    private async getTaskUpdate(taskId: string, createdAt: string, threadId: string) {
        if (!taskId || !createdAt || !threadId) throw new Error('Invalid args');
        if (!this.userId) throw new Error('Invalid userId');
        const taskData = await mls.api.msgGetTaskUpdate(
            {
                taskId,
                messageId: `${threadId}/${createdAt}`,
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
    private onTaskChange = async (e: Event) => {
        const customEvent = e as CustomEvent;
        const message: mls.msg.Message = customEvent.detail.context.message;
        const task: mls.msg.TaskData = customEvent.detail.context.task;
        const thId = message?.threadId;
        if (!this.actualThread || !thId || thId !== this.actualThread.thread.threadId) return;
        await this.updateMessageAI(customEvent.detail.context, false, customEvent.detail.oldContextCreateAt);
        if (task) await addOrUpdateTask(customEvent.detail.context.task);
    };

    private onTaskCompleted = async (e: Event) => {
        const customEvent = e as CustomEvent;
        const message: mls.msg.Message = customEvent.detail.context.message;
        const task: mls.msg.TaskData = customEvent.detail.context.task;
        const thId = message?.threadId;
        if (!this.actualThread || !thId || thId !== this.actualThread.thread.threadId) return;
        if (task.status === 'done') {
            this.addMessageResponse(task);
        }
    };

    private onTaskDetailsClose = async (_e: Event) => {
        this.onTitleClick();
    };

    private onThreadChange = async (e: Event) => {
        const customEvent = e as CustomEvent;
        await this.updateMessageAI(customEvent.detail, false);
        const thread = customEvent.detail as mls.msg.Thread;
        const threadUpdated = this.userThreads[this.group].find((th) => th.thread.threadId === thread.threadId);
        if (threadUpdated) threadUpdated.thread = { ...threadUpdated.thread, ...thread };
        else if (thread.group === this.group) {
            this.userThreads[this.group] = [...this.userThreads[this.group], { thread, users: [] }];
        }
        this.requestUpdate();
    };

    private onMessageSend = async (e: Event) => {
        const customEvent = e as CustomEvent;
        const message: mls.msg.Message = customEvent.detail.context.message;
        const outputs: mls.msg.BotOutput[] = customEvent.detail.context.botOutput;

        const thId = message?.threadId;
        if (!this.actualThread || !thId || thId !== this.actualThread.thread.threadId) return;
        this.updateMessage2(false, { ...message, footers: [] }, message, outputs);
    };
}

interface IThreadInfo {
    thread: mls.msg.ThreadPerformanceCache,
    users: mls.msg.User[]
}

interface IMessage extends mls.msg.MessagePerformanceCache {
    context?: mls.msg.ExecutionContext,
    lastChanged?: number,
    isSame?: boolean,
    isLoading?: boolean,
    isFailed?: boolean,
    isFailedError?: string,
}

interface IMessageFooter {
    title?: string;
    lines: string[];
    icon?: string; // icon to show in footer, ex: "fa fa-check"
    color?: string; // color of the footer, ex: "#00ff00"
    backgroundColor?: string; // background color of the footer, ex: "#000000"
    timestamp?: string;
}
interface IFilteredThreads {
    _lastMessageDate: {
        dateObject: Date;
        datafull: string;
        date: string;
        time: string;
    };
    thread: mls.msg.ThreadPerformanceCache;
    users: mls.msg.User[];
}
type IMessageGrouped = { [key: string]: IMessage[] }
type IThread = { [key: string]: IThreadInfo[] }
type IScenery = 'list' | 'details' | 'loading' | 'task' | 'threadDetails'
