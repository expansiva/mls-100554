/// <mls shortName="mlsStartCheckbox" project="100554" enhancement="_100541_enhancementLit" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('mls-start-checkbox-100554')
export class MLSCheckboxStart extends LitElement {

    @property() level = '';
    @query('input') check: HTMLInputElement;

    private state: boolean[] = [];
    private getData() {
        let data: boolean[] = [true, true, true, true, true, true, true, true]
        const dataStr = localStorage.getItem('collabcodes-showstart');
        if (dataStr) data = JSON.parse(dataStr);
        this.state = data;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.getData();
        this.requestUpdate(); // Trigger a re-render
    }

    changeStatusService() {
        this.state[this.level] = this.check.checked;
        localStorage.setItem('collabcodes-showstart', JSON.stringify(this.state));
    }

    render() {
        return html`
          <input
            type="checkbox"
            .checked=${(this.state[this.level])} 
            @change="${this.changeStatusService}">
          </input> Mostrar este service na primeira vez que entrar neste módulo </div>    
    `;
    }
}
