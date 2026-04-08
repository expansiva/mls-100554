/// <mls fileReference="_100554_/l2/collabOrgTeamCard.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    addUser: 'Adicionar usuário',
    addUserPlaceholder: 'Nome de usuário',
    btnAdd: 'Adicionar',
    btnCancel: 'Cancelar',
    confirmRemove: 'Remover',
    cancelRemove: 'Cancelar',
    confirmMessage: 'Remover este membro do time?',
    noMembers: 'Nenhum membro neste time.',
}

const message_en = {
    addUser: 'Add User',
    addUserPlaceholder: 'Username',
    btnAdd: 'Add',
    btnCancel: 'Cancel',
    confirmRemove: 'Remove',
    cancelRemove: 'Cancel',
    confirmMessage: 'Remove this member from the team?',
    noMembers: 'No members in this team.',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

interface Member {
    username: string;
    avatar_url: string;
}

@customElement('collab-org-team-card-100554')
export class CollabOrgTeamCard extends CollabLitElement {

    @property({ type: String })  teamName: string = '';
    @property({ type: Array })   members: Member[] = [];
    @property({ type: Boolean }) loading: boolean = false;

    private msg: MessageType = messages['en'];
    private _addOpen: boolean = false;
    private _addUsername: string = '';
    private _confirmingRemove: string | null = null;

    private _toggleAdd(): void {
        this._addOpen = !this._addOpen;
        this._addUsername = '';
        this.requestUpdate();
    }

    private _handleAddInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        this._addUsername = target.value;
    }

    private _handleAdd(e: Event): void {
        e.preventDefault();
        if (!this._addUsername.trim()) return;
        this.dispatchEvent(new CustomEvent('member-add', {
            detail: { team_name: this.teamName, username: this._addUsername.trim() },
            bubbles: true,
            composed: true,
        }));
        this._addOpen = false;
        this._addUsername = '';
        this.requestUpdate();
    }

    private _requestRemove(username: string): void {
        this._confirmingRemove = username;
        this.requestUpdate();
    }

    private _cancelRemove(): void {
        this._confirmingRemove = null;
        this.requestUpdate();
    }

    private _confirmRemove(username: string): void {
        this.dispatchEvent(new CustomEvent('member-remove', {
            detail: { team_name: this.teamName, username },
            bubbles: true,
            composed: true,
        }));
        this._confirmingRemove = null;
        this.requestUpdate();
    }

    private _renderMember(m: Member): TemplateResult {
        const confirming: boolean = this._confirmingRemove === m.username;

        return html`
            <li class="member-item">
                <div class="member-info">
                    <img class="avatar" src="${m.avatar_url}" alt="${m.username}" />
                    <span class="member-name">${m.username}</span>
                </div>

                ${confirming ? html`
                    <div class="confirm-inline">
                        <span class="confirm-label">${this.msg.confirmMessage}</span>
                        <button
                            class="btn-danger"
                            ?disabled="${this.loading}"
                            @click="${(): void => this._confirmRemove(m.username)}"
                        >${this.msg.confirmRemove}</button>
                        <button
                            class="btn-secondary"
                            @click="${(): void => this._cancelRemove()}"
                        >${this.msg.cancelRemove}</button>
                    </div>
                ` : html`
                    <button
                        class="btn-remove"
                        ?disabled="${this.loading}"
                        @click="${(): void => this._requestRemove(m.username)}"
                        title="Remove"
                    >🗑</button>
                `}
            </li>
        `;
    }

    private _renderAddForm(): TemplateResult {
        return html`
            <form class="add-form" @submit="${(e: Event): void => this._handleAdd(e)}">
                <input
                    type="text"
                    class="add-input"
                    placeholder="${this.msg.addUserPlaceholder}"
                    .value="${this._addUsername}"
                    ?disabled="${this.loading}"
                    @input="${(e: Event): void => this._handleAddInput(e)}"
                />
                <button type="submit" class="btn-primary" ?disabled="${this.loading}">
                    ${this.msg.btnAdd}
                </button>
                <button
                    type="button"
                    class="btn-secondary"
                    @click="${(): void => this._toggleAdd()}"
                >${this.msg.btnCancel}</button>
            </form>
        `;
    }

    render(): TemplateResult {
        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="team-card">

                <ul class="member-list">
                    ${this.members.length > 0
                        ? this.members.map((m: Member) => this._renderMember(m))
                        : html`<li class="no-members">${this.msg.noMembers}</li>`
                    }
                </ul>

                <div class="add-section">
                    ${this._addOpen
                        ? this._renderAddForm()
                        : html`
                            <button
                                class="btn-add-toggle"
                                ?disabled="${this.loading}"
                                @click="${(): void => this._toggleAdd()}"
                            >+ ${this.msg.addUser}</button>
                        `
                    }
                </div>

            </div>
        `;
    }

}