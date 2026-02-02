/// <mls fileReference="_100554_/l2/collabManagerCoachMarks.ts" enhancement="_blank" />

import { addCoachMark, ICoachMarks } from '/_100554_/l2/coachMarks.js';
import {getMessageKey} from '/_100554_/l2/collabLitElement.js'

/// **collab_i18n_start**
const message_pt = {
    start: 'Service Start: Entenda o nível em que você está e como avançar no nosso sistema.',
    project: 'Project: Crie, selecione e administre seus projetos de forma eficiente.',
    workspace: 'Workspace: Abra chamados, verifique requisições e gerencie suas tarefas.',
    panel: 'Panel: Monitore a hospedagem, verifique erros e analise a latência.',
    save: 'Save: Salve arquivos e crie pull requests com facilidade.'

}

const message_en = {
    start: 'Service Start: Understand your current level and how to progress in our system.',
    project: 'Project: Create, select, and efficiently manage your projects.',
    workspace: 'Workspace: Open tickets, check requests, and manage your tasks.',
    panel: 'Panel: Monitor hosting, check for errors, and analyze latency.',
    save: 'Save: Save files and easily create pull requests.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

let msg: MessageType = messages['en'];

export function initManagerCoachMark() {

    mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['LevelChanged'] as any, onLevelchange)

    mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'] as any, onServicechange)

}

function onLevelchange(ev: mls.events.IEvent) {

    if (!ev.desc) return;

    const data: { to: number, from: number } = JSON.parse(ev.desc);

    switch (data.to) {
        case 5: setL5(); 
        default: undefined;
    }

}

function onServicechange(ev: mls.events.IEvent) {

    if (!ev.desc) return;
    const data = JSON.parse(ev.desc);

}

function setL5(){
    const lang = getMessageKey(messages);
    msg = messages[lang];
    infoMark.l5.steps[0].text = msg.start;
    infoMark.l5.steps[1].text = msg.project;
    infoMark.l5.steps[2].text = msg.workspace;
    infoMark.l5.steps[3].text = msg.panel;
    infoMark.l5.steps[4].text = msg.save;

    addCoachMark(infoMark.l5);
}


const infoMark: { [key: string]: ICoachMarks } = {
    l5: {
        key: "l5",
        transparency: "normal",
        fontSize: "1.1em",
        timeClose: 12,
        steps: [
            {
                elementRef: `collab-nav-2-item[data-service="_100529_service_start"]`,
                text: msg.start,
                position: "bottom",
                marginV: 25,
                marginH: 25,
                arrow: "up",
                duration: 3,
                autoClose: true
            },
            {
                elementRef: `collab-nav-2-item[data-service="_100554_serviceUnit"]`,
                text: msg.project,
                position: "bottom",
                marginV: 25,
                marginH: 25,
                arrow: "up",
                duration: 3,
                autoClose: true
            },
            {
                elementRef: `collab-nav-2-item[data-service="_100554_serviceWorkspace"]`,
                text: msg.workspace,
                position: "bottom",
                marginV: 25,
                marginH: 25,
                arrow: "up",
                duration: 3,
                autoClose: true
            },
            {
                elementRef: `collab-nav-2-item[data-service="_100554_servicePanel"]`,
                text: msg.panel,
                position: "bottom",
                marginV: 25,
                marginH: 25,
                arrow: "up",
                duration: 3,
                autoClose: true
            },
            {
                elementRef: `collab-nav-2-item[data-service="_100554_serviceSave"]`,
                text: msg.save,
                position: "bottom",
                marginV: 25,
                marginH: 25,
                arrow: "up",
                duration: 3,
                autoClose: true
            }
        ]
    }
}








