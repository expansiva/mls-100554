/// <mls shortName="pageTest4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_collabState';
import { initTestState, ISolicitacao } from './_100554_testPagesState';
@customElement('page-test4-100554')
export class PageTest4 extends CollabPageElement {

    initPage() {
        initTestState();

        initState('projectTest.page4', {
            action: '',
            filter: {
                solicitante: '',
                dataInicial: '',
                dataFinal: new Date().toISOString().split('T')[0],
                status: '',
            },
            fields: ['id', 'solicitante', 'item', 'quantidade', 'data', 'status'],
            status: [{ key: '', value: '' }].concat(...globalState._ica.projectTest.tables.status),
            actualData: [...globalState._ica.projectTest.tables.solicitacoes]
        });

        globalState.globalStateManagment.subscribe(
            [
                'projectTest.page4.action',
            ]
            , this);

    }

    handleIcaStateChange(_key: string, _value: any) {
        if (_key !== 'projectTest.page4.action') return;

        if (_value === 'filter') {
            this.handleClickBtnFilter();
        }
    }

    private filterData(dados: ISolicitacao[], filtro: any) {
        return dados.filter(({ solicitante, data, status }) => {
            const dentroDoPeriodo = new Date(data) >= new Date(filtro.dataInicial) && new Date(data) <= new Date(filtro.dataFinal);
            const statusCorreto = filtro.status ? status === filtro.status : true;
            const solicitanteCorreto = filtro.solicitante ?
                solicitante.toLowerCase().includes(filtro.solicitante.toLowerCase()) : true;

            return dentroDoPeriodo && statusCorreto && solicitanteCorreto;
        });
    }


    async handleClickBtnFilter() {
        const filterAtual = globalState._ica.projectTest.page4.filter;
        const data = [...globalState._ica.projectTest.tables.solicitacoes];
        const filtered = this.filterData(data, filterAtual);
        setState('projectTest.page4.actualData', filtered, true);
        setState('projectTest.page4.filter', '', true);
        this.requestUpdate();
    }

}
