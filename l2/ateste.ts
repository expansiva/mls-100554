/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// teste 4
@customElement('ateste-100554')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: red }`; 

    @property()
    name: string = new Date(Date.now()).toString();

    render() {
        return html`<p>  ${this.name} !</p>`;
    }

    
}
