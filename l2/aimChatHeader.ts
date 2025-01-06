/// <mls shortName="aimChatHeader" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import './_100554_aimChatHelper';

/// **collab_i18n_start** 
const message_pt = {
    titleRoom: 'Sala',
    titleMessage: 'Mensagem',
}
const message_en = {
    titleRoom: 'Room',
    titleMessage: 'Message',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-chat-header-100554')
export class AimChatHeader100554 extends IcaLitElement {

    @propertyDataSource({ type: String, reflect: true }) activeRoom: string | undefined;
    @propertyDataSource({ type: Number, reflect: true }) activeMessage: number | undefined;
    @propertyDataSource({ type: String, reflect: true }) activeFilterRooms: string | undefined;

    private msg: MessageType = messages['en'];

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        console.log('chat header render, activerrom', this.activeRoom)

        return html`
      <h4
        class="title ${this.activeRoom || this.activeMessage ? 'button-back' : ''}"
        @click=${() => this.handleHeaderClick()}>
        ${this.activeRoom || this.activeMessage
                ? html`<i class="fa">&#xf053;</i>`
                : ''}
        ${this.activeMessage
                ? `${this.msg.titleMessage}: ${this.activeMessage}`
                : this.activeRoom
                    ? `${this.msg.titleRoom}: ${this.activeRoom}`
                    : "Collab Chat " + this.activeFilterRooms}
      </h4>
    `;
    }

    handleHeaderClick() {
        if (this.activeMessage) {
            this.activeMessage = undefined;
        } else if (this.activeRoom) {
            this.activeRoom = undefined;
        }
    }

}
