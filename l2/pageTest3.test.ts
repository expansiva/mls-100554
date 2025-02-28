/// <mls shortName="pageTest3" project="100554" enhancement="_blank" />
				
import { initState, setState, verifyState, watchState } from './_100554_libManagementCan';
import { ICANTest, ICANIntegration } from './_100554_tsTestAST';

export const integrations: ICANIntegration[] = [];
export const tests: ICANTest[] = [
    {
        functionName: "test1",
        params: [
            {
                indexSel: 0,
                cnpj: "15.704.863/0001-17",
                action: "save"
            },
        ]
    },
]

export function test1(args: Record<string, any>): string {
    return 'ok, test pass'
}
