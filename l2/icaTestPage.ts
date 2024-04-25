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

        return html`

        <div>
            <h3>Exemplos dinamicos no Render</h3>
            ${window.globalState.users.map((user: IUser, index: number) => {
                return html`
            <div style="padding: 1rem; display:flex; gap:4rem;">
                <wc-select-one-100554 label="Sexo" options="{{ tables. }}" selectedvalue="{{users[${index}].sex}}" username="{{users[${index}].name}}"  ></wc-select-one-100554>
                <wc-input-text-100554 label="Usuario"  datasource="{{users[${index}].name}}" ></wc-input-text-100554>
                <wc-input-number-with-buttons-100554 label="Idade:" datasource="{{users[${index}].age}}" errormessage="Idade Invalida" minvalue="0" maxvalue="100"></wc-input-number-with-buttons-100554>
            </div>

         `
        })}
        </div>
        
        `;
    }
}

interface IUser {
    name: string,
    age: number,
    city: string,
    sex: string,
}