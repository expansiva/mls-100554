/// <mls shortName="pageTest2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState } from './_100554_icaState';

@customElement('page-test2-100554')
export class PageTest2100554 extends CollabPageElement {

    initPage() {
        globalState._ica = {
            page2: {
                indexSel: -1,
                selecionado: {
                    empresa: '',
                    cnpj: '',
                    endereco: '',
                    contato: '',
                    produtos: []
                },
                produtos: [
                    {
                        key: 'Monitores',
                        value: 'Monitores'
                    },
                    {
                        key: 'Teclados',
                        value: 'Teclados'
                    },
                    {
                        key: 'Mouse',
                        value: 'Mouse'
                    },
                    {
                        key: 'Notebook',
                        value: 'Notebook'
                    }
                ],
                fornecedores:
                    [
                        {
                            empresa: 'TechParts LTDA',
                            cnpj: '12.345.678/0001-90',
                            endereco: 'Rua A, 123',
                            contato: '(11) 99999 - 9999',
                            produtos: ['Monitores', 'Teclados']
                        },
                        {
                            empresa: 'MoveisOffice',
                            cnpj: '98.765.432 / 0001 - 10',
                            endereco: 'Rua B, 456',
                            contato: '(21) 88888 - 8888',
                            produtos: ['Mesas', 'Cadeiras']
                        }
                    ],
            },

        };

        setTimeout(() => { this.setEvents(); }, 500)
    }

    private setEvents() {


        /*const eltableSelect = this.querySelector('#tableSelect');
        if (eltableSelect) {
            const evt = this.onSelectItemtableSelect.bind(this);
            eltableSelect.addEventListener('SelectItem', evt)
        }*/

        /*const novo = this.querySelector('#buttonNovo') as HTMLElement;
        if (novo) {
            novo.onclick = this.onNovo.bind(this);
        }*/

        const cancelar = this.querySelector('#buttonCancelar') as HTMLElement;
        if (cancelar) {
            cancelar.onclick = this.onCancelar.bind(this);
        }

        const salvar = this.querySelector('#buttonSalvar') as HTMLElement;
        if (salvar) {
            salvar.onclick = this.onSalvar.bind(this);
        }

        const excluir = this.querySelector('#buttonExcluir') as HTMLElement;
        if (excluir) {
            excluir.onclick = this.onExcluir.bind(this);
        }



    }

    onSelectItemtableSelect(e: any) {

        globalState.globalStateManagment.setState('page2.indexSel', e.detail.index);
        globalState.globalStateManagment.setState('page2.selecionado.empresa', globalState._ica.page2.fornecedores[e.detail.index].empresa);
        globalState.globalStateManagment.setState('page2.selecionado.cnpj', globalState._ica.page2.fornecedores[e.detail.index].cnpj);
        globalState.globalStateManagment.setState('page2.selecionado.endereco', globalState._ica.page2.fornecedores[e.detail.index].endereco);
        globalState.globalStateManagment.setState('page2.selecionado.contato', globalState._ica.page2.fornecedores[e.detail.index].contato);
        globalState.globalStateManagment.setState('page2.selecionado.produtos', globalState._ica.page2.fornecedores[e.detail.index].produtos);
    }

    onCancelar() {

        const idx = globalState._ica.page2.indexSel;

        const emp = idx < 0 ? '' : globalState._ica.page2.fornecedores[idx].empresa;
        const cnpj = idx < 0 ? '' : globalState._ica.page2.fornecedores[idx].cnpj;
        const end = idx < 0 ? '' : globalState._ica.page2.fornecedores[idx].endereco;
        const ct = idx < 0 ? '' : globalState._ica.page2.fornecedores[idx].contato;
        const prod = idx < 0 ? '' : globalState._ica.page2.fornecedores[idx].produtos;

        globalState.globalStateManagment.setState('page2.selecionado.empresa', emp);
        globalState.globalStateManagment.setState('page2.selecionado.cnpj', cnpj);
        globalState.globalStateManagment.setState('page2.selecionado.endereco', end);
        globalState.globalStateManagment.setState('page2.selecionado.contato', ct);
        globalState.globalStateManagment.setState('page2.selecionado.produtos', prod);

    }

    onNovo() {

        globalState.globalStateManagment.setState('page2.indexSel', -1);
        globalState.globalStateManagment.setState('page2.selecionado.empresa', '');
        globalState.globalStateManagment.setState('page2.selecionado.cnpj', '');
        globalState.globalStateManagment.setState('page2.selecionado.endereco', '');
        globalState.globalStateManagment.setState('page2.selecionado.contato', '');
        globalState.globalStateManagment.setState('page2.selecionado.produtos', '');

    }

    onSalvar() {

        let idx = globalState._ica.page2.indexSel;

        if (idx < 0) {

            globalState._ica.page2.fornecedores.push(Object.assign({}, globalState._ica.page2.selecionado));

            idx = globalState._ica.page2.fornecedores.length;

        } else {

            const i = Object.assign({}, globalState._ica.page2.selecionado);

            globalState.globalStateManagment.setState(`page2.fornecedores[${idx}].empresa`, i.empresa);
            globalState.globalStateManagment.setState(`page2.fornecedores[${idx}].cnpj`, i.cnpj);
            globalState.globalStateManagment.setState(`page2.fornecedores[${idx}].endereco`, i.endereco);
            globalState.globalStateManagment.setState(`page2.fornecedores[${idx}].contato`, ``);
            globalState.globalStateManagment.setState(`page2.fornecedores[${idx}].produtos`, i.produtos);
        }

        globalState.globalStateManagment.setState('page2.indexSel', idx);

        const eltableSelect = this.querySelector('#tableSelect') as any;
        if (eltableSelect) {
            eltableSelect.data = globalState._ica.page2.fornecedores;
            eltableSelect.requestUpdate();
        }

    }

    onExcluir() {

        let idx = globalState._ica.page2.indexSel;

        if (idx < 0) return;

        globalState._ica.page2.fornecedores.splice(idx, 1);

        globalState.globalStateManagment.setState(`page2.indexSel`, -1);
        globalState.globalStateManagment.setState(`page2.selecionado.empresa`, '');
        globalState.globalStateManagment.setState(`page2.selecionado.cnpj`, '');
        globalState.globalStateManagment.setState(`page2.selecionado.endereco`, '');
        globalState.globalStateManagment.setState(`page2.selecionado.contato`, ``);
        globalState.globalStateManagment.setState(`page2.selecionado.produtos`, '');


        const eltableSelect = this.querySelector('#tableSelect') as any;
        if (eltableSelect) {
            eltableSelect.data = globalState._ica.page2.fornecedores;
            eltableSelect.requestUpdate();
        }

    }

    /// **collab_events_start**
    handleClickbuttonNovo() {
        this.onNovo();
    }

    handleSelectItemableSelect(ev:any) {
        this.onSelectItemtableSelect(ev);
    }

    

}
