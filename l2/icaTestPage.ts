/// <mls shortName="icaTestPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ica-test-page-100554')
export class IcaTestPage100554 extends LitElement {

    static styles = css`:host {
        display: flex;
    }`;
    
    render() {
        window.globalState = {
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }]
            },
            users: [{
                name: 'Wagner',
                age: 63,
                city: 'SP',
                sex: 'm'
            },
            {
                name: 'Guilherme',
                age: 28,
                city: 'SP',
                sex: 'm'
            }]
        };
        return html``;

    }
}

interface IUser {
    name: string,
    age: number,
    city: string,
    sex: string,
}