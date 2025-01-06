/// <mls shortName="aimChatRooms" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import * as chatHelper from './_100554_aimChatHelper';
import { currentUser, getRooms } from './_100554_aimChatMock';
import { globalState } from './_100554_icaState';

 @customElement('aim-chat-rooms-100554')
 export class AimChatRooms100554 extends IcaLitElement {
    
    @propertyDataSource({ type: Number }) activeRoom: number | undefined;
    @propertyDataSource({ type: Number }) activeMessage: number | undefined;
    @propertyDataSource({ type: String }) activeFilterRooms: string | undefined;

     render() {
         return this.renderRooms("chats");
     }

   renderRooms(group: chatHelper.ChatGroup): TemplateResult {
     const roomsrecords = getRooms();
     const rooms = chatHelper.getChatRoomSummaries(currentUser, roomsrecords, group);
     console.log(rooms)
     return html` 
        <ul class="chat-list">
        ${rooms.map(
       (room) => html`
            <li class="chat-item"  @click=${() => this.handleRoomClick(room.id)}>
              <img class="avatar" src=${room.avatarUrl} alt="user avatar" />
              <div class="chat-content">
                <div class="chat-header">
                  <span class="room-name">${room.roomName}</span>
                  <span class="last-update">${chatHelper.formatChatDate(room.lastUpdate)}</span>
                </div>
                <div class="chat-summary">
                  <span class="last-message">${room.lastMessageSummary}</span>
                  ${room.unreadCount > 0 ? html`<span class="unread-count">${room.unreadCount}</span>` : ''}
                </div>
              </div>
            </li>
          `
     )}
      </ul>        
        `;
   }

   handleRoomClick(id: number): void {
     this.activeRoom = id;
   }

 }

