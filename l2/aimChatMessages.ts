/// <mls shortName="aimChatMessages" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult, noChange } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import './_100554_aimChatMessage';
import * as chatHelper from './_100554_aimChatHelper';
import * as chatMock from './_100554_aimChatMock';

/// **collab_i18n_start** 
const message_pt = {
  lazyLoading: 'Carregar mais ...',
  unreadMessages: 'Mensagens não lidas',
}
const message_en = {
  lazyLoading: 'Load more ...',
  unreadMessages: 'Mensages not read',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**


@customElement('aim-chat-messages-100554')
export class AimChatMessages100554 extends IcaLitElement {

  @propertyDataSource({ type: Number }) activeRoom: number | undefined;
  @propertyDataSource({ type: Number }) activeMessage: number | undefined;
  @propertyDataSource({ type: String, reflect: true }) activeFilterRooms: string | undefined;

  private offsetUnread = 3000;
  private minVisibleGroups = 20000;
  private lazyLoadingOffset = 0;
  private scrollToUnreadMessages = true;
  private msg: MessageType = messages['en'];

  
  firstUpdated() {
    this.scrollMessages();
  }

  updated() {
    this.scrollMessages();
  }

  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const currentUser = chatMock.currentUser;
    const roomId = Number(this.activeRoom) || 0;
    const fm = this.groupMessagesByUserAndDate(currentUser, roomId);

    const rc = html`    
        <div class="chat-container">
        ${this.renderLazyLoadingIfNeed(fm.showLazyLoading)}
        ${fm.groups.map((group, index) => {
      const isUser = group.sender === currentUser.username;

      const showDateHeader = index === 0 ||
        (group.date && fm.groups[index - 1]?.date?.toDateString() !== group.date.toDateString());

      return html`
              ${showDateHeader
          ? html`<div class="message-time">${chatHelper.formatMessageTime(group.date!)}</div>`
          : ''}
              ${group.showUnreadTitle
          ? html`<div class="unread-label" id="unread-${group.messagesId[0]}">${this.msg.unreadMessages}</div>`
          : ''}
              <aim-chat-message-100554
                class="${isUser ? 'user' : 'other'}" 
                .isUser="${isUser}"
                .messages="${group.messagesId.map((id) =>
            fm.messages.find((msg) => msg.id === id)
          )}"
              ></aim-chat-message-100554>
            `;
    })}
      </div>
      `;
    return rc;

  }

  renderLazyLoadingIfNeed(showLazyLoading: boolean): TemplateResult {
    if (!showLazyLoading) return html``;
    return html`
        <div class="lazyloading"
        @click=${() => {
        this.lazyLoadingOffset = this.lazyLoadingOffset + 10;
        this.scrollToUnreadMessages = false;
        this.requestUpdate();
      }}>${this.msg.lazyLoading}</div>
    `;
  }


  private readMessages(currentUser: chatHelper.CurrentUser, roomId: number): chatHelper.ChatMessage[] {
    return chatHelper.getMessages(currentUser, chatMock.getRooms(), roomId)
      ;
  }

  private getGroupsToRender(fm: FilteredMessages): FilteredMessages {
    // this.offsetUnread = 5; -> min start on 5 groups before unread
    // this.minVisibleMessages = 200; -> min visible groups
    // lazyLoadingOffset = 0; -> start on 0, add after 'load More'

    if (fm.groups.length === 0) return fm;
    const unreadIndex = fm.groups.findIndex((group) => group.showUnreadTitle);
    const startGroupIndex = unreadIndex > -1
      ? Math.max(unreadIndex - this.offsetUnread - this.lazyLoadingOffset, 0)
      : Math.max(fm.groups.length - this.minVisibleGroups - this.lazyLoadingOffset, 0);
    const endGroupIndex = Math.min(
      startGroupIndex + this.minVisibleGroups,
      fm.groups.length
    );
    fm.groups = fm.groups.slice(startGroupIndex, endGroupIndex);
    if (startGroupIndex > 0)
      fm.showLazyLoading = true;
    return fm;
  }

  private groupMessagesByUserAndDate(currentUser: chatHelper.CurrentUser, roomId: number): FilteredMessages {
    const fm: FilteredMessages = {
      lastSeen: currentUser.lastSeenChats[roomId] || new Date(0),
      showLazyLoading: false,
      messages: this.readMessages(currentUser, roomId),
      groups: []
    }
    if (fm.messages.length === 0) return fm;

    let currentGroup: GroupedMessages | null = null;
    let unreadTitleSet = false;

    for (let i = 0; i < fm.messages.length; i++) {
      const message = fm.messages[i];
      const messageDate = message.timestamp.toDateString();

      const isFirstUnread: boolean = !unreadTitleSet && message.timestamp > fm.lastSeen;
      if (isFirstUnread) unreadTitleSet = true;

      if (
        currentGroup &&
        currentGroup.sender === message.sender &&
        !isFirstUnread &&
        messageDate === fm.messages[i - 1].timestamp.toDateString()
      ) {
        currentGroup.messagesId.push(message.id);
      } else {
        if (currentGroup) fm.groups.push(currentGroup);
        currentGroup = {
          showUnreadTitle: isFirstUnread,
          date: new Date(message.timestamp),
          messagesId: [message.id],
          sender: message.sender,
        };
      }
    }
    if (currentGroup) fm.groups.push(currentGroup);
    return this.getGroupsToRender(fm);
  }

  private shouldDisplayTime(prevMessage: chatHelper.ChatMessage, currentMessage: chatHelper.ChatMessage): boolean {
    const dt1 = chatHelper.formatMessageTime(prevMessage.timestamp);
    const dt2 = chatHelper.formatMessageTime(currentMessage.timestamp);
    return dt1 !== dt2;
  }

  private async scrollMessages() {
    // scrool to unread messages ou start
    if (!this.scrollToUnreadMessages) return;
    const unreadLabel = this.renderRoot.querySelector('.unread-label');
    if (unreadLabel) {
      const el = unreadLabel.previousElementSibling || unreadLabel;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}

interface GroupedMessages {
  showUnreadTitle: boolean;
  date: Date;
  messagesId: number[],
  sender: string,
}

interface FilteredMessages {
  lastSeen: Date,
  showLazyLoading: boolean,
  messages: chatHelper.ChatMessage[],
  groups: GroupedMessages[]
}
