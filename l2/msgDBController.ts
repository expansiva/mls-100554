/// <mls shortName="msgDBController" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("msgDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("threads")) {
                db.createObjectStore("threads", { keyPath: "threadId" });
            }
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "userId" });
            }

            if (!db.objectStoreNames.contains("tasks")) {
                db.createObjectStore("tasks", { keyPath: "PK" });
            }

            if (!db.objectStoreNames.contains("messages")) {
                const messageStore = db.createObjectStore("messages", { keyPath: "messageId" });
                messageStore.createIndex("byThreadId", "threadId", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao abrir o IndexedDB");
    });
}

export async function addMessages(messages: mls.msg.Message[]): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("messages", "readwrite");
        const store = tx.objectStore("messages");

        for (const message of messages) {
            const newMessage = {
                ...message,
                messageId: `${message.createAt}/${message.threadId}`,
            };
            store.put(newMessage);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro ao adicionar mensagens");
        tx.onabort = () => reject("Transação abortada ao adicionar mensagens");
    });
}

export async function addMessage(message: mls.msg.Message): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("messages", "readwrite");
        const store = tx.objectStore("messages");
        const newMessage = {
            ...message,
            messageId: `${message.createAt}/${message.threadId}`,
        }
        store.put(newMessage);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro ao adicionar task");
        tx.onabort = () => reject("Transação abortada");
    });
}

export async function getMessage(messageId: string): Promise<mls.msg.Message | undefined> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("messages", "readonly");
        const store = tx.objectStore("messages");
        const request = store.get(messageId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao buscar mensagem");
    });
}

export async function getMessagesByThreadId(
  threadId: string,
  limit: number = 15,
  offset: number = 0
): Promise<mls.msg.Message[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("messages", "readonly");
    const store = tx.objectStore("messages");
    const index = store.index("byThreadId");

    const range = IDBKeyRange.only(threadId);
    const request = index.openCursor(range, "prev"); // "prev" = mais recentes primeiro

    const messages: mls.msg.Message[] = [];
    let skipped = 0;

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor || messages.length >= limit) {
        resolve(messages);
        return;
      }

      if (skipped < offset) {
        skipped++;
        cursor.continue();
        return;
      }

      messages.push(cursor.value);
      cursor.continue();
    };

    request.onerror = () => reject("Erro ao buscar mensagens por threadId com paginação");
  });
}


export async function getAllMessagesByThreadId(threadId: string): Promise<mls.msg.Message[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("messages", "readonly");
        const store = tx.objectStore("messages");
        const index = store.index("byThreadId");
        const request = index.getAll(IDBKeyRange.only(threadId));

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao buscar mensagens por threadId");
    });
}

export async function addTask(task: mls.msg.TaskData): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");
        store.put(task);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro ao adicionar task");
        tx.onabort = () => reject("Transação abortada");
    });
}

export async function getTask(taskId: string): Promise<mls.msg.TaskData | undefined> {
    const db = await openDB();
    const tx = db.transaction("tasks", "readonly");
    const store = tx.objectStore("tasks");

    return new Promise((resolve, reject) => {
        const request = store.get(taskId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao buscar task");
    });
}


export async function syncTask(taskFromServer: mls.msg.TaskData): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");
        store.put(taskFromServer);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro na transação de sincronização de task");
        tx.onabort = () => reject("Transação de sincronização de task abortada");
    });
}


export async function listThreads(): Promise<mls.msg.ThreadPerformanceCache[]> {
    const db = await openDB();
    const tx = db.transaction("threads", "readonly");
    const store = tx.objectStore("threads");
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao listar threads");
    });
}

export async function addThread(thread: mls.msg.Thread): Promise<void> {
    const db = await openDB();

    const threadCache: mls.msg.ThreadPerformanceCache = {
        ...thread,
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0,
        lastSync: getCompactUTC()
    }

    return new Promise((resolve, reject) => {
        const tx = db.transaction("threads", "readwrite");
        const store = tx.objectStore("threads");
        store.put(threadCache);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro ao adicionar thread");
        tx.onabort = () => reject("Transação abortada");
    });
}

export async function updateThread(
    threadId: string,
    lastMessage: string,
    lastMessageTime: string,
    unreadCount: number
): Promise<mls.msg.ThreadPerformanceCache> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("threads", "readwrite");
        const store = tx.objectStore("threads");
        const request = store.get(threadId);

        request.onsuccess = () => {
            const thread = request.result;

            if (!thread) {
                reject(`Thread com ID ${threadId} não encontrada.`);
                return;
            }

            thread.lastMessage = lastMessage;
            thread.lastMessageTime = lastMessageTime;
            thread.unreadCount = unreadCount;
            thread.lastSync = getCompactUTC(); // atualiza o timestamp de sync também
            const updateRequest = store.put(thread);
            updateRequest.onsuccess = () => resolve(thread);
            updateRequest.onerror = () => reject("Erro ao atualizar a thread");
        };

        request.onerror = () => reject("Erro ao buscar a thread");
    });
}

export async function syncThreads(threadsFromServer: mls.msg.Thread[]): Promise<void> {

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("threads", "readwrite");
        const store = tx.objectStore("threads");

        try {
            for (const thread of threadsFromServer) {

                const threadCache: mls.msg.ThreadPerformanceCache = {
                    ...thread,
                    lastMessage: '',
                    lastMessageTime: '',
                    unreadCount: 0,
                    lastSync: getCompactUTC()
                }

                store.put(threadCache);
            }
        } catch (err) {
            reject(`Erro ao inserir threads: ${err}`);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro na transação de sincronização");
        tx.onabort = () => reject("Transação de sincronização abortada");
    });
}

export async function listUsers(): Promise<mls.msg.User[]> {
    const db = await openDB();
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao listar usuários");
    });
}

export async function addUser(user: mls.msg.User): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");
        store.put(user);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro ao adicionar usuário");
        tx.onabort = () => reject("Transação de usuário abortada");
    });
}

export async function syncUsers(usersFromServer: mls.msg.User[]): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");

        try {
            for (const user of usersFromServer) {
                store.put(user); // Assumindo que user.userId está presente
            }
        } catch (err) {
            reject(`Erro ao inserir usuários: ${err}`);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro na transação de sincronização de usuários");
        tx.onabort = () => reject("Transação de sincronização de usuários abortada");
    });
}

export async function getUser(userId: string): Promise<mls.msg.User | undefined> {
    const db = await openDB();
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");

    return new Promise((resolve, reject) => {
        const request = store.get(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao buscar usuário");
    });
}

function getCompactUTC() {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}


