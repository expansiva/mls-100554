/// <mls shortName="pageTest1" project="100554" enhancement="_blank" />
import { addTest, setState, verifyState } from './_100554_libManagementCan';

//Test

export const integrations = [
    {
        enabled: false,
        name: 'adicionar usuario com parametros basicos',
        page: 'pageTest1',
        functionName: 'testAddUser',
        params: { solicitante: '{String}', phone: '{Number, optional}' }
    },
    {
        enabled: false,
        name: 'adicionar usuario com todos os parametros',
        page: 'pageTest1',
        functionName: 'testAddUser',
        params: { solicitante: 'Guilherme', _phone: '169999999' }
    }
]

export const tests = [
    {
        title: 'Test add',
        functionName: '',
        params: { solicitante: 'Guilherme', _phone: '169999999' }
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

function testAddUserFull(args: any): string {
    try {
        setState('projectTest.page1.newRequest.solicitante', args.solicitante);
        return 'ok';
    } catch (e: any) {
        return e.message;
    }
}



