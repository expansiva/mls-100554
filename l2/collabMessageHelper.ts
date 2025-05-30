/// <mls shortName="collabMessageHelper" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

const LS_KEY = 'collabChatPreferences';

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

export type TranslateMode = "none" | "icon" | "text" | "iconText" | "trace"

export interface IChatPreferences {
    translationMode: TranslateMode
    language: string,
    threadMaintenance:string
}