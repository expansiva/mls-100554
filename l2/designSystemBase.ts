/// <mls shortName="designSystemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ServiceSource100554 } from './_100554_serviceSource';
import { forceServiceInstance } from './_100554_libCommom';
import { createAllModels } from './_100554_collabLibModel'
import { collabImport } from './_100554_collabImport';

export const acceptedImages = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg", ".webp"];
export const acceptedVideos = [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".m4v"]

export async function getImages(project: number): Promise<mls.stor.IFileInfo[]> {
    const folder = 'assets';
    const imagesFiles = Object.values(mls.stor.files).filter((file) => {
        return file.project === project && file.folder === folder && acceptedImages.includes(file.extension);
    });
    return imagesFiles || [];
}

export async function getVideos(project: number): Promise<mls.stor.IFileInfo[]> {
    const folder = 'assets';
    const videosFiles = Object.values(mls.stor.files).filter((file) => {
        return file.project === project && file.folder === folder && acceptedVideos.includes(file.extension);
    });
    return videosFiles || [];
}

export async function addAssets(project: number, file: File): Promise<boolean> {

    const folder = 'assets';
    const shortName = file.name;
    const newShortName = shortName.replace(/_/g, '-');
    const ext = newShortName.split('.').pop();
    const extension = `.${ext}`;
    if (!extension) throw new Error('Invalid extension');
    if (!acceptedImages.includes(extension) && !acceptedVideos.includes(extension)) throw new Error(`Invalid extension. Valid extensions: ${acceptedImages.join(',')},${acceptedVideos.join(',')}, `);

    const extensionIndex = newShortName.lastIndexOf('.');
    const fileNameWithoutExtension = newShortName.slice(0, extensionIndex);

    const assetsByName = Object.keys(mls.stor.files).find((key) => {
        const stor = mls.stor.files[key];
        return stor.project === project
            && stor.folder === folder
            && stor.shortName === fileNameWithoutExtension
            && stor.extension === extension
    });

    if (assetsByName) throw new Error(`assets: ${folder}/${newShortName} already exists`);
    try {
        await createNewAssets(project, fileNameWithoutExtension, extension, folder, file)
        return true;
    } catch (err: any) {
        throw new Error(`Error on add new asset: ${err.message}`)
    }
}

async function createNewAssets(project: number, shortName: string, extension: string, folder: string, content: string | Blob | null): Promise<mls.stor.IFileInfo> {

    const params = {
        project,
        level: 3,
        shortName,
        extension,
        versionRef: '0',
        folder
    };

    const file = await mls.stor.addOrUpdateFile(params);
    if (!file) throw new Error('Error on update or add File');
    file.status = 'new';
    file.getValueInfo = () => _getValueInfo(file);
    file.onAction = (action: mls.stor.IFileInfoAction) => _onAction(action, file);
    const contentType = typeof content === 'string' ? 'string' : 'blob';
    const fileInfo: mls.stor.IFileInfoValue = {
        content,
        contentType,
    };
    await mls.stor.localStor.setContent(file, fileInfo);
    return file;
}

async function _getValueInfo(
    file: mls.stor.IFileInfo,
    originalShortName?: string,
    originalFolder?: string,
    originalProject?: number,
    originalCRC?: string,
): Promise<mls.stor.IFileInfoValue> {

    file.inLocalStorage = file.status !== 'nochange';
    const content = await file.getContent();
    const contentType = typeof content === 'string' ? 'string' : 'blob';
    const obj: mls.stor.IFileInfoValue = {
        content,
        contentType,
        originalShortName,
        originalFolder,
        originalProject,
        originalCRC,
    };
    return obj;
}

async function _onAction(action: mls.stor.IFileInfoAction, storFile: mls.stor.IFileInfo): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (action === 'aftersave') {
            storFile.status = 'nochange';
            storFile.inLocalStorage = false;
            const fileInfoValue: mls.stor.IFileInfoValue = {
                content: null,
                contentType: undefined,
            };
            mls.stor.localStor.setContent(storFile, fileInfoValue);
        }
        return resolve();
    });
}

export async function getTokens(project: number): Promise<IDesignSystemTokens[]> {
    const fileName = `./_${project}_designSystem`;
    const instance: IDesignSystem = await collabImport({ folder: '', project, shortName: 'designSystem' });
    if (!instance) throw new Error(`Invalid ds file: ${fileName}`);
    return instance.tokens || [];
}

