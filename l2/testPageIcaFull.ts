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

            aux: {
                sum: 0,
            }

        };
        return html``;
    }


    /// **collab_events_start**
    handleClickbtnSomarDesktop() {
        window.globalStateManagment.setState('aux.sum', window.globalState.aux.sum + 1);
    }

    handleClickbtnSubtrairDesktop() {
        window.globalStateManagment.setState('aux.sum', window.globalState.aux.sum - 1);
    }



}

