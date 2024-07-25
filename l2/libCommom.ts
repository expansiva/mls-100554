/// <mls shortName="libCommom" project="100554" enhancement="_blank" groupName="other" />
import { getMessageKey } from "./_100554_collabLitElement";

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