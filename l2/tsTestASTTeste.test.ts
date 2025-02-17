/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_blank" />

import { addTest, setState, verifyState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = [
    {
        enabled: false,
        name: "adicionar usuario com parametros basicos",
        page: "pageTest1",
        functionName: "testAddUser",
        params: {
            solicitante: "{String}",
            phone: "{Number, optional}"
        }
    },

]

export const tests: ICANTest[] = [
    {
        title: "Test add",
        functionName: "",
        params: {
            solicitante: "Guilherme",
            _phone: "169999999"
        }
    },
    {
        title: "Test add 2",
        functionName: "",
        params: {
            solicitante: "Guilherme",
            _phone: "169999999"
        }
    },
]

export function testAddUser(args: any): string {
    try {
        setState('projectTest.page1.newRequest.solicitante', args.solicitante);
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
}

function testAddUserFull(args: any): string {
    try {
        setState('projectTest.page1.newRequest.solicitante', args.solicitante);
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
}
