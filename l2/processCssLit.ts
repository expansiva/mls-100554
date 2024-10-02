/// <mls shortName="processCssLit" project="100554" enhancement="_blank" />
import { convertFileNameToTag } from './_100554_utilsLit'
import { compileStyleUsingMFile } from './_100554_enhancementStyle';

export const MLS_GETDEFAULTDESIGNSYSTEM = '[[mls_getDefaultDesignSystem]]';

export async function injectStyle(mfile: mls.l2.editor.IMFile, theme: string): Promise<void> {
    const js = mfile.compilerResults?.prodJS;
    if (js && js.indexOf(MLS_GETDEFAULTDESIGNSYSTEM) === -1)
        return; const fileName = `_${mfile.project}_${mfile.shortName}`;
    const tagName = convertFileNameToTag(fileName)
    const css = await compileStyleUsingMFile(mfile, ':host', theme);
    if (!css) return; const css2 = getCssWithoutTag(css, tagName);
    if (mfile && mfile.compilerResults) {
        mfile.compilerResults.prodJS = mfile.compilerResults.prodJS.replace(MLS_GETDEFAULTDESIGNSYSTEM, css2)
    } return;
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
