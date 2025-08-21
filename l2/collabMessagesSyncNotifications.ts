/// <mls shortName="collabMessagesSyncNotifications" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { getUserId, loadNotificationDeviceId } from "./_100554_collabMessageHelper";
import { getThread, updateThread, getMessage, addMessages } from './_100554_msgDBController';
import { notifyThreadChange } from './_100554_aiAgentHelper';

export const threadSyncMap = new Map<string, boolean>();
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function removeThreadFromSync(threadId: string) {
    threadSyncMap.delete(threadId);
}

export function listenToThreadEvents() {

    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type !== "thread-update") return;
        console.info(event?.data);
        const id = event.data.id;
        enqueueThreadForSync(event.data?.data?.threadId);
        mls.stor.cache.sendACK(id);
    });

    mls.stor.cache.sendRequestMissed();
}

function enqueueThreadForSync(threadId: string) {
    threadSyncMap.set(threadId, true);
    scheduleNextSync();
}

async function scheduleNextSync() {
    if (syncTimeout || threadSyncMap.size === 0) return;

    syncTimeout = setTimeout(async () => {
        syncTimeout = null;

        const [threadId] = threadSyncMap.entries().next().value;
        threadSyncMap.delete(threadId);

        try {
            await getThreadUpdate(threadId);
        } catch (err) {
            console.error(`Erro ao sincronizar thread ${threadId}`, err);
        }

        scheduleNextSync();
    }, 500);
}

async function getThreadUpdate(threadId: string): Promise<void> {
    const userId = getUserId();
    const deviceId = loadNotificationDeviceId();
    if (!userId) throw new Error('Invalid user id');
    const threadDB = await getThread(threadId);
    if (!threadDB) return;
    const lastOrderAt = threadDB?.lastMessageTime || '';

    try {
        const response = await mls.api.msgGetThreadUpdate({
            threadId,
            userId,
            lastOrderAt,
            deviceId: deviceId || undefined
        });

        if (!response.messages || response.messages.length === 0) return;
        const lastMessage = response.messages[response.messages.length - 1];
        const lastUnreadCount = threadDB && threadDB.unreadCount ? threadDB.unreadCount : 0;

        const thread = await updateThread(
            threadId,
            threadDB,
            lastMessage.content,
            lastMessage.createAt,
            response.messages.length + lastUnreadCount
        );

        const newMessages: mls.msg.MessagePerformanceCache[] = [];
        for await (let mm of response.messages) {
            const messageId = `${mm.threadId}/${mm.createAt}`
            const messageOld = await getMessage(messageId);
            const tempMessage: mls.msg.MessagePerformanceCache = { ...mm, footers: messageOld?.footers || [] };
            newMessages.push(tempMessage);
        }
        await addMessages(newMessages);
        notifyThreadChange(thread);

    } catch (err: any) {
        throw new Error(err.message)
    }
}

