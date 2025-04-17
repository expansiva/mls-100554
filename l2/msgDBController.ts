/// <mls shortName="msgDBController" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("msgDB", 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("threads")) {
                db.createObjectStore("threads", { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao abrir o IndexedDB");
    });
}

export async function listThreads() {
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



export async function syncThreads(threadsFromServer: mls.msg.Thread[]): Promise<void> {

    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("threads", "readwrite");
        const store = tx.objectStore("threads");

        try {
            for (const thread of threadsFromServer) {
                store.put(thread);
            }
        } catch (err) {
            reject(`Erro ao inserir threads: ${err}`);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject("Erro na transação de sincronização");
        tx.onabort = () => reject("Transação de sincronização abortada");
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


