/// <mls shortName="wcRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wc-row-100554')
export class WcRow extends LitElement {
    gap: string | undefined;

    @property() hint: string | undefined;

    render() {
        return html`<slot></slot>`;
    }
}
