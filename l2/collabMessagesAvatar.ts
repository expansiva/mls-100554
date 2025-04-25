/// <mls shortName="collabMessagesAvatar" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { collab_user } from './_100554_collabIcons';

@customElement('collab-messages-avatar-100554')
export class CollabMessagesAvatar100554 extends IcaLitElement {

    @property() avatar: string = '';

    render() {
        return html`
        <div class="avatar">
            ${this.avatar
                ? html`<img src="${this.avatar}" alt="Avatar" />`
                : html`<div class="avatar-placeholder">${collab_user}</div>`
            }
        </div>`;
    }
}
