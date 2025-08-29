/// <mls shortName="libCommom" project="100554" enhancement="_blank" groupName="other" />

import { getMessageKey } from "./_100554_collabLitElement";
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName, convertFileNameToTag } from './_100554_utilsLit';
import { collabImport } from './_100554_collabImport';
import { ServiceDetail100554 } from './_100554_serviceDetail';

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

export function createPath(project: number, shortName: string, folder: string) {
    if (!folder) return `_${project}_${shortName}`
    else return `_${project}_${folder}/${shortName}`
}

export function generateCompactTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
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


export function openService(service: string, position: 'left' | 'right', level: number, args?: Record<string, string>) {
    let page = top?.document.querySelector('collab-page');
    if (!page) return;
    const toolbar = page.querySelector(`collab-nav-2[toolbarposition="${position}"]`) as HTMLElement;
    if (!toolbar) return;
    if (mls.actualLevel !== level) {
        (toolbar as any).state[level][position] = service;
        selectLevel(level);
        return;
    }
    const item = toolbar.querySelector(`collab-nav-2-item[data-service="${service}"]`) as HTMLElement;
    const itemNav3Content = page.querySelector(`collab-nav-3-service[data-service="${service}"]`) as HTMLElement;

    if (itemNav3Content && args) {
        const { shortName, folder, project } = mls.l2.getPath(service);
        const tagService = convertFileNameToTag({ shortName, folder, project });
        const serviceItem = itemNav3Content.querySelector(tagService);
        if (serviceItem) {
            Object.entries(args).forEach((arg) => {
                const [key, value] = arg;
                serviceItem.setAttribute(key, value);
            })
        }
    }
    if (item) item.click();

    return;
}

export function selectLevel(level: number) {

    const page = top?.document.querySelector('collab-page');
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
    await (nav as any).forceInstanceIfNeed([`${service};${level}`]);

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
        const info = convertTagToFileName(wc);
        if (info) {
            const script = document.createElement('script');
            script.type = 'module';
            script.id = info.shortName;
            script.src = (`/_${info.project}_${info.shortName}`);
            el.appendChild(script)
        }
    });

}

