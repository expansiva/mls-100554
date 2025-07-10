/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { initState, setState, getState, subscribe } from './_100554_collabState';
import { initTestState, adicionarSolicitacao, ISolicitacao } from './_100554_testPagesState';

@customElement('page-test1-100554') 
export class PageTest1100554 extends CollabPageElement {

    initPage() {
        initTestState();
        initState('projectTest.page1', {
            action: '',
            labelError: '',
            labelOk: '',
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

        subscribe(
            [
                'projectTest.page1.action',
            ]
            , this);

    }


    handleIcaStateChange(_key: string, _value: any) {

        if (_key !== 'projectTest.page1.action') return;
        if (_value === 'save') this.handleClickBtnSave();
        else if (_value === 'cancel') this.handleClickBtnCancel();
    }

    private clear() {
        setState('projectTest.page1.newRequest.id', 0, true);
        setState('projectTest.page1.newRequest.solicitante', '', true);
        setState('projectTest.page1.newRequest.item', 'Computadores e notebooks', true);
        setState('projectTest.page1.newRequest.quantidade', '1', true);
        setState('projectTest.page1.newRequest.data', new Date().toISOString().split('T')[0], true);
        setState('projectTest.page1.newRequest.status', 'Pendente', true);
        setState('projectTest.page1.newRequest.depto', 'Tecnologia da Informação', true);
        setState('projectTest.page1.newRequest.justificativa', '', true);
    }


    async handleClickBtnSave() {
        const novaSolicitacao: ISolicitacao = getState('projectTest.page1.newRequest');
        if (!novaSolicitacao.solicitante) {
            setState(`projectTest.page1.labelError`, 'O solicitante não deve pode ser em branco', true);
            return;
        }
        if (novaSolicitacao.quantidade < 1) {
            setState(`projectTest.page1.labelError`, 'A quantidade minima deve ser 1', true);
            return;
        }
        adicionarSolicitacao(novaSolicitacao);
        this.clear();
        setState('projectTest.page1.action', '', true);
        setState(`projectTest.page1.labelOk`, 'Dados salvos', true);

    }

    async handleClickBtnCancel() {
        this.clear();
        setState('projectTest.page1.action', '', true);
    }

}
