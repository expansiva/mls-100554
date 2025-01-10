/// <mls shortName="aimChatHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { globalState, initState } from './_100554_icaState';

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: number;
  roomName: string;
  group: ChatGroup;
  avatarUrl: string;
  lastSeenId: number;
  messages: ChatMessage[];
}

export interface CurrentUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  lastSeenChats: { [roomId: number]: Date }; // Última vez que viu cada sala, usando o ID da sala
}

export type ChatGroup = 'chats' | 'docs';

export interface ChatRoomSummaries {
  id: number;
  roomName: string;
  avatarUrl: string;
  lastUpdate: Date;
  unreadCount: number;
  lastMessageSummary: string;
}

export function getMessages(
  user: CurrentUser,
  chatRooms: ChatRoom[],
  roomId: number
): ChatMessage[] {
  const room = chatRooms.find((room) => room.id === roomId);
  if (!room) {
    console.warn(`Room with ID ${roomId} not found`);
    return [];
  }
  return room.messages
    .slice()
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  // .slice(-100);
}

export function getMessagesGroup(
  chatRooms: ChatRoom[],
  roomId: number,
  messages: number[]
): ChatMessage[] {
  const room = chatRooms.find((room) => room.id === roomId);
  if (!room) {
    console.warn(`Room with ID ${roomId} not found`);
    return [];
  }

  return room.messages
    .filter((message) => messages.includes(message.id))
    .sort((a, b) => messages.indexOf(a.id) - messages.indexOf(b.id));
}

export function getChatRoomSummaries(
  user: CurrentUser,
  chatRooms: ChatRoom[],
  group: ChatGroup,
): ChatRoomSummaries[] {
  return chatRooms
    .filter((room) => room.group === group)
    .map((room) => {
      const lastSeenId = user.lastSeenChats[room.id] || new Date(0);
      const unreadCount = room.messages.filter((msg) => msg.timestamp > lastSeenId).length;
      const lastUpdate = room.messages[room.messages.length - 1]?.timestamp || new Date(0);
      const lastMessage = room.messages[room.messages.length - 1];
      const lastMessageSummary = lastMessage
        ? `${lastMessage.sender}: ${lastMessage.content}`
        : 'no msg';

      return {
        roomName: room.roomName,
        id: room.id,
        avatarUrl: room.avatarUrl,
        lastUpdate,
        unreadCount,
        lastMessageSummary,
      };
    })
    .sort((a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime());
}

export function formatChatDate(
  date: Date,
  language: string = navigator.language
): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisWeek =
    date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

  if (isToday) {
    return new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit' }).format(date);
  } else if (isThisWeek) {
    return new Intl.DateTimeFormat(language, { weekday: 'long' }).format(date);
  } else {
    return new Intl.DateTimeFormat(language, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }
}

export function formatMessageTime(date: Date): string {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Hoje, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Ontem, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString();
}

export function formatMessageTimeCompact(date: Date): string {
  return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}


export const pathActiveRoom = "{{globalState.chat.activeRoom}}";
export const pathActiveMessage = "{{globalState.chat.activeMessage}}";
export const pathActiveFilterRooms = "{{globalState.chat.activeFilterRooms}}";

function initDataSource() {
  if (globalState?._ica?.globalState?.chat) return;
  initState('globalState.chat', {
    activeRoom: "",
    activeMessage: "",
    activeFilterRooms: ""
  });

}

initDataSource();
