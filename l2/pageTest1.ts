/// <mls shortName="pageTest1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState } from './_100554_icaState';

@customElement('page-test1-100554')
export class PageTest1100554 extends CollabPageElement {

    initPage() {

        initState('tables.depto', [
            { key: 'Tecnologia da Informação (TI)', value: 'TI' },
            { key: 'Administração', value: 'Admin' },
            { key: 'Contabilidade', value: 'Cont' },
            { key: 'Recursos Humanos (RH)', value: 'RH' },
        ]);

        initState('tables.products', [
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
    
    /// **collab_events_start**
    async handleClickbtnSave(e: CustomEvent) {
        console.info('click save')
    }

    

}
