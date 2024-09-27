/// <mls shortName="libCommom" project="100554" enhancement="_blank" groupName="other" />
import { getMessageKey } from "./_100554_collabLitElement";
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';

/// **collab_i18n_start**
const message_pt = {
    updatedToday: 'atualizado hoje',
    updated: 'atualizado',
    on: 'em',
    days: 'dias',
    day: 'dia',
    ago: 'atrás',
    jan: 'Jan',
    feb: 'Fev',
    mar: 'Mar',
    apr: 'Abr',
    may: 'Mai',
    june: 'Jun',
    july: 'Jul',
    aug: 'Ago',
    sept: 'Set',
    oct: 'Out',
    nov: 'Nov',
    dec: 'Dez',
}

const message_en = {
    updatedToday: 'updated today',
    updated: 'updated',
    on: 'on',
    days: 'days',
    day: 'day',
    ago: 'ago',
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    june: 'June',
    july: 'July',
    aug: 'Aug',
    sept: 'Sept',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages)
const msg: MessageType = messages[lang];

export function getMyKeysBranch(project: number): { branch: string, owner: string, repo: string } {

    try {

        if (!mls.stor.projects[project]) throw new Error('Not found projectInfo:' + project);

        const obj = mls.l5.getProjectDetails(project);
        if (!obj || !obj.value) throw new Error('Error getProjectDetails in:' + project);

        const json = JSON.parse(obj.value);
        if (!json) throw new Error('Error getProjectDetails .value json in:' + project);

        let info = '';

        if (!json.projectURL && json.l5_actionPrjSettings) info = json.l5_actionPrjSettings.projectURL;
        else if (json.projectURL) info = json.projectURL;
        else throw new Error('Error project info:' + project);

        if (info.endsWith('/')) info = info.substring(0, info.length - 1);
        const array = info.split('/');
        if (array.length < 3) throw new Error('Insufficient information to progress');

        return { branch: array[array.length - 3], owner: array[array.length - 2], repo: array[array.length - 1] };

    } catch (e: any) {

        throw new Error('Error get info branch: ' + e.message);

    }

}


export function getDateFormated(dt: string): string {

    let lastUpdated: string;

    const dateToday = new Date();
    const dtLastWrite = new Date(dt);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a: Date, b: Date) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    const diffDays = dateDiffInDays(dtLastWrite, dateToday);
    const moreThanTwoDays = diffDays > 1;

    if (diffDays === 0) {

        lastUpdated = msg.updatedToday;

    } else if (diffDays < 30) {

        lastUpdated = `${msg.updated} ${diffDays} ${moreThanTwoDays ? msg.days : msg.day} ${msg.ago}`;

    } else {

        const lastWriteYear = dtLastWrite.getFullYear();
        const lastWriteMounth = dtLastWrite.getMonth();
        const lastWriteDay = dtLastWrite.getDate();
        const mounthFilter: any = {
            0: msg.jan,
            1: msg.feb,
            2: msg.mar,
            3: msg.apr,
            4: msg.may,
            5: msg.june,
            6: msg.july,
            7: msg.aug,
            8: msg.sept,
            9: msg.oct,
            10: msg.nov,
            11: msg.dec,
        };

        lastUpdated = `${msg.updated} ${msg.on} ${lastWriteYear}, ${lastWriteDay} ${mounthFilter[lastWriteMounth]} `;

    }

    return lastUpdated;

}

export function escapeHTML(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


export function openService(service: string, position: 'left' | 'right', level: number) {
    let page = document.querySelector('collab-page');
    if (!page) return;
    const toolbar = page.querySelector(`collab-nav-2[toolbarposition="${position}"]`) as HTMLElement;
    if (!toolbar) return;
    if (mls.actualLevel !== level) {
        (toolbar as any).state[level][position] = service;
        selectLevel(level);
        return;
    }
    const item = toolbar.querySelector(`collab-nav-2-item[data-service="${service}"]`) as HTMLElement;
    if (item) {
        item.click();
    }
    return;
}

export function selectLevel(level: number) {

    const page = document.querySelector('collab-page');
    const nav = page?.querySelector('collab-nav-1') as HTMLElement;
    const objIndex = {
        0: 7,
        1: 6,
        2: 5,
        3: 4,
        4: 3,
        5: 2,
        6: 1,
        7: 0,

    } as any;
    if (!nav) return;
    nav.setAttribute('tabindexactive', objIndex[level]);

}

export async function forceServiceInstance(level: number, service: string) {

    const page = document.querySelector('collab-page');
    const nav = page?.querySelector('collab-nav-1') as HTMLElement;
    if (!nav) return;
    await (nav as any).forceInstanceIfNeed([`${service};${level}`])

}


export async function loadFileHTMLInContainer(el: HTMLElement, shortName: string, project: number) {

    const keyFile = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
    const storFile = mls.stor.files[keyFile];
    if (!storFile) throw new Error('File not founded');

    const content = await storFile.getContent();
    if (!content || typeof content !== 'string') throw new Error('File html invalid');

    el.innerHTML = '';

    const allWcs = getAllWebComponentsInSource(content);
    el.innerHTML = content;

    allWcs.forEach((wc) => {
        const fileName = convertTagToFileName(wc);
        const script = document.createElement('script');
        script.type = 'module';
        script.id = fileName;
        script.src = (`/${fileName}`);
        el.appendChild(script)
    });

}

