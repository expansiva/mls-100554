/// <mls shortName="collabMessages" project="100554" enhancement="_blank" />

import { CollabMessagesBase, ITranslations } from './_100554_collabMessagesBase';

export class CollabMessages {

    public static messages:ITranslations

    private static my_messages: IMyMessages = {};

    private static imports = {
        'en-US': './_100554_collabMessagesEn',
        'pt-BR': './_100554_collabMessagesPt',
    }

    public static async setLanguage(language: Languages) {

        try {

            if (!this.imports[language]) return;

            if (this.my_messages[language]) {
                this.messages = this.my_messages[language].collab_messages;
                (window as any).collab_messages = this.my_messages[language].collab_messages;
                return;
            }

            const { getInstance } = await import(this.imports[language]);
            this.my_messages[language] = getInstance();
            this.messages = this.my_messages[language].collab_messages;
            (window as any).collab_messages = this.my_messages[language].collab_messages;
            return;

        } catch (e) {

            return;

        }

    }


}

type Languages = 'en-US' | 'pt-BR';

interface IMyMessages {
    [key: string]: CollabMessagesBase
}