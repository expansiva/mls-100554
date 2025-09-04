/// <mls shortName="ateste2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
//import { CollabLitElement } from './_100554_/l2/collabLitElement';
//import { CollabLitElement } from './l2/collabLitElement'
// colocar no console: mls.modePreview = 'minimum'

const message_pt = {
    hello: 'Hello world!'
}

@customElement('ateste2-100554')
export class SimpleGreeting extends CollabLitElement {

    @property() name: string = 'Roberto';

    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }
    
    render() {
        return html`<div class="cls1">
            Meu nome é: ${this.name}
        </div>`;
    }


}