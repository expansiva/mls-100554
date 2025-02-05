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
            columns:['empresa','cnpj','endereco'],
            error: '',
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

        globalState.globalStateManagment.setState('projectTest.page2.indexSel', e.detail.index, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', globalState._ica.projectTest.tables.fornecedores[e.detail.index].empresa, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', globalState._ica.projectTest.tables.fornecedores[e.detail.index].cnpj, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', globalState._ica.projectTest.tables.fornecedores[e.detail.index].endereco, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', globalState._ica.projectTest.tables.fornecedores[e.detail.index].contato, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', globalState._ica.projectTest.tables.fornecedores[e.detail.index].produtos, true);
    }

    onCancelar() {

        const idx = globalState._ica.projectTest.page2.indexSel;

        const emp = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].empresa;
        const cnpj = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].cnpj;
        const end = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].endereco;
        const ct = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].contato;
        const prod = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].produtos;

        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', emp, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', cnpj, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', end, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', ct, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', prod, true);

    }

    onNovo() {

        globalState.globalStateManagment.setState('projectTest.page2.indexSel', -1, true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.empresa', '', true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.cnpj', '', true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.endereco', '', true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.contato', '', true);
        globalState.globalStateManagment.setState('projectTest.page2.selecionado.produtos', '', true);

    }

    onSalvar() {

        let idx = globalState._ica.projectTest.page2.indexSel;
        let ret = this.validarReg();
        if (!ret) return;

        globalState.globalStateManagment.setState(`projectTest.page2.error`, '', true);

        const i = Object.assign({}, globalState._ica.projectTest.page2.selecionado);

        i.produtos = typeof i.produtos === 'string' ? i.produtos.split(', ') : i.produtos;

        if (idx < 0) {

            const dt = [...globalState._ica.projectTest.tables.fornecedores];
            dt.push(i);
            globalState.globalStateManagment.setState(`projectTest.tables.fornecedores`, dt, true);

            this.onNovo();
            return;

        }

        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].empresa`, i.empresa, true);
        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].cnpj`, i.cnpj, true);
        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].endereco`, i.endereco, true);
        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].contato`, i.contato, true);
        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores[${idx}].produtos`, i.produtos, true);


    }

    onExcluir() {

        let idx = globalState._ica.projectTest.page2.indexSel;

        if (idx < 0) return;

        const dt = [...globalState._ica.projectTest.tables.fornecedores];
        dt.splice(idx, 1);

        globalState.globalStateManagment.setState(`projectTest.tables.fornecedores`, dt, true);

        globalState.globalStateManagment.setState(`projectTest.page2.indexSel`, -1, true);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.empresa`, '', true);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.cnpj`, '', true);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.endereco`, '', true);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.contato`, ``, true);
        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.produtos`, '', true);

    }

    private onAddProd() {

        const selProds = this.querySelector('#selProds') as any;
        if (!selProds) return;
        const vl = selProds.querySelector('select').value;
        if (globalState._ica.projectTest.page2.selecionado.produtos.includes(vl)) return;

        let vls = globalState._ica.projectTest.page2.selecionado.produtos;
        if (typeof vl === 'string') {
            vls += vls.length === 0 ? vl : ', ' + vl;
        } else {
            vls.push(vl);
            vls = vls.join(', ');
        }

        globalState.globalStateManagment.setState(`projectTest.page2.selecionado.produtos`, vls, true);

    }

    private validarReg(): boolean {

        let vcnpj = this.validarCNPJ(globalState._ica.projectTest.page2.selecionado.cnpj);

        if (!vcnpj) {
            globalState.globalStateManagment.setState(`projectTest.page2.error`, 'CNPJ invalido', true);
            return false;
        }

        const cnpj = globalState._ica.projectTest.page2.selecionado.cnpj.replace(/[^\d]/g, '');

        let cnpjv = true;
        globalState._ica.projectTest.tables.fornecedores.forEach((f: any) => {
            const cnpjf = f.cnpj.replace(/[^\d]/g, '');
            if (cnpj === cnpjf) cnpjv = false;
        })

        if (!cnpjv) {
            globalState.globalStateManagment.setState(`projectTest.page2.error`, 'Fornecedor já cadastrado', true);
            return false;
        }


        return true;
    }

    private validarCNPJ(cnpj: string) {

        cnpj = cnpj.replace(/[^\d]/g, '');

        if (cnpj.length !== 14) return false;

        if (/^(\d)\1+$/.test(cnpj)) return false;

        const calcularDigito = (pos: number) => {
            let soma = 0;
            const multiplicadores = pos === 12
                ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

            for (let i = 0; i < multiplicadores.length; i++) {
                soma += parseInt(cnpj[i]) * multiplicadores[i];
            }

            let resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        if (calcularDigito(12) !== parseInt(cnpj[12])) return false;

        if (calcularDigito(13) !== parseInt(cnpj[13])) return false;

        return true;
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
