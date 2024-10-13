/// <mls shortName="aimPromptExample" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('aim-prompt-example-100554')
export class AimPromptExample extends CollabLitElement {

    @property({ type: String }) text = "example";
    @property({ type: String }) for = "";

    static styles = css`
        .prompt-suggestion {
            display: inline-block;
            padding: 10px;
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f0f0f0;
            cursor: pointer;
            font-family: Arial, sans-serif;
            transition: background-color 0.3s;
            color: black;
        }

        .prompt-suggestion:hover {
            background-color: #e0e0e0;
        }

        aim-prompt-100554 {
            display: block;
            margin: 20px 0;
            font-weight: bold;
        }
    `;

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