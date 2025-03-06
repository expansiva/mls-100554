/// <mls shortName="pageTest2" project="100554" enhancement="_blank" />

import { initState, setState, verifyState, watchState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration, ICANSchema } from './_100554_tsTestAST';

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
            }
        ]
    },
    {
        functionName: "testEditCNPJInvalid",
        params: [
            {
                indexSel: 1,
                cnpj: "1111111",
                action: "save"
            },
            {
                indexSel: 1,
                cnpj: "11.704.863/0001-17",
                action: "save"
            }
        ]
    },
    {
        functionName: "testCompanyNameEmpty",
        params: [
            {
                indexSel: 1,
                empresa: "",
                action: "save"
            }
        ]
    },
    {
        functionName: "testCompanyNameInvalidCaracters",
        params: [
            {
                indexSel: 1,
                empresa: "Empresa %$#¨&",
                action: "save"
            }
        ]
    },
    {
        functionName: "testCompanyNameOnlyNumbers",
        params: [
            {
                indexSel: 1,
                empresa: "123434",
                action: "save"
            }
        ]
    },
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

export function testCompanyName(args: Record<string, any>): string {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    watchState('projectTest.page2.labelError', '');
    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.empresa', args.empresa);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelOk', 'Dados salvos');
    return 'ok, test pass';
}

export function testCompanyNameEmpty(args: Record<string, any>): string {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.empresa', args.empresa);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelError', 'O nome da empresa não pode estar vazio');
    return 'ok, test pass';
}

export function testCompanyNameInvalidCaracters(args: Record<string, any>): string {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.empresa', args.empresa);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelError', 'O nome da empresa não pode conter caracteres especiais');
    return `
        -----------------------------------------
        | Args     | Entrada       
        -----------------------------------------
        | indexSel |  ${args.indexSel}   
        | empresa  |  ${args.empresa}    
        | action   |  ${args.action}    
        ---------------------------------------
        Result: Ok, test pass
        `;
}

export async function testCompanyNameOnlyNumbers(args: Record<string, any>): Promise<string> {

    initState('projectTest.page2', {
        labelError: '',
        labelOk: '',
    });

    setState('projectTest.page2.indexSel', args.indexSel);
    setState('projectTest.page2.selecionado.empresa', args.empresa);
    setState('projectTest.page2.action', args.action);
    verifyState('projectTest.page2.labelError', 'O nome da empresa não pode conter apenas números');
    await delay(5000);
    return 'ok, test pass';
}


function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
