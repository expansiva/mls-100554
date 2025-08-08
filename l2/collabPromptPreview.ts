/// <mls shortName="collabPromptPreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { loadChatPreferences, getUserId } from './_100554_collabMessageHelper';
import { getTemporaryContext } from './_100554_aiAgentHelper';
import { createAgent } from './_100554_agentWebCare';

export const initCollabICATree = '';

const message_pt = {
    send: 'Enviar',
    overlay: 'Digite seu prompt'
}

const message_en = {
    send: 'Send',
    overlay: 'Edit your prompt'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}

@customElement('collab-prompt-preview-100554')
export class CollabFCATree extends CollabLitElement {
    private msg: MessageType = messages['en'];

    @property() page: string = '';
    @query('#inputpromptpreview') inputpromptpreview: HTMLInputElement | undefined;
    @state() private loading: boolean = false;

    render() {
        return html`
        <div class="input-wrapper">
            <input
                type="text"
                id="inputpromptpreview"
                placeholder="Digite sua mensagem..."
                ?disabled=${this.loading}
            />
            <button type="button" @click=${this.clickSend} ?disabled=${this.loading}>
                ${this.loading
                ? html`<span class="loader"></span>`
                : this.msg.send
            }
            </button>
        </div>
        `;
    }

    private async clickSend() {

        if (!this.page) {
            this.sendError('Erro page not selected');
            return;
        }

        const v = this.inputpromptpreview?.value || '';

        if (!v) {
            this.sendError('Error: Invalid prompt');
            return;
        }

        this.loading = true;
        if (this.inputpromptpreview) this.inputpromptpreview.value = '';

        try {
            await this.fireCollab(JSON.stringify({ page: this.page, prompt: v }));
        } catch (err: any) {
            this.sendError('Error on send message:' + err.message);
        } finally {
            this.loading = false;
        }
    }

    private sendError(erro: string) {
        const father = this.closest('service-preview-100554') as any;
        if (!father) return;
        if (father.setError) father.setError(erro);
    }

    private async fireCollab(prompt: string) {

        const pref = loadChatPreferences();
        if (!pref.threadMaintenance) {
            this.sendError('Please configure your maintenance thread at: CollabMessage > Settings > Chat Preferences');
            return;
        }

        const userId = getUserId();
        const threadId = pref.threadMaintenance;
        if (!userId) return;

        const context = getTemporaryContext(threadId, userId, '@@ agentWebCare ' + prompt);
        const agent = createAgent();
        await agent.beforePrompt(context);

    }
}