/// <mls shortName="testPageIcaFull" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';

@customElement('test-page-ica-full-100554')
export class TestPageICAFull extends CollabPageElement {

    render() {
        window.globalState = {
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
            },
            newUser: {
                name: '',
                age: 0,
                city: '',
                sex: ''
            },
        };
        return html``;
    }
}
