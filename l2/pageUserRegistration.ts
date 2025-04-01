/// <mls shortName="pageUserRegistration" project="100554" enhancement="_100554_enhancementLit" groupName="other" /> 

import { BECollabClient } from './_100554_beCollabClient';
import { CollabPageElement } from './_100554_collabPageElement';
import { customElement, query } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_icaState';
import { initTestState } from './_100554_testPagesState';

@customElement('page-user-registration-100554')
export class PageUserRegistration100554 extends CollabPageElement {

    private client = new BECollabClient();
    @query('#widget44') list: HTMLElement | undefined; 
    @query('#contentForm') contentForm: HTMLElement | undefined;

    initPage() {

        initTestState();

        initState('projectTest.pageUserRegistration', {
            indexSel: -1,
            columns: ['id', 'user', 'status'],
            mode:'list',
            msg: '',
            action: '',
            users: [],
            selected: {
                id: '',
                user: '',
                status: ''

            },
        });

        

        globalState.globalStateManagment.subscribe([
            'data/0;projectTest.pageUserRegistration.indexSel',
            'data/0;projectTest.pageUserRegistration.action',
            'data/0;projectTest.pageUserRegistration.mode'
        ], this);

        this.onGetForm();

        
    }

    handleIcaStateChange(_key: string, _value: any) {

        if (_key === 'projectTest.pageUserRegistration.indexSel' && _value >= 0) {
            this.onSelectItem(_value);
            return;
        }

        if (_key === 'projectTest.pageUserRegistration.action' && _value === 'add') {
            this.onNew();
            return;
        }
 
        if (_key === 'projectTest.pageUserRegistration.action' && _value != '') {
            this.onSubmitForm();
            return;
        }

        if (_key === 'projectTest.pageUserRegistration.mode' && _value != '') {
            this.onMode();
            return;
        }

    }

    onSelectItem(idx: number) {

        setState('projectTest.pageUserRegistration.selected.id', globalState._ica.projectTest.pageUserRegistration.users[idx].id, true);

        setState('projectTest.pageUserRegistration.selected.user', globalState._ica.projectTest.pageUserRegistration.users[idx].user, true);

        setState('projectTest.pageUserRegistration.selected.status', globalState._ica.projectTest.pageUserRegistration.users[idx].status, true);

        setState('projectTest.pageUserRegistration.mode', 'edit', true);

    }

    onNew() {

        setState('projectTest.pageUserRegistration.selected.id', '', true);

        setState('projectTest.pageUserRegistration.selected.user', '', true);

        setState('projectTest.pageUserRegistration.selected.status', '', true);

        setState('projectTest.pageUserRegistration.mode', 'edit', true);

    }

    private async onSubmitForm() { 
    
        let action = globalState._ica.projectTest.pageUserRegistration.action;
        const st = { ...globalState._ica.projectTest.pageUserRegistration };

        if (action === 'cancel') {
            setState('projectTest.pageUserRegistration.indexSel', -1, true);
            this.onGetForm();
            return;

        }

        if (action === 'save' && !st.selected.id) st.action = 'new';
        if (st.selected.id !== '') st.selected.id = +st.selected.id; 
        
        const ret = await this.client.request("beUserRegistration", "POST", st);  
        setState('projectTest.pageUserRegistration.msg', ret, true);
        this.onGetForm();
    }

    private async onGetForm() { 

        const ret = await this.client.request("beUserRegistration", "GET", {});
        setState('projectTest.pageUserRegistration.users', ret, true);
        setState('projectTest.pageUserRegistration.mode', 'list', true);
        setTimeout(() => setState('projectTest.pageUserRegistration.msg', '', true), 3000);
        
    }

    private time = -1;
    private onMode() { 
        clearTimeout(this.time);
        this.time = setTimeout(()=>this.configureMode(),500) 
    }

    private configureMode() {

        if (!this.contentForm || !this.list) return;
        const st = { ...globalState._ica.projectTest.pageUserRegistration };
        if (st.mode === 'list') {
            this.list.style.display = '';
            this.contentForm.style.display = 'none';
            return;
        }

        this.list.style.display = 'none';
        this.contentForm.style.display = '';

        const f = this.contentForm.querySelector('form');
        if (f) f.onsubmit = (e) => e.preventDefault();
    }

}