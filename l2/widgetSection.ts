/// <mls shortName="widgetSection" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('widget-section-100554')
export class WidgetSection100554 extends StateLitElement {
    createRenderRoot() {
        return this;
    }

    render() {
        return html`<slot></slot>`;
    }
}
