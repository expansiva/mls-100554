/// <mls shortName="testPagesState" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { globalState, initState } from './_100554_icaState';

export function initTestState() {

    initState('projectTest.tables.solicitacoes', [
        {
            id: 1,
            solicitante: 'João Silva',
            item: 'Teclado',
            quantidade: 2,
            data: '2025-02-03',
            justificativa: '',
            depto: 'TI',
            status: 'Aprovado',
        },
        {
            id: 2,
            solicitante: 'Guilherme Santiago',
            item: 'Cadeira',
            quantidade: 1,
            data: '2025-01-01',
            justificativa: '',
            depto: 'TI',
            status: 'Pendente',
        },
        {
            id: 3,
            solicitante: 'Guilherme Pereira',
            item: 'Monitor',
            quantidade: 1,
            data: '2024-12-11',
            justificativa: '',
            depto: 'TI',
            status: 'Pendente',
        },
        {
            id: 4,
            solicitante: 'Bica',
            item: 'Fones de ouvido',
            quantidade: 1,
            data: '2025-02-01',
            justificativa: '',
            depto: 'TI',
            status: 'Pendente',
        },
        {
            id: 5,
            solicitante: 'Wagner',
            item: 'Mouse',
            quantidade: 1,
            data: '2025-01-11',
            justificativa: '',
            depto: 'TI',
            status: 'Rejeitado',
        },
    ])

    initState('projectTest.tables.fornecedores', [
        {
            empresa: 'TechParts LTDA',
            cnpj: '12.345.678/0001-90',
            endereco: 'Rua A, 123',
            contato: '(11) 99999 - 9999',
            produtos: ['Monitores', 'Teclados']
        },
        {
            empresa: 'MoveisOffice',
            cnpj: '98.765.432 / 0001 - 10',
            endereco: 'Rua B, 456',
            contato: '(21) 88888 - 8888',
            produtos: ['Mesas', 'Cadeiras']
        }
    ]);

    initState('projectTest.tables.depto', [
        { key: 'Tecnologia da Informação', value: 'Tecnologia da Informação' },
        { key: 'Administração', value: 'Administração' },
        { key: 'Contabilidade', value: 'Contabilidade' },
        { key: 'Recursos Humanos', value: 'Recursos Humanos' },
    ]);

    initState('projectTest.tables.products', [
        {
            "key": "Computadores e notebooks",
            "value": "Computadores e notebooks",
            "category": "Tecnologia",
            "description": "Equipamentos para uso pessoal e profissional, incluindo desktops, laptops e workstations."
        },
        {
            "key": "Impressoras",
            "value": "Impressoras",
            "category": "Escritório",
            "description": "Impressoras a laser, jato de tinta e térmicas para diversos tipos de impressão."
        },
        {
            "key": "Cadeira",
            "value": "Cadeira",
            "category": "Móveis",
            "description": "Cadeiras ergonômicas e convencionais para escritórios e residências."
        },
        {
            "key": "Mouse",
            "value": "Mouse",
            "category": "Periféricos",
            "description": "Dispositivos apontadores para computadores, incluindo mouses com e sem fio."
        },
        {
            "key": "Teclado",
            "value": "Teclado",
            "category": "Periféricos",
            "description": "Teclados mecânicos e de membrana para escritórios e gamers."
        },
        {
            "key": "Monitor",
            "value": "Monitor",
            "category": "Tecnologia",
            "description": "Monitores de diversos tamanhos e resoluções para uso profissional e doméstico."
        },
        {
            "key": "Mesa para escritório",
            "value": "Mesa para escritório",
            "category": "Móveis",
            "description": "Mesas de trabalho com diferentes tamanhos e materiais."
        },
        {
            "key": "Fones de ouvido",
            "value": "Fones de ouvido",
            "category": "Periféricos",
            "description": "Headsets com e sem fio para comunicação e entretenimento."
        },

    ]);

}

export function adicionarSolicitacao(novaSolicitacao: ISolicitacao) {
    const newObJ = { ...novaSolicitacao }
    const data = globalState._ica.projectTest.tables.solicitacoes || [];
    newObJ.id = getNextIdSolicitacao();
    data.push(newObJ);
    globalState.globalStateManagment.setState(`projectTest.tables.solicitacoes`, data);
}

export function alterarStatusSolicitacao(newStatus: TStatus, index: number) {
    const data = globalState._ica.projectTest.tables.solicitacoes || [];
    if (!data[index]) throw new Error('Invalid row');
    data[index].status = newStatus;
    globalState.globalStateManagment.setState(`projectTest.tables.solicitacoes[${index}].status`, newStatus);
}

function getNextIdSolicitacao() {
    return globalState._ica.projectTest.tables.solicitacoes?.length + 1 || 1;
}

export interface ISolicitacao {
    id: number,
    solicitante: string,
    item: string,
    quantidade: number,
    data: string,
    status: TStatus,
    depto: string,
    justificativa: string,
}

export type TStatus = 'Pendente' | 'Aprovado' | 'Rejeitado'