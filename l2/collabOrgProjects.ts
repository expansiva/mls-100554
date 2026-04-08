/// <mls fileReference="_100554_/l2/collabOrgProjects.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    activeProjects: 'Projetos Ativos',
    archivedProjects: 'Projetos Arquivados',
    searchPlaceholder: 'Buscar projetos...',
    viewProject: 'Ver projeto',
    noResults: 'Nenhum projeto encontrado.',
    loading: 'Carregando...',
    error: 'Erro ao carregar projetos.',
}

const message_en = {
    activeProjects: 'Active Projects',
    archivedProjects: 'Archived Projects',
    searchPlaceholder: 'Search projects...',
    viewProject: 'View project',
    noResults: 'No projects found.',
    loading: 'Loading...',
    error: 'Failed to load projects.',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

@customElement('collab-org-projects-100554')
export class CollabOrgProjects extends CollabLitElement {

    @property({ type: Number }) project: number = 0;

    private msg: MessageType = messages['en'];
    private projects: mls.cbe.IPrj_settings[] = [];
    private searchQuery: string = '';
    private _loading: boolean = false;
    private _error: string = '';

    connectedCallback(): void {
        super.connectedCallback();
        this.fetchProjects();
    }

    private async fetchProjects(): Promise<void> {
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

            this.projects = lastOrg.sett.projects;
        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this._loading = false;
            this.requestUpdate();
        }
    }

    private handleSearch(e: Event): void {
        const input = e.target as HTMLInputElement;
        this.searchQuery = input.value;
        this.requestUpdate();
    }

    private handleViewProject(project: mls.cbe.IPrj_settings): void {
        mls.setActualProject(project.id);
        const orgIndex = mls.l5.getProjectOrgIndex(project.id);
        mls.l5.setActualOrg(orgIndex);
        window.location.reload();
    } 

    private getFiltered(archived: boolean): mls.cbe.IPrj_settings[] {

        const query: string = this.searchQuery.toLowerCase();
        return this.projects.filter((p: mls.cbe.IPrj_settings) =>
            (p.archived_at !== '' || !archived) &&
            p.name.toLowerCase().includes(query)
        );
    }

    private renderProjectList(items: mls.cbe.IPrj_settings[]): TemplateResult {
        if (items.length === 0) {
            return html`<p class="no-results">${this.msg.noResults}</p>`;
        }
        return html`
            <ul class="project-list">
                ${items.map((p: mls.cbe.IPrj_settings) => html`
                    <li class="project-item">
                        <span class="project-name">${p.name}(${p.id})</span>
                        <button class="btn-view" @click=${() => this.handleViewProject(p)}>
                            ${this.msg.viewProject}
                        </button>
                    </li>
                `)}
            </ul>
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
            return html`<div class="feedback error">${this.msg.error}</div>`;
        }

        const active: mls.cbe.IPrj_settings[] = this.getFiltered(false);
        const archived: mls.cbe.IPrj_settings[] = this.getFiltered(true);

        return html`
            <div class="container">
                <input
                    class="search-input"
                    type="text"
                    placeholder=${this.msg.searchPlaceholder}
                    .value=${this.searchQuery}
                    @input=${this.handleSearch}
                />

                <section class="section">
                    <h2 class="section-title">${this.msg.activeProjects}</h2>
                    ${this.renderProjectList(active)}
                </section>

                <section class="section">
                    <h2 class="section-title">${this.msg.archivedProjects}</h2>
                    ${this.renderProjectList(archived)}
                </section>
            </div>
        `;
    }

}