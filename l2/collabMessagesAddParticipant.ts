/// <mls shortName="collabMessagesAddParticipant" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { updateThread } from './_100554_msgDBController';
import { notifyThreadChange } from './_100554_aiAgentHelper';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    btnAddParticipant: 'Adicionar participante',
    labelUserId: 'Nome do usuario ou Id',
    labelPermission: 'Autoridade:',
    errorFieldsAddParticipant: 'Preencha todos os campos!',
    successAddParticipant: 'Usuário adicionado com sucesso',
    threadDetails: 'Detalhes da sala'
}

const message_en = {
    loading: 'Loading...',
    btnAddParticipant: 'Add Participant',
    labelUserId: 'User id or name',
    labelPermission: 'Auth:',
    errorFieldsAddParticipant: 'Fill in all fields!',
    successAddParticipant: 'User added sucessfully',
    threadDetails: 'Thread details'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-messages-add-participant-100554')
export class CollabMessagesAddParticipant100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @property() userId: string | undefined;
    @property() labelOkAddParticipant: string = '';
    @property() labelErrorAddParticipant: string = '';
    @property() userIdOrName = '';
    @property() auth: mls.msg.UserAuth = 'write';
    @property() isAddParticipant: boolean = false;
    @property() actualThread: IThreadActual | undefined;

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <div class="add-participant">
            <label>
                ${this.msg.labelUserId}
                <input 
                    type="text"
                    .value=${this.userIdOrName}
                    @input=${(e: Event) => this.userIdOrName = (e.target as HTMLInputElement).value}
                />
            </label>

            <label>
                ${this.msg.labelPermission}
                <select
                    .value=${this.auth}
                    @change=${(e: Event) => (this.auth as string) = (e.target as HTMLSelectElement).value}
                >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="none">None</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                </select>
            </label>

            <button
                @click=${this.onSubmitAddParticipant}
                ?disabled=${this.isAddParticipant}
            >
                ${this.isAddParticipant ? html`<span class="loader"></span>` : this.msg.btnAddParticipant}
            </button>
            
            ${this.labelOkAddParticipant ? html`<small class="add-participant-ok">${this.labelOkAddParticipant}<small>` : ''}
            ${this.labelErrorAddParticipant ? html`<small class="add-participant-error">${this.labelErrorAddParticipant}<small>` : ''}
        </div>
    `;
    }

    private async onSubmitAddParticipant() {

        this.labelErrorAddParticipant = '';
        this.labelOkAddParticipant = '';

        if (!this.actualThread || !this.userId) {
            return;
        }
        if (!this.userIdOrName || !this.auth) {
            this.labelErrorAddParticipant = this.msg.errorFieldsAddParticipant
            return;
        }

        this.isAddParticipant = true;

        try {
            const response = await mls.api.msgAddUserInThread({
                auth: this.auth,
                userIdOrName: this.userIdOrName,
                threadId: this.actualThread?.thread.threadId,
                userId: this.userId,
            });

            if (response.statusCode !== 200) {
                this.labelErrorAddParticipant = `${response.msg}`;
                this.isAddParticipant = false;
                return;
            }

            if (response.thread) {
                const thr = await updateThread(response.thread.threadId, response.thread);
                notifyThreadChange(thr);
            }

            this.labelOkAddParticipant = `${this.msg.successAddParticipant}`;
            this.userIdOrName = '';
            this.auth = 'write';
            this.isAddParticipant = false;

        } catch (error: any) {
            console.error('Error on add user:', error);
            this.labelErrorAddParticipant = error.message;
            this.isAddParticipant = false;
        }
    }
}

interface IThreadActual {
    thread: mls.msg.ThreadPerformanceCache,
    users: mls.msg.User[]
}
