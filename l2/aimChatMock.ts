/// <mls shortName="aimChatMock" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ChatMessage, ChatRoom, CurrentUser, ChatGroup } from './_100554_aimChatHelper';

export const getRooms = (): ChatRoom[] => {
  const rooms = chatRooms;
  rooms[0].messages = addRandomMessages(rooms[0].messages);
  return rooms;
}

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    roomName: "encontro final de ano",
    group: "chats",
    avatarUrl: "https://lh6.googleusercontent.com/-Gup9IkqANhQ/AAAAAAAAAAI/AAAAAAAAIFc/38cLYfRcRbg/s96-c/photo.jpg",
    lastSeenId: 1002,
    messages: [
    { id: 1000, sender: "@joão", content: "Até mais!", timestamp: new Date("2024-12-31T01:03:50") },
    { id: 1001, sender: "@ana", content: "Como foi o final de semana?", timestamp: new Date("2024-12-31T12:06:50") },
    { id: 1002, sender: "@joão", content: "Preciso de ajuda com algo.", timestamp: new Date("2024-12-31T13:55:50") },
    { id: 1003, sender: "@josé", content: "Entendido!", timestamp: new Date("2024-12-31T08:26:50") },
    { id: 1004, sender: "@joão", content: "Podemos conversar mais tarde?", timestamp: new Date("2024-12-31T14:08:50") },
    { id: 1005, sender: "@pedro", content: "Podemos conversar mais tarde?", timestamp: new Date("2024-12-31T10:56:50") },
    { id: 1006, sender: "@ana", content: "Como foi o final de semana?", timestamp: new Date("2024-12-31T17:02:50") },
    { id: 1007, sender: "@ana", content: "Olá, pessoal!", timestamp: new Date("2024-12-30T23:49:50") },
    { id: 1008, sender: "@josé", content: "Gostei da ideia!", timestamp: new Date("2024-12-31T01:36:50") },
    { id: 1009, sender: "@ana", content: "Gostei da ideia!", timestamp: new Date("2024-12-31T14:24:50") },
    { id: 1010, sender: "@joão", content: "Entendido!", timestamp: new Date("2024-12-30T21:08:50") },
    { id: 1011, sender: "@joão", content: "Até mais!", timestamp: new Date("2024-12-31T02:24:50") },
    { id: 1012, sender: "@ana", content: "Tudo bem?", timestamp: new Date("2024-12-31T20:17:50") },
    { id: 1013, sender: "@maria", content: "Entendido!", timestamp: new Date("2024-12-31T19:25:50") },
    { id: 1014, sender: "@josé", content: "Podemos conversar mais tarde?", timestamp: new Date("2024-12-31T18:59:50") },
    { id: 1015, sender: "@maria", content: "Obrigado!", timestamp: new Date("2024-12-31T02:09:50") },
    { id: 1016, sender: "@joão", content: "Olá, pessoal!", timestamp: new Date("2024-12-31T13:42:50") },
    { id: 1017, sender: "@maria", content: "Vamos nos encontrar, hoje é o ultimo dia do ano?", timestamp: new Date("2024-12-31T19:02:50") },
    { id: 1018, sender: "@josé", content: "Vamos nos encontrar?, amanhã é o ultimo dia do ano", timestamp: new Date("2024-12-30T22:11:50") },
    { id: 1019, sender: "@maria", content: "Gostei da ideia!", timestamp: new Date("2024-12-31T17:14:50") },
    // Messages from earlier this week
    { id: 1020, sender: "@pedro", content: "Obrigado!", timestamp: new Date("2024-12-27T20:55:50") },
    { id: 1021, sender: "@maria", content: "Olá, pessoal!", timestamp: new Date("2024-12-29T20:55:50") },
    { id: 1022, sender: "@josé", content: "Tudo bem?", timestamp: new Date("2024-12-28T20:55:50") },
    // Older messages
    { id: 1023, sender: "@joão", content: "Olá, pessoal!", timestamp: new Date("2024-11-30T20:55:50") },
    { id: 1024, sender: "@pedro", content: "Como foi o final de semana?", timestamp: new Date("2024-11-25T20:55:50") },
    { id: 1025, sender: "@maria", content: "Obrigado!", timestamp: new Date("2024-11-22T20:55:50") },
    // Months ago
    { id: 1050, sender: "@pedro", content: "Tudo bem?", timestamp: new Date("2024-09-15T20:55:50") },
    { id: 1070, sender: "@ana", content: "Entendido!", timestamp: new Date("2024-08-30T20:55:50") },
    { id: 1090, sender: "@joão", content: "Como foi o final de semana?", timestamp: new Date("2024-07-11T20:55:50") },
    // From the current year
    { id: 1091, sender: "@maria", content: "Vamos nos encontrar?", timestamp: new Date("2024-05-23T20:55:50") },
    { id: 1092, sender: "@josé", content: "Entendido!", timestamp: new Date("2024-04-12T20:55:50") },
    { id: 1093, sender: "@maria", content: "Entendido!", timestamp: new Date("2024-03-10T20:55:50") },
    ],
  },
  {
    id: 2,
    roomName: "@josé",
    group: "chats",
    avatarUrl: "https://lh6.googleusercontent.com/-Gup9IkqANhQ/AAAAAAAAAAI/AAAAAAAAIFc/38cLYfRcRbg/s96-c/photo.jpg",
    lastSeenId: 2001,
    messages: [
      { id: 2001, sender: "@joão", content: "Você pode enviar o relatório?", timestamp: new Date("2024-12-22T13:20:00") },
      { id: 2002, sender: "@josé", content: "Claro, já estou terminando!", timestamp: new Date("2024-12-22T13:30:00") },
    ],
  },
  {
    id: 3,
    roomName: "@maria",
    avatarUrl: "https://lh6.googleusercontent.com/-Gup9IkqANhQ/AAAAAAAAAAI/AAAAAAAAIFc/38cLYfRcRbg/s96-c/photo.jpg",
    group: "chats",
    lastSeenId: 3002,
    messages: [
      { id: 3001, sender: "@maria", content: "Oi, João! Conseguiu ver o design?", timestamp: new Date("2023-12-22T10:00:00") },
      { id: 3002, sender: "@joão", content: "Sim, achei ótimo! Vamos discutir mais tarde.", timestamp: new Date("2023-12-22T10:15:00") },
    ],
  },
];

