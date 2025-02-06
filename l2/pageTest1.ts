/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState } from './_100554_icaState';
import { initTestState, adicionarSolicitacao, ISolicitacao } from './_100554_testPagesState';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';

@customElement('page-test1-100554')
export class PageTest1100554 extends CollabPageElement {

    initPage() {

        initTestState();
        initState('projectTest.page1', {
            saving: false,
            canceling: false,
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

        globalState.globalStateManagment.subscribe(
            [
                'state/0;projectTest.page1.saving',
                'state/0;projectTest.page1.canceling',
            ]
            , this);

    }


    handleIcaStateChange(_key: string, _value: any) {

        if (_key === 'projectTest.page1.saving' && _value === true) {
            this.handleClickBtnSave();
        } else if (_key === 'projectTest.page1.canceling' && _value == true) {
            this.handleClickBtnCancel();
        }

    }

    private clear() {
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.id', 0, true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.solicitante', '', true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.item', 'Computadores e notebooks', true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.quantidade', '1', true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.data', new Date().toISOString().split('T')[0], true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.status', 'Pendente', true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.depto', 'Tecnologia da Informação', true);
        globalState.globalStateManagment.setState('projectTest.page1.newRequest.justificativa', '', true);
    }


    async handleClickBtnSave() {
        const novaSolicitacao: ISolicitacao = globalState._ica.projectTest.page1.newRequest;
        adicionarSolicitacao(novaSolicitacao);
        this.clear();
        globalState.globalStateManagment.setState('projectTest.page1.saving', false, true);
    }

    async handleClickBtnCancel() {
        this.clear();
        globalState.globalStateManagment.setState('projectTest.page1.canceling', false, true);
    }

}