export async function updateTokensTheme(project: number, themeName: string, tokenData: IDesignSystemTokens): Promise<void> {
    const actualTokens = await getTokens(project);
    const tokensByTheme = actualTokens.find((theme) => theme.themeName === themeName);
    if (!tokensByTheme) throw new Error(`Invalid theme`);

    tokensByTheme.color = tokenData.color;
    tokensByTheme.typography = tokenData.typography;
    tokensByTheme.global = tokenData.global;
    tokensByTheme.description = tokenData.themeName;
    await serializeTokens(project, actualTokens);

}

export async function addNewTokensTheme(project: number, tokenData: IDesignSystemTokens): Promise<void> {
    const actualTokens = await getTokens(project);
    let v = 1;

    const prepareTokens = (tokenData: IDesignSystemTokens) => {
        const { themeName } = tokenData;
        const alreadyExists = actualTokens.find((theme) => theme.themeName === themeName);
        if (alreadyExists) {
            v += 1;
            tokenData.themeName = tokenData.themeName + v;
            prepareTokens(tokenData);
        }
    }

    prepareTokens(tokenData);
    actualTokens.push(tokenData);
    await serializeTokens(project, actualTokens);

}

async function serializeTokens(project: number, tokens: IDesignSystemTokens[]) {
    const content = tokens.map(t => JSON.stringify(t, null, 4)).join(",\n\n");
    const key = mls.stor.getKeyToFiles(project, 2, 'designSystem', '', '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) return;

    await forceServiceInstance(2, '_100554_serviceSource');
    const serviceSource: ServiceSource100554 = mls.services['100554_serviceSource_left'];
    if (!serviceSource) throw new Error('Service source is not instancied');

    const models = await createAllModels(storFile);
    if (!models || !models.ts) throw new Error(`Invalid models for file: ${project}_designSystem`);
    const newCode = replaceTokensBlock(models.ts.model.getValue(), `\n${content}\n`);
    serviceSource.setValueInModeKeepingUndo(models.ts.model, newCode, true);
}

export function replaceTokensBlock(code: string, newContent: string): string {
  const regex = /export\s+const\s+tokens\s*:\s*IDesignSystemTokens\[\]\s*=\s*\[[\s\S]*?\];?/g;
  return code.replace(regex, `export const tokens: IDesignSystemTokens[] = [\n${newContent}\n]`);
}

export async function getTokensLess(project: number, theme: string): Promise<string> {
    const tokens = await getTokens(project)
    const tokenByTheme = tokens.find((item) => item.themeName === theme);
    if (!tokenByTheme) throw new Error(`no find theme: ${theme}`);
    let tokensLess = '';
    tokensLess += Object.keys(tokenByTheme.color).map((key) => {
        let token = '';
        if (!key.startsWith('_dark-')) token = `@${key}: ${tokenByTheme.color[key]};`
        return token;
    }).filter((item) => !!item).join('\n')
    tokensLess += '\n' + Object.keys(tokenByTheme.typography).map((key) => `@${key}: ${tokenByTheme.typography[key]};`).join('\n');
    tokensLess += '\n' + Object.keys(tokenByTheme.global).map((key) => `@${key}: ${tokenByTheme.global[key]};`).join('\n');
    return Promise.resolve(tokensLess);
}

export async function getTokensCss(project: number, theme: string): Promise<string> {

    const tokens = await getTokens(project);
    const prefix = ':root';
    try {
        const tokenInfo = tokens.find((item) => item.themeName === theme);
        if (!tokenInfo) return '';
        const allTokens = { ...tokenInfo.color, ...tokenInfo.typography, ...tokenInfo.global };
        const darkAndLight = getDarkAndLight(allTokens);
        const cssVars = getCssVars(darkAndLight, prefix);
        const tokensCss = convertLessTokensToCss(cssVars, darkAndLight['root']);
        return tokensCss;
    } catch (err: any) {
        throw new Error(`Error on compile tokens Less: ${err.message}`);
    }
}

export async function compileLess(str: string): Promise<string> {

    return new Promise((resolve, reject) => {
        if (!str || str.trim().length < 1) resolve('');
        mls.l2.less.compile(str).then(async (css) => {
            resolve(css);
        }).catch((err) => {
            reject(new Error('Error LESS: ' + err));
        });
    });
}

export async function preCompileLess(project: number, less: string, theme: string): Promise<string> {

    const tokens = await getTokens(project);
    const prefix = ':root';

    try {

        less = removeTokensFromSource(less);
        const tokenInfo = tokens.find((item) => item.themeName === theme);
        if (!tokenInfo) return '';
        const allTokens = { ...tokenInfo.color, ...tokenInfo.typography, ...tokenInfo.global };
        const darkAndLight = getDarkAndLight(allTokens);
        const newLess = convertLessTokensToCss(less, darkAndLight['root']);
        const tokensLess = await getTokensLess(project, theme);
        const res = await compileLess(`${newLess}\n${tokensLess}`)
        return res;
    } catch (err: any) {
        throw new Error(`Error on pre compile tokens Less: ${err.message}`);
    }

}

export async function preCompileLessByThemeOrDefault(project: number, less: string, theme: string): Promise<string> {

    const tokens = await getTokens(project);
    const prefix = ':root';

    try {

        less = removeTokensFromSource(less);
        let tokenInfo = tokens.find((item) => item.themeName === theme);
        if (!tokenInfo) {
            tokenInfo = tokens.find((item) => item.themeName === 'Default');
            theme = 'Default';
        }
        if (!tokenInfo) throw new Error(`Not found tokens`);
        const allTokens = { ...tokenInfo.color, ...tokenInfo.typography, ...tokenInfo.global };
        const darkAndLight = getDarkAndLight(allTokens);
        const newLess = convertLessTokensToCss(less, darkAndLight['root']);
        const tokensLess = await getTokensLess(project, theme);
        const res = await compileLess(`${newLess}\n${tokensLess}`)
        return res;
    } catch (err: any) {
        throw new Error(`Error on pre compile tokens Less: ${err.message}`);
    }

}

function getDarkAndLight(allTokens: IKeyValueToken): IDarkLight {
    const themes: IDarkLight = {};

    Object.entries(allTokens).forEach((entry) => {
        const [key, value] = entry;
        const [theme] = key.split('-');
        let themeName = 'root';
        if (theme === '_dark') themeName = 'dark';
        if (!themes[themeName]) themes[themeName] = {};
        themes[themeName][key] = value;
    });

    return themes;
}

function getCssVars(themes: IDarkLight, prefix: ':host' | ':root') {

    const cssArr: string[] = [];
    Object.entries(themes).forEach((entry) => {
        const [key, value] = entry;
        if (key === 'root') {

            const cssVars: string[] = [];
            Object.entries(value).forEach((entryTokens) => {
                const [keyToken, valueToken] = entryTokens;
                const cssVar = `--${keyToken}: ${valueToken};`;
                cssVars.push(cssVar);
            });
            const cssFinal = `${prefix}{\n\t${cssVars.join('\n\t')}\n}`;
            cssArr.push(cssFinal);

        } else {

            const cssVars: string[] = [];
            Object.entries(value).forEach((entryTokensDark) => {
                const [keyToken, valueToken] = entryTokensDark;
                const tokenKey = keyToken.substring(1 + key.length + 1, keyToken.length);
                const cssVar = `--${tokenKey}: ${valueToken};`;
                cssVars.push(cssVar);
            });
            const cssFinal = `[data-theme="dark"] {\n\t${cssVars.join('\n\t')}\n}`;
            cssArr.push(cssFinal);

        }
    });

    return cssArr.join('\n');

}

function convertLessTokensToCss(less: string, tokens: IKeyValueToken): string {
    const lessTokens = new Set(Object.keys(tokens));

    return less.replace(/@([a-zA-Z0-9-_]+)/g, (match, token, offset, fullText) => {
        if (!lessTokens.has(token)) {
            return match;
        }

        const beforeText = fullText.slice(0, offset);
        const insideMediaQuery = /@media\s*\([^{}]*$/.test(beforeText);

        const lessFunctions = [
            "lighten", "darken", "saturate", "desaturate", "fadein", "fadeout", "fade",
            "spin", "mix", "tint", "shade", "contrast", "ceil", "floor", "round", "abs",
            "sqrt", "pow", "mod", "min", "max", "escape", "e", "unit", "convert",
            "extract", "length"
        ];

        const insideLessFunction = new RegExp(`(${lessFunctions.join("|")})\\s*\\([^()]*$`, "i").test(beforeText);

        if (insideMediaQuery || insideLessFunction) {
            return match;
        }

        return `var(--${token})`;
    });
}

export function removeTokensFromSource(src: string) {
    const regex = /\/\/Start Less Tokens[\s\S]*?\/\/End Less Tokens/g;
    return src.replace(regex, '');
}



export interface IDesignSystemTokens {
    description: string,
    themeName: string,
    color: Record<string, string>,
    global: Record<string, string>,
    typography: Record<string, string>,
}

export interface IDesignSystem {
    tokens: IDesignSystemTokens[]
}

interface IKeyValueToken {
    [x: string]: string
}

export interface IDarkLight {
    [theme: string]: IKeyValueToken
}


