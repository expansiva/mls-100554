/// <mls shortName="aimChatMessage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import * as chatHelper from './_100554_aimChatHelper';

@customElement('aim-chat-message-100554')
export class AimChatMessage100554 extends StateLitElement {

    @property({ type: Array }) messages: chatHelper.ChatMessage[] = [];
    @property({ type: Boolean }) isUser: boolean | undefined;

    render() {
        const isUser = this.isUser || false;
        if (!this.messages || this.messages.length < 1) {
            return html`<p>No messages found</p>`;
        }
        return html`
        <div class="message-group">
        ${this.messages.map((message, index) => html`
        <div class="message-row">
          <div class="message-card ${isUser ? 'user' : ''}">
            ${index === 0
                ? html`<div class="message-title">${message.sender}</div>`
                : ''}
            <div class="message-content">${message.content}</div>
            <div class="message-footer">
                ${chatHelper.formatMessageTimeCompact(message.timestamp)}
            </div>
          </div>
        </div>
        </div>
        `)}
    `;
    }
}
