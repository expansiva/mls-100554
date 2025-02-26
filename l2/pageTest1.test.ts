/// <mls shortName="pageTest1" project="100554" enhancement="_blank" />

import { initState, setState, verifyState, watchState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration, ICANSchema } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = []
export const tests: ICANTest[] = [
    {
        functionName: "testAddNewSolicitacao",
        params: [
            {
                solicitante: "Guilherme",
                quantidade: 3,
                item: "Impressoras",
                depto: "Administração",
                action: "save"
            },
            {
                solicitante: "Guilherme",
                justificativa: "O antigo quebrou",
                item: "Computadores e notebooks",
                depto: "Tecnologia da Informação",
                quantidade: 3,
                action: "save"
            }
        ]
    }
]


export function testAddNewSolicitacao(args: Record<string, any>): string {
    watchState('projectTest.page1.labelError', '');
    setState('projectTest.page1.newRequest.solicitante', args.solicitante);;
    setState('projectTest.page1.newRequest.quantidade', args.quantidade);;
    setState('projectTest.page1.action', args.action);
    verifyState('projectTest.page1.newRequest.status', 'Pendente')
    verifyState('projectTest.page1.labelOk', 'Dados salvos')
    return 'ok';
}
