/// <mls shortName="enhancementStyle" project="100554" enhancement="_blank" groupName="other" />

import { convertFileNameToTag } from './_100554_utilsLit';
import { getCssWithoutTag } from './_100554_processCssLit'
import { getDSInstance, DesignSystemIO, ITokenInfo } from './_100554_libDesignSystem';

let dsInstance: DesignSystemIO | undefined;

export const requires: mls.l2.enhancement.IRequire[] = [];

export const onAfterChange = (models: mls.editor.IModels) => {

    const modelStyle: mls.editor.IModelStyle | undefined = models.style;
    if (!modelStyle) return '';
    try {
        validateStyle(modelStyle);
        return '';
    } catch (e: any) {
        throw new Error(e)
    }
};


export const onAfterCompile = async (modelStyle: mls.editor.IModelStyle): Promise<void> => {
    return;
}


export const getDesignDetails = (modelStyle: mls.editor.IModelStyle): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}


export function validateStyle(modelStyle: mls.editor.IModelStyle) {

    const model: monaco.editor.ITextModel = modelStyle.model;
    const { project, shortName } = modelStyle.storFile;
    const keyToStorFileLess = mls.stor.getKeyToFiles(project, 2, shortName, '', '.less');
    const storFileLess = mls.stor.files[keyToStorFileLess];
    if (!model || !storFileLess) return;

    storFileLess.hasError = false;
    const value = model.getValue();
    let text = removeTokensFromSource(value);
    text = removeCommentLines(text);
    const markers: monaco.Position[] = [];
    const validRootSelectorClass = /^[a-zA-Z][\w-]*\.[a-zA-Z][\w-]*$/;
    const validRootSelectorTag = /^\s*[a-zA-Z]+[\w-]*-[\w-]*\s*$/;
    const rootRules = getRootSelectors(text);
    const tagName = convertFileNameToTag(`_${project}_${shortName}`);

    if (rootRules) {
        rootRules.forEach((rule) => {
            const lineSelector = rule.trim().split('\n')[0].trim();
            const selector = lineSelector.split('{')[0].trim();
            const isSameSelectorAndTag = selector.startsWith(tagName);
            const position = getLineByText(model, lineSelector);

            if ((!isSameSelectorAndTag || (!validRootSelectorClass.test(selector) && !validRootSelectorTag.test(selector))) && position) {
                markers.push(position);
            }
        });
    }

    if (markers.length > 0) storFileLess.hasError = true;
    setErrorOnEditor(markers, model, tagName);
}

function setErrorOnEditor(position: monaco.Position[], model: monaco.editor.ITextModel, tag: string) {
    monaco.editor.setModelMarkers(model, 'markerSource', []);
    const markers: monaco.editor.IMarkerData[] = [];
    position.forEach((pos) => {
        const markerOptions = {
            severity: monaco.MarkerSeverity.Error,
            message: `Invalid selector, must starting with tag or tag.class ex: '${tag} {' or '${tag}.myclass {'`,
            startLineNumber: pos.lineNumber,
            startColumn: pos.column,
            endLineNumber: pos.lineNumber,
            endColumn: pos.column,
        };
        markers.push(markerOptions);
    })
    monaco.editor.setModelMarkers(model, 'markerSource', markers);
}

export function getLineByText(model: monaco.editor.ITextModel, searchText: string) {
    const lineCount = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineContent = model.getLineContent(lineNumber);
        if (lineContent.trim() === searchText) {
            return new monaco.Position(lineNumber, 1);
        }
    }
    return null;
}

export function removeTokensFromSource(src: string) {
    const regex = /\/\/Start Less Tokens[\s\S]*?\/\/End Less Tokens/g;
    return src.replace(regex, '');
}

export function removeCommentLines(text: string) {

    const lines = text.split('\n');
    const lineCount = lines.length - 1;

    const newLines = [];

    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineContent = lines[lineNumber]
        if (!isCommentLine(lineContent)) {
            newLines.push(lineContent);
        }
    }
    const newContent = newLines.join('\n');
    return newContent;
}

