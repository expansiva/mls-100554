/// <mls fileReference="_100554_/l2/collabOrgInviteUser.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    fieldUsername: 'Usuário ou E-mail',
    fieldTeam: 'Time inicial',
    fieldTeamPlaceholder: 'Selecione um time',
    fieldCompText: 'Texto complementar',
    btnSubmit: 'Enviar convite',
    btnSubmitting: 'Enviando…',
    feedbackSuccess: 'Convite enviado com sucesso.',
    feedbackError: 'Erro ao enviar o convite.',
}

const message_en = {
    fieldUsername: 'Username or Email',
    fieldTeam: 'Initial Team',
    fieldTeamPlaceholder: 'Select a team',
    fieldCompText: 'Complementary Text',
    btnSubmit: 'Send invite',
    btnSubmitting: 'Sending…',
    feedbackSuccess: 'Invite sent successfully.',
    feedbackError: 'Failed to send invite.',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

type InviteStatus = 'idle' | 'success' | 'error';

@customElement('collab-org-invite-user-100554')
export class CollabOrgInviteUser extends CollabLitElement {

    @property({ type: Array })  teams: string[] = [];
    @property({ type: Boolean }) loading: boolean = false;
    @property({ type: String })  status: InviteStatus = 'idle';

    private msg: MessageType = messages['en'];
    private _usernameOrEmail: string = '';
    private _initialTeam: string = '';
    private _complementaryText: string = '';

    private _handleInput(field: 'username' | 'team' | 'text', e: Event): void {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (field === 'username') this._usernameOrEmail = target.value;
        if (field === 'team') this._initialTeam = target.value;
        if (field === 'text') this._complementaryText = target.value;
        this.requestUpdate();
    }

    private _handleSubmit(e: Event): void {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('invite-submit', {
            detail: {
                username_or_email: this._usernameOrEmail,
                initial_team: this._initialTeam,
                complementary_text: this._complementaryText,
            },
            bubbles: true,
            composed: true,
        }));
    }

    private _renderFeedback(): TemplateResult {
        if (this.status === 'success') return html`<div class="feedback success">${this.msg.feedbackSuccess}</div>`;
        if (this.status === 'error')   return html`<div class="feedback error">${this.msg.feedbackError}</div>`;
        return html``;
    }

    render(): TemplateResult {
        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <form class="invite-form" @submit="${(e: Event): void => this._handleSubmit(e)}">

                <div class="form-group">
                    <label for="invite-username">${this.msg.fieldUsername}</label>
                    <input
                        id="invite-username"
                        type="text"
                        .value="${this._usernameOrEmail}"
                        ?disabled="${this.loading}"
                        @input="${(e: Event): void => this._handleInput('username', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="invite-team">${this.msg.fieldTeam}</label>
                    <select
                        id="invite-team"
                        .value="${this._initialTeam}"
                        ?disabled="${this.loading}"
                        @change="${(e: Event): void => this._handleInput('team', e)}"
                    >
                        <option value="">${this.msg.fieldTeamPlaceholder}</option>
                        ${this.teams.map((t: string) => html`
                            <option value="${t}">${t}</option>
                        `)}
                    </select>
                </div>

                <div class="form-group">
                    <label for="invite-text">${this.msg.fieldCompText}</label>
                    <textarea
                        id="invite-text"
                        rows="3"
                        .value="${this._complementaryText}"
                        ?disabled="${this.loading}"
                        @input="${(e: Event): void => this._handleInput('text', e)}"
                    ></textarea>
                </div>

                ${this._renderFeedback()}

                <div class="form-actions">
                    <button type="submit" class="btn-primary" ?disabled="${this.loading}">
                        ${this.loading ? this.msg.btnSubmitting : this.msg.btnSubmit}
                    </button>
                </div>

            </form>
        `;
    }

}