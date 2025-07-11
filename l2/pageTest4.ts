/// <mls shortName="pageTest4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { getState, subscribe, initState, setState, unsubscribe } from './_100554_collabState';
import { initTestState, ISolicitacao } from './_100554_pageTestBase';
@customElement('page-test4-100554')
export class PageTest4 extends CollabPageElement {

    initPage() {
        initTestState();
        initState('projectTest.page4', {
            action: '',
            filter: {
                solicitante: '',
                status: '',
            },
            fields: ['id', 'solicitante', 'item', 'quantidade', 'data', 'status'],
            status: [''].concat(...getState('projectTest.tables.status').map((item: any) => item.value)),
            actualData: [...getState('projectTest.tables.solicitacoes')]
        });

        subscribe(
            [
                'projectTest.page4.action',
            ]
            , this);

    }


    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribe([
            'projectTest.page4.action'
        ], this)
    }

    handleIcaStateChange(_key: string, _value: any) {
        if (_key !== 'projectTest.page4.action') return;

        if (_value === 'filter') {
            this.handleClickBtnFilter();
        }
    }

    private filterData(dados: ISolicitacao[], filtro: any) {
        return dados.filter(({ solicitante, data, status }) => {
            const statusCorreto = filtro.status ? status === filtro.status : true;
            const solicitanteCorreto = filtro.solicitante ?
                solicitante.toLowerCase().includes(filtro.solicitante.toLowerCase()) : true;
            return statusCorreto && solicitanteCorreto;
        });
    }

    async handleClickBtnFilter() {

        const filterAtual = getState('projectTest.page4.filter');
        const data = [...getState('projectTest.tables.solicitacoes')];
        const filtered = this.filterData(data, filterAtual);
        setState('projectTest.page4.actualData', filtered, true);
        setState('projectTest.page4.action', '', true);
        this.requestUpdate();
    }

}
