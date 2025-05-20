/// <mls shortName="wcSection" project="100554" enhancement="_100554_enhancementLit" groupName="_100554_icaLayoutFlowSection" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wc-section-100554')
export class WcSection100554 extends LitElement {
    createRenderRoot() {
        return this;
    }

    render() {
        return html`<slot></slot>`;
    }
}
