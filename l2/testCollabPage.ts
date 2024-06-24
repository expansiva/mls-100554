/// <mls shortName="testCollabPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { CollabPageElement } from './_100554_collabPageElement'
import { customElement, property } from 'lit/decorators.js';

@customElement('test-collab-page-100554')
export class TestCollabPage100554 extends CollabPageElement {

    render() {
        window.globalState = {
            wcdAddEventSelected: '',
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
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

    handleClickinput2Desktop() {
        console.log('Click handler desktop for element with ID 2');
    }

    handleClickinput2Mobile() {
        console.log('Click handler mobile for element with ID 2');
    }

}