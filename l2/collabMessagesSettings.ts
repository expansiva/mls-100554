/// <mls shortName="collabMessagesSettings" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { ServiceBase } from './_100554_serviceBase';
import { loadChatPreferences, saveChatPreferences } from './_100554_collabMessageHelper';
import { IChatPreferences, TranslateMode } from './_100554_collabMessageHelper';

import {
    collab_user,
    collab_minus,
    collab_ban,
    collab_dot,
    collab_message
} from './_100554_collabIcons';

/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    save: 'Salvar',
    status: 'Status',
    userid: 'Id do usuário',
    username: 'Nome do usuário',
    errorUserName: 'Nome do usuário não pode ser vazio',
    successSavingUser: 'Perfil do usuário atualizado com sucesso',
    successSavingChatPref: 'Preferências do chat atualizado com sucesso',
    chatPref: 'Preferências do chat',
    translate: 'Tradução',
    preferLanguage: 'Idioma preferido',
    userTitle: 'Usuário',
}

const message_en = {
    loading: 'Loading...',
    save: 'Save',
    status: 'Status',
    userid: 'User Id',
    username: 'UserName',
    errorUserName: 'User name cannot be empty',
    successSavingUser: 'User perfil updated successfully',
    successSavingChatPref: 'Chat preferences updated successfully',
    chatPref: 'Chat Preferences',
    translate: 'Translate',
    preferLanguage: 'Preferred language',
    userTitle: 'User',
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
    @state() private chatPreferences: IChatPreferences = {
        translationMode: 'icon',
        language: ''
    };

    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() labelOkPref: string = '';
    @property() labelErrorPref: string = '';
    @property() isSavingUser: boolean = false;
    @property() isSavingChat: boolean = false;


    @query('.avatar img') userAvatarEl: HTMLImageElement | undefined;

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        this.userPerfil = await this.getUserPerfil();
        this.chatPreferences = loadChatPreferences();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            ${this.renderUser()}
            ${this.renderChatPreferences()}
        `;
    }

    private renderUser() {

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
        <h4>${collab_user} ${this.msg.userTitle}</h4>
        <div class="section user">
          <div class="user-details">
            <div class="avatar">
                ${avatarUrl
                ? html`<img src="${avatarUrl}" alt="Avatar" />`
                : html`<div class="avatar-placeholder">${collab_user}</div>`}
                <a @click=${(e: MouseEvent) => { e.preventDefault(); this.refreshAvatar(); }} href="#"> Atualizar</a>
            </div>
            <div class="user-info">
                <div class="user-info-item">
                    <label>${this.msg.username}</label>
                    <input
                        .value=${this.userPerfil?.name ?? ''} 
                        type="text" 
                        @input=${this.handleNameInput}
                    />
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
                    ?disabled=${this.isSavingUser}
                >
                    ${this.isSavingUser ? html`<span class="loader"></span>` : this.msg.save}
                </button>
            </div>
            ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
            ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}      
      </div>
        
        `
    }

    private renderChatPreferences() {
        return html`
    <div>
        <h4>${collab_message} ${this.msg.chatPref}</h4>
        <div class="section chat-preferences">

            <div class="chat-config-item">
                <label for="translationMode">${this.msg.translate}:</label>
                <select
                    id="translationMode"
                    @change=${this.handleTranslationModeChange}
                    .value=${this.chatPreferences?.translationMode ?? 'icon'}
                >
                    <option value="none">none</option>
                    <option value="icon">icon</option>
                    <option value="text">text</option>
                    <option value="iconText">icon + text</option>
                </select>
            </div>
            <div class="chat-config-item">
                <label>${this.msg.preferLanguage}:</label>
                <input
                    @input=${this.handleLanguageInput}
                    .value=${this.chatPreferences?.language ?? ''}
                    type="text"
                />
            </div>
            <div class="chat-config-item action">
                <button
                    @click=${this.handleSaveChatPref}
                    ?disabled=${this.isSavingChat}
                >
                    ${this.isSavingChat ? html`<span class="loader"></span>` : this.msg.save}
                </button>
            </div>
            ${this.labelOkPref ? html`<small class="saving-ok">${this.labelOkPref}<small>` : ''}
            ${this.labelErrorPref ? html`<small class="saving-error">${this.labelErrorPref}<small>` : ''}    
        </div>
    </div>`;
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

        this.isSavingUser = true;

        try {
            const response = await mls.api.msgUpdateUserDetails({
                userId: this.userPerfil.userId,
                avatar_url: this.userPerfil.avatar_url,
                name: this.userPerfil.name,
                status: this.userPerfil.status
            });

            if (response.statusCode !== 200) {
                this.labelError = `${response.msg}`;
                this.isSavingUser = false;
                return;
            }
            this.labelOk = `${this.msg.successSavingUser}`;
            this.isSavingUser = false;

        } catch (error: any) {
            console.error('Error on update perfil:', error);
            this.labelError = error.message;
            this.isSavingUser = false;
        }
    }

    private async handleSaveChatPref() {

        this.labelErrorPref = '';
        this.labelOkPref = '';
        this.isSavingChat = true;

        try {
            saveChatPreferences(this.chatPreferences);
            this.labelOkPref = `${this.msg.successSavingChatPref}`;
            this.isSavingChat = false;

        } catch (error: any) {
            console.error('Error on update chat preferences:', error);
            this.labelErrorPref = error.message;
            this.isSavingChat = false;
        }
    }

    private handleTranslationModeChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        this.chatPreferences = {
            ...this.chatPreferences,
            translationMode: select.value as TranslateMode
        };
    }


    private handleLanguageInput(e: Event) {
        const target = e.target as HTMLInputElement;
        this.chatPreferences = {
            ...this.chatPreferences,
            language: target.value
        };
    }

    private handleNameInput(e: Event) {
        if (!this.userPerfil) return;
        const target = e.target as HTMLInputElement;
        this.userPerfil.name = target.value;
    }
}

