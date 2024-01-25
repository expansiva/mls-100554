/// <mls shortName="serviceDsStyleSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('service-ds-style-size-100554')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: red }`;

    @property()
    name: string = 'Somebody';

    render() {
        return html`<p> Hello, ${this.name} !</p>`;
    }
}
