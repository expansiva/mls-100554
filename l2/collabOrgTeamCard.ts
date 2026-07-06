/// <mls fileReference="_100554_/l2/collabOrgTeamCard.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';

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

interface Member { idx: number, name: string, avatar: string }

interface Team {
    name: string;
    auth: string;
    projectCount: number;
    userCount: number;
    users: Member[]
}

@customElement('collab-org-team-card-100554')
export class CollabOrgTeamCard extends CollabLitElement {

    private team: Team | undefined; 
    @property({ type: Number }) project: number = 0;
    @property({ type: Array }) members: Member[] = [];
    @property({ type: Array }) users: Member[] = [];
    @property({ type: Boolean }) loading: boolean = false;

    private msg: MessageType = messages['en'];
    private _addOpen: boolean = false;
    private _addUsername: string = '';
    private _confirmingRemove: string | null = null;

    firstUpdated() {

        const idxOrg = mls.l5.getProjectOrgIndex(this.project) || -1;
        const orgName = mls.l5.getOrgsName()[idxOrg];
        const lastOrg = mls.stor.orgs[orgName];
        if (!lastOrg) {
            
            return
        }

        if (this.team) {
            this.members = this.team.users;
        }

        const users: Member[] = [];
        lastOrg.sett.users.forEach((u, idx) => {
            users.push({ idx, name: u, avatar: 'https://i.pravatar.cc/40?u=alice' })
        });

        this.users = users;
    }

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


        this._confirmingRemove = null;
        this.requestUpdate();
    }

    private _renderMember(m: Member): TemplateResult {
        const confirming: boolean = this._confirmingRemove === m.name;

        return html`
            <li class="member-item">
                <div class="member-info">
                    <img class="avatar" src="${m.avatar}" alt="${m.name}" />
                    <span class="member-name">${m.name}</span>
                </div>

                ${confirming ? html`
                    <div class="confirm-inline">
                        <span class="confirm-label">${this.msg.confirmMessage}</span>
                        <button
                            class="btn-danger"
                            ?disabled="${this.loading}"
                            @click="${(): void => this._confirmRemove(m.name)}"
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
                        @click="${(): void => this._requestRemove(m.name)}"
                        title="Remove"
                    >🗑</button>
                `}
            </li>
        `;
    }

    private _renderAddForm(): TemplateResult {
        return html`
            <form class="add-form" @submit="${(e: Event): void => this._handleAdd(e)}">
                <select
                    class="add-input"
                    placeholder="${this.msg.addUserPlaceholder}"
                    .value="${this._addUsername}"
                    ?disabled="${this.loading}"
                    @input="${(e: Event): void => this._handleAddInput(e)}"
                >   
                    <option value="-1"></option> 
                    ${this.users.map((u) => html`<option value="${u.idx}">${u.name}</option>`)}
                </select>
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