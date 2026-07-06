/// <mls fileReference="_100554_/l2/widgetDividerLine.ts" enhancement="_100554_/l2/enhancementLit" />

import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';

@customElement('widget-divider-line-100554')
export class WidgetDivider100554 extends StateLitElement {

    createRenderRoot() {
        return this;
    }

    @property() text: string | undefined;

    render() {
        return html`<hr></hr>`;
    }
}

