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
    setCodeLensMlsComponents(model, mfile);
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
                mls.l2.codeLens.addCodeLen(model, _decorator.line + 1, { id: 'helpAssistant', title: `customElement`, jsComm: '', refs: 'codelens-custom-element-100554' });
            }
        })
    })
}

async function setCodeLensServiceDetails(model: monaco.editor.ITextModel, mfile: mls.l2.editor.IMFile) {
    const lines = findLinesByText(model, 'public details: IService');
    lines.forEach((line) => {
        mls.l2.codeLens.addCodeLen(model, line, { id: 'helpAssistant', title: `serviceDetails`, jsComm: '', refs: 'codelens-service-details-100554' });
    });
}

async function setCodeLensMlsComponents(model: monaco.editor.ITextModel, mfile: mls.l2.editor.IMFile) {

    const errorInfo = {
        line: 0,
        start: 0,
        end: 0,
    }

    const lines = findLinesByText(model, '@mlsComponentDetails');

    lines.forEach((line) => {

        errorInfo.line = line;
        mls.l2.codeLens.addCodeLen(model, line, { id: 'helpAssistant', title: `mlsComponentDetails`, jsComm: '', refs: 'codelens-component-details-100554' });
    });

    const mModule = await mls.l2.enhancement.getEnhancementInstance(mfile);
    if (!mModule) return;
    const obj = await mModule.getDesignDetails(mfile);

    let hasError = lines.length > 1 ? 'only one dependency declaration is valid.' : '';

    if (!hasError) {
        for (let i of obj.webComponentDependencies) {

            if (!(mls.l2.editor as any).mfiles[i]) {
                hasError = i;
                break;
            }

        }
    }

    if (hasError) {

        mfile.storFile.hasError = true;
        const text = model.getLineContent(errorInfo.line);
        errorInfo.end = text.length;
        setErrorOnModel(model, errorInfo.line, errorInfo.start, errorInfo.end, hasError.startsWith('onl') ? hasError : `Not found dependence: ${hasError}`, monaco.MarkerSeverity.Error)

        mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'left');
        mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'right');
    }


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
