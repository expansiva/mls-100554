/// <mls shortName="pageTest3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement, query } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_icaState';
import { initTestState } from './_100554_testPagesState';

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

        globalState.globalStateManagment.subscribe([
            'data/0;projectTest.page3.indexSel',
            'data/0;projectTest.page3.action'
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
    
        setState('projectTest.page3.id', globalState._ica.projectTest.tables.solicitacoes[idx].id, true);

        setState('projectTest.page3.solicitante', globalState._ica.projectTest.tables.solicitacoes[idx].solicitante, true);

        setState('projectTest.page3.justificativa', globalState._ica.projectTest.tables.solicitacoes[idx].justificativa, true);

    }

    onApprove() {

        setState(`projectTest.page3.action`, '', true);

        const idx = globalState._ica.projectTest.page3.indexSel;
        const dt = [...globalState._ica.projectTest.tables.solicitacoes];

        dt[idx].status = 'Aprovado';
        setState(`projectTest.tables.solicitacoes`, dt, true);
    }

    onReject() {

        setState(`projectTest.page3.action`, '', true);

        const idx = globalState._ica.projectTest.page3.indexSel;
        const jus = globalState._ica.projectTest.page3.justificativa;
        const dt = [...globalState._ica.projectTest.tables.solicitacoes];

        dt[idx].status = 'Rejeitado';
        dt[idx].justificativa = jus;
        setState(`projectTest.tables.solicitacoes`, dt, true);

    }

}