export const currentUser: CurrentUser = {
  id: "user1",
  username: "@joão",
  displayName: "João Silva",
  avatarUrl: "https://lh6.googleusercontent.com/-Gup9IkqANhQ/AAAAAAAAAAI/AAAAAAAAIFc/38cLYfRcRbg/s96-c/photo.jpg",
  lastSeenChats: {
    1: new Date("2024-12-05T13:42:56"),
    2: new Date("2024-12-22T13:25:00"),
    3: new Date("2024-12-22T10:10:00"),
  },
};

function addRandomMessages(messages: ChatMessage[]): ChatMessage[] {
  const newMessages: ChatMessage[] = [];
  const senders = ["@josé", "@joão", "@maria"];
  const contents = [
    "Olá, como vai?",
    "Gostei da ideia!",
    "Vamos nos encontrar amanhã?",
    "Tudo certo por aqui.",
    "Não sei se entendi.",
    "Isso parece ótimo!",
    "Mais detalhes, por favor.",
    "Obrigado!",
    "Que bom ouvir isso!",
    "Podemos marcar uma reunião?",
  ];

  for (let i = 0; i < 10000; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30); // Últimos 30 dias
    const randomTimestamp = new Date();
    randomTimestamp.setDate(randomTimestamp.getDate() - randomDaysAgo);
    randomTimestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

    const message: ChatMessage = {
      id: messages.length + i + 1, // Garante IDs únicos
      sender: senders[Math.floor(Math.random() * senders.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      timestamp: randomTimestamp,
    };

    newMessages.push(message);
  }
  const allMessages = [...messages, ...newMessages];
  return allMessages.sort((a, b) => Math.random() - 0.5);
}
