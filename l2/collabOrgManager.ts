/// <mls fileReference="_100554_/l2/collabOrgManager.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import '/_100554_/l2/collabOrgHome.js'
import '/_100554_/l2/collabOrgSettings.js'
import '/_100554_/l2/collabOrgProjects.js'
import '/_100554_/l2/collabOrgUsers.js'
import '/_100554_/l2/collabOrgTeams.js'

/// **collab_i18n_start**
const message_pt = {
    home: 'Inicio',
    settings: 'Configurações',
    projects: 'Projetos',
    users: 'Usuários',
    teams: 'Times',
    
}

const message_en = {
    home: 'Home',
    settings: 'Settings',
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

@customElement('collab-org-manager-100554')
export class CollabOrgManager extends CollabLitElement {

    private msg: MessageType = messages['en'];
    @property({ type: Number }) project: number = 0;
    @property({ type: String }) activeSection: string = 'home';

    private _handleSectionClick(section: string): void {
        this.activeSection = section;
        this.dispatchEvent(new CustomEvent('section-changed', {
            detail: { section },
            bubbles: true,
            composed: true,
        }));
    }

    private _renderIcon(section: string): TemplateResult {
        const icons: Record<string, TemplateResult> = {
            home: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
            settings: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.01 7.01 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
            projects: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
            trash: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
            users: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
            teams: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
            explorer: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 17l1.5 1.49z"/></svg>`,
            verify: html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
        };
        return icons[section] ?? html``;
    }

    private _renderSection(): TemplateResult {
        const sectionMap: Record<string, TemplateResult> = {
            home:     html`<collab-org-home-100554     project="${this.project}"></collab-org-home-100554>`,
            settings: html`<collab-org-settings-100554 project="${this.project}"></collab-org-settings-100554>`,
            projects: html`<collab-org-projects-100554 project="${this.project}"></collab-org-projects-100554>`,
            trash:    html`<collab-org-trash-100554    project="${this.project}"></collab-org-trash-100554>`,
            users:    html`<collab-org-users-100554    project="${this.project}"></collab-org-users-100554>`,
            teams:    html`<collab-org-teams-100554    project="${this.project}"></collab-org-teams-100554>`,
            explorer: html`<collab-org-explorer-100554 project="${this.project}"></collab-org-explorer-100554>`,
            verify:   html`<collab-org-verify-100554   project="${this.project}"></collab-org-verify-100554>`,
        };
        return sectionMap[this.activeSection] ?? html`<div class="fallback">Seção não encontrada</div>`;
    }

    private _menuItems: Array<{ section: string; label: string }> = [
        { section: 'home',     label: 'Home' },
        { section: 'settings', label: 'Settings' },
        { section: 'projects', label: 'Projects' },
        //{ section: 'trash',    label: 'Trash' },
        { section: 'users',    label: 'Users' },
        { section: 'teams',    label: 'Teams' },
        //{ section: 'explorer', label: 'Explorer' },
        //{ section: 'verify',   label: 'Verify' },
    ];

    render(): TemplateResult {
        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="layout">
                <nav class="sidebar">
                    ${this._menuItems.map((item: { section: string; label: string }): TemplateResult => html`
                        <div
                            class="menu-item ${this.activeSection === item.section ? 'active' : ''}"
                            @click="${(): void => this._handleSectionClick(item.section)}"
                            tabindex="0"
                            @keydown="${(e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') this._handleSectionClick(item.section); }}"
                        >
                            <span class="menu-icon">${this._renderIcon(item.section)}</span>
                            <span class="menu-label">${(this.msg as any)[item.section]}</span>
                            <span class="menu-arrow">›</span>
                        </div>
                    `)}
                </nav>
                <main class="content">
                    ${this._renderSection()}
                </main>
            </div>
        `;
    }

}