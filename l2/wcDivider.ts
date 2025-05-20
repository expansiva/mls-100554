/// <mls shortName="wcDivider" project="100554" enhancement="_100554_enhancementLit" groupName="_100554_icaLayoutFlowDivider" />

import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';

@customElement('wc-divider-100554')
export class WcDivider100554 extends LitElement {

    @property() text: string | undefined;

    render() {
        return html`<hr data-text=${this.text || '...'}></hr>`;
    }
}
