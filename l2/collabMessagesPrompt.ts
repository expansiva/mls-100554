/// <mls shortName="collabMessagesPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_arrow_up_long } from './_100554_collabIcons';
import { getThread, listUsers } from './_100554_msgDBController';
import { IAgent } from './_100554_aiAgentBase'
import './_100554_collabMessagesAvatar';

@customElement('collab-messages-prompt-100554')
export class CollabMessagesPrompt100554 extends StateLitElement {

    @query('textarea') textArea: HTMLTextAreaElement | undefined;
    @query('.mention-suggestions') mentionSuggestionsElement?: HTMLElement;
    @query('.wrapper') wrapper?: HTMLElement;
    @property() text: string = '';
    @state() actualMention?: IMentions;
    @state() mentionActive: boolean = false;
    @state() mentionQuery: string = '';
    @state() mentionSuggestions: IMentions[] = [];
    @state() mentionIndex: number = 0;
    @state() allUsers: mls.msg.User[] = [];
    @state() allAgents: IMentionAgent[] = [];

    @state() alreadyLoadingAgents: boolean = false;
    @state() lastScopeLoaded: string | undefined;

    @property({ type: Function }) onSend: Function | undefined;
    @property() threadId?: string;
    @property() scope?: string;
    @property({
        type: Boolean,
        converter: (value: string | null) => value === 'true'
    }) acceptAutoCompleteUser?: boolean = false;
    @property({
        type: Boolean,
        converter: (value: string | null) => value === 'true'
    }) acceptAutoCompleteAgents?: boolean = false;

    firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        this.adjustTextAreaHeight();
        // if (this.acceptAutoCompleteAgents && !this.scope) this.getAgents();
    }

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('threadId')
            && this.threadId !== ''
            && this.threadId !== changedProperties.get('threadId')
            && this.acceptAutoCompleteUser
        ) {
            this.getUsers();
        }
    }

    private async getUsers() {
        if (!this.threadId) return;
        const thread = await getThread(this.threadId.trim());
        if (!thread) return;
        const users: mls.msg.User[] = await listUsers();
        const threadUsers: mls.msg.User[] = [];
        thread.users.forEach((user) => {
            const userDB = users.find((us) => us.userId === user.userId);
            if (userDB) threadUsers.push(userDB);
        });
        this.allUsers = threadUsers;
    }

    private async getAgents() {
        const agentsFiles = await this.getAgentsFiles();
        const agentsPublic = agentsFiles.map((agent: IAgent) => {
            const { visibility, agentName, avatar_url, agentDescription, scope } = agent;
            if (visibility === 'public') {
                let inScope = this.scope ? false : true;
                if (this.scope && scope) {
                    inScope = scope.includes(this.scope);
                }
                if (!this.scope && scope) inScope = false;
                if (inScope) {
                    return {
                        name: agentName,
                        description: agentDescription,
                        avatar_url,
                        alias: agentName.replace('agent', '')
                    }
                }
            }
        }).filter((item) => !!item);
        this.allAgents = agentsPublic as IMentionAgent[];
    }

    private calculatePosition() {
        if (!this.mentionSuggestionsElement || !this.wrapper) return;
        const bound1 = this.wrapper.getBoundingClientRect();
        const bound2 = this.mentionSuggestionsElement.getBoundingClientRect();
        let calc = 0
        if (bound1.top < bound1.height) {
            calc = bound1.top;
        } else {
            calc = bound1.top - bound1.height - bound2.height;
        }
        this.mentionSuggestionsElement.style.top = `${calc}px`;
    }
    private adjustTextAreaHeight() {
        const maxHeight = 200;
        const minHeight = 40;

        if (this.textArea) {
            const prevHeight = this.textArea.offsetHeight;

            if (this.text === '') {
                this.textArea.style.height = `${minHeight}px`;
            } else {
                this.textArea.style.height = 'auto';
                this.textArea.style.height = Math.min(this.textArea.scrollHeight, maxHeight) + 'px';
            }

            const newHeight = this.textArea.offsetHeight;

            if (newHeight !== prevHeight) {
                this.dispatchEvent(new CustomEvent('textarea-resize', {
                    detail: {
                        height: newHeight
                    },
                    bubbles: true,
                    composed: true
                }));
            }
        }
    }

    private async getAgentsFiles(): Promise<IAgent[]> {
        const keys = Object.keys(mls.stor.files);
        const ret: IAgent[] = [];
        for await (const k of keys) {
            if (k.indexOf('agent') < 0) continue;
            const file = mls.stor.files[k];
            const path = `./_${file.project}_${file.shortName}`;
            if (file.extension !== '.ts' || !file.shortName.startsWith('agent')) continue;
            try {
                const mdl = await import(path);
                if (!mdl.createAgent) continue;
                const agent = mdl.createAgent() as IAgent
                ret.push(agent);
            } catch (err) {
                continue;
            }
        }
        return ret;
    }

    render() {
        return html`
    </div>
    <div class="wrapper">
        <textarea
            .value=${this.text}
            @input=${this.handleInput}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
            id="prompt_input"
            placeholder="Digite aqui... (@ para menções) (@@ para agentes)">
        </textarea>
        <button
            @click=${this.handleSend}
        >
            ${collab_arrow_up_long}
        </button>
        ${this.mentionActive && this.mentionSuggestions.length > 0 ? html`
            <ul class="mention-suggestions">
                ${this.mentionSuggestions.map((s, i) => html`
                    <li
                        class="${i === this.mentionIndex ? 'active' : ''}"
                        title=${s.description}
                        @click=${() => this.selectMention(s)}
                    >
                        ${s.avatar_url ? html`<collab-messages-avatar-100554 width="20px" height="20px" avatar=${s.avatar_url}></collab-messages-avatar-100554>` : ''}
                        ${s.text}
                    </li>
                `)}
            </ul>
        ` : ''}
    </div>`
    }

    async handleFocus() {
        if (this.acceptAutoCompleteAgents &&
            (!this.alreadyLoadingAgents || this.scope !== this.lastScopeLoaded)
        ) {
            this.lastScopeLoaded = this.scope;
            this.alreadyLoadingAgents = true;
            this.getAgents();
        }
    }

    async handleInput(e: MouseEvent) {
        if (!e.target) return;
        const target = e.target as HTMLTextAreaElement;
        const value = target.value;
        this.text = value;
        this.adjustTextAreaHeight();
        const cursorPos = target.selectionStart;
        const beforeCursor = value.slice(0, cursorPos);
        const match = beforeCursor.match(/(?:^|\s)(@{1,2})([a-zA-Z]*)$/);
        if (match) {
            const atSymbol = match[1];
            const query = match[2];
            if (atSymbol === '@@' && this.acceptAutoCompleteAgents) {
                this.mentionActive = true;
                this.mentionQuery = query;
                this.mentionSuggestions = (this.allAgents.map(agent => {
                    if (agent.name.toLowerCase().startsWith(query.toLowerCase()) || agent.alias.toLowerCase().startsWith(query.toLowerCase()))
                        return {
                            text: agent.alias,
                            value: agent.name,
                            description: agent.description,
                            avatar_url: agent.avatar_url,
                            type: 'agent'
                        }
                }).filter((item) => item !== undefined)) as IMentions[]
                await this.updateComplete;
                this.calculatePosition();
            } else if (atSymbol === '@' && this.acceptAutoCompleteUser) {
                this.mentionActive = true;
                this.mentionQuery = query;
                this.mentionSuggestions = (this.allUsers.map(user => {
                    if (user.name.toLowerCase().startsWith(query.toLowerCase()))
                        return {
                            avatar_url: user.avatar_url,
                            text: user.name,
                            value: user.name,
                            description: user.name,
                            type: 'user'
                        }
                }).filter((item) => item !== undefined)) as IMentions[];
                await this.updateComplete;
                this.calculatePosition();
            } else {
                this.mentionActive = false;
                this.mentionSuggestions = [];
                this.mentionQuery = '';
            }
        } else {
            this.mentionActive = false;
            this.mentionSuggestions = [];
            this.mentionQuery = '';
        }
    }

    private async handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            await this.handleSend();
            return;
        }
        if (this.mentionActive) {
            const mention = this.mentionSuggestions[this.mentionIndex];
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.mentionIndex = (this.mentionIndex + 1) % this.mentionSuggestions.length;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.mentionIndex =
                    (this.mentionIndex - 1 + this.mentionSuggestions.length) % this.mentionSuggestions.length;
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.selectMention(mention);
            } else if (e.key === 'Enter') {
                if (this.mentionSuggestions.length > 0) {
                    e.preventDefault();
                    this.selectMention(mention);
                }
            }
        }
    }

    private selectMention(suggestion: IMentions) {
        if (!this.textArea) return;
        const cursorPos = this.textArea.selectionStart;
        const beforeCursor = this.text.slice(0, cursorPos);
        const afterCursor = this.text.slice(cursorPos);
        const prefix = suggestion.type === 'agent' ? '@@' : '@';
        const newText = beforeCursor.replace(/@{1,2}[a-zA-Z]*$/, `${prefix}${suggestion.text} `) + afterCursor;
        this.text = newText;
        this.mentionActive = false;
        this.mentionSuggestions = [];
        this.mentionQuery = '';
        this.mentionIndex = 0;
        this.actualMention = suggestion;
        setTimeout(() => {
            if (!this.textArea) return;
            const newCursorPos = beforeCursor.replace(/@{1,2}[a-zA-Z]*$/, `${prefix}${suggestion.text} `).length;
            this.textArea.selectionStart = this.textArea.selectionEnd = newCursorPos;
            this.textArea.focus();
        });
    }

    private extractAgentName(text: string): string | undefined {
        //const match = text.match(/@@(\w+)/);
        const match = text.match(/^@@(\w+)/);
        if (!match) return undefined;
        let value = match[1];
        if (!value.startsWith('agent')) {
            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
            value = 'agent' + capitalized;
        }
        return value;
    }

    async handleSend() {
        if (!this.text) return;
        let finalText = this.text.trim();
        let isSpecialMention = false;
        let agentName: string | undefined;
        if (finalText.startsWith('@@')) {
            isSpecialMention = true;
            agentName = this.extractAgentName(finalText.trim())
        }

        if (this.onSend && typeof this.onSend === 'function') {
            this.onSend(finalText.trim(), { isSpecialMention, agentName });
        }
        this.text = '';
        this.adjustTextAreaHeight();
    }
}

interface IMentionAgent {
    name: string,
    description: string,
    alias: string,
    avatar_url?: string,
}

interface IMentions {
    text: string,
    value: string,
    description: string,
    avatar_url?: string | undefined,
    type: 'user' | 'agent'
}
