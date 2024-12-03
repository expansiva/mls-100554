/// <mls shortName="cteste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';
import { Window } from './_100554_icaState';

 @customElement('cteste-100554')
 export class Cteste100554 extends CollabPageElement {

    initPage() {
    
        console.info('teste em Cteste100554');

        (window as any as Window).globalState = {
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
            },
            newUser: {
                name: 'Jose da Silva',
                age: 10,
                city: '',
                sex: ''
            },
            sum: 0,
        };

    }

    /// **collab_events_start**
    handleClickbuttonSum() {
        // here or code for event
    }

 }
