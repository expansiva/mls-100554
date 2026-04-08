/// <mls fileReference="_100554_/l2/collabOrgTeams.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import '/_100554_/l2/collabOrgTeamCard.js'

/// **collab_i18n_start**
const message_pt = {
    title: 'Times',
    btnNewTeam: 'Novo time',
    btnCancel: 'Cancelar',
    btnCreate: 'Criar',
    btnCreating: 'Criando…',
    colTeam: 'Time',
    colAuth: 'Auth',
    colProjects: 'Projetos',
    colUsers: 'Usuários',
    fieldName: 'Nome do time',
    viewProjects: 'Ver projetos',
    viewUsers: 'Ver usuários',
    loading: 'Carregando times…',
    error: 'Erro ao carregar times.',
    noTeams: 'Nenhum time encontrado.',
    feedbackSuccess: 'Time criado com sucesso.',
    feedbackError: 'Erro ao criar time.',
}

const message_en = {
    title: 'Teams',
    btnNewTeam: 'New Team',
    btnCancel: 'Cancel',
    btnCreate: 'Create',
    btnCreating: 'Creating…',
    colTeam: 'Team',
    colAuth: 'Auth',
    colProjects: 'Projects',
    colUsers: 'Users',
    fieldName: 'Team name',
    viewProjects: 'View projects',
    viewUsers: 'View users',
    loading: 'Loading teams…',
    error: 'Failed to load teams.',
    noTeams: 'No teams found.',
    feedbackSuccess: 'Team created successfully.',
    feedbackError: 'Failed to create team.',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

interface Team {
    name: string;
    auth: string;
    projectCount: number;
    userCount: number;
}

type FormStatus = 'idle' | 'saving' | 'success' | 'error';

const MOCK_TEAMS: Team[] = [
    { name: 'frontend',  auth: 'write', projectCount: 3, userCount: 5 },
    { name: 'backend',   auth: 'admin', projectCount: 4, userCount: 3 },
    { name: 'design',    auth: 'read',  projectCount: 2, userCount: 4 },
    { name: 'devops',    auth: 'admin', projectCount: 6, userCount: 2 },
];

@customElement('collab-org-teams-100554')
export class CollabOrgTeams extends CollabLitElement {

    @property({ type: String }) orgSlug: string = '';
    @property({ type: String }) baseUrl: string = '';

    private msg: MessageType = messages['en'];
    private _teams: Team[] = [];
    private _loading: boolean = false;
    private _error: string = '';
    private _expandedTeam: string | null = null;
    private _newTeamOpen: boolean = false;
    private _newTeamName: string = '';
    private _formStatus: FormStatus = 'idle';
    private _formError: string = '';

    connectedCallback(): void {
        super.connectedCallback();
        this._fetchTeams();
    }

    private async _fetchTeams(): Promise<void> {
        this._loading = true;
        this._error = '';
        this.requestUpdate();

        try {
            // const res = await fetch(`${this.baseUrl}/organizations/${this.orgSlug}/teams`);
            // if (!res.ok) throw new Error(`HTTP ${res.status}`);
            // this._teams = await res.json() as Team[];

            await new Promise<void>((resolve: () => void) => setTimeout(resolve, 700));
            this._teams = [...MOCK_TEAMS];
        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this._loading = false;
            this.requestUpdate();
        }
    }

    private async _handleCreate(e: Event): Promise<void> {
        e.preventDefault();
        this._formStatus = 'saving';
        this._formError = '';
        this.requestUpdate();

        try {
            // const res = await fetch(`${this.baseUrl}/organizations/${this.orgSlug}/teams`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name: this._newTeamName }),
            // });
            // if (!res.ok) throw new Error(`HTTP ${res.status}`);

            await new Promise<void>((resolve: () => void) => setTimeout(resolve, 600));

            this.dispatchEvent(new CustomEvent('team-created', {
                detail: { name: this._newTeamName },
                bubbles: true,
                composed: true,
            }));

            this._formStatus = 'success';
            this._newTeamName = '';
            await this._fetchTeams();
            this._newTeamOpen = false;
            this._formStatus = 'idle';
        } catch (err: unknown) {
            this._formStatus = 'error';
            this._formError = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this.requestUpdate();
        }
    }

    private _toggleExpand(teamName: string): void {
        this._expandedTeam = this._expandedTeam === teamName ? null : teamName;
        this.requestUpdate();
    }

    private _toggleNewTeam(): void {
        this._newTeamOpen = !this._newTeamOpen;
        this._newTeamName = '';
        this._formStatus = 'idle';
        this._formError = '';
        this.requestUpdate();
    }

    private _handleNameInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        this._newTeamName = target.value;
    }

    private _emitViewProjects(teamName: string): void {
        this.dispatchEvent(new CustomEvent('view-team-projects', {
            detail: { team_name: teamName },
            bubbles: true,
            composed: true,
        }));
    }

    private _emitViewUsers(teamName: string): void {
        this.dispatchEvent(new CustomEvent('view-team-users', {
            detail: { team_name: teamName },
            bubbles: true,
            composed: true,
        }));
    }

    private _renderNewTeamForm(): TemplateResult {
        const saving: boolean = this._formStatus === 'saving';
        return html`
            <div class="new-team-form-wrapper">
                <form class="new-team-form" @submit="${(e: Event): Promise<void> => this._handleCreate(e)}">
                    <div class="form-group">
                        <label for="new-team-name">${this.msg.fieldName}</label>
                        <input
                            id="new-team-name"
                            type="text"
                            .value="${this._newTeamName}"
                            ?disabled="${saving}"
                            @input="${(e: Event): void => this._handleNameInput(e)}"
                        />
                    </div>

                    ${this._formStatus === 'error' ? html`
                        <div class="feedback error">${this._formError || this.msg.feedbackError}</div>
                    ` : ''}

                    <div class="form-actions">
                        <button
                            type="button"
                            class="btn-secondary"
                            ?disabled="${saving}"
                            @click="${(): void => this._toggleNewTeam()}"
                        >${this.msg.btnCancel}</button>
                        <button type="submit" class="btn-primary" ?disabled="${saving}">
                            ${saving ? this.msg.btnCreating : this.msg.btnCreate}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    private _renderTable(): TemplateResult {
        if (this._teams.length === 0) {
            return html`<p class="no-teams">${this.msg.noTeams}</p>`;
        }

        return html`
            <div class="table-wrapper">
                <table class="teams-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>${this.msg.colTeam}</th>
                            <th>${this.msg.colAuth}</th>
                            <th>${this.msg.colProjects}</th>
                            <th>${this.msg.colUsers}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._teams.map((t: Team) => this._renderRow(t))}
                    </tbody>
                </table>
            </div>
        `;
    }

    private _renderRow(t: Team): TemplateResult {
        const expanded: boolean = this._expandedTeam === t.name;
        return html`
            <tr class="team-row ${expanded ? 'expanded' : ''}">
                <td class="td-toggle">
                    <button class="btn-expand" @click="${(): void => this._toggleExpand(t.name)}">
                        ${expanded ? '▲' : '▼'}
                    </button>
                </td>
                <td class="td-name">${t.name}</td>
                <td class="td-auth"><span class="auth-badge auth-${t.auth}">${t.auth}</span></td>
                <td class="td-link">
                    <button class="btn-link" @click="${(): void => this._emitViewProjects(t.name)}">
                        ${t.projectCount} ${this.msg.viewProjects}
                    </button>
                </td>
                <td class="td-link">
                    <button class="btn-link" @click="${(): void => this._emitViewUsers(t.name)}">
                        ${t.userCount} ${this.msg.viewUsers}
                    </button>
                </td>
            </tr>
            ${expanded ? html`
                <tr class="expand-row">
                    <td colspan="5">
                        <collab-org-team-card-100554
                            team-name="${t.name}"
                            org-slug="${this.orgSlug}"
                            base-url="${this.baseUrl}"
                        ></collab-org-team-card-100554>
                    </td>
                </tr>
            ` : ''}
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
            <div class="teams-root">

                <div class="header">
                    <h1 class="page-title">${this.msg.title}</h1>
                    <button class="btn-primary" @click="${(): void => this._toggleNewTeam()}">
                        ${this._newTeamOpen ? this.msg.btnCancel : this.msg.btnNewTeam}
                    </button>
                </div>

                ${this._newTeamOpen ? this._renderNewTeamForm() : ''}

                ${this._renderTable()}

            </div>
        `;
    }

}