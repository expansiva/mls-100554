/// <mls fileReference="_100554_/l2/collabOrgHome.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando organização…',
    again: 'Tentar novamente',
    error: 'Erro desconhecido',
    projects: 'Projetos',
    users: 'Usuários',
    teams: 'Times',
}

const message_en = {
    loading: 'Loading organization…',
    again: 'Try again',
    error: 'Unknown error',
    projects: 'Projects',
    users: 'Users',
    teams: 'Teams',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

interface OrgData {
    name: string;
    description: string;
    totalProjects: number;
    totalUsers: number;
    totalTeams: number;
}

const MOCK_ORG_DATA: OrgData = {
    name: 'Collab Codes',
    description: 'Plataforma colaborativa de desenvolvimento low-code.',
    totalProjects: 42,
    totalUsers: 18,
    totalTeams: 5,
};

@customElement('collab-org-home-100554')
export class CollabOrgHome extends CollabLitElement {

    private msg: MessageType = messages['en'];
    @property({ type: Number }) project: number = 0;

    private _loading: boolean = false;
    private _error: string = '';
    private _data: OrgData | null = null;

    connectedCallback(): void {
        super.connectedCallback();
        this._fetchOrg();
    }

    private async _fetchOrg(): Promise<void> {
        this._loading = true;
        this._error = '';
        this._data = null;
        this.requestUpdate();

        try {

            const idxOrg = mls.l5.getProjectOrgIndex(this.project) || -1;
            const orgName = mls.l5.getOrgsName()[idxOrg];
            const lastOrg = mls.stor.orgs[orgName];
            if (!lastOrg) {
                this._error = 'Not found organization';
                return
            }

            this._data = {
                name: orgName,
                description: lastOrg.sett.description,
                totalProjects: lastOrg.sett.projects.length,
                totalUsers: lastOrg.sett.users.length,
                totalTeams: lastOrg.sett.teams.length,
            }
            
        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : this.msg.error;
        } finally {
            this._loading = false;
            this.requestUpdate();
        }
    }

    private _renderLoading(): TemplateResult {
        return html`
            <div class="state-loading">
                <span class="spinner"></span>
                <span>${this.msg.loading}</span>
            </div>
        `;
    }

    private _renderError(): TemplateResult {
        return html`
            <div class="state-error">
                <span class="error-icon">⚠</span>
                <span>${this._error}</span>
                <button @click="${(): Promise<void> => this._fetchOrg()}">${this.msg.again}</button>
            </div>
        `;
    }

    private _renderData(data: OrgData): TemplateResult {
        return html`
            <div class="org-card">
                <div class="org-header">
                    <h1 class="org-name">${data.name}</h1>
                    <p class="org-description">${data.description || 'no description'}</p>
                </div>
                <div class="org-counters">
                    <div class="counter">
                        <span class="counter-value">${data.totalProjects}</span>
                        <span class="counter-label">${this.msg.projects}</span>
                    </div>
                    <div class="counter">
                        <span class="counter-value">${data.totalUsers}</span>
                        <span class="counter-label">${this.msg.users}</span>
                    </div>
                    <div class="counter">
                        <span class="counter-value">${data.totalTeams}</span>
                        <span class="counter-label">${this.msg.teams}</span>
                    </div>
                </div>
            </div>
        `;
    }

    render(): TemplateResult {

        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this._loading) return this._renderLoading();
        if (this._error) return this._renderError();
        if (this._data) return this._renderData(this._data);
        return html``;
    }

}