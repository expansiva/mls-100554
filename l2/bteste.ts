/// <mls shortName="bteste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

@customElement('bteste-100554')
export class MeuTeste extends CollabLitElement {
    
    createRenderRoot() {
        return this;
    }

        
    @property() name: string = new Date(Date.now()).toString();
    
    handleConfirm(e: CustomEvent) {
        console.info(e.detail, 'no handleConfirm');
    }

    render() {

        return html`<div class="cls1"><h1>Hello world lucas 3</h1></div>`;
    }


}
