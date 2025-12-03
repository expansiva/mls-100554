/// <mls shortName="processCssLit" project="100554" enhancement="_blank" />

import { compileStyleUsingMFile } from '/_100554_/l2/enhancementStyle.js';
import { generateCompactTimestamp } from '/_100554_/l2/libCommom.js';

export async function injectStyle(modelTS: mls.editor.IModelTS, theme: string): Promise<void> {
    injectStyleWithoutShadowRoot(modelTS, theme);
}

export async function injectStyleWithoutShadowRoot(modelTS: mls.editor.IModelTS, theme: string): Promise<void> {
    if (!modelTS) return;
    const modelStyle = mls.editor.getModels(modelTS.storFile.project, modelTS.storFile.shortName, modelTS.storFile.folder)?.style;
    if (!modelStyle) return;


    const css = await compileStyleUsingMFile(modelStyle, theme);
    if (!css) return;
    if (modelTS && modelTS.compilerResults) {

        const newJs = addLineInConstructor(modelTS.compilerResults.prodJS, `if(this.loadStyle) this.loadStyle(\`${css}\`);`);
        //if (!newJs || !newJs.trim().startsWith('/// <mls')) return;
        if (!newJs || newJs.indexOf('/// <mls') < 0) return;
        modelTS.compilerResults.prodJS = newJs;
        mls.stor.cache.clearObsoleteCache();
        modelTS.compilerResults.cacheVersion = generateCompactTimestamp();
        await delay(200);
        let { project, shortName, folder, extension } = modelTS.storFile;
        const version = modelTS.compilerResults.cacheVersion;
        extension = extension.replace('.ts', '.js');
        await mls.stor.cache.addIfNeed({ project, folder, shortName, version, content: newJs, extension });
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addLineInConstructor(code: string, lineToAdd: string): string {

    const lines = code.split('\n');

    const lineEnhacement = lines.find((l) => l.trim().startsWith('/// <mls'));
    const hasEnhancementLit = (lineEnhacement || '').includes('_100554_enhancementLit');
    //const hasEnhancementLit = lines[0].includes('_100554_enhancementLit');
    if (!hasEnhancementLit) return code;
    let insideClass = false;
    let constructorIndex = -1;
    let superIndex = -1;
    let lineAlreadyExists = false;

    if (!code) return code;

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();

        if (trimmedLine.includes('class ') && trimmedLine.includes(' extends ')) {
            insideClass = true;
        }

        if (insideClass && trimmedLine.startsWith('constructor(')) {
            constructorIndex = i;

            for (let j = constructorIndex + 1; j < lines.length; j++) {
                if (lines[j].trim().startsWith('super(')) {
                    superIndex = j;

                    if (lines[j + 1] && lines[j + 1].trim() === lineToAdd.trim()) {
                        lineAlreadyExists = true;
                    }
                    break;
                }
            }

            break;
        }

    }

    if (constructorIndex !== -1) {
        if (!lineAlreadyExists) {
            lines.splice(superIndex + 1, 0, `        ${lineToAdd}`);
        }
    } else {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().includes('class ') && lines[i].includes(' extends ')) {
                lines.splice(i + 1, 0, `    constructor() {`, `        super();`, `        ${lineToAdd}`, `    }`);
                break;
            }
        }
    }

    return lines.join('\n');
}


export function getCssWithoutTag(css: string, tag: string): string {
    const originalString = css;
    const regex = /(\w+-\d+)\.(\w+)\s+/;
    let modifiedString = originalString.replace(regex, ':host(.$2) ');
    const searchString = tag;
    const replacementString = '';
    modifiedString = modifiedString.replace(new RegExp(searchString, "g"), replacementString);
    modifiedString = replaceBackTicks(modifiedString);
    // modifiedString = decodeString(modifiedString)
    return modifiedString;
}

function replaceBackTicks(originalString: string): string {
    const stringWithSingleQuotes = originalString.replace(/`/g, "'");
    return stringWithSingleQuotes;
}


function decodeString(cssString: string) {
    try {
        return decodeURIComponent(cssString)
    } catch (err) {
        console.info(err)
        return ''
    }
}
