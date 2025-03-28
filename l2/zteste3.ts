/// <mls shortName="zteste3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState } from './_100554_icaState';

 @customElement('zteste3-100554')
 export class Zteste3100554 extends CollabPageElement {

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
     handleClickbuttonSum() {
         // here or code for event
     }

 }
