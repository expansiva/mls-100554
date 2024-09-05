/// <mls shortName="wcAccordionDetails" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaNavigationContentAccordionBase } from './_100554_icaNavigationContentAccordionBase';

@customElement('wc-accordion-details-100554')
export class WcAccordionDetails100554 extends IcaNavigationContentAccordionBase {

    @property({ type: String }) text = '';
    @property({ type: Boolean }) open = false;

    render() {
        return html`
        <details .open="${this.open}">
            <summary>${this.text || ''}</summary>
            <div>
                <slot></slot>
            </div>
        </details>
       `;
    }

}