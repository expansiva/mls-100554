/// <mls shortName="widgetRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('widget-row-100554')
export class WidgetRow extends StateLitElement {
    gap: string | undefined;

    createRenderRoot() {
        return this;
    }

    @property() hint: string | undefined;

    render() {
        return html`<slot></slot>`;
    }
}
