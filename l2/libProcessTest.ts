/// <mls shortName="libProcessTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaState } from './_100554_icaState';

export function getScriptTest(ica: IcaState): string {

    const array = ica.getHistory();
    if (array.length <= 0) return '';

    const ret: string[] = [];

    let lastkey = '';
    let lastInteraction = '';
    let lastIndex = -1;
    let jsdocParams = "";
    let jsdocReturns = "";

    array.forEach((h) => {

        const tipo = h.system ? "System" : "User";
        const vl = processValue(h.value);
        const tp = typeof h.value;
        const key = h.key.split('.').pop();
        let row = '';

        if (h.system) {

            row = `${vl} -> {{${h.key}}}  // return.${key}`;
            if (typeof vl === "string") {
                row = `'${vl}' -> {{${h.key}}}  // return.${key}`;
            }


        } else {

            row = `{{${h.key}}} -> ${vl}  // request.${key}`;
            if (typeof vl === "string") {
                row = `{{${h.key}}} -> '${vl}'  // request.${key}`;
            }
        }

        if (lastInteraction === tipo && lastkey === h.key && lastIndex >= 0) {
            ret[lastIndex] = row;

        } else {

            if (h.system) {

                jsdocReturns += jsdocReturns ? `\n* @returns {${tp}} [return.${key}]` : `* @returns {${tp}} [return.${key}]`;

            } else {

                jsdocParams += jsdocParams ? `\n* @param {${tp}} request.${key}` : `* @param {${tp}} request.${key}`;

            }

            ret.push(row);
            lastInteraction = tipo;
            lastkey = h.key;
            lastIndex = ret.length - 1;

        }

    });

    const jsdoc = `/**\n${jsdocParams}\n*\n${jsdocReturns}\n*/\n\n`;

    return `<mls-script title="" description="">\n${jsdoc}${ret.join('\n')}\n</mls-script>`;
}

function processValue(vl: any): string | number {

    if (typeof vl === "string" || typeof vl === "number") {
        return vl;
    }

    return JSON.stringify(vl);

}

let iframeTest: HTMLIFrameElement | undefined;
let lines: string[] = [];
let lineIndex = -1;
let lineWait = -1;
const errors: string[] = [];

export function runTest(iframe: HTMLIFrameElement) {

    if (!iframe || !iframe.contentWindow || !(iframe.contentWindow as any).globalStateManagment) return;

    errors.length = 0;
    lineIndex = -1;
    lineWait = -1;
    iframeTest = iframe;
    lines = test.split('\n');
    
    lineIndex = 0;
    runLine();
}

function runLine() {

    if (!iframeTest || !iframeTest.contentWindow || !(iframeTest.contentWindow as any).globalStateManagment) return;

    if (lineIndex < 0) return;
    if (lineIndex >= lines.length) {
        finisheTest();
        return;
    }

    const l = lines[lineIndex];
    if (l.startsWith('/**') || l.startsWith('*') || l.trim() === '') {
        lineIndex++;
        runLine();
        return;
    }

    const info = extractKeyValue(l);
    if (l.startsWith('{{')) {
        (iframeTest.contentWindow as any).globalStateManagment.setState(info.key, info.vl, false);
        lineIndex++;
        runLine();
        return;
    } else {
        lineWait = lineIndex;
        verifyLine();
        return;
    }

}

function verifyLine() {

    if (lineIndex < 0 || lineIndex !== lineWait) return;

    if (!iframeTest || !iframeTest.contentWindow || !(iframeTest.contentWindow as any).globalStateManagment) return;

    const l = lines[lineIndex];
    const info = extractKeyValue(l);
    const v = (iframeTest.contentWindow as any).globalStateManagment.getState(info.key);

    if (typeof v !== 'object') {
        if (v !== info.vl) {
            errors.push(`line:${lineIndex}, key:${info.key}, expected: ${info.vl}, received: ${v}`);
        }
    } else {

        const jv = JSON.stringify(v);
        const jvl = JSON.stringify(info.vl);

        if (jv !== jvl) {
            errors.push(`line:${lineIndex}, key:${info.key}, expected: ${jvl}, received: ${jv}`);
            finisheTest();
            return;
        }
    
    }

    lineIndex++;
    runLine();
}

function finisheTest() {

    if (errors.length > 0) {
        console.info('Erro', errors);
    } else {
        console.info('ok');
    }

}

function extractKeyValue(text: string) {

    const key = extractKey(text);
    let vl: any;
    if (text.startsWith('{{')) {
        vl = text.split('->')?.pop()?.split('//')[0].replace(/\'/g, '').trim();
    } else {
        vl = text.split('->').shift()?.replace(/\'/g, '').trim();
    }

    try {

        if (!isNaN(vl) && vl !== '') {
            vl = +vl;
        } else if (vl.indexOf('{') >= 0 || vl.indexOf('[') >= 0) {
            vl = JSON.parse(vl);
        }

        return { key, vl }
    } catch (e) {
        return { key, vl }
    }

}

function extractKey(text: string) {
    const regex = /{{(.*?)}}/;
    const match = text.match(regex);

    return match ? match[1] : null;
}

const test = `
/**
* @param {number} request.indexSel
* @param {string} request.empresa
* @param {string} request.action
*
* @returns {string} [return.empresa]
* @returns {string} [return.cnpj]
* @returns {string} [return.endereco]
* @returns {string} [return.contato]
* @returns {object} [return.produtos]
* @returns {string} [return.action]
* @returns {string} [return.error]
*/

{{projectTest.page2.indexSel}} -> 0  // request.indexSel
'BTechParts LTDA' -> {{projectTest.page2.selecionado.empresa}}  // return.empresa
'12.345.678/0001-90' -> {{projectTest.page2.selecionado.cnpj}}  // return.cnpj
'Rua A, 123' -> {{projectTest.page2.selecionado.endereco}}  // return.endereco
'(11) 99999 - 9999' -> {{projectTest.page2.selecionado.contato}}  // return.contato
'["Monitores","Teclados"]' -> {{projectTest.page2.selecionado.produtos}}  // return.produtos
{{projectTest.page2.selecionado.empresa}} -> 'TechParts LTDAaaaa'  // request.empresa
{{projectTest.page2.action}} -> 'save'  // request.action
'' -> {{projectTest.page2.action}}  // return.action
'CNPJ invalido' -> {{projectTest.page2.error}}  // return.error
`;