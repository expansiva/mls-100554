/// <mls shortName="collabMessagesPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined } from 'lit';
import { customElement, property, state, query, } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_arrow_up_long } from './_100554_collabIcons';
import { getThread, listUsers } from './_100554_msgDBController';
import { IAgent } from './_100554_aiAgentBase'
import { emojiList } from './_100554_collabMessagesEmojis'

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
    @property() placeholder?: string;
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
        this.allUsers = users;
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
                        placeholder="${ifDefined(this.placeholder)}">
                    </textarea>
                    <button @click=${this.handleSend}>${collab_arrow_up_long}</button>
                    ${this.mentionActive && this.mentionSuggestions.length > 0 ? html`
                        <ul class="mention-suggestions">
                            ${this.mentionSuggestions.map((s, i) => html`
                                <li
                                    class="${i === this.mentionIndex ? 'active' : ''}"
                                    title=${s.description}
                                    @click=${() => this.selectMention(s)}
                                >
                                    ${s.type === 'emoji' ? html`
                                    <span class="emoji-suggestion">${s.text}</span>
                                    <span class="emoji-code">:${s.value}:</span>
                                    ` : s.type === 'agent' ? html`
                                    ${s.avatar_url
                    ? html`<collab-messages-avatar-100554 width="20px" height="20px" avatar=${s.avatar_url}></collab-messages-avatar-100554>`
                    : ''}
                                    <span class="agent-suggestion">${s.text}</span>
                                    ` : s.type === 'user' ? html`
                                    ${s.avatar_url
                    ? html`<collab-messages-avatar-100554 width="20px" height="20px" avatar=${s.avatar_url}></collab-messages-avatar-100554>`
                    : ''}
                                    <span class="user-suggestion">${s.text}</span>
                                    ` : ''}
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
        this.text = target.value;
        this.adjustTextAreaHeight();

        const cursorPos = target.selectionStart;
        const beforeCursor = this.text.slice(0, cursorPos);

        let suggestions: IMentions[] = [];
        let query = '';

        const matchUser = beforeCursor.match(/(?:^|\s)@([a-zA-Z]*)$/);
        if (matchUser && this.acceptAutoCompleteUser) {
            query = matchUser[1];
            suggestions = this.getUserSuggestions(query);
        }

        const matchAgent = beforeCursor.match(/(?:^|\s)@@([a-zA-Z]*)$/);
        if (matchAgent && this.acceptAutoCompleteAgents) {
            query = matchAgent[1];
            suggestions = this.getAgentSuggestions(query);
        }

        const matchEmoji = beforeCursor.match(/::(\w*)$/);
        if (matchEmoji) {
            query = matchEmoji[1];
            suggestions = this.getEmojiSuggestions(query).slice(0, 10);
        }

        if (suggestions.length > 0) {
            this.mentionActive = true;
            this.mentionQuery = query;
            this.mentionSuggestions = suggestions;
            await this.updateComplete;
            this.calculatePosition();
        } else {
            this.mentionActive = false;
            this.mentionSuggestions = [];
            this.mentionQuery = '';
        }
    }

    private getUserSuggestions(query: string): IMentions[] {
        return this.allUsers
            .filter(user => user.name.toLowerCase().startsWith(query.toLowerCase()))
            .map(user => ({
                avatar_url: user.avatar_url,
                text: user.name,
                value: user.name,
                description: user.name,
                type: 'user'
            }));
    }

    private getAgentSuggestions(query: string): IMentions[] {
        return this.allAgents
            .filter(agent =>
                agent.name.toLowerCase().startsWith(query.toLowerCase()) ||
                agent.alias.toLowerCase().startsWith(query.toLowerCase())
            )
            .map(agent => ({
                text: agent.alias,
                value: agent.name,
                description: agent.description,
                avatar_url: agent.avatar_url,
                type: 'agent'
            }));
    }

    private getEmojiSuggestions(query: string): IMentions[] {
        return emojiList
            .filter(e => e.value.startsWith(query.toLowerCase()))
            .map(e => ({
                text: e.text,
                value: e.value,
                description: e.description,
                type: 'emoji'
            }));
            
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
        if (!this.textArea || !suggestion) return;

        const cursorPos = this.textArea.selectionStart;
        const beforeCursor = this.text.slice(0, cursorPos);
        const afterCursor = this.text.slice(cursorPos);

        let newText = '';

        switch (suggestion.type) {
            case 'emoji':
                newText = beforeCursor.replace(/::\w*$/, `${suggestion.text} `) + afterCursor;
                break;
            case 'agent':
                newText = beforeCursor.replace(/@{2}[a-zA-Z]*$/, `@@${suggestion.text} `) + afterCursor;
                break;
            case 'user':
                newText = beforeCursor.replace(/@{1}[a-zA-Z]*$/, `@${suggestion.text} `) + afterCursor;
                break;
        }

        this.text = newText;
        this.mentionActive = false;
        this.mentionSuggestions = [];
        this.mentionQuery = '';
        this.mentionIndex = 0;
        this.actualMention = suggestion;

        setTimeout(() => {
            if (!this.textArea) return;
            const newCursorPos = newText.length - afterCursor.length;
            this.textArea.selectionStart = this.textArea.selectionEnd = newCursorPos;
            this.textArea.focus();
        });
    }


    private extractAgentName(text: string): string | undefined {
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
        if (this.allUsers.length > 0) {
            const sortedUsers = [...this.allUsers].sort((a, b) => b.name.length - a.name.length);
            sortedUsers.forEach(user => {
                const escapedName = user.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(^|\\s)@${escapedName}(?=$|\\s|[.,!?])`, 'g');
                finalText = finalText.replace(regex, `$1[@${user.name}](${user.userId})`);
            });
        }

        if (finalText.startsWith('@@')) {
            isSpecialMention = true;
            agentName = this.extractAgentName(finalText.trim());
        }

        if (this.onSend && typeof this.onSend === 'function') {
            this.onSend(finalText, { isSpecialMention, agentName });
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
    type: 'user' | 'agent' | 'emoji'
}


