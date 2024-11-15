/// <mls shortName="aimPromptExample" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('aim-prompt-example-100554')
export class AimPromptExample extends CollabLitElement {

    @property({ type: String }) text = "example";
    @property({ type: String }) for = "";

    handleClick() {
        const aimPromptElement = document.querySelector(this.for);
        if (aimPromptElement) {
            aimPromptElement.setAttribute('text', this.text);
        }
    }

    render() {
        return html`
            <div class="prompt-suggestion" @click=${this.handleClick}>
                ${this.text}
            </div>
        `;
    }
}