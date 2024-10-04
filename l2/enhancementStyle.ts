/// <mls shortName="enhancementStyle" project="100554" enhancement="_blank" groupName="other" />

import { convertFileNameToTag } from './_100554_utilsLit';
import { getCssWithoutTag } from './_100554_processCssLit'
import { getDSInstance, DesignSystemIO, ITokenInfo } from './_100554_libDesignSystem';

let dsInstance: DesignSystemIO | undefined;


export const getAddNewFileDetails = async () => {
    const lessTokens = await getTokensLess('Default');
    return [
        {
            title: 'Style',
            description: 'Initial Less',
            tags: ["less", "style"],
            example: `/// <mls shortName="[shortName]" project="[project]" enhancement="enhancementStyle" />
				\n[tag] {
                \n // Here your less
                \n} \n
                \n\n//Start Less Tokens\n${lessTokens}\n//End Less Tokens\n`
        }
    ]
}

export const requires: mls.l2.editor.IRequire[] = [];


export const onAfterChange = (mfile: mls.l2.editor.IMFile) => {
    try {
        validateStyle(mfile);
        return '';
    } catch (e: any) {
        throw new Error(e)
    }
};


export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return;
}


export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}


export function validateStyle(mfile: mls.l2.editor.IMFile) {

    const model: monaco.editor.ITextModel = (mfile as any).modelLESS;
    const keyToStorFileLess = mls.stor.getKeyToFiles(mfile.project, 2, mfile.shortName, '', '.less');
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
    const tagName = convertFileNameToTag(`_${mfile.project}_${mfile.shortName}`);

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

export async function compileStyleUsingMFile(mfile: mls.l2.editor.IMFile, prefix: ':host' | ':root', theme: string = 'Default') {
    const model: monaco.editor.ITextModel = (mfile as any).modelLESS;
    const keyToStorFileLess = mls.stor.getKeyToFiles(mfile.project, 2, mfile.shortName, '', '.less');
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
        const options = {
            compress: true,
            errorReporting: 'function'
        };
        (window as any)['less'].render(str, options)
            .then((output: any) => {
                resolve(output.css);
            }, (error: any) => {
                reject(new Error('Error LESS: ' + error));
            });
    });
}

