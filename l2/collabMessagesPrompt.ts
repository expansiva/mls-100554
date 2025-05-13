/// <mls shortName="collabMessagesPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_arrow_up_long } from './_100554_collabIcons';
import './_100554_collabMessagesAvatar';

@customElement('collab-messages-prompt-100554')
export class CollabMessagesPrompt100554 extends StateLitElement {

    // @property() isSending: boolean = false;
    @property({ type: Function }) onSend: Function | undefined;
    @query('textarea') textArea: HTMLTextAreaElement | undefined;

    @state() text: string = '';
    @state() mentionActive = false;
    @state() mentionQuery = '';
    @state() mentionSuggestions: mls.msg.User[] = [];
    @state() mentionIndex = 0;
    @property() allUsers: mls.msg.User[] = [];

    firstUpdated(prop: any) {
        super.firstUpdated(prop);
        this.adjustTextAreaHeight();
    }

    private adjustTextAreaHeight() {
        const maxHeight = 200;
        const minHeight = 40;

        if (this.textArea) {
            const content = this.text

            if (content === '') {
                this.textArea.style.height = `${minHeight}px`;
            } else {
                this.textArea.style.height = 'auto';
                this.textArea.style.height = Math.min(this.textArea.scrollHeight, maxHeight) + 'px';
            }
        }
    }

    render() {
        return html`
        </div> 
            <div class="wrapper">
                <textarea
                    .value=${this.text}
                    @input=${this.handleInput}
                    @keydown=${this.handleKeyDown}
                    id="prompt_input"
                    placeholder="Digite aqui... (@ para menções)">
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
                        @click=${() => this.selectMention(s.name)}
                    >
                        ${s.avatar_url ? html`<collab-messages-avatar-100554 width="20px" height="20px" avatar=${s.avatar_url}></collab-messages-avatar-100554>` : ''}
                        ${s.name}
                    </li>
                `)}
            </ul>
        ` : ''}

        </div>`
    }

    handleInput(e: MouseEvent) {

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

            if (atSymbol === '@@') {
                this.mentionActive = false;
                this.mentionQuery = '';
                this.mentionSuggestions = [];
            } else {
                this.mentionActive = true;
                this.mentionQuery = query;
                this.mentionSuggestions = this.allUsers.filter(user =>
                    user.name.toLowerCase().startsWith(query.toLowerCase())
                );
            }
        } else {
            this.mentionActive = false;
            this.mentionSuggestions = [];
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }

        if (this.mentionActive) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.mentionIndex = (this.mentionIndex + 1) % this.mentionSuggestions.length;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.mentionIndex =
                    (this.mentionIndex - 1 + this.mentionSuggestions.length) % this.mentionSuggestions.length;
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.selectMention(this.mentionSuggestions[this.mentionIndex].name);
            } else if (e.key === 'Enter') {
                if (this.mentionSuggestions.length > 0) {
                    e.preventDefault();
                    this.selectMention(this.mentionSuggestions[this.mentionIndex].name);
                }
            }
        }
    }

    private selectMention(suggestion: string) {
        if (!this.textArea) return;
        const cursorPos = this.textArea.selectionStart;
        const beforeCursor = this.text.slice(0, cursorPos);
        const afterCursor = this.text.slice(cursorPos);
        const newText = beforeCursor.replace(/@{1,2}[a-zA-Z]*$/, `@${suggestion} `) + afterCursor;

        this.text = newText;
        this.mentionActive = false;
        this.mentionSuggestions = [];
        this.mentionQuery = '';
        this.mentionIndex = 0;

        setTimeout(() => {
            if (!this.textArea) return;
            const newCursorPos = beforeCursor.replace(/@{1,2}[a-zA-Z]*$/, `@${suggestion} `).length;
            this.textArea.selectionStart = this.textArea.selectionEnd = newCursorPos;
            this.textArea.focus();
        });
    }

    async handleSend() {

        if (!this.text) return;
        let finalText = this.text.trim();
        let isSpecialMention = false;

        if (finalText.startsWith('@@')) {
            isSpecialMention = true;
        }

        if (this.onSend && typeof this.onSend === 'function') {
            this.onSend(finalText.trim(), { isSpecialMention });
        }

        this.text = '';
        this.adjustTextAreaHeight();


    }

}
