/// <mls shortName="wcDivider" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowDividerBase } from './_100554_icaLayoutFlowDividerBase';

@customElement('wc-divider-100554')
export class WcDivider100554 extends IcaLayoutFlowDividerBase {

    @property() text: string | undefined;

    render() {
        return html`<hr data-text=${this.text || '...'}></hr>`;
    }
}
