/// <mls shortName="collabMessagesConnect" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import { collab_chevron_left } from './_100554_collabIcons';

@customElement('collab-messages-connect-100554')
export class CollabMessagesConnect100554 extends IcaLitElement {

    @property() userId: string | undefined;

    @property() activeScenerie: IScenery = 'list';

    @property() actualThread: mls.msg.Thread | undefined;


    @property({ attribute: false }) userThreads: IThread = { "CONNECT": [{ "history": [{ "action": "created", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "update_group", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_language ${language}", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120841.1000", "timestamp": "20250417135645" }, { "action": "add_user", "userId": "20250417120844.1000", "timestamp": "20250417172252" }, { "action": "add_user", "userId": "20250417004803.1000", "timestamp": "20250417174719" }], "languages": ["pt"], "status": "active", "visibility": "private", "group": "CONNECT", "threadId": "20250417135645.1000", "users": [{ "userId": "20250417120841.1000", "auth": "admin" }, { "userId": "20250417120844.1000", "auth": "write" }, { "userId": "20250417004803.1000", "auth": "write" }], "name": "" }] };

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
    }

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
    }

    render() {

        const unreadCount = 6;

        console.info(this.userThreads)
        return html`

        <div class="header">
            ${this.activeScenerie === 'details'
                ? html`<span @click=${this.onTitleClick} >${collab_chevron_left} Thread: ${this.actualThread?.name || this.actualThread?.threadId}</span>`
                : html`Threads`
            }
            
        </div>

        ${this.activeScenerie === 'list'
                ? html`
                <ul class="thread-list">
                ${this.userThreads?.CONNECT.map((thread) => {
                    return html`
                        <li @click=${() => this.onThreadClick(thread)} class="thread-item">
                            <div class="thread-content">
                                <div class="thread-item-header">
                                    <span class="thread-name">${thread.name || thread.threadId}</span>
                                    <span class="last-update">2025-04-01</span>
                                </div>
                                <div class="thread-summary">
                                <span class="last-message">In develpoment</span>
                                    ${unreadCount > 0 ? html`<span class="unread-count">${unreadCount}</span>` : ''}
                                </div>
                            </div>
                        </li>
                    `;
                })}
            </ul>`
                : html`
                <div>In develpoment</div>
            `

            }
        
    `;
    }

    private onThreadClick(thread: mls.msg.Thread) {
        this.actualThread = thread;
        this.activeScenerie = 'details';
    }

    private onTitleClick() {
        this.activeScenerie = 'list';
    }

}

export interface CollbaMessagesConnectResponse {
    ok: boolean,
    msg?: string,
    data?: mls.msg.Thread
}

type IThread = { CONNECT: mls.msg.Thread[] }
type IScenery = 'list' | 'details'
