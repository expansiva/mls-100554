/// <mls shortName="collabMessagesAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import './_100554_collabInputTag';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    threadName: 'Nome da thread',
    visibility: 'Visibilidade',
    group: 'Grupo',
    languages: 'Idiomas',
    languagesHint: 'Detectado e atualizado com base nos idiomas dos usuários participantes.',
    addLoading: 'Adicionando thread...',
    validateFormError: 'Preencha todos os campos obrigatórios.',
    userError: 'ID de usuário inválido.',
    btnAdd: 'Adicionar thread'
}

const message_en = {
    loading: 'Loading...',
    threadName: 'Thread name',
    visibility: 'Visibility',
    group: 'Group',
    languages: 'Languages',
    languagesHint: 'Detected and updated based on the languages of participating users.',
    addLoading: 'Adding thread...',
    validateFormError: 'Please fill in all required fields.',
    userError: 'Invalid user ID.',
    btnAdd: 'Add thread'
}


type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-messages-add-100554')
export class CollabMessagesAdd100554 extends IcaLitElement {

    private msg: MessageType = messages['en'];

    @state() private threadName: string = '';
    @state() private visibility: mls.msg.ThreadVisibility = 'private';
    @state() private group: mls.msg.ThreadGroup = 'CRM';
    @state() private languages: string[] = [];
    @state() private isLoading: boolean = false; // NOVO

    @property() userId: string | undefined;

    public afterAdd: Function | undefined;

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
                    <option value="public">Pública</option>
                    <option value="private">Privada</option>
                    <option value="company">Empresa</option>
                    <option value="team">Equipe</option>
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

            ${this.isLoading
                ? html`<p>${this.msg.addLoading}</p>`
                : html`<button @click=${this.addNewThread} style="margin-top: 20px;">${this.msg.btnAdd}</button>`
            }
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

            const res: CollbaMessagesAddResponse = { ok: false, msg: this.msg.validateFormError };
            if (this.afterAdd) this.afterAdd(res);
            this.isLoading = false;
            return;
        }

        if (!this.userId) {
            const res: CollbaMessagesAddResponse = { ok: false, msg: this.msg.userError };
            if (this.afterAdd) this.afterAdd(res);
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
            const res: CollbaMessagesAddResponse = { ok: true, data: response.thread };
            if (this.afterAdd) this.afterAdd(res);
        } catch (err: any) {
            const res = { ok: false, msg: err.message };
            if (this.afterAdd) this.afterAdd(res);
            throw new Error(err.message);
        } finally {
            this.isLoading = false;
        }
    }
}


export interface CollbaMessagesAddResponse {
    ok: boolean,
    msg?: string,
    data?: mls.msg.Thread
}
