/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// teste 4
@customElement('ateste-100554')
export class SimpleGreeting extends LitElement {
    static styles = css`p { color: red }`;

    @property()
    name: string = new Date(Date.now()).toString();

    handleConfirm(e: CustomEvent) {

        console.info(e.detail)

    }

    render() {
        return html`<aim-select-widget-100554 @select-widget-confirm=${this.handleConfirm}> </aim-select-widget-100554>`;
    }


}
