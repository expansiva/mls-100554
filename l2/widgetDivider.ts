/// <mls fileReference="_100554_/l2/widgetDivider.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

@customElement('widget-divider-100554')
export class WcDivider100554 extends StateLitElement {

    createRenderRoot() {
        return this;
    }

    @property() text: string | undefined;

    render() {
        return html`<hr data-text=${this.text || '...'}></hr>`;
    }
}
