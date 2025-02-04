/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState } from './_100554_icaState';
import { initTestState } from './_100554_testPagesState';
@customElement('page-test1-100554')
export class PageTest1100554 extends CollabPageElement {

    initPage() {

        initTestState();

    }

    /// **collab_events_start**
    async handleClickbtnSave(e: CustomEvent) {
        console.info('click save')
    }



}
