/// <mls fileReference="_100554_/l2/collabOrgSettings.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    pageTitle: 'Configurações da Organização',
    fieldUrl: 'URL',
    fieldCompany: 'Empresa',
    fieldLocation: 'Localização',
    fieldEmail: 'E-mail',
    fieldLogo: 'URL do Logo',
    fieldDescription: 'Descrição',
    fieldDescriptionHint: '(markdown)',
    btnSave: 'Salvar',
    btnSaving: 'Salvando…',
    feedbackSuccess: 'Configurações salvas com sucesso.',
    loadingSettings: 'Carregando configurações…',
    dangerTitle: 'Zona de Perigo',
    archiveTitle: 'Arquivar esta organização',
    archiveDesc: 'Marcar a organização como arquivada e somente leitura.',
    btnArchive: 'Arquivar',
    deleteTitle: 'Excluir esta organização',
    deleteDesc: 'Remove permanentemente a organização e todos os seus dados. Esta ação não pode ser desfeita.',
    btnDelete: 'Excluir',
}

const message_en = {
    pageTitle: 'Organization Settings',
    fieldUrl: 'URL',
    fieldCompany: 'Company',
    fieldLocation: 'Location',
    fieldEmail: 'Email',
    fieldLogo: 'Logo URL',
    fieldDescription: 'Description',
    fieldDescriptionHint: '(markdown)',
    btnSave: 'Save',
    btnSaving: 'Saving…',
    feedbackSuccess: 'Settings saved successfully.',
    loadingSettings: 'Loading settings…',
    dangerTitle: 'Delete Organization',
    archiveTitle: 'Archive this organization',
    archiveDesc: 'Mark the organization as archived and read-only.',
    btnArchive: 'Archive',
    deleteTitle: 'Delete this organization',
    deleteDesc: 'Permanently remove the organization and all its data. This action cannot be undone.',
    btnDelete: 'Delete',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt,
}
/// **collab_i18n_end**

interface OrgSettings {
    url: string;
    company: string;
    location: string;
    email: string;
    logo: string;
    description: string;
}

const MOCK_SETTINGS: OrgSettings = {
    url: 'https://collabcodes.dev',
    company: 'Collab Codes',
    location: 'São Paulo, BR',
    email: 'contact@collabcodes.dev',
    logo: '',
    description: '## About\nPlataforma colaborativa de desenvolvimento low-code.',
};

@customElement('collab-org-settings-100554')
export class CollabOrgSettings extends CollabLitElement {

    @property({ type: Number }) project: number = 0;

    private msg: MessageType = messages['en'];
    private _loading: boolean = false;
    private _saving: boolean = false;
    private _error: string = '';
    private _successMessage: string = '';
    private _form: OrgSettings = { url: '', company: '', location: '', email: '', logo: '', description: '' };

    connectedCallback(): void {
        super.connectedCallback();
        this._fetchSettings();
    }

