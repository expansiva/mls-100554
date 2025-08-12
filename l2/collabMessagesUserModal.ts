/// <mls shortName="collabMessagesUserModal" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_message } from './_100554_collabIcons';


@customElement('collab-messages-user-modal-100554')
export class CollabMessagesUserModal100554 extends StateLitElement {

    @property({ type: Boolean }) open = true;
    @property() user?: mls.msg.User; 


    private close() {
        this.open = false;
    }

    private handleGlobalMouseMove = (e: MouseEvent) => {
        const modal = this.querySelector('collab-messages-user-modal-100554');
        if (modal && !modal.contains(e.target as Node)) {
            this.destroy();
        }
    };

    firstUpdated() {
        document.addEventListener('mousemove', this.handleGlobalMouseMove);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('mousemove', this.handleGlobalMouseMove);
    }

    private destroy() {
        this.remove();
    }

    render() {
        if (!this.open) return null;

        return html`
        <div class="collab-messages-user-modal-box"
            @mouseover=${(e: MouseEvent) => e.stopPropagation()}
            @mouseleave=${(e: MouseEvent) => { e.stopPropagation(); this.destroy(); }}
            @click=${(e: Event) => e.stopPropagation()}
        >
            <div class="collab-messages-user-modal-header">
            <img class="collab-messages-user-modal-avatar" src=${this.user?.avatar_url} alt=${this.user?.name} />
                <div>
                    <div class="collab-messages-user-modal-userName">${this.user?.name}<span class="collab-messages-user-modal-userId"> (${this.user?.userId})</span></div>
                    <div class="collab-messages-user-modal-userStatus ${this.user?.status}"> ● ${this.user?.status}</div>
                </div>
            </div>
            <div class="collab-messages-user-modal-actions">
                <button class="collab-messages-user-modal-message-btn">${collab_message} Message</button>
            </div>
        </div>
    
    `;
    }
}