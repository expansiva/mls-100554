/// <mls shortName="ateste2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

const message_pt = {
    hello: 'Hello world!'
}

@customElement('ateste2-100554')
export class SimpleGreeting extends CollabLitElement {

    @property() name: string = new Date(Date.now()).toString();

    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }
    
    showGreetingAlert() {
        alert(`Hello world Lucas 10`);
    } 

    render() {
        return html`<div class="cls1">
            Meu nome é: ${this.name}
        </div>`;
    }


}