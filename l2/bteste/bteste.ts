/// <mls shortName="bteste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

@customElement('bteste-100554')
export class SimpleGreeting extends CollabLitElement {
    
    createRenderRoot() {
        return this;
    }

        
    @property() name: string = new Date(Date.now()).toString();
    
    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }

    render() {

        return html`<div class="cls1"><h1>Hello world lucas 4</h1></div>`;
    }


}