export function getRootSelectors(lessContent: string): string[] {
    const rootSelectors = [];
    const regex = /^([^\s{]+(?:\.[^\s{]+)*(?:\s+[^\s{]+)*)\s*\{/gm;
    let match;
    while ((match = regex.exec(lessContent)) !== null) {
        rootSelectors.push((match[1].trim().replace(/\n/g, ' ').replace(/}/g, '') + ' {').trim());
    }
    return rootSelectors;
}

export function isCommentLine(line: string) {
    if (!line) return false;
    if (line.trim().startsWith('//')) {
        return true;
    }
    return line.trim().startsWith('/*') && line.trim().endsWith('*/');
}

export async function initDsInstance() {
    const { project } = mls.actual[5];
    if (project === undefined) throw new Error('No project selected!');
    dsInstance = await getDSInstance(project, 0);
    if (!dsInstance) return;
    await dsInstance.init();
}

export async function getTokensLess(theme: string) {
    await initDsInstance();
    if (!dsInstance || !dsInstance.tokens) return '';
    if (!dsInstance) return '';
    const resumeTokens = await dsInstance.tokens.getTokensLess(theme);
    return resumeTokens;
}

export async function getTokensList() {
    await initDsInstance();
    if (!dsInstance || !dsInstance.tokens) return {};
    if (!dsInstance) return {};
    const resumeTokens = await dsInstance.tokens.list;
    return resumeTokens;
}

export async function compileStyleUsingMFile(modelStyle: mls.editor.IModelStyle, prefix: ':host' | ':root', theme: string = 'Default') {
    const model: monaco.editor.ITextModel = modelStyle.model;
    const { project, shortName } = modelStyle.storFile;
    const keyToStorFileLess = mls.stor.getKeyToFiles(project, 2, shortName, '', '.less');
    const storFileLess = mls.stor.files[keyToStorFileLess];
    if (!model || !storFileLess) return;
    const tokensLess = await getTokensLess(theme);
    const tokensList = await getTokensList();
    let val = model.getValue();
    val = removeTokensFromSource(val);
    val = removeCommentLines(val);

    try {
        // let fullLess = `${tokensLess || ''}\n${val}`;
        // await compileLess(fullLess);
        return preCompileLess(val, tokensList, theme, prefix, true);

    } catch (err: any) {
        throw new Error(err.message);
    }
}

export async function compileStyleUsingStorFile(shortName: string, project: number, theme: string = 'Default') {

    const keyToStorFileLess = mls.stor.getKeyToFiles(project, 2, shortName, '', '.less');
    const storFileLess = mls.stor.files[keyToStorFileLess];
    if (!storFileLess) return;

    const tokensList = await getTokensList();
    let val = await storFileLess.getContent();
    if (!val || typeof val !== 'string') return '';

    val = removeTokensFromSource(val);
    val = removeCommentLines(val);

    try {
        return preCompileLess(val, tokensList, theme, ':root', true);
    } catch (err: any) {
        throw new Error(err.message);
    }
}


function compileLess(str: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!str || str.trim().length < 1) resolve('');

        mls.l2.less.compile(str, true).then(async (css) => {
            resolve(css);
        }).catch((err) => {
            reject(new Error('Error LESS: ' + err));
        });

    });
}

async function preCompileLess(less: string, tokens: ITokenInfo, theme: string, prefix: ':host' | ':root', includeTokens: boolean): Promise<string> {
    try {
        let newLess = '';

        const actualTheme = tokens[theme];
        const allTokens = { ...actualTheme.color, ...actualTheme.typography, ...actualTheme.global };
        const darkAndLight = getDarkAndLight(allTokens);
        const cssVars = getCssVars(darkAndLight, prefix);
        newLess = replaceTokens(less, darkAndLight, cssVars, false);
        newLess = await compileLess(newLess);

        if (less !== '' && newLess === '') {
            errorCompileLess(`Error: invalid less`);
        }
        return newLess;
    } catch (e: any) {

        console.info(e);
        if (typeof e === 'string') errorCompileLess(e);
        else if (e && e.message) errorCompileLess(e.message);
        else errorCompileLess(`Error: invalid less`);

        return '';
    }

}

