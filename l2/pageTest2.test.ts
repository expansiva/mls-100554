/// <mls shortName="pageTest2" project="100554" enhancement="_blank" />

import { initState, setState, verifyState, watchState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration } from './_100554_tsTestAST';


export const integrations: ICANIntegration[] = [];
export const tests: ICANTest[] = [
    {
        functionName: "testEditCNPJ",
        params: [
            {
                indexSel: 0,
                cnpj: "15.704.863/0001-17",
                action: "save"
            },
            {
                indexSel: 0,
                cnpj: "89.237.988/0001-10",
                action: "save"
            },
        ]
    },
    {
        functionName: "testEditCNPJInvalid",
        params: [
            {
                indexSel: 1,
                cnpj: "89.237.988/0001-10",
                action: "save"
            },
            {
                indexSel: 1,
                cnpj: "11.704.863/0001-17",
                action: "save"
            },
        ]
    }
]
export function testEditCNPJ(args: Record<string, any>): string {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    watchState('projectTest.page2.labelError', '');
    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.cnpj', args.cnpj);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelOk', 'Dados salvos');

    return 'ok, test pass'
}

export function testEditCNPJInvalid(args: Record<string, any>): string {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.cnpj', args.cnpj);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelError', 'CNPJ invalido');

    return 'ok, test pass'
}
