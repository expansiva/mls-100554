/// <mls shortName="testPageInPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';
import { globalState } from './_100554_icaState';

@customElement('test-page-in-page-100554')
export class TestPageICAFull extends CollabPageElement {

    initPage() {
    
        globalState._ica = {
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
        globalState.globalStateManagment.setState('sum', globalState._ica.sum + 1);
    }

    handleClickbtnSubtrairDesktop() {
        globalState.globalStateManagment.setState('sum', globalState._ica.sum - 1);
    }
    
}