function errorCompileLess(err: string) {

    const model = mls.editor.instances[mls.editor.activeInstance].getModel();
    if (!model || model.getLanguageId() !== 'less') return;
    monaco.editor.setModelMarkers(model, 'markerSource', []);
    const markers: monaco.editor.IMarkerData[] = [];

    const markerOptions = {
        severity: monaco.MarkerSeverity.Error,
        message: err,
        startLineNumber: 0,
        startColumn: 0,
        endLineNumber: 0,
        endColumn: 50,
    };
    markers.push(markerOptions);

    monaco.editor.setModelMarkers(model, 'markerSource', markers);

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
            // const cssFinal = `@media (prefers-color-scheme: dark) {\n\t${prefix}{\n\t${cssVars.join('\n\t')}\n}`;
            const cssFinal = `[data-theme="dark"] {\n\t${cssVars.join('\n\t')}\n}`;
            cssArr.push(cssFinal);
        }
    });

    return cssArr.join('\n');

}

function lessToCssParser(lessCode: string): string {

    const lessVariableRegex = /@([a-zA-Z0-9_-]+)(\s*default\s*([^;]+))?/g;
    const cssCode = lessCode.replace(lessVariableRegex, (match, tokenName, _, defaultValue) => {
        if (defaultValue) {
            return `var(--${tokenName}, ${defaultValue.trim()})`;
        }
        return `var(--${tokenName})`;
    });
    return cssCode;
};

function replaceTokens(less: string, themes: IDarkLight, cssVars: string, includeTokens: boolean) {

    const { root } = themes;
    if (!root) return less;

    let newLess: string;
    if (includeTokens) newLess = cssVars + '\n' + less;
    else newLess = less;

    Object.keys(root).forEach((key) => {

        const variableName5 = `@${key}, `;
        const escapedVariableName5 = getEscapedVariable(variableName5);
        const pattern5 = new RegExp(`${escapedVariableName5}\\s*([^;]+);`, 'g');
        const replacement5 = `var(--${key}, $1);`;
        newLess = newLess.replace(pattern5, replacement5);

        const variableName = `@${key};`;
        const escapedVariableName = getEscapedVariable(variableName);
        const pattern = new RegExp(escapedVariableName, 'g');
        const replacement = `var(--${key});`;
        newLess = newLess.replace(pattern, replacement);

        const variableName2 = `@${key},`;
        const escapedVariableName2 = getEscapedVariable(variableName2);
        const pattern2 = new RegExp(escapedVariableName2, 'g');
        const replacement2 = `var(--${key}),`;
        newLess = newLess.replace(pattern2, replacement2);

        const variableName3 = `(@${key}`;
        const escapedVariableName3 = getEscapedVariable(variableName3);
        const pattern3 = new RegExp(escapedVariableName3, 'g');
        const replacement3 = `(var(--${key})`;
        newLess = newLess.replace(pattern3, replacement3);

        const variableName4 = `@${key} `;
        const escapedVariableName4 = getEscapedVariable(variableName4);
        const pattern4 = new RegExp(escapedVariableName4, 'g');
        const replacement4 = `var(--${key}) `;
        newLess = newLess.replace(pattern4, replacement4);

    });

    return newLess;
}

function getEscapedVariable(variableName: string): string {
    return variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export async function setStylesProcessed(newCss: string, el: HTMLElement, tag: string) {
    const cssWithoutTag = getCssWithoutTag(newCss, tag);
    if (!el.shadowRoot) return;
    const stylesheet = createStyleSheet(cssWithoutTag, el.ownerDocument.defaultView!);
    if (!stylesheet) return;
    el.shadowRoot.adoptedStyleSheets = [stylesheet];
    (el as any).requestUpdate();
}

function createStyleSheet(cssString: string, defaultView: Window) {
    const sheet = (new (defaultView as any).CSSStyleSheet() as any);
    sheet.replaceSync(cssString);
    return sheet;
}


interface IKeyValueToken {
    [x: string]: string
}

export interface IDarkLight {
    [theme: string]: IKeyValueToken
}
