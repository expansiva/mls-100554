/// <mls shortName="tsTestASTTeste" project="100554" enhancement="_blank" />
import { setState, verifyState } from '/_100554_/l2/libManagementCan.js';

import { ICANTest, ICANIntegration, ICANSchema } from '/_100554_/l2/tsTestAST.js';

export const integrations: ICANIntegration[] = [
    {
        functionName: "fcIntegrationNew",
        description: "adicionar usuario com todos os parametros",
        enabled: true,
        page: "tsTestASTTeste",
        schema: {
            user: {
                type: "String",
                description: "The user name"
            },
            phone: {
                type: "String",
                description: "The user phone number"
            },
            cep: {
                type: "Number",
                description: "The user cep",
                optional: true
            }
        }
    }
]


export const tests: ICANTest[] = [
    {
        functionName: "fcTestNew",
        params: [
            {
                user: "String",
                value: "Guilherme"
            }
        ]
    }
]

function fcTestNew() {
    console.info('Implements here');
}
function fcIntegrationNew() {
    console.info('Implements here');
}
