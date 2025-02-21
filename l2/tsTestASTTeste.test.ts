/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_blank" />

import { setState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = [

]

export const tests: ICANTest[] = [
    {
        functionName: "testAddUser",
        params: [
            { solicitante: "Guilherme", phone: "169999999" },
            { solicitante: "Guilherme", phone: "" }
        ]
    },
]

export function testAddUser(args: any): string {
    try {
        console.info('testAddUser')
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
}
