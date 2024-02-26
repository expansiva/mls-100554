/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { messages } from './_100554_collabMessagesPt';
// teste
@customElement('ateste-100554')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: red }`;

    @property()
    name: string = messages.todayIs(new Date(Date.now()));

    render() {
        return html`<p>  ${this.name} !</p>`;
    }

    
}
