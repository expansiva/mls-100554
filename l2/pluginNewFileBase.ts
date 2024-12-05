/// <mls shortName="pluginNewFileBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { openService } from './_100554_libCommom'
export interface IDetails {
    title: string,
    description: string,
    tags: string[]
}

export function changeClassName(source: string, project: number, shortname: string): string {
    const newClassName = shortname.charAt(0).toUpperCase() + shortname.substring(1, shortname.length) + project.toString();
    const outputString = source.replace(/\[className\]/g, newClassName);
    return outputString;
}

export function changeWidget(source: string, project: number, shortname: string): string {
    const newWidget = `_${project.toString()}_${shortname}`;
    const outputString = source.replace(/\[widgetName\]/g, newWidget);
    return outputString;
}

export function changeTagName(source: string, tagName: string): string {
    const outputString = source.replace(/\[tagName\]/g, tagName);
    return outputString;
}

export async function createNewFile(project: number, position: string, shortName: string, enhancement: string, source: string, openPreview: boolean = true) {
    const params = {} as mls.events.IFileAction;

    params.action = 'new' as typeof params.action;
    params.level = 2;
    params.project = project;
    params.newProject = project;
    params.shortName = shortName;
    params.newshortName = shortName;
    params.folder = '';
    params.newfolder = '';
    params.newEnhancement = enhancement || '_blank';
    params.extension = '.ts';
    params.newTSSource = source;
    (params as any).position = position;

    mls.actual[2].setFullName('_' + params.project + '_' + params.shortName);
    (mls.actual[2] as any)[position] = {
        project: params.project,
        shortName: params.shortName
    };

    await mls.events.fire([2], ['FileAction'], JSON.stringify(params), 0);
    saveLocalHistory(params.project, 2, params.shortName, params.extension, params.folder);
    if (position === 'left' && openPreview ) openService('_100554_servicePreview', 'right', 2);

}

function saveLocalHistory(project: number, level: number, shortName: string, extension: string, folder: string): void {

    const info = localStorage.getItem('mlsInfoHistoryL' + level);
    const res: any[] = info ? JSON.parse(info) : [];
    let idx = -1;
    res.forEach((i: any, index) => {
        if (i.project !== project || i.shortName !== shortName) return;
        idx = index;
    });

    if (idx >= 0) res.splice(idx, 1);
    res.unshift({ project, shortName, extension, folder });
    if (res.length > 10) res.length = 10;
    localStorage.setItem('mlsInfoHistoryL' + level, JSON.stringify(res));

}