/// <mls shortName="codeLensLit" project="100554" enhancement="_blank" />

import type { IDecoratorDictionary, IDecoratorDetails } from './_100554_propiertiesLit';
import { setErrorOnModel } from './_100554_validateLit'

// File: CodeLens
export function setCodeLens(mfile: mls.l2.editor.IMFile) {
    clearCodeLens(mfile);
    const { model, compilerResults } = mfile;
    const { decorators } = compilerResults as any;
    if (mfile.shortName === 'enhancementLit' && mfile.project === 100554) return;
    setCodeLensDecoratorClass(model, decorators);
    setCodeLensServiceDetails(model, mfile);
}

function clearCodeLens(mfile: mls.l2.editor.IMFile) {
    for (let slineNr in mfile.codeLens) {
        const codeLen = mfile.codeLens[slineNr];
        if (codeLen[0].id === 'helpAssistant') {
            mls.l2.codeLens.removeCodeLen(mfile.model, Number.parseInt(slineNr))
        }
    }
}

function setCodeLensDecoratorClass(model: monaco.editor.ITextModel, decorators: string) {
    const objDecorators: IDecoratorDictionary = JSON.parse(decorators);
    Object.entries(objDecorators).forEach((entrie) => {
        const decoratorInfo: IDecoratorDetails = entrie[1];
        if (!decoratorInfo || decoratorInfo.type !== 'ClassDeclaration') return;
        decoratorInfo.decorators.forEach((_decorator) => {
            if (_decorator.text.startsWith('customElement(')) {
                mls.l2.codeLens.addCodeLen(model, _decorator.line + 1, { id: 'helpAssistant', title: `customElement`, jsComm: '', refs: '_100554_pluginCodelensCustomElement' });
            }
        })
    })
}

async function setCodeLensServiceDetails(model: monaco.editor.ITextModel, mfile: mls.l2.editor.IMFile) {
    const lines = findLinesByText(model, 'public details: IService');
    lines.forEach((line) => {
        mls.l2.codeLens.addCodeLen(model, line, { id: 'helpAssistant', title: `serviceDetails`, jsComm: '', refs: '_100554_pluginCodelensServiceDetails' });
    });
}


function findLinesByText(model: monaco.editor.ITextModel, textToFind: string): number[] {
    const lines: number[] = [];
    if (!model) return lines;
    const lineCount = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineText = model.getLineContent(lineNumber);
        if (lineText.includes(textToFind)) {
            lines.push(lineNumber);
        }
    }
    return lines;
}
