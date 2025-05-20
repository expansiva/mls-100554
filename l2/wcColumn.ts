/// <mls shortName="wcColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wc-column-100554')
export class WcColumn extends LitElement {
    gap: string | undefined;

    render() {
        return html`<slot></slot>`
    }

}

