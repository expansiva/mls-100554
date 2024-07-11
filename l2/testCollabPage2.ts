/// <mls shortName="testCollabPage2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { CollabPageElement, getEventName } from './_100554_collabPageElement'
import { customElement, property } from 'lit/decorators.js';

@customElement('test-collab-page2-100554')
export class TestCollabPage2100554 extends CollabPageElement {

    initPage() {
        window.globalState.users = [{
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
    }


    handleClickinput2Desktop() {
        console.log('Click handler desktop for element with ID 2 in page collabPage2');
    }

}