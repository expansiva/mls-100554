/// <mls shortName="collabMessageHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { getTemporaryContext, getUserIdLocalStorage, notifyMessageSendChange } from './_100554_aiAgentHelper';
import { IAgent } from './_100554_aiAgentBase';

const LS_KEY = 'collabChatPreferences';
export const AGENTDEFAULT = 'agentPlanner1';
export const PROJECTAGENTDEFAULT = 100554;

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

export function loadChatPreferences(): IChatPreferences {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.warn('Invalid preferences in localStorage');
        }
    }
    return loadDefaultPreferences();
}

export function saveChatPreferences(chatPreferences: IChatPreferences) {
    localStorage.setItem(LS_KEY, JSON.stringify(chatPreferences));
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