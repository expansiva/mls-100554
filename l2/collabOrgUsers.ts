/// <mls fileReference="_100554_/l2/collabOrgUsers.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import "/_100554_/l2/collabOrgInviteUser.js"

/// **collab_i18n_start**
const message_pt = {
    title: 'Membros',
    inviteToggle: 'Convidar usuário',
    colAvatar: 'Avatar',
    colUser: 'Usuário',
    colTeams: 'Times',
    colAccess: 'Acesso ao repositório',
    loading: 'Carregando membros…',
    loadingAccess: 'Verificando…',
    error: 'Erro ao carregar membros.',
    noMembers: 'Nenhum membro encontrado.',
    accessOk: 'Acesso OK',
    accessNone: 'Sem acesso',
}

const message_en = {
    title: 'Members',
    inviteToggle: 'Invite user',
    colAvatar: 'Avatar',
    colUser: 'User',
    colTeams: 'Teams',
    colAccess: 'Repository access',
    loading: 'Loading members…',
    loadingAccess: 'Checking…',
    error: 'Failed to load members.',
    noMembers: 'No members found.',
    accessOk: 'Access OK',
    accessNone: 'No access',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

interface Member {
    id:number,
    username: string;
    avatarUrl: string;
    teams: string[];
}

interface RepoAccess {
    github: boolean | null;
    gitlab: boolean | null;
}

type AccessMap = { [username: string]: RepoAccess };




@customElement('collab-org-users-100554')
export class CollabOrgUsers extends CollabLitElement {

    @property({ type: Number }) project: number = 0;

    private msg: MessageType = messages['en'];
    private _members: Member[] = [];
    private _accessMap: AccessMap = {};
    private _loading: boolean = false;
    private _error: string = '';
    private _inviteOpen: boolean = false;

    connectedCallback(): void {
        super.connectedCallback();
        this._fetchMembers();
    }

    private async _fetchMembers(): Promise<void> {
        this._loading = true;
        this._error = '';
        this.requestUpdate();

        try {
            const idxOrg = mls.l5.getProjectOrgIndex(this.project) || -1;
            const orgName = mls.l5.getOrgsName()[idxOrg];
            const lastOrg = mls.stor.orgs[orgName];
            if (!lastOrg) {
                this._error = 'Not found organization';
                return
            }


            this._members = this.configUsers(lastOrg);

            await this._fetchAllAccess();
        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this._loading = false;
            this.requestUpdate();
        }
    }

    private configUsers(info: mls.cbe.IOrgInfo) {
        const users: Member[] = [];

        info.sett.users.forEach((u, idx: number) => {

            const user: Member = {
                id: idx,
                username: u,
                avatarUrl: 'https://i.pravatar.cc/40?u=alice',
                teams: []
            }

            info.sett.teams.forEach((t) => {
                if (t.usrIndex.includes(idx)) user.teams.push(t.name);
            })

            users.push(user);

        })

        return users;

    }

    private async _fetchAllAccess(): Promise<void> {
        const entries = await Promise.all(
            this._members.map(async (m: Member): Promise<[string, RepoAccess]> => {
                const access = await this._fetchRepoAccess(m.username);
                return [m.username, access];
            })
        );
        this._accessMap = Object.fromEntries(entries);
    }

    private async _fetchRepoAccess(username: string): Promise<RepoAccess> {
    
        await new Promise<void>((resolve: () => void) => setTimeout(resolve, 300));
        return { github: false,  gitlab: false  };
    }

    private _toggleInvite(): void {
        this._inviteOpen = !this._inviteOpen;
        this.requestUpdate();
    }

    private _handleInviteSuccess(): void {
        this._inviteOpen = false;
        this._fetchMembers();
    }

    private _renderAccessBadge(value: boolean | null, platform: string): TemplateResult {
        if (value === null) return html`<span class="badge badge-neutral">${platform} –</span>`;
        return value
            ? html`<span class="badge badge-ok">${platform} ✓</span>`
            : html`<span class="badge badge-fail">${platform} ✗</span>`;
    }

    private _renderAccessCell(username: string): TemplateResult {
        const access: RepoAccess | undefined = this._accessMap[username];
        if (!access) return html`<span class="access-loading">${this.msg.loadingAccess}</span>`;
        return html`
            <div class="access-badges">
                ${this._renderAccessBadge(access.github, 'GitHub')}
                ${this._renderAccessBadge(access.gitlab, 'GitLab')}
            </div>
        `;
    }

    private _renderTable(): TemplateResult {
        if (this._members.length === 0) {
            return html`<p class="no-members">${this.msg.noMembers}</p>`;
        }

        return html`
            <div class="table-wrapper">
                <table class="members-table">
                    <thead>
                        <tr>
                            <th>${this.msg.colAvatar}</th>
                            <th>${this.msg.colUser}</th>
                            <th>${this.msg.colTeams}</th>
                            <th>${this.msg.colAccess}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._members.map((m: Member) => html`
                            <tr>
                                <td class="td-avatar">
                                    <img class="avatar" src="${m.avatarUrl}" alt="${m.username}" />
                                </td>
                                <td class="td-user">${m.username}</td>
                                <td class="td-teams">
                                    <div class="tags-wrapper">
                                        ${m.teams.length > 0
                                            ? m.teams.map((t: string) => html`<span class="team-tag">${t}</span>`)
                                            : html`<span class="no-teams">—</span>`
                                        }
                                    </div>
                                </td>
                                <td class="td-access">
                                    ${this._renderAccessCell(m.username)}
                                </td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        `;
    }

    render(): TemplateResult {
        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this._loading) {
            return html`
                <div class="state-loading">
                    <span class="spinner"></span>
                    <span>${this.msg.loading}</span>
                </div>
            `;
        }

        if (this._error) {
            return html`<div class="feedback error">${this._error}</div>`;
        }

        return html`
            <div class="users-root">

                <div class="header">
                    <h1 class="page-title">${this.msg.title}</h1>
                    <button class="btn-invite" @click="${(): void => this._toggleInvite()}">
                        ${this._inviteOpen ? '✕' : '+ ' + this.msg.inviteToggle}
                    </button>
                </div>

                ${this._inviteOpen ? html`
                    <div class="invite-wrapper">
                        <collab-org-invite-user-100554
                            project="${this.project}"
                            @invite-success="${(): void => this._handleInviteSuccess()}"
                        ></collab-org-invite-user-100554>
                    </div>
                ` : ''}

                ${this._renderTable()}

            </div>
        `;
    }

}