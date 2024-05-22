/// <mls shortName="aimAddLanguageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ICollabLanguage } from './_100554_collabLanguages';
import { IInternationalizationsDetails } from './_100554_aimTaskGetSourceLanguageTypescript';

export interface ITaskRootArgsInitial {
    project: number,
    fileName: string,
    languages: ICollabLanguage[],
    onlyLanguageDontConfigured: boolean
}

export interface ITaskFileInfo {
    fileName: string,
    checkHtml: boolean,
    checkTs: boolean,
    detailsi18n: IInternationalizationsDetails | undefined,
    html: string,
    languages: ICollabLanguage[],
    onlyLanguageDontConfigured: boolean
}
