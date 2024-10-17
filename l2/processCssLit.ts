/// <mls shortName="processCssLit" project="100554" enhancement="_blank" />
import { convertFileNameToTag } from './_100554_utilsLit'
import { compileStyleUsingMFile } from './_100554_enhancementStyle';

export const MLS_GETDEFAULTDESIGNSYSTEM = '[[mls_getDefaultDesignSystem]]';

export async function injectStyle(mfile: mls.l2.editor.IMFile, theme: string): Promise<void> {
    const js = mfile.compilerResults?.prodJS;
    if (js && js.indexOf(MLS_GETDEFAULTDESIGNSYSTEM) === -1) return injectStyleWithoutShadowRoot(mfile, theme);
    return injectStyleShadowRoot(mfile, theme);
}

export async function injectStyleShadowRoot(mfile: mls.l2.editor.IMFile, theme: string): Promise<void> {
    const fileName = `_${mfile.project}_${mfile.shortName}`;
    const tagName = convertFileNameToTag(fileName)
    const css = await compileStyleUsingMFile(mfile, ':host', theme);
    if (!css) return;
    const css2 = getCssWithoutTag(css, tagName);
    if (mfile && mfile.compilerResults) {
        mfile.compilerResults.prodJS = mfile.compilerResults.prodJS.replace(MLS_GETDEFAULTDESIGNSYSTEM, css2)
    }
}

export async function injectStyleWithoutShadowRoot(mfile: mls.l2.editor.IMFile, theme: string): Promise<void> {
    const css = await compileStyleUsingMFile(mfile, ':root', theme);
    if (!css) return;
    if (mfile && mfile.compilerResults) {
        const newJs = addLineInConstructor(mfile.compilerResults.prodJS, `if(this.loadStyle) this.loadStyle(\`${css}\`);`);
        if (!newJs || !newJs.trim().startsWith('/// <mls')) return;
        mfile.compilerResults.prodJS = newJs;
        mls.stor.cache.clearObsoleteCache();
        mfile.compilerResults.cacheVersion = generateCompactTimestamp();
        mls.stor.cache.AddMfileIfNeed(mfile);
    }
}

function generateCompactTimestamp() {
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

function addLineInConstructor(code: string, lineToAdd: string): string {

    const lines = code.split('\n');
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
