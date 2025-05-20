/// <mls shortName="wcAccordionDetails" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('wc-accordion-details-100554')
export class WcAccordionDetails100554 extends LitElement {
    multiple: boolean | undefined;
    disabled: boolean | undefined;

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