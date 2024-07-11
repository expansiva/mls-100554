/// <mls shortName="testPageInPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';

@customElement('test-page-in-page-100554')
export class TestPageICAFull extends CollabPageElement {

    initPage() {
    
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
            sum: 0,
            
        };
    }

    /// **collab_events_start**
    handleClickbtnSomarDesktop() {
        window.globalStateManagment.setState('sum', window.globalState.sum + 1);
    }

    handleClickbtnSubtrairDesktop() {
        window.globalStateManagment.setState('sum', window.globalState.sum - 1);
    }
    
}

