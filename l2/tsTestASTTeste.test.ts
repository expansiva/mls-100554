/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_blank" />

import { setState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = [
    {
        enabled: false,
        description: "adicionar usuario com parametros basicos",
        page: "pageTest1",
        functionName: "testAddUser",
        params: {
            solicitante: { type: 'String', description: '' },
            phone: { type: 'Number', description: '' }
        }
    },
]

export const tests: ICANTest[] = [
    {
        title: "Test add 2",
        functionName: "testAddUser",
        params: {
            solicitante: {
                type: "String",
                value: "Guilherme"
            },
            phone: {
                type: "String",
                value: "169999999"
            }
        }
    }
]

export function testAddUser(args: any): string {
    try {
        setState('projectTest.page1.newRequest.solicitante', args.solicitante);
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
} 
