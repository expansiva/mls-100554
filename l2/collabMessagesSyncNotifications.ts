/// <mls shortName="collabMessagesSyncNotifications" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { getUserId, loadNotificationDeviceId } from "./_100554_collabMessageHelper";
import { getThread, updateThread, getMessage, addMessages } from './_100554_msgDBController';
import { notifyThreadChange } from './_100554_aiAgentHelper';

export const threadSyncMap = new Map<string, boolean>();
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function removeThreadFromSync(threadId: string) {
    threadSyncMap.delete(threadId);
}

export async function listenToThreadEvents() {

    navigator.serviceWorker.addEventListener('message', async (event) => {
        if ((mls as any).isTraceNotification) console.info(`[NOTIFICATION] Received`)
        if (event.data.type !== "thread-update") return;
        if ((mls as any).isTraceNotification) console.info(`[NOTIFICATION] Data`, event?.data)
        const id = event.data.id;
        enqueueThreadForSync(event.data?.data?.threadId);

        if ((mls as any).isTraceNotification) console.info(`[NOTIFICATION] : sendACK id: ${id}`);
        await mls.stor.cache.sendACK(id);

    });

    if ((mls as any).isTraceNotification) console.info('[NOTIFICATION] : sendRequestMissed');
    await mls.stor.cache.sendRequestMissed();

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
            if ((mls as any).isTraceNotification) console.info(`[NOTIFICATION] : refreshThread : ${threadId}`);
            await getThreadUpdateInBackground(threadId);

        } catch (err) {
            console.error(`Erro ao sincronizar thread ${threadId}`, err);
        }

        scheduleNextSync();
    }, 500);
}

export async function getThreadUpdateInBackground(threadId: string): Promise<void> {
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

        if ((mls as any).isTraceNotification) console.info(`[NOTIFICATION] : getThreadUpdateInBackground threadsPending: ${response.threadsPending}`);

        if (response.threadsPending) {
            for (let threadsPending of response.threadsPending) {
                enqueueThreadForSync(threadsPending);
            }
        }

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