async function preCompileLess(less: string, tokens: ITokenInfo, theme: string, prefix: ':host' | ':root', includeTokens: boolean): Promise<string> {
    let newLess = '';
    const actualTheme = tokens[theme];
    const allTokens = { ...actualTheme.color, ...actualTheme.typography, ...actualTheme.global };
    const darkAndLight = getDarkAndLight(allTokens);
    const cssVars = getCssVars(darkAndLight, prefix);
    newLess = replaceTokens(less, darkAndLight, cssVars, false);
    newLess = await compileLess(newLess);
    return newLess;
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

function replaceTokens(less: string, themes: IDarkLight, cssVars: string, includeTokens: boolean) {

    const { root } = themes;
    if (!root) return less;

    let newLess: string;
    if (includeTokens) newLess = cssVars + '\n' + less;
    else newLess = less;

    Object.keys(root).forEach((key) => {

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

export function setModelAPI(editor: monaco.editor.IStandaloneCodeEditor, model: monaco.editor.ITextModel | IMonacoModelStyle | undefined) {

    if (!model) return;
    const modelStyle = model as IMonacoModelStyle;

    modelStyle.add = (text: string, lineNumber: number, refLine: number) => {
        let lineToChange = lineNumber;
        const blockInfo = modelStyle.getBlockInfo();
        if (!lineToChange) {
            const newLineNumber = refLine === blockInfo.endLine ? refLine : refLine + 1;
            const columnStartRefLine = modelStyle.getLineIndentColumn(refLine as number);
            const newLine = {
                range: new monaco.Range(newLineNumber, 1, newLineNumber, 1),
                text: ' '.repeat(columnStartRefLine - 1) + '\n',
                forceMoveMarkers: true
            };

            if (editor) editor.executeEdits('style', [newLine]);
            lineToChange = newLineNumber;
        }

        const columnStart = modelStyle['getLineIndentColumn'](lineToChange);
        const columnEnd = modelStyle.getLineLength(lineToChange) + 1;
        const range = new monaco.Range(lineToChange, columnStart, lineToChange, columnEnd);
        if (editor) {
            editor.executeEdits('style', [{ range, text }]);
        }
        const endLineLength = modelStyle.getLineLength(blockInfo.endLine) + 1;
        const rangeBlock = new monaco.Range(blockInfo.startLine, 1, blockInfo.endLine, endLineLength);
        modelStyle.removeBlankLines(rangeBlock);

    };

    modelStyle.changeBlock = (key: string, value: string, comment: string) => {
        if (!editor) return;
        const blockLess = modelStyle.getLessBlock();
        const { lineNumber } = editor.getPosition() as monaco.Position;
        const text = `${key}: ${value};//${comment}`;
        const objChanged: any = {
            lineChange: undefined,
            prop: key,
            newValue: value,
            oldValue: ''
        };

        if (!blockLess) return;

        blockLess.lines.forEach((item: any) => {
            if (item.key === key) {
                objChanged.lineChange = item.line;
                objChanged.oldValue = item.value;
            }
        });

        if (!objChanged.newValue) {
            const linewithSameKey = blockLess.lines.find((line: any) => line.key === objChanged.prop);
            if (!linewithSameKey) return;
            modelStyle.removeLine(linewithSameKey.line);
            return;
        }

        if (!objChanged.lineChange) {
            modelStyle.add(text, objChanged.lineChange, lineNumber);
            return;
        }
        modelStyle.add(text, objChanged.lineChange);
    };

    modelStyle.removeLine = (lineNumber: number) => {
        const columnEnd = modelStyle.getLineLength(lineNumber) + 1;
        const columnStart = modelStyle.getLineIndentColumn(lineNumber);
        const range = new monaco.Range(lineNumber, columnStart, lineNumber, columnEnd);
        if (editor) {
            editor.executeEdits('', [{ range, text: null }]);
        }
    };

    modelStyle.getLessBlock = (): IBlockLess | undefined => {

        const { isValidBlock, endLine, startLine, selector } = modelStyle.getBlockInfo();
        if (!isValidBlock) return undefined;

        const rc: IBlockLess = {
            lines: [],
            selector
        };

        const lines = modelStyle.getLinesContent();
        let bracketsOpenCount = 0;
        let bracketsCloseCount = 0;

        for (let i = startLine - 1; i <= endLine - 1; i++) {

            let line = lines[i];
            line = line.replace(/\/\/.*/, ''); // remove inline comment
            const isInBlockComment = modelStyle.isInCommentBlock(lines, i + 1);
            if (isInBlockComment) continue;
            if (line.indexOf('{') >= 0) bracketsOpenCount += 1;
            if (line.indexOf('}') >= 0) bracketsCloseCount += 1;
            if ((bracketsOpenCount - bracketsCloseCount) > 1) continue;

            const rules = line.split(';');
            rules.forEach((rule: any) => {

                if (!rule) return;
                const item = modelStyle.convertRuleToKeyValue(rule);
                if (!item) return;
                item.line = i + 1;
                rc.lines.push(item);

            });

        }

        return rc;

    };

    modelStyle.getHelperNameByLine = (lineNumber: number): string => {

        const lineContent = modelStyle.getLineContent(lineNumber);
        const [, helperName] = lineContent.split('//');
        return helperName;

    };

    modelStyle.isCursorInBlockValid = (): boolean => {

        const blockInfo = modelStyle.getBlockInfo();
        return blockInfo.isValidBlock;

    };

    modelStyle.getBlockInfoByLine = (lineNumber: number): IBlockInfo => {
        const lines = modelStyle.getLinesContent();
        const startBlockInfo = modelStyle.haveStartBlock(lines, lineNumber);
        const endBlockInfo = modelStyle.haveEndBlock(lines, lineNumber);
        const rc: IBlockInfo = {
            selector: '',
            endLine: endBlockInfo.line,
            hasEndBlock: endBlockInfo.haveEndBlock,
            hasStartBlock: startBlockInfo.haveStartBlock,
            startLine: startBlockInfo.line,
            isValidBlock: startBlockInfo.haveStartBlock && endBlockInfo.haveEndBlock
        };

        if (startBlockInfo.line > 0 && rc.isValidBlock) {
            const lineStartContent = modelStyle.getLineContent(startBlockInfo.line);
            rc.selector = lineStartContent.replace(/\/\/.*/, '').replace(/\{.*$/, '').trim();
        }

        return rc;
    };

    modelStyle.getBlockInfo = (): IBlockInfo => {
        const { lineNumber } = editor.getPosition() as monaco.Position;
        const rc = modelStyle.getBlockInfoByLine(lineNumber);
        return rc;
    };

    modelStyle.isInCommentBlock = (lines: string[], lineNumber: number): boolean => {

        let countStartBlockComment = 0;
        let countEndBlockComment = 0;

        for (let i = 0; i <= lineNumber - 1; i++) {
            const line = lines[i];
            if (line.indexOf('/*') >= 0) countStartBlockComment += 1;
            if (line.indexOf('*/') >= 0 && i !== lineNumber - 1) countEndBlockComment += 1;
        }

        const isInBlockComment = countStartBlockComment > countEndBlockComment;
        return isInBlockComment;

    };

    modelStyle.haveStartBlock = (lines: string[], lineNumber: number): { haveStartBlock: boolean, line: number } => {

        const rc = {
            haveStartBlock: false,
            line: -1
        };

        let bracketsCount = 1;

        let actualLine = lines[lineNumber - 1];
        if (actualLine.trim().startsWith('//')) return rc;

        actualLine = actualLine.replace(/\/\/.*/, '').replace(/\/\*.*/, ''); // remove comment in line
        if (actualLine.indexOf('{') >= 0) {
            rc.haveStartBlock = true;
            rc.line = lineNumber;
            return rc;
        }

        if (actualLine.indexOf('}') >= 0) bracketsCount -= 1;

        const isInBlockComment = modelStyle.isInCommentBlock(lines, lineNumber);
        if (isInBlockComment) return rc;

        for (let i = lineNumber - 1; i >= 0; i--) {
            let line = lines[i];
            line = line.replace(/\/\/.*/, ''); // remove inline comment 
            const lineInCommentBlock = modelStyle.isInCommentBlock(lines, i + 1);

            if (line.indexOf('}') >= 0 && !lineInCommentBlock) bracketsCount += 1;
            if (line.indexOf('{') >= 0 && !lineInCommentBlock) bracketsCount -= 1;

            if (bracketsCount === 0) {
                rc.haveStartBlock = true;
                rc.line = i + 1;
                break;
            }
        }

        return rc;

    };

    modelStyle.haveEndBlock = (lines: string[], lineNumber: number): { haveEndBlock: boolean, line: number } => {

        const rc = {
            haveEndBlock: false,
            line: -1
        };

        let bracketsCount = 1;
        let actualLine = lines[lineNumber - 1];
        if (actualLine.trim().startsWith('//')) return rc;
        actualLine = actualLine.replace(/\/\/.*/, '').replace(/\/\*.*/, ''); // remove comment in line
        if (actualLine.indexOf('}') >= 0) {
            rc.haveEndBlock = true;
            rc.line = lineNumber;
            return rc;
        }

        if (actualLine.indexOf('{') >= 0) bracketsCount -= 1;
        const isInBlockComment = modelStyle.isInCommentBlock(lines, lineNumber);
        if (isInBlockComment) return rc;

        for (let i = lineNumber - 1; i <= lines.length - 1; i++) {

            let line = lines[i];
            line = line.replace(/\/\/.*/, ''); // remove inline comment 
            const lineInCommentBlock = modelStyle.isInCommentBlock(lines, i + 1);
            if (line.indexOf('{') >= 0 && !lineInCommentBlock) bracketsCount += 1;
            if (line.indexOf('}') >= 0 && !lineInCommentBlock) bracketsCount -= 1;
            if (bracketsCount === 0) {
                rc.haveEndBlock = true;
                rc.line = i + 1;
                break;
            }

        }
        return rc;
    };

    modelStyle.convertRuleToKeyValue = (content: string): IBlockLessLine | undefined => {
        const blockLine: IBlockLessLine = {} as IBlockLessLine;
        const [key, value] = content.split(':');
        if (!key || !value) return undefined;
        blockLine.key = key.trim();
        blockLine.value = value.trim();
        return blockLine;
    };

}

export interface IMonacoModelStyle extends monaco.editor.ITextModel {
    add(cssLine: string, line: number, refLine?: number): void;
    changeBlock(key: string, value: string, comment: string): void;
    removeLine(line: number): void;
    removeBlankLines(range: monaco.IRange): void;
    getHelperNameByLine(line: number): string;
    isCursorInBlockValid(): boolean;
    haveStartBlock(lines: string[], lineNumber: number): { haveStartBlock: boolean, line: number };
    haveEndBlock(lines: string[], lineNumber: number): { haveEndBlock: boolean, line: number };
    isInCommentBlock(lines: string[], lineNumber: number): boolean;
    getBlockInfo(): IBlockInfo;
    getBlockInfoByLine(line: number): IBlockInfo;
    getLessBlock(): IBlockLess | undefined;
    convertRuleToKeyValue(content: string): IBlockLessLine | undefined;
    getLineIndentColumn(line: number): number;
}


export interface IBlockLess {
    selector: string,
    lines: IBlockLessLine[]
}

export interface IBlockLessLine {
    key: string,
    value: string,
    line: number
}

export interface IBlockInfo {
    selector: string,
    hasStartBlock: boolean,
    startLine: number,
    endLine: number,
    hasEndBlock: boolean,
    isValidBlock: boolean
}


interface IKeyValueToken {
    [x: string]: string
}

export interface IDarkLight {
    [theme: string]: IKeyValueToken
}
