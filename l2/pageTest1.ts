/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState } from './_100554_icaState';
import { initTestState, adicionarSolicitacao, ISolicitacao } from './_100554_testPagesState';
@customElement('page-test1-100554')
export class PageTest1100554 extends CollabPageElement {

    initPage() {

        initTestState();
        initState('projectTest.page1', {
            newRequest: {
                id: 0,
                solicitante: '',
                item: 'Computadores e notebooks',
                quantidade: 1,
                data: new Date().toISOString().split('T')[0],
                status: 'Pendente',
                depto: 'Tecnologia da Informação',
                justificativa: '',
            }
        });

    }

    private clear() {
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.id', 0);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.solicitante', '');
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.item', 'Computadores e notebooks');
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.quantidade', 1);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.data', new Date().toISOString().split('T')[0],);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.status', 'Pendente');
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.depto', 'Tecnologia da Informação');
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.justificativa', '');
    }

    /// **collab_events_start**
    async handleClickBtnSave(e: CustomEvent) {

        const novaSolicitacao: ISolicitacao = globalState._ica.projectTest.page1.newRequest;
        adicionarSolicitacao(novaSolicitacao);

        globalState.globalStateManagment.setState('projectTest.page1.newRequest', {
            id: 0,
            solicitante: '',
            item: 'Computadores e notebooks',
            quantidade: 0,
            data: new Date().toISOString().split('T')[0],
            status: 'Pendente',
            depto: 'Tecnologia da Informação',
            justificativa: '',
        });

        this.clear();

    }

    async handleClickBtnCancel(e: CustomEvent) {
        this.clear();
    }

}
