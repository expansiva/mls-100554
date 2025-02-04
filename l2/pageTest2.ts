/// <mls shortName="pageTest2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement, query } from 'lit/decorators.js';
import { globalState, initState } from './_100554_icaState';
import { initTestState } from './_100554_testPagesState';

@customElement('page-test2-100554')
export class PageTest2100554 extends CollabPageElement {

    initPage() {

        initTestState();

        initState('projectTest.page2', {
            indexSel: -1,
            selecionado: {
                empresa: '',
                cnpj: '',
                endereco: '',
                contato: '',
                produtos: []
            }
        });

    }

    onSelectItemtableSelect(e: any) {

        globalState.globalStateManagment.setState('projectTest.page2.indexSel', e.detail.index);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', globalState._ica.projectTest.tables.fornecedores[e.detail.index].empresa);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', globalState._ica.projectTest.tables.fornecedores[e.detail.index].cnpj);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', globalState._ica.projectTest.tables.fornecedores[e.detail.index].endereco);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', globalState._ica.projectTest.tables.fornecedores[e.detail.index].contato);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', globalState._ica.projectTest.tables.fornecedores[e.detail.index].produtos);
    }

    onCancelar() {

        const idx = globalState._ica.projectTest.page2.indexSel;

        const emp = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].empresa;
        const cnpj = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].cnpj;
        const end = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].endereco;
        const ct = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].contato;
        const prod = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].produtos;

        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', emp);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', cnpj);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', end);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', ct);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', prod);

    }

    onNovo() {

        globalState.globalStateManagment.setState('projectTest.page2.indexSel', -1);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', '');
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', '');
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', '');
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', '');
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', '');

    }

    onSalvar() {

        let idx = globalState._ica.projectTest.page2.indexSel;

        if (idx < 0) {

            globalState._ica.projectTest.tables.fornecedores.push(Object.assign({}, globalState._ica.projectTest.page2.selecionado));

            idx = globalState._ica.projectTest.tables.fornecedores.length;

        } else {

            const i = Object.assign({}, globalState._ica.projectTest.page2.selecionado);

            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].empresa`, i.empresa);
            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].cnpj`, i.cnpj);
            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].endereco`, i.endereco);
            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].contato`, ``);
            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].produtos`, i.produtos);
        }

        globalState.globalStateManagment.setState('projectTest.page2.indexSel', idx);

        const eltableSelect = this.querySelector('#tableSelect') as any;
        if (eltableSelect) {
            eltableSelect.data = globalState._ica.projectTest.tables.fornecedores;
            eltableSelect.requestUpdate();
        }

    }

    onExcluir() {

        let idx = globalState._ica.projectTest.page2.indexSel;

        if (idx < 0) return;

        globalState._ica.projectTest.tables.fornecedores.splice(idx, 1);

        globalState.globalStateManagment.setState(`projectTest.page2.indexSel`, -1);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.empresa`, '');
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.cnpj`, '');
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.endereco`, '');
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.contato`, ``);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.produtos`, '');


        const eltableSelect = this.querySelector('#tableSelect') as any;
        if (eltableSelect) {
            eltableSelect.data = globalState._ica.projectTest.tables.fornecedores;
            eltableSelect.requestUpdate();
        }

    }

    private onAddProd() {
    
        const selProds = this.querySelector('#selProds') as any;
        if (!selProds) return;
        const vl = selProds.querySelector('select').value;
        if (globalState._ica.projectTest.page2.selecionado.produtos.includes(vl)) return;

        globalState._ica.projectTest.page2.selecionado.produtos.push(vl);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.produtos`, globalState._ica.projectTest.page2.selecionado.produtos.join(', '));

    }


    /// **collab_events_start**
    handleItemSelectedTableSelect(ev: any) {
        this.onSelectItemtableSelect(ev);
    }

    handleClickButtonNovo() {
        this.onNovo();
    }

    handleClickButtonSalvar() {
        this.onSalvar();
    }

    handleClickButtonCancelar() {
        this.onCancelar();
    }

    handleClickButtonExcluir() {
        this.onExcluir();
    }

    handleClickButtonAddProd() {
        this.onAddProd();
    }

}
