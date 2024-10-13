/// <mls shortName="aimList" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('aim-list-100554')
export class AimActionList extends CollabLitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    render() {
        return html`${this.children}`;
    }

}