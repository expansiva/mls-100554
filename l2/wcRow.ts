/// <mls shortName="wcRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowRowBase } from './_100554_icaLayoutFlowRowBase';

@customElement('wc-row-100554')
export class WcRow extends IcaLayoutFlowRowBase {

    @property() hint: string | undefined;

    render() {
        return html`<slot></slot>`; 
    }
}
