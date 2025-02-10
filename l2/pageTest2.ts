/// <mls shortName="pageTest2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement, query } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_icaState';
import { initTestState } from './_100554_testPagesState';

@customElement('page-test2-100554')
export class PageTest2100554 extends CollabPageElement {

    initPage() {

        
        initTestState();
        
        initState('projectTest.page2', {
            columns:['empresa','cnpj','endereco'],
            error: '',
            indexSel: -1,
            action:'',
            selecionado: {
                empresa: '',
                cnpj: '',
                endereco: '',
                contato: '',
                produtos: []
            }
        });

        globalState.globalStateManagment.subscribe([
            'projectTest.page2.indexSel',
            'projectTest.page2.action'
        ], this)

    }

    handleIcaStateChange(_key: string, _value: any) {

        if (_key === 'projectTest.page2.indexSel' && _value >= 0) {
            this.onSelectItemtableSelect(_value);
            return;
        }

        if (_key === 'projectTest.page2.action' && _value === 'newRow') {
            this.onNew();
            return;
        }

        if (_key === 'projectTest.page2.action' && _value === 'save') {
            this.onSave();
            return;
        }

        if (_key === 'projectTest.page2.action' && _value === 'cancel') {
            this.onCancel();
            return;
        }

        if (_key === 'projectTest.page2.action' && _value === 'del') {
            this.onDel();
            return;
        }

        if (_key === 'projectTest.page2.action' && _value === 'addProd') {
            this.onAddProd();
            return;
        }

    }

    onSelectItemtableSelect(idx:number) {

        setState('projectTest.page2.selecionado.empresa', globalState._ica.projectTest.tables.fornecedores[idx].empresa, true);
        setState('projectTest.page2.selecionado.cnpj', globalState._ica.projectTest.tables.fornecedores[idx].cnpj, true);
        setState('projectTest.page2.selecionado.endereco', globalState._ica.projectTest.tables.fornecedores[idx].endereco, true);
        setState('projectTest.page2.selecionado.contato', globalState._ica.projectTest.tables.fornecedores[idx].contato, true);
        setState('projectTest.page2.selecionado.produtos', globalState._ica.projectTest.tables.fornecedores[idx].produtos, true);
    }

    onNew() {

        setState('projectTest.page2.action', '', true);
        setState('projectTest.page2.indexSel', -1, true);
        setState('projectTest.page2.error', '', true);

        setState('projectTest.page2.selecionado.empresa', '', true);
        setState('projectTest.page2.selecionado.cnpj', '', true);
        setState('projectTest.page2.selecionado.endereco', '', true);
        setState('projectTest.page2.selecionado.contato', '', true);
        setState('projectTest.page2.selecionado.produtos', '', true);

    }

    onSave() {

        setState('projectTest.page2.action', '', true);

        let idx = globalState._ica.projectTest.page2.indexSel;
        let ret = this.validarReg();
        if (!ret) return;

        setState(`projectTest.page2.error`, '', true);

        const i = Object.assign({}, globalState._ica.projectTest.page2.selecionado);

        i.produtos = typeof i.produtos === 'string' ? i.produtos.split(', ') : i.produtos;

        if (idx < 0) {

            const dt = [...globalState._ica.projectTest.tables.fornecedores];
            dt.push(i);
            setState(`projectTest.tables.fornecedores`, dt, true);

            this.onNew();
            return;

        }

        setState(`projectTest.tables.fornecedores[${idx}].empresa`, i.empresa, true);
        setState(`projectTest.tables.fornecedores[${idx}].cnpj`, i.cnpj, true);
        setState(`projectTest.tables.fornecedores[${idx}].endereco`, i.endereco, true);
        setState(`projectTest.tables.fornecedores[${idx}].contato`, i.contato, true);
        setState(`projectTest.tables.fornecedores[${idx}].produtos`, i.produtos, true);


    }

    onCancel() {

        setState('projectTest.page2.action', '', true);

        const idx = globalState._ica.projectTest.page2.indexSel;

        const emp = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].empresa;
        const cnpj = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].cnpj;
        const end = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].endereco;
        const ct = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].contato;
        const prod = idx < 0 ? '' : globalState._ica.projectTest.tables.fornecedores[idx].produtos;

        setState('projectTest.page2.selecionado.empresa', emp, true);
        setState('projectTest.page2.selecionado.cnpj', cnpj, true);
        setState('projectTest.page2.selecionado.endereco', end, true);
        setState('projectTest.page2.selecionado.contato', ct, true);
        setState('projectTest.page2.selecionado.produtos', prod, true);

    }

    onDel() {

        setState('projectTest.page2.action', '', true);

        let idx = globalState._ica.projectTest.page2.indexSel;

        if (idx < 0) return;

        const dt = [...globalState._ica.projectTest.tables.fornecedores];
        dt.splice(idx, 1);

        setState(`projectTest.tables.fornecedores`, dt, true);

        setState(`projectTest.page2.indexSel`, -1, true);
        setState(`projectTest.page2.selecionado.empresa`, '', true);
        setState(`projectTest.page2.selecionado.cnpj`, '', true);
        setState(`projectTest.page2.selecionado.endereco`, '', true);
        setState(`projectTest.page2.selecionado.contato`, ``, true);
        setState(`projectTest.page2.selecionado.produtos`, '', true);

    }

    private onAddProd() {

        setState('projectTest.page2.action', '', true);

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

        setState(`projectTest.page2.selecionado.produtos`, vls, true);

    }

    private validarReg(): boolean {

        let vcnpj = this.validarCNPJ(globalState._ica.projectTest.page2.selecionado.cnpj);

        if (!vcnpj) {
            setState(`projectTest.page2.error`, 'CNPJ invalido', true);
            return false;
        }

        const cnpj = globalState._ica.projectTest.page2.selecionado.cnpj.replace(/[^\d]/g, '');

        let cnpjv = true;
        globalState._ica.projectTest.tables.fornecedores.forEach((f: any) => {
            const cnpjf = f.cnpj.replace(/[^\d]/g, '');
            if (cnpj === cnpjf) cnpjv = false;
        })

        if (!cnpjv) {
            setState(`projectTest.page2.error`, 'Fornecedor já cadastrado', true);
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

}
