/// <mls shortName="pageTest1" project="100554" enhancement="_blank" />

import { setState, verifyState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration, ICANParams } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = []
export const tests: ICANTest[] = [
    {
        title: "new request with all params",
        functionName: "testNewRequest",
        params: {
            solicitante: {
                type: "String",
                value: "Guilherme"
            },
            item: {
                type: "String",
                value: "Computadores e notebooks"
            },
            depto: {
                type: "String",
                value: "Tecnologia da Informação"
            },
            justificativa: {
                type: "String",
                value: "Parou de funcionar"
            },
            quantidade: {
                type: "Number",
                value: 1
            }
        }
    },
]



export function testNewRequest(args: Record<string, ICANParams>): string {

    try {
        setState('projectTest.page1.newRequest.solicitante', args.solicitante.value);
        setState('projectTest.page1.newRequest.item', args.item.value);
        setState('projectTest.page1.newRequest.depto', args.depto.value);
        setState('projectTest.page1.newRequest.justificativa', args.justificativa.value);
        setState('projectTest.page1.newRequest.quantidade', args.quantidade.value);
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
}

