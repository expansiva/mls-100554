/// <mls shortName="pageTest3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement, query } from 'lit/decorators.js';
import { getState, subscribe, initState, setState, unsubscribe } from './_100554_collabState';
import { initTestState } from './_100554_pageTestBase';

@customElement('page-test3-100554') 
export class PageTest3100554 extends CollabPageElement {

    initPage() {

        initTestState();

        initState('projectTest.page3', {
            indexSel: -1,
            columns: ['id', 'solicitante', 'status'],
            error: '',
            action:'',
            justificativa: '',
            id: -1,
            solicitante: '',
        });

        subscribe([
            'projectTest.page3.indexSel',
            'projectTest.page3.action'
        ], this)

    }

    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribe([
            'projectTest.page3.indexSel',
            'projectTest.page3.action',

        ], this)
    }

    handleIcaStateChange(_key: string, _value: any) {

        if (_key === 'projectTest.page3.indexSel' && _value >= 0) {
            this.onSelectItem(_value);
            return;
        }

        if (_key === 'projectTest.page3.action' && _value === 'approve') {
            this.onApprove();
            return;
        }

        if (_key === 'projectTest.page3.action' && _value === 'reject') {
            this.onReject();
            return;
        }

    }

    onSelectItem(idx: number) {
    
        setState('projectTest.page3.id', getState(`projectTest.tables.solicitacoes[${idx}].id`), true);

        setState('projectTest.page3.solicitante', getState(`projectTest.tables.solicitacoes[${idx}].solicitante`), true);

        setState('projectTest.page3.justificativa', getState(`projectTest.tables.solicitacoes[${idx}].justificativa`), true);

    }

    onApprove() {

        setState(`projectTest.page3.action`, '', true);

        const idx = getState('projectTest.page3.indexSel');
        const dt = [...getState('projectTest.tables.solicitacoes')];

        dt[idx].status = 'Aprovado';
        setState(`projectTest.tables.solicitacoes`, dt, true);
    }

    onReject() {

        setState(`projectTest.page3.action`, '', true);

        const idx = getState('projectTest.page3.indexSel');
        const jus = getState('projectTest.page3.justificativa');
        const dt = [...getState('projectTest.tables.solicitacoes')];

        dt[idx].status = 'Rejeitado';
        dt[idx].justificativa = jus;
        setState(`projectTest.tables.solicitacoes`, dt, true);

    }

}