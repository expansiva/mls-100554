/// <mls shortName="wcSection" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowSectionBase } from './_100554_icaLayoutFlowSectionBase';

@customElement('wc-section-100554')
export class WcSection100554 extends IcaLayoutFlowSectionBase {

    static styles = css`
        :host {
            height: 100%;
            width: 100%;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        :host(.full) {
            width: 100%;
        }
        :host(.outset) {
            max-width: 740px;
        }
        :host(.inset) {
            max-width: 680px;
        }
    `;

    render() {
        return html`
        <slot></slot>
       `;
    }
}
