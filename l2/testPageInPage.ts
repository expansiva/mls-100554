/// <mls shortName="testPageInPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';
import { Window } from './_100554_icaState';

@customElement('test-page-in-page-100554')
export class TestPageICAFull extends CollabPageElement {

    initPage() {
    
        (window as any as Window).globalState = {
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
            },
            newUser: {
                name: '',
                age: 0,
                city: '',
                sex: ''
            },
            sum: 0,
            
        };
    }

    /// **collab_events_start**
    handleClickbtnSomarDesktop() {
        (window as any as Window).globalStateManagment.setState('sum', (window as any as Window).globalState.sum + 1);
    }

    handleClickbtnSubtrairDesktop() {
        (window as any as Window).globalStateManagment.setState('sum', (window as any as Window).globalState.sum - 1);
    }
    
}

