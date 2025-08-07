/// <mls shortName="collabMessageHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { getTemporaryContext, getUserIdLocalStorage, notifyMessageSendChange } from './_100554_aiAgentHelper';
import { IAgent } from './_100554_aiAgentBase';
import { collabImport } from './_100554_collabImport';

const LS_KEY_OLD = 'collabChatPreferences';
const LOCAL_STORAGE_KEY = '_100554_serviceCollabMessages';
export const AGENTDEFAULT = 'agentPlanner1';
export const PROJECTAGENTDEFAULT = 100554;

export async function registerToken() {

    const token = await mls.events.getFCMTokenForBackend();
    if (token === null) {
        saveNotificationPreferences('denied');
        return token;
    }

    const lastToken = loadNotificationToken();
    if (lastToken === token) return token;
    
    saveNotificationToken(token);

    try {
        const deviceId = crypto.randomUUID();
        saveNotificationDeviceId(deviceId);

        const userResponse = await mls.api.msgGetUserUpdate({ userId: "" });
        await mls.api.msgUpdateUserDetails({
            userId: userResponse.user.userId,
            avatar_url: userResponse.user.avatar_url,
            name: userResponse.user.name,
            status: userResponse.user.status,
            deviceId,
            notificationToken: token
        });

        saveNotificationPreferences('granted');
        return token;
    } catch (err: any) {
        throw new Error('Error on register token' + err.message);
    }

}

export async function addMessage(threadId: string, messageContent: string, contextToBot?: mls.bots.ToolsBeforeSendMessage) {

    const userId = getUserIdLocalStorage() || '';
    if (!userId) throw new Error('Invalid user id');
    const context = getTemporaryContext(threadId, userId, messageContent);

    if (!messageContent.startsWith('@@')) {
        const params: mls.msg.RequestAddMessage = {
            action: 'addMessage',
            content: messageContent,
            threadId: threadId,
            userId: userId,
            contextToBot: contextToBot
        };
        const res = await mls.api.msgAddMessage(params);
        notifyMessageSendChange({ message: res.message, task: undefined })
        return;
    }

    const agentName = extractAgentName(messageContent) || AGENTDEFAULT;
    const moduleAgent = await import(`/_${PROJECTAGENTDEFAULT}_${agentName}`);
    const agent: IAgent = moduleAgent.createAgent();
    await agent.beforePrompt(context);

}

export async function getArgsToBots(): Promise<Record<string, any>> {
    const data = {
        project: mls.actualProject
    }
    return data
}

export async function getBotsContext(thread: mls.msg.Thread, prompt: string, context: mls.msg.ExecutionContext): Promise<Record<string, any>> {

    const argsToBot = await getArgsToBots();
    const botsVarsBefore = mls.bots.getBotContextVarsBeforeMessageSend(thread, prompt);
    const botsVarsBefore2 = mls.bots.getBotContextVarsBeforeMessageSend2(botsVarsBefore, argsToBot);
    const auxContextToBot: Record<string, any>[] = []
    for await (let bot of botsVarsBefore2) {
        try {
            const moduleBot = await collabImport({ project: PROJECTAGENTDEFAULT, shortName: bot.toolName, folder: '' });
            if (!moduleBot || !moduleBot.createAgent || typeof moduleBot.createAgent !== 'function') continue;
            const agent: IAgent = moduleBot.createAgent();
            if (agent && agent.beforeBot && typeof agent.beforeBot === 'function') {
                const argsBot: Record<string, any> = await agent.beforeBot(context, prompt, botsVarsBefore2)
                auxContextToBot.push(argsBot);
            }
        } catch (err: any) {
            console.error(err.message);
            continue;
        }

    }

    const merged = auxContextToBot.reduce((acc, curr) => {
        return { ...acc, ...curr }
    }, {})

    return merged;
}