export function convertColorToHex(color: string) {

    const element = document.createElement('div');
    element.style.color = color.trim();
    document.body.appendChild(element);
    const computedColor = window.getComputedStyle(element).color;
    document.body.removeChild(element);

    if (!computedColor || !computedColor.startsWith('rgb')) {
        throw new Error(`Invalid color value: ${color}`);
    }

    const match = computedColor.match(/\d+/g);
    if (!match) return undefined;
    const rgbMatch = match.map(Number);
    const [r, g, b] = rgbMatch;

    return (
        '#' +
        [r, g, b]
            .map((val) => val.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()
    );
}

export async function getEnhancementName(file: { project: number, shortName: string, folder: string }): Promise<string> {
    const key = mls.editor.getKeyModel(file.project, file.shortName, file.folder);
    const mmodel = mls.editor.models[key];
    if (!mmodel || !mmodel.ts) throw new Error('model invalid');
    if (!mmodel.ts.compilerResults) throw new Error('model ts not compiled yet');
    const enhacementName = mmodel.ts.compilerResults.tripleSlashMLS?.variables.enhancement
    if (!enhacementName) throw new Error('enhacementName not valid');
    return enhacementName;
}

const BaseProject = 100554;
export async function loadPluginProject(project: number, scope: string, onlyEnabled: boolean = true): Promise<mls.plugin.MenuAction[]> {

    await mls.plugin.loadAll(BaseProject, false);
    const base = mls.plugin.getAllMenuActions(BaseProject, { scope: scope } as any);

    await mls.plugin.loadAll(project, false);
    const user = mls.plugin.getAllMenuActions(project, { scope: scope } as any);

    const i = [...base, ...user];

    return Array.from(
        new Map(i.map(obj => [JSON.stringify(obj), obj])).values()
    );

}

const KeyProject = 'projectDetails'
export function setProjectDetails(project: number) {
    localStorage.setItem(KeyProject, JSON.stringify({ project }));
}

export function getProjectDetails(): mls.stor.localStor.IRetProjectDetails | undefined {
    return mls.stor.localStor.getProjectDetails();
}

export function calculateTotalStringSize(source: string, limitBase: number): ICalculateTotalStringSize {

    let totalBytes = 0;
    for (const text of source) {
        const encoded = new TextEncoder().encode(text);
        totalBytes += encoded.length;
    }

    const exceededLimit = totalBytes > limitBase;

    return {
        totalsize: totalBytes, // em bytes
        exceededLimit,
        sizeFormatted: formatSize(totalBytes)
    };
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}


export async function getListNewFilesToDeleteByGroup(group: string, project: number, folder: string) {

    const filesToDelete: mls.stor.IFileInfo[] = [];

    const filesLocal = Object.values(mls.stor.files).filter(file =>
        file.inLocalStorage &&
        file.folder === folder &&
        file.project === project &&
        file.status === 'new'
    );

    for await (let storFile of filesLocal) {
        const keyModel = mls.editor.getKeyModel(storFile.project, storFile.shortName, storFile.folder);
        let models: mls.editor.IModels | undefined = mls.editor.models[keyModel];
        if (!models) models = await mls.editor.addModels(storFile.project, storFile.shortName, '')
        if (models && models.ts) {
            mls.l2.typescript.parseTripleSlash(models.ts);
            const tpsGroup = models.ts.compilerResults?.tripleSlashMLS?.variables['groupName']
            if (group === tpsGroup) filesToDelete.push(storFile);
        }
    }

    return filesToDelete;
}

export async function* deleteAllFilesLocal(filesToDelete: mls.stor.IFileInfo[]) {

    const modelsToDelete: { project: number, shortName: string, folder: string }[] = Array.from(
        new Map(filesToDelete.map(({ project, shortName, folder }) => [shortName, { project, shortName, folder }])).values()
    );

    const filesToDeleteCache: Set<string> = new Set();

    for (const fileToDelete of filesToDelete) {
        await mls.stor.localStor.setContent(fileToDelete, { contentType: 'string', content: null });
        fileToDelete.onAction = undefined;
        fileToDelete.getValueInfo = undefined;

        const keyFiles = mls.stor.getKeyToFiles(
            fileToDelete.project,
            fileToDelete.level,
            fileToDelete.shortName,
            fileToDelete.folder,
            fileToDelete.extension
        );
        delete mls.stor.files[keyFiles];

        yield `Storfile deleted: ${keyFiles}`;

        const ext = fileToDelete.extension.replace('.ts', '.js');
        let targetKey = `https://collab.codes/local/_${fileToDelete.project}_${fileToDelete.shortName}${ext}?v=`;
        if (fileToDelete.folder) targetKey = `https://collab.codes/local/_${fileToDelete.project}_${fileToDelete.folder}/${fileToDelete.shortName}${ext}?v=`;
        filesToDeleteCache.add(targetKey);
    }

    for (const data of modelsToDelete) {
        const keyModel = mls.editor.getKeyModel(data.project, data.shortName, data.folder);
        mls.editor.deleteModels(data.project, data.shortName, data.folder, true);
        yield `Model deleted : ${keyModel}`;
    }

    const cacheName = 'mls-v2';
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (const request of keys) {
        for (const targetKey of filesToDeleteCache) {
            if (request.url.includes(targetKey)) {
                await cache.delete(request);
                yield `Cache file deleted: ${request.url}`;
            }
        }
    }
}

export async function loadModuleFromProjectOrDependency(name: string, folder: string, ext: string): Promise<any> {

    const prj = mls.actualProject;
    if (!prj) throw new Error('Not found project actual!');

    let key = mls.stor.getKeyToFiles(prj, 2, name, folder, ext);
    if (mls.stor.files[key]) return await await collabImport({ project: prj, shortName: name, folder: folder });

    const info = mls.l5.getProjectDetails(prj);
    if (!info) throw new Error('Not found project details from actual project!');

    let prjDep = 0;
    info.prj_dependencies.forEach((dep) => {

        if (mls.stor.files[key]) return;
        prjDep = dep;
        key = mls.stor.getKeyToFiles(dep, 2, name, folder, ext);

    });

    if (!mls.stor.files[key]) throw new Error('File not found in any dependency!');

    return await await collabImport({ project: prjDep, shortName: name, folder: folder });

}

export function findStorFileInProjectsOrDeps(
    projectActual: number,
    level: number,
    fileName: string,
    folder: string,
    extension: string): mls.stor.IFileInfo {

    const deps = mls.l5.getProjectDependencies(projectActual, false);
    const keyActual = mls.stor.getKeyToFiles(projectActual, level, fileName, folder, extension);
    let storFile = mls.stor.files[keyActual];
    if (storFile) return storFile;
    for (let dep of deps) {
        const keyDep = mls.stor.getKeyToFiles(dep, level, fileName, folder, extension);
        storFile = mls.stor.files[keyDep];
        if (storFile) break;
    }
    return storFile;

}



const STORAGE_KEY = '_100554_serviceInit';

export function saveOpenedFile(project: number, level: number, file: OpenedFile): void {

    if (level < 0 || level > 7) {
        console.warn('Invalid level');
        return;
    }

    const data = getAllUserOpenedFiles();
    if (!data[project]) {
        data[project] = {};
    }

    const currentLevelData = data[project][level];

    if (
        typeof file === 'object' &&
        file !== null &&
        typeof currentLevelData === 'object' &&
        currentLevelData !== null
    ) {
        data[project][level] = {
            left: file.left ?? currentLevelData.left,
            right: file.right ?? currentLevelData.right,
        };
    } else {
        data[project][level] = file;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLastOpenedFiles(project: number): UserOpenedFiles {
    const data = getAllUserOpenedFiles();
    return data[project] ?? {};
}

function getAllUserOpenedFiles(): Record<string, UserOpenedFiles> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

export function getBaseTemplate(file: IInfoFile, enhancement: string = '_blank'): string {

    const { project, shortName, folder } = file;

    switch (file.extension) {
        case ('.ts'): return `/// <mls shortName="${file.shortName}" project="${file.project}" enhancement="${enhancement}" folder="${file.folder}" />\n\n// typescript new file\n`;

        case ('.html'): return `<h1>${file.shortName}</h1>`;

        case ('.less'): return `/// <mls shortName="${file.shortName}" project="${file.project}" enhancement="${enhancement}" folder="${file.folder}" />\n\n${convertFileNameToTag({ project, shortName, folder })} {\n\n// Here your less\n\n }`;

        case ('.test.ts'): return `/// <mls shortName="${file.shortName}" project="${file.project}" enhancement="${enhancement}" folder="${file.folder}" />\n\n import { ICANTest, ICANIntegration, ICANSchema  } from './_100554_tsTestAST';\n export const integrations: ICANIntegration[] = [];\n export const tests: ICANTest[] = [];`;

        case ('.defs.ts'): return `/// <mls shortName="${file.shortName}" project="${file.project}" enhancement="${enhancement}" folder="${file.folder}" />\n\n`;

        default: return '';
    }

}

export function verifyNeedAddTripleslach(info: mls.cbe.IPath, src: string, extension: string, enhancement: string = '_blank'): string {

    if (extension === '.html') return src;

    if (enhancement === '_blank' && extension === '.ts') enhancement = '_100554_enhancementLit';
    if (enhancement === '_blank' && extension === '.less') enhancement = '_100554_enhancementStyle';

    const triple = `/// <mls shortName="${info.shortName}" project="${info.project}" enhancement="${enhancement}" folder="${info.folder}" />\n`;

    if (src.startsWith('/// <mls ')) return src;
    return triple + src;
}

export async function getInstanceByFile(file: mls.stor.IFileInfo): Promise<Object | undefined> {

    try {
        let { project, shortName, folder, extension } = file;
        if (file.extension === '.ts') extension = '';

        let key = `/_${project}_${shortName}${extension}`;
        if (folder) key = `/_${project}_${folder}/${shortName}${extension}`;
        key = key.replace('.ts', '.js');
        const m = await import(key);
        return m;
    } catch (e) {
        return undefined;
    }

}

export async function openElementInServiceDetails(el: HTMLElement) {
    const serviceDetails: ServiceDetail100554 = mls.services['100554_serviceDetail_right'];
    if (!serviceDetails) return;
    serviceDetails.openMe();
    serviceDetails.updateContentPluginWithElement(el);
}

export async function clearServiceDetails() {
    const serviceDetails: ServiceDetail100554 = mls.services['100554_serviceDetail_right'];
    if (!serviceDetails) return;
    serviceDetails.clear();
}


export type OpenedFile = string | OpenedFileL2;
export type UserOpenedFiles = Record<number, OpenedFile>;
export type OpenedFileL2 = { left?: string; right?: string };


interface ICalculateTotalStringSize {
    totalsize: number, // em bytes
    exceededLimit: boolean,
    sizeFormatted: string
}

interface IRetProjectDetails {
    project: number,
    dependencies: number[]
}

interface IRetProjectDetails {
    project: number,
    dependencies: number[]
}

interface IInfoFile {
    project: number,
    folder: string,
    shortName: string,
    extension: string
}