    private async _fetchSettings(): Promise<void> {
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

            const info = JSON.parse(lastOrg.value || '{}');
            const objParse = info.l5_actionOrgSettings ? info.l5_actionOrgSettings : {};

            this._form = {
                url: objParse.html_url ? objParse.html_url : '',
                company: objParse.company ? objParse.company : '',
                location: objParse.location ? objParse.location : '',
                email: objParse.email ? objParse.email : '',
                logo: objParse.logo ? objParse.logo : '',
                description: objParse.description ? objParse.l5_actionOrgSettings.description : '',

            };

        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this._loading = false;
            this.requestUpdate();
        }
    }

    private async _handleSave(e: Event): Promise<void> {
        e.preventDefault();
        this._saving = true;
        this._error = '';
        this._successMessage = '';
        this.requestUpdate();

        try {
            // const res = await fetch(`${this.baseUrl}/organizations/${this.orgSlug}/settings`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(this._form),
            // });
            // if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const orgPreferences: any = {
                l5_actionOrgSettings: { ...this._form }
            };

            //mls.l5.setProjectSettings()
            

            await new Promise<void>((resolve: () => void) => setTimeout(resolve, 600));
            this._successMessage = this.msg.feedbackSuccess;
            this.dispatchEvent(new CustomEvent('org-updated', { bubbles: true, composed: true }));
        } catch (err: unknown) {
            this._error = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            this._saving = false;
            this.requestUpdate();
        }
    }

    private _handleInput(field: keyof OrgSettings, e: Event): void {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        this._form = { ...this._form, [field]: target.value };
        this._successMessage = '';
    }

    private _handleArchive(): void {
        // Implementação futura
    }

    private _handleDelete(): void {
        this.dispatchEvent(new CustomEvent('org-deleted', { bubbles: true, composed: true }));
    }

    private _renderLoading(): TemplateResult {
        return html`
            <div class="state-loading">
                <span class="spinner"></span>
                <span>${this.msg.loadingSettings}</span>
            </div>
        `;
    }

    private _renderFeedback(): TemplateResult {
        if (this._successMessage) return html`<div class="feedback success">${this._successMessage}</div>`;
        if (this._error) return html`<div class="feedback error">${this._error}</div>`;
        return html``;
    }

    private _renderForm(): TemplateResult {
        return html`
            <form class="settings-form" @submit="${(e: Event): Promise<void> => this._handleSave(e)}">

                <div class="form-group">
                    <label for="field-url">${this.msg.fieldUrl}</label>
                    <input
                        id="field-url"
                        type="url"
                        .value="${this._form.url}"
                        @input="${(e: Event): void => this._handleInput('url', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="field-company">${this.msg.fieldCompany}</label>
                    <input
                        id="field-company"
                        type="text"
                        .value="${this._form.company}"
                        @input="${(e: Event): void => this._handleInput('company', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="field-location">${this.msg.fieldLocation}</label>
                    <input
                        id="field-location"
                        type="text"
                        .value="${this._form.location}"
                        @input="${(e: Event): void => this._handleInput('location', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="field-email">${this.msg.fieldEmail}</label>
                    <input
                        id="field-email"
                        type="email"
                        .value="${this._form.email}"
                        @input="${(e: Event): void => this._handleInput('email', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="field-logo">${this.msg.fieldLogo}</label>
                    <input
                        id="field-logo"
                        type="url"
                        .value="${this._form.logo}"
                        @input="${(e: Event): void => this._handleInput('logo', e)}"
                    />
                </div>

                <div class="form-group">
                    <label for="field-description">
                        ${this.msg.fieldDescription}
                        <span class="hint">${this.msg.fieldDescriptionHint}</span>
                    </label>
                    <textarea
                        id="field-description"
                        rows="6"
                        .value="${this._form.description}"
                        @input="${(e: Event): void => this._handleInput('description', e)}"
                    ></textarea>
                </div>

                ${this._renderFeedback()}

                <div class="form-actions">
                    <button type="submit" class="btn-primary" ?disabled="${this._saving}">
                        ${this._saving ? this.msg.btnSaving : this.msg.btnSave}
                    </button>
                </div>

            </form>
        `;
    }

    private _renderDangerZone(): TemplateResult {
        return html`
            <section class="danger-zone">
                <h2 class="danger-title">${this.msg.dangerTitle}</h2>

                <div class="danger-item">
                    <div class="danger-item-info">
                        <strong>${this.msg.archiveTitle}</strong>
                        <p>${this.msg.archiveDesc}</p>
                    </div>
                    <button class="btn-warning" @click="${(): void => this._handleArchive()}">${this.msg.btnArchive}</button>
                </div>

                <div class="danger-item">
                    <div class="danger-item-info">
                        <strong>${this.msg.deleteTitle}</strong>
                        <p>${this.msg.deleteDesc}</p>
                    </div>
                    <button class="btn-danger" @click="${(): void => this._handleDelete()}">${this.msg.btnDelete}</button>
                </div>
            </section>
        `;
    }

    render(): TemplateResult {
        const lang: string = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this._loading) return this._renderLoading();

        return html`
            <div class="settings-root">
                <h1 class="page-title">${this.msg.pageTitle}</h1>
                ${this._renderForm()}
                ${this._renderDangerZone()}
            </div>
        `;
    }

}