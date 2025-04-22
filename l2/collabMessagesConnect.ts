/// <mls shortName="collabMessagesConnect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import { collab_chevron_left, collab_arrow_up_long } from './_100554_collabIcons';

import { agentPlanner1 } from './_100554_agentPlanner1';

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

    @property() userId: string | undefined;

    @property() activeScenerie: IScenery = 'list';

    @property() actualThread: IThreadInfo | undefined;

    @property() actualMessages: mls.msg.Message[] = [];

    @property() actualMessagesParsed: IMessageGrouped = {};

    @state() private text: string = '';
    @state() private suggestions: string[] = [];
    @state() private mentionList = ['collabIA'];
    @state() private showSuggestions = false;

    @property({ attribute: false }) userThreads: IThread = {
        CONNECT: [{ "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }, "users": [{ "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "threads": ["20250417133813.1000", "20250417180232.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "threads": ["20250417135645.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] }]
    };

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const unreadCount = 6;

        if (this.activeScenerie === 'loading') {
            return html`<div class="loading">${this.msg.loading}</div>`
        }

        return html`

        <div class="header">
            ${this.activeScenerie === 'details'
                ? html`<span @click=${this.onTitleClick} >${collab_chevron_left} Thread: ${this.actualThread?.thread.name || this.actualThread?.thread.threadId}</span>`
                : html`Threads`
            }
            
        </div>

        ${this.activeScenerie === 'list'
                ? html`
                <ul class="thread-list">
                ${this.userThreads.CONNECT.map((item) => {
                    return html`
                        <li @click=${() => this.onThreadClick(item)} class="thread-item">
                            <div class="thread-content">
                                <div class="thread-item-header">
                                    <span class="thread-name">${item.thread.name || item.thread.threadId}</span>
                                    <span class="last-update">2025-04-01</span>
                                </div>
                                <div class="thread-summary">
                                <span class="last-message">In develpoment</span>
                                    ${unreadCount > 0 ? html`<span class="unread-count">${unreadCount}</span>` : ''}
                                </div>
                            </div>
                        </li>
                    `;
                })}
            </ul>`
                : html`
                <div class="chat-container">
                    
                ${Object.keys(this.actualMessagesParsed).map((key) => {
                    const threadMessages = this.actualMessagesParsed[key];
                    const messageTime = this.parseLocalDate(key);
                    return html`
                        <div class="message-time">${messageTime.date}</div>
                        ${threadMessages.map((message) => {

                        const dateFormated = this.formatTimestamp(message.createAt);
                        const userName = this.actualThread?.users.find((user) => user.userId === message.senderId)?.name || message.senderId;

                        return html`
                                ${message.taskId
                                ? html`
                                        <div class="message ${message.senderId === this.userId ? 'user' : 'system'}">
                                            <widget-ai-task-100554 
                                                taskTitle=${message.content}
                                                taskTime=${dateFormated.time}
                                                taskUserName=${userName}
                                                taskId=${message.taskId}>
                                            </widget-ai-task-100554>
                                        </div>`

                                : html`
                                        <div class="message ${message.senderId === this.userId ? 'user' : 'system'}">
                                            <div class="message-group">
                                                <div class="message-row">
                                                <div class="message-card user">
                                                    <div class="message-title">@${userName}</div>
                                                    <div class="message-content">${message.content}</div>
                                                    <div class="message-footer">${dateFormated.time}</div>
                                                </div>
                                                </div>
                                            </div>
                                        </div> 
                                    `
                            }`
                    })}
                    
                    `
                })}    
                </div> 
                   <div class="wrapper">
                        <textarea
                            .value=${this.text}
                            @input=${this.handleInput}
                            id="prompt_input"
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
                        <button @click=${this.handleSend}>
                            ${collab_arrow_up_long}
                        </button>
                    </div>
                `
            }
        `
    }

    private async getMessages(thread: mls.msg.Thread): Promise<mls.msg.Message[]> {

        if (!this.userId) {
            return [];
        }

        const response = await mls.api.msgGetNextMessages({
            action: 'getNextMessages',
            lastOrderAt: '',
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

    private formatTimestamp(timestamp: string) {
        if (!timestamp || timestamp.length !== 14) {
            throw new Error("Formato de timestamp inválido");
        }

        const year = timestamp.slice(0, 4);
        const month = timestamp.slice(4, 6);
        const day = timestamp.slice(6, 8);
        const hour = timestamp.slice(8, 10);
        const minute = timestamp.slice(10, 12);
        const second = timestamp.slice(12, 14);

        // Cria o objeto Date no formato UTC
        const utcDate = new Date(Date.UTC(
            parseInt(year),
            parseInt(month) - 1,  // Meses são indexados de 0 a 11
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second)
        ));

        // Converte para o horário local
        const localDate = utcDate.toLocaleString('pt-BR', {
            timeZoneName: 'short'
        });

        // Converte os componentes individuais para o formato local
        const localYear = utcDate.getFullYear();
        const localMonth = (utcDate.getMonth() + 1).toString().padStart(2, '0');
        const localDay = utcDate.getDate().toString().padStart(2, '0');
        const localHour = utcDate.getHours().toString().padStart(2, '0');
        const localMinute = utcDate.getMinutes().toString().padStart(2, '0');
        const localSecond = utcDate.getSeconds().toString().padStart(2, '0');

        const date = `${localYear}-${localMonth}-${localDay}`;
        const time = `${localHour}:${localMinute}:${localSecond}`;
        const dateFull = `${date} ${time}`;

        return { dateFull, date, time };
    }

    private async onThreadClick(threadInfo: IThreadInfo) {

        this.activeScenerie = 'loading';
        this.actualThread = threadInfo;
        const messages = await this.getMessages(threadInfo.thread);
        this.actualMessages = messages;
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);

        console.info({
            actual: this.actualThread,
            actualMessages: this.actualMessages,
            actualMessagesParsed: this.actualMessagesParsed
        });

        this.activeScenerie = 'details';
    }

    private onTitleClick() {
        this.activeScenerie = 'list';
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

    private handleSend() {

        const trimmed = this.text.trim();
        const mentionMatch = trimmed.match(/^@(\w+)/);
        const mention = mentionMatch ? mentionMatch[1] : null;
        console.info({
            message: this.text,
            mention
        })
        if (!this.text) return;

        if (!mention) {
            this.addMessage(this.text);
            return;
        }

        if (mention && mention === 'collabIA') {
            this.addMessageIA(this.text);
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
        const newMessage: mls.msg.Message = {
            content,
            createAt,
            orderAt,
            senderId,
            threadId,
        }

        this.actualMessages.push(newMessage);
        this.actualMessagesParsed = this.parseMessages(this.actualMessages);
        this.text = '';
        this.requestUpdate();

        console.info({
            addMessage: response
        });
    }

    private async addMessageIA(prompt: string) {
        if (!this.userId || !this.actualThread) return;

        // const instance = new agentPlanner1(this.actualThread.thread.threadId, this.userId);
        // const ip = instance.getPrompt(prompt);
        // let task = await instance.executePrompt(prompt, ip);

    }

}

export interface CollbaMessagesConnectResponse {
    ok: boolean,
    msg?: string,
    data?: mls.msg.Thread
}

interface IThreadInfo {
    thread: mls.msg.Thread,
    users: mls.msg.User[]
}

type IMessageGrouped = { [key: string]: mls.msg.Message[] }
type IThread = { CONNECT: IThreadInfo[] }
type IScenery = 'list' | 'details' | 'loading'
