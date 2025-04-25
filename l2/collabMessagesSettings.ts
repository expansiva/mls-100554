/// <mls shortName="collabMessagesSettings" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { ServiceBase } from './_100554_serviceBase';
import {
    collab_user,
    collab_minus,
    collab_ban,
    collab_dot
} from './_100554_collabIcons';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    save: 'Salvar',
    status: 'Status',
    userid: 'Id do usuário',
    username: 'Nome do usuário',
    errorUserName: 'Nome do usuário não pode ser vazio',
    successSaving: 'Perfil do usuário atualizado com sucesso'

}

const message_en = {
    loading: 'Loading...',
    save: 'Save',
    status: 'Status',
    userid: 'User Id',
    username: 'UserName',
    errorUserName: 'User name cannot be empty',
    successSaving: 'User perfil updated successfully'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('collab-messages-settings-100554')
export class CollabMessagesSettings100554 extends IcaLitElement {

    private msg: MessageType = messages['en'];

    private serviceBase: ServiceBase | undefined;

    @state() userPerfil: mls.msg.User | undefined;

    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() isSaving: boolean = false;

    @query('.avatar img') userAvatarEl: HTMLImageElement | undefined;

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        this.userPerfil = await this.getUserPerfil();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        const avatarUrl = this.userPerfil?.avatar_url;
        const iconByStatus = {
            'active': collab_dot,
            'deleted': collab_minus,
            'blocked': collab_ban,
            '': html``,
        }

        const icon = iconByStatus[this.userPerfil?.status || '']

        return html`
      <div >
        <h4>User</h4>
        <div class="user">
          <div class="user-details">
            <div class="avatar">
                ${avatarUrl
                ? html`<img src="${avatarUrl}" alt="Avatar" />`
                : html`<div class="avatar-placeholder">${collab_user}</div>`}
                <a @click=${(e: MouseEvent) => { e.preventDefault(); this.refreshAvatar(); }} href="#"> Atualizar</a>
            </div>
            <div  class="user-info">
                <div class="user-info-item">
                    <label>${this.msg.username}</label>
                    <input .value=${this.userPerfil?.name ?? ''} type="text" />
                </div>
                <div class="user-info-item">
                    <label>${this.msg.userid}</label>
                    <span> ${this.userPerfil?.userId ?? ''}  </span>
                </div>
                <div class="user-info-item status">
                    <label>${this.msg.status}</label>
                    <span class=${this.userPerfil?.status}> ${this.userPerfil?.status ?? 'N/A'} ${icon} </span>
                </div>
            
            </div>
        </div>
            <div class="user-info-item action">
                <button
                    @click=${this.handleSave}
                    ?disabled=${this.isSaving}
                >
                    ${this.isSaving ? html`<span class="loader"></span>` : this.msg.save}
                </button>
            </div>
            ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
            ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}      
      </div>
    `;
    }

    private refreshAvatar() {
        const collabInit = document.querySelector('collab-init-100554')
        if (!collabInit) return;
        const url = collabInit.getAttribute('avatarUrl');
        if (url && this.userPerfil) {
            this.userPerfil.avatar_url = url;
            this.requestUpdate();
        }
    }

    private async getUserPerfil() {
        try {
            const response = await mls.api.msgGetUserUpdate({ userId: "" });
            console.info(response)
            return response.user;
        } catch (err: any) {
            this.serviceBase?.setError(err.message);
            throw new Error(err.message);
        }
    }

    private async handleSave() {

        this.labelError = '';
        this.labelOk = '';


        if (!this.userPerfil || !this.userPerfil?.name) {
            this.labelError = this.msg.errorUserName
            return;
        }

        this.isSaving = true;

        try {
            const response = await mls.api.msgUpdateUserDetails({
                userId: this.userPerfil.userId,
                avatar_url: this.userPerfil.avatar_url,
                name: this.userPerfil.name,
                status: this.userPerfil.status
            });

            if (response.statusCode !== 200) {
                this.labelError = `${response.msg}`;
                this.isSaving = false;
                return;
            }
            this.labelOk = `${this.msg.successSaving}`;
            this.isSaving = false;

        } catch (error: any) {
            console.error('Error on update perfil:', error);
            this.labelError = error.message;
            this.isSaving = false;
        }
    }
}
