/// <mls shortName="collabMessagesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { addThread } from './_100554_msgDBController';
import { notifyThreadChange } from './_100554_aiAgentHelper';
import './_100554_collabInputTag';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    threadName: 'Nome da thread',
    visibility: 'Visibilidade',
    visibilityPublic: 'Pública',
    visibilityPrivate: 'Privada',
    visibilityCompany: 'Empresa',
    visibilityTeam: 'Time',
    group: 'Grupo',
    languages: 'Idiomas',
    languagesHint: 'Detectado e atualizado com base nos idiomas dos usuários participantes.',
    validateFormError: 'Preencha todos os campos obrigatórios.',
    userError: 'ID de usuário inválido.',
    btnAdd: 'Adicionar thread',
    successSaving: 'Alterações salvas com sucesso!',

}

const message_en = {
    loading: 'Loading...',
    threadName: 'Thread name',
    visibility: 'Visibility',
    visibilityPublic: 'Plubic',
    visibilityPrivate: 'Private',
    visibilityCompany: 'Company',
    visibilityTeam: 'Team',
    group: 'Group',
    languages: 'Languages',
    languagesHint: 'Detected and updated based on the languages of participating users.',
    validateFormError: 'Please fill in all required fields.',
    userError: 'Invalid user ID.',
    btnAdd: 'Add thread',
    successSaving: 'Saving sucessfully',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-messages-add-100554')
export class CollabMessagesAdd100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    @state() private threadName: string = '';
    @state() private visibility: mls.msg.ThreadVisibility = 'private';
    @state() private group: mls.msg.ThreadGroup = 'CRM';
    @state() private languages: string[] = [];
    @state() private isLoading: boolean = false;

    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() userId: string | undefined;

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <div class="section-add">
            <label>${this.msg.threadName}
                <input type="text" name="name" required
                    .value=${this.threadName}
                    @input=${(e: Event) => this.threadName = (e.target as HTMLInputElement).value}>
            </label>

            <label> ${this.msg.visibility}
                <select name="visibility" required
                    .value=${this.visibility}
                    @change=${(e: Event) => this.visibility = (e.target as HTMLSelectElement).value as mls.msg.ThreadVisibility}>
                      <option value="public">${this.msg.visibilityPublic}</option>
                    <option value="private">${this.msg.visibilityPrivate}</option>
                    <option value="company">${this.msg.visibilityCompany}</option>
                    <option value="team">${this.msg.visibilityTeam}</option>
                </select>
            </label>

            <label> ${this.msg.group}
                <select name="group" required
                    .value=${this.group}
                    @change=${(e: Event) => this.group = (e.target as HTMLSelectElement).value as mls.msg.ThreadGroup}>
                    <option value="CRM">CRM</option>
                    <option value="TASK">TASK</option>
                    <option value="DOCS">DOCS</option>
                    <option value="CONNECT">CONNECT</option>
                    <option value="APPS">APPS</option>
                </select>
            </label>

            <label> ${this.msg.languages}
                <collab-input-tag-100554 
                    .value=${this.languages.join(',')}
                    .onValueChanged=${(value: string) => this.languages = value.split(',')}
                    id="languageInput"
                ></collab-input-tag-100554>
                <small> ${this.msg.languagesHint}</small>
            </label>

            <button
                @click=${this.addNewThread}
                ?disabled=${this.isLoading}
                >
                ${this.isLoading ? html`<span class="loader"></span>` : this.msg.btnAdd}
            </button>

            ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
            ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}   
        </div>`;
    }

    private validateForm(): boolean {
        if (!this.threadName.trim()) return false;
        if (!this.group) return false;
        if (!this.visibility) return false;
        return true;
    }

    private async addNewThread() {

        if (!this.validateForm()) {
            this.labelError = this.msg.validateFormError;
            this.isLoading = false;
            return;
        }

        if (!this.userId) {
            this.labelError = this.msg.userError;
            this.isLoading = false;
            return;
        }

        const params: mls.msg.RequestAddThread = {
            action: 'addThread',
            name: this.threadName,
            group: this.group,
            languages: this.languages,
            userId: this.userId,
            visibility: this.visibility,
            status: 'active'
        };

        this.isLoading = true;

        try {
            const response = await mls.api.msgAddThread(params);

            this.labelOk = `${this.msg.successSaving}`;
            if (response.thread) {
                const thr = await addThread(response.thread);
                notifyThreadChange(thr);

            }

        } catch (err: any) {
            console.error(err);
            this.labelError = err.message;
        } finally {
            this.isLoading = false;
        }
    }
}

