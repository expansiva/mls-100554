/// <mls shortName="wcRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('wc-row-100554')
export class WcRow extends StateLitElement {
    gap: string | undefined;

    createRenderRoot() {
        return this;
    }

    @property() hint: string | undefined;

    render() {
        return html`<slot></slot>`;
    }
}
