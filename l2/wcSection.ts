/// <mls shortName="wcSection" project="100554" enhancement="_100554_enhancementLit" groupName="_100554_icaLayoutFlowSection" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowSectionBase } from './_100554_icaLayoutFlowSectionBase';

@customElement('wc-section-100554')
export class WcSection100554 extends IcaLayoutFlowSectionBase {

    render() {
        return html`<slot></slot>`;
    }
}
