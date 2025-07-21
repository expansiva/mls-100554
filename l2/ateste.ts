/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'
import './_100554_ateste2';
/// **collab_i18n_start**
const message_pt = {
    hello2: 'Ola mundo!, teste',
    hello: 'Ola mundo novo!',
}
type MessageType = typeof message_pt;
const messages: { [key: string]: MessageType } = {
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('ateste-100554')
export class SimpleGreeting extends CollabLitElement {
    @property() name: string = new Date(Date.now()).toString();
    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }
    showGreetingAlert() {
        alert(`Hello world Lucas 10`);
    }
    render() {
        return html`
      <div class="cls1" clb_id="1">
        <h1 clb_id="2">Hello world Lucas ${message_pt.hello} teste 23</h1>
        <button @click="${this.showGreetingAlert}" clb_id="3">Show Greeting</button>
        <ateste2-100554 clb_id="4" name="Guilherme"></ateste2-100554>
        <h1 clb_id="5">${message_pt.hello}</h1>
      </div>
    `;
    }
}
