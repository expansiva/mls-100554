/// <mls shortName="collabMessagesThreadDetails" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { updateThread, getUser, listUsers } from './_100554_msgDBController';
import { collab_triangle_exclamation } from './_100554_collabIcons';
import { notifyThreadChange } from './_100554_aiAgentHelper';
import { StateLitElement } from './_100554_stateLitElement';
import './_100554_collabInputTag';
import './_100554_collabMessagesAddParticipant';


/// **collab_i18n_start** 
const message_pt = {
    loading: 'Carregando...',
    threadName: 'Nome da thread',
    visibility: 'Visibilidade',
    visibilityPublic: 'Pública',
    visibilityPrivate: 'Privada',
    visibilityCompany: 'Empresa',
    visibilityTeam: 'Time',
    status: 'Status',
    statusActive: 'Ativo',
    statusArchived: 'Arquivado',
    statusDeleted: 'Deletado',
    remove: 'Remover',
    users: 'Usuários',
    group: 'Grupo',
    details: 'Detalhes',
    languages: 'Idiomas',
    languagesHint: 'Detectado e atualizado com base nos idiomas dos usuários participantes.',
    validateFormError: 'Preencha todos os campos obrigatórios.',
    userError: 'ID de usuário inválido.',
    btnSave: 'Salvar alterações',
    successSaving: 'Alterações salvas com sucesso!',
    noChanges: 'Nenhuma alteração detectada.',
    addParticipant: 'Adicionar participante',
    labelUserId: 'Nome do usuario ou Id',
    labelPermission: 'Autoridade:',
    errorFieldsAddParticipant: 'Preencha todos os campos!',
    errorRemoveUser: 'Erro ao remover usuário',
    successAddParticipant: 'Usuário adicionado com sucesso',
    threadDetails: 'Detalhes da sala'
}