export function saveNotificationDeviceId(deviceId: string) {
    let dataLocal: CollabMessagesLS | undefined = loadLocalStorage();
    if (!dataLocal) dataLocal = { deviceId }
    else dataLocal.deviceId = deviceId;
    saveLocalStorage(dataLocal);
}

export function loadNotificationDeviceId(): string | null {
    const lsData = loadLocalStorage();
    if (lsData && lsData.deviceId) return lsData.deviceId;
    return null;
}

export function saveNotificationToken(tokenFCM: string) {
    let dataLocal: CollabMessagesLS | undefined = loadLocalStorage();
    if (!dataLocal) dataLocal = { tokenFCM }
    else dataLocal.tokenFCM = tokenFCM;
    saveLocalStorage(dataLocal);
}

export function loadNotificationToken(): string | null {
    const lsData = loadLocalStorage();
    if (lsData && lsData.tokenFCM) return lsData.tokenFCM;
    return null;
}

export function saveNotificationPreferences(notificationPreference: NotificationPermission) {
    let dataLocal: CollabMessagesLS | undefined = loadLocalStorage();
    if (!dataLocal) dataLocal = { notificationPreference }
    else dataLocal.notificationPreference = notificationPreference;
    saveLocalStorage(dataLocal);
}

export function loadNotificationPreferences(): NotificationPermission | null {
    const lsData = loadLocalStorage();
    if (lsData && lsData.notificationPreference) return lsData.notificationPreference;
    return null;
}

export function saveLastTab(lastTab: string) {
    let dataLocal: CollabMessagesLS | undefined = loadLocalStorage();
    if (!dataLocal) dataLocal = { lastTab }
    else dataLocal.lastTab = lastTab;
    saveLocalStorage(dataLocal);
}

export function loadLastTab(): string {
    const lsData = loadLocalStorage();
    if (lsData && lsData.lastTab) return lsData.lastTab;
    return 'CRM';
}

export function loadChatPreferences(): IChatPreferences {
    const savedOld = localStorage.getItem(LS_KEY_OLD);
    if (savedOld) {
        try {
            const data = JSON.parse(savedOld);
            saveChatPreferences(data);
            localStorage.removeItem(LS_KEY_OLD);
        } catch (e) {
            localStorage.removeItem(LS_KEY_OLD);
            console.warn('Invalid preferences in localStorage');
        }
    }

    const lsData = loadLocalStorage();
    if (lsData && lsData.chatPreferences) return lsData.chatPreferences;
    return loadDefaultPreferences();
}

export function saveChatPreferences(chatPreferences: IChatPreferences) {
    let dataLocal: CollabMessagesLS | undefined = loadLocalStorage();
    if (!dataLocal) {
        dataLocal = { chatPreferences }
    } else {
        dataLocal.chatPreferences = chatPreferences;
    }
    saveLocalStorage(dataLocal);
}

function saveLocalStorage(data: CollabMessagesLS) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

function loadLocalStorage() {

    let dataLocal: CollabMessagesLS | undefined;
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) dataLocal = JSON.parse(stored);
        return dataLocal;
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
    }
}

function loadDefaultPreferences(): IChatPreferences {
    return {
        language: document.documentElement?.lang?.split('-')?.shift() || 'en',
        translationMode: 'icon',
        threadMaintenance: ''
    }
}

function extractAgentName(str: string) {
    const match = str.match(/^@@([a-zA-Z]+)/);
    if (!match) return undefined;
    const name = match[1];
    if (name.toLowerCase().startsWith('agent')) {
        return name;
    }
    return 'agent' + name[0].toUpperCase() + name.slice(1);
}

export type TranslateMode = "none" | "icon" | "text" | "iconText" | "trace"

export interface IChatPreferences {
    translationMode: TranslateMode
    language: string,
    threadMaintenance: string
}

export interface CollabMessagesLS {
    lastTab?: string,
    chatPreferences?: IChatPreferences,
    tokenFCM?: string,
    deviceId?: string,
    notificationPreference?: NotificationPermission
}