const message_en = {
    loading: 'Loading...',
    threadName: 'Thread name',
    visibility: 'Visibility',
    visibilityPublic: 'Plubic',
    visibilityPrivate: 'Private',
    visibilityCompany: 'Company',
    visibilityTeam: 'Team',
    status: 'Status',
    statusActive: 'Active',
    statusArchived: 'Archived',
    statusDeleted: 'Deleted',
    remove: 'Remove',
    group: 'Group',
    users: 'Users',
    languages: 'Languages',
    details: 'Details',
    languagesHint: 'Detected and updated based on the languages of participating users.',
    validateFormError: 'Please fill in all required fields.',
    userError: 'Invalid user ID.',
    btnSave: 'Save changes',
    successSaving: 'Saving sucessfully',
    noChanges: 'No changes.',
    addParticipant: 'Add Participant',
    labelUserId: 'User id or name',
    labelPermission: 'Auth:',
    errorFieldsAddParticipant: 'Fill in all fields!',
    errorRemoveUser: 'Error on remove user',
    successAddParticipant: 'User added sucessfully',
    threadDetails: 'Thread details'
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-messages-thread-details-100554')
export class CollabMessagesThreadDetails extends StateLitElement {

    private msg: MessageType = messages['en'];

    @property() userId: string | undefined;

    @property() threadDetails?: IThreadDetails = { "thread": { "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417180232" }, { "action": "update_name", "userId": "20250417120841.1000", "timestamp": "20250417180232" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417180232" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417180232" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417183722" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250424195218" }], "languages": ["pt", "en", "es"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417180232.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "Enquetes", "lastMessage": "@@ Criar um widget que permita aos usuários selecionar um intervalo de datas, com opções para definir limites mínimos e máximos e bloquear datas específicas, ideal para aplicações de reservas e agendamentos. Fazer um dropdown, com a data inicial e data final sendo marcadas uma após a outra. A data inicial deve ser menor que a data final. O usuário deve clicar na data inicial e depois na data final para confirmar a seleção. Cada dia na tabela deve ser um botão clicável. No final da seleção, atualizar o componente para mostrar o período selecionado e atualizar a propriedade do web-componente. A mensagem de erro deve ficar em cima do componente, para evitar que fique embaixo do dropdown e não seja visível.", "lastMessageTime": "20250502195959.1000", "unreadCount": 0, "lastSync": "20250506140645" }, "users": [{ "avatar_url": "https://lh3.googleusercontent.com/a-/AOh14GjhEPN7UazL97l6qFIRIYUoLY-PNNPC93Zw4EVT=s96-c", "threads": ["20250417135645.1000", "20250417180232.1000", "20250417133813.1000", "20250422203048.1000", "20250425212707.1000"], "name": "Guilherme Pereira", "userId": "20250417120841.1000", "status": "active" }, { "avatar_url": "https://lh5.googleusercontent.com/-RcrSZBlS8sM/AAAAAAAAAAI/AAAAAAAAAAc/DQDUXj8XpEo/s96-c/photo.jpg", "threads": ["20250417133813.1000", "20250417180232.1000", "20250423205309.1000"], "name": "Santiago", "userId": "20250417120844.1000", "status": "active" }, { "avatar_url": "https://lh6.googleusercontent.com/-Gup9IkqANhQ/AAAAAAAAAAI/AAAAAAAAIFc/38cLYfRcRbg/s96-c/photo.jpg", "threads": ["20250417135645.1000", "20250417180232.1000", "20250425212707.1000"], "name": "Wagner", "userId": "20250417004803.1000", "status": "active" }] };

    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() labelErrorRemoveUser: string = '';

    @state() private isLoading: boolean = false;
    @state() private editedThreadDetails?: IThreadDetails;

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
    }

    async updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);

        if (changedProperties.has('threadDetails') && this.threadDetails && this.userId) {
            for (const user of this.threadDetails?.thread.users || []) {
                const find = this.threadDetails?.users.find((u) => u.userId === user.userId);
                if (!find) {
                    const resUser = await getUser(user.userId);
                    if (resUser) this.threadDetails.users.push(resUser);
                    else {
                        const data = await this.getThreadInfo(this.threadDetails.thread.threadId, this.userId);
                        this.threadDetails = data;
                    }
                }
            }

            this.editedThreadDetails = JSON.parse(JSON.stringify(this.threadDetails));
        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const users = this.editedThreadDetails?.users || [];

        return html`
      <div class="content">
        <div class="details">
            <h3>${this.msg.details}: ${this.threadDetails?.thread.threadId}</h3>

            <label>${this.msg.threadName}
                <input type="text" name="name" required
                    .value=${this.editedThreadDetails?.thread.name}
                    @input=${(e: Event) => { if (this.editedThreadDetails) this.editedThreadDetails.thread.name = (e.target as HTMLInputElement).value }}>
            </label>
                <label>${this.msg.status}
                <select name="status" required
                    .value=${this.editedThreadDetails?.thread.status}
                    @change=${(e: Event) => { if (this.editedThreadDetails) this.editedThreadDetails.thread.status = (e.target as HTMLInputElement).value as mls.msg.ThreadStatus }}>
                    <option value="active">${this.msg.statusActive}</option>
                    <option value="archived">${this.msg.statusArchived}</option>
                    <option value="deleted">${this.msg.statusDeleted}</option>
                </select>
            </label>

             <label> ${this.msg.visibility}
                <select name="visibility" required
                    .value=${this.editedThreadDetails?.thread.visibility}
                    @change=${(e: Event) => { if (this.editedThreadDetails) this.editedThreadDetails.thread.visibility = (e.target as HTMLInputElement).value as mls.msg.ThreadVisibility }}>
                    <option value="public">${this.msg.visibilityPublic}</option>
                    <option value="private">${this.msg.visibilityPrivate}</option>
                    <option value="company">${this.msg.visibilityCompany}</option>
                    <option value="team">${this.msg.visibilityTeam}</option>
                </select>
            </label>

            
            <label> ${this.msg.languages}</label>
            <collab-input-tag-100554 
                pattern="^[a-z]{2}$|^[a-z]{2}-[A-Z]{2}$"
                .value=${this.editedThreadDetails?.thread.languages.join(',')}
                .onValueChanged=${(value: string) => { if (this.editedThreadDetails) this.editedThreadDetails.thread.languages = value.split(',') }}
                id="languageInput"
            ></collab-input-tag-100554>
            <small> ${this.msg.languagesHint}</small>
    
            <div class="actions">
                <button
                @click=${this.saveChanges}
                ?disabled=${this.isLoading}
                >
                    ${this.isLoading ? html`<span class="loader"></span>` : this.msg.btnSave}
                </button>
                ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}<small>` : ''}
                ${this.labelError ? html`<small class="saving-error">${this.labelError}<small>` : ''}   
            </div>

        </div>

        <div class="users">
            <h3>${this.msg.users}</h3>
            <ul>
                ${repeat(
            this.editedThreadDetails?.thread.users || [],
            ((user: { userId: string }) => user.userId) as any,
            ((user: { userId: string; }) => {
                const details = users.find((us) => us.userId === user.userId);
                return html`
                                <li>
                                    <img src="${details?.avatar_url}" alt="${details?.name}" width="32" height="32" />
                                    ${details?.name} (${user.userId})
                                    <button class="remove" @click="${(e: MouseEvent) => this.removeUser(e, user.userId)}">${this.msg.remove}</button>
                                </li>
                    `;
            }
            ) as any)}
            </ul>
            ${this.labelErrorRemoveUser ? html`<small class="saving-error">${collab_triangle_exclamation} ${this.labelErrorRemoveUser}<small>` : ''}   

            <details class="details-add-participant">
                <summary>${this.msg.addParticipant}</summary>
                <div>
                    <collab-messages-add-participant-100554 userId=${this.userId} .actualThread=${{ ...this.threadDetails }}></collab-messages-add-participant-100554>
                </div>
            </details>
        </div>
      </div>

    `;
    }

    private async removeUser(e: MouseEvent, userId: string) {
        this.labelErrorRemoveUser = '';
        if (!this.threadDetails || !this.userId || !this.editedThreadDetails) return;
        const button = (e.target as HTMLElement).closest('button');
        try {
            button?.classList.add('loading');
            const newThread = await this.removeUserFromThread(this.threadDetails.thread.threadId, this.userId, userId);
            if (newThread) {
                this.threadDetails = JSON.parse(JSON.stringify(this.editedThreadDetails));
                const threadCache = await updateThread(newThread.threadId, newThread);
                notifyThreadChange(threadCache);
            }
        } catch (err: any) {
            this.labelErrorRemoveUser = this.msg.errorRemoveUser + ':' + err.message;
        } finally {
            button?.classList.remove('loading');
        }
    }

    private getChangedFields(): mls.msg.RequestUpdateThread | undefined {
        if (!this.threadDetails || !this.editedThreadDetails) return undefined;

        const original = this.threadDetails.thread;
        const edited = this.editedThreadDetails.thread;

        const fields: (keyof mls.msg.ThreadPerformanceCache)[] = ['group', 'languages', 'name', 'status', 'visibility'];
        const changed: mls.msg.RequestUpdateThread = {
            action: 'updateThread',
            threadId: original.threadId,
            userId: this.userId!,
        };

        for (const field of fields) {
            const origVal = JSON.stringify(original[field]);
            const editVal = JSON.stringify(edited[field]);
            if (origVal !== editVal) {
                (changed as any)[field] = edited[field];
            }
        }

        return changed;
    }


    private async saveChanges() {

        this.labelError = '';
        this.labelOk = '';
        if (!this.editedThreadDetails || !this.userId) return;

        const changes = this.getChangedFields();
        if (!changes) return;

        const needUpdateThread = Object.keys(changes).length > 3;

        if (!needUpdateThread) {
            this.labelError = this.msg.noChanges;
            return;
        }

        let newThread: mls.msg.Thread | undefined;

        this.isLoading = true;
        try {

            if (needUpdateThread) {
                const response = await mls.api.msgUpdateThread(changes);
                if (response.statusCode !== 200) {
                    this.labelError = `${response.msg}`;
                    return;
                }
                newThread = response.thread;
            }

            if (newThread) {
                this.threadDetails = JSON.parse(JSON.stringify(this.editedThreadDetails));
                const threadCache = await updateThread(newThread.threadId, newThread);
                notifyThreadChange(threadCache);
            }

            this.labelOk = `${this.msg.successSaving}`;

        } catch (err: any) {
            console.error(err);
            this.labelError = err.message;
        } finally {
            this.isLoading = false;
        }
    }

    private async removeUserFromThread(threadId: string, userId: string, userIdOrName: string) {
        const params: mls.msg.RequestRemoveUserInThread = {
            action: 'removeUserInThread',
            threadId,
            userId,
            userIdOrName
        };

        try {
            const res = await mls.api.msgUpdateThread(params);
            return res.thread;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    private async getThreadInfo(threadId: string, userId: string): Promise<IThreadDetails> {
        try {
            const response = await mls.api.msgGetThreadUpdate({
                threadId,
                userId
            });
            return response;
        } catch (err: any) {
            throw new Error(err.message)
        }
    }

}

interface IThreadDetails {
    thread: mls.msg.ThreadPerformanceCache,
    users: mls.msg.User[]
}
