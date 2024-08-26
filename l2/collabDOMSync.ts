/// <mls shortName="collabDOMSync" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function sync(model: monaco.editor.ITextModel, iframe: HTMLIFrameElement) {

    if (!model) return;

    const newHTMLOnlyICA = clearTree(iframe)
    const formatedNewHTML = formatHtml(newHTMLOnlyICA);
    const formatedOldHTML = formatHtml(model.getValue());

    const tempModel = monaco.editor.createModel('', 'html');

    const diffs = getDiffs(formatedOldHTML.split('\n'), formatedNewHTML.split('\n'));
    console.info(diffs);
    setValueInModeKeepingUndo(model, formatedNewHTML, false);
    applyDiffs(model, diffs);

}

function getDiffs(originalLines: string[], modifiedLines: string[]) {

    const diffs: IDiffs[] = [];

    originalLines.forEach((line, index) => {
        if (line !== modifiedLines[index]) {
            diffs.push({
                lineNumber: index + 1,
                originalLine: line,
                modifiedLine: modifiedLines[index]
            });
        }
    });

    return diffs;
}

function getDiffs2(originalModel: monaco.editor.ITextModel, modifiedModel: monaco.editor.ITextModel) {
    const originalLines = originalModel.getLinesContent();
    const modifiedLines = modifiedModel.getLinesContent();
    const diffs: IDiffs[] = [];

    originalLines.forEach((line, index) => {
        if (line !== modifiedLines[index]) {
            diffs.push({
                lineNumber: index + 1,
                originalLine: line,
                modifiedLine: modifiedLines[index]
            });
        }
    });

    return diffs;
}

function applyDiffs(originalModel: monaco.editor.ITextModel, diffs: IDiffs[]) {


    const editor = findEditorByModel(originalModel);
    console.info(editor);
    if (!editor) return;
    diffs.forEach(diff => {

        const lineContent = originalModel.getLineContent(diff.lineNumber);

        // originalModel.applyEdits([{
        //     range: new monaco.Range(diff.lineNumber, 1, diff.lineNumber, lineContent),
        //     text: diff.modifiedLine
        // }]);

        editor.executeEdits('my-source', [{
            range: new monaco.Range(diff.lineNumber, 1, diff.lineNumber, lineContent.length + 1),
            text: diff.modifiedLine,
            forceMoveMarkers: true
        }]);

        // originalModel.pushEditOperations([], [{
        //     range: new monaco.Range(diff.lineNumber, 1, diff.lineNumber, lineContent.length + 1),
        //     text: diff.modifiedLine
        // }], () => null);


    });
}

function findEditorByModel(model: monaco.editor.ITextModel): monaco.editor.ICodeEditor | null {
    const allEditors = monaco.editor.getEditors();
    let associatedEditor = null;
    allEditors.forEach((editor) => {
        if (editor.getModel() === model) {
            associatedEditor = editor;
        }
    });
    return associatedEditor;
}

function setValueInModeKeepingUndo(model: monaco.editor.ITextModel, val: string, checkFirstLine: boolean) {
    let fullRange = model.getFullModelRange();
    let newText = val;
    if (checkFirstLine && !(val.trim().startsWith('/// <mls shortName'))) {
        const firstLine = model.getLineContent(1);
        newText = firstLine + '\n' + newText;
    }
    const lines = newText.split('\n');
    const operations = [{
        range: fullRange,
        text: '',
        forceMoveMarkers: true
    }, {
        range: { startLineNumber: 1, startColumn: 1 },
        text: lines.join('\n'),
        forceMoveMarkers: true
    }];

    model.pushEditOperations([], operations as any, () => []);
}

function registerProvider() {
    monaco.languages.registerDocumentFormattingEditProvider('html', {
        provideDocumentFormattingEdits: (model) => {
            const value = model.getValue();
            const formattedValue = formatHtml(value);
            return [{
                range: model.getFullModelRange(),
                text: formattedValue
            }];
        }
    });

}

function formatHtml(html: string) {
    // Cria um container temporário para o HTML
    const container = document.createElement('div');
    container.innerHTML = html;

    // Função para formatar um nó e seus filhos
    function formatNode(node: any, indentLevel = 0) {
        const indent = '\t'.repeat(indentLevel); // Indentação para o nível atual usando tabulação
        const childIndent = '\t'.repeat(indentLevel + 1); // Indentação adicional para os atributos
        let formattedHtml = '';

        if (node.nodeType === Node.ELEMENT_NODE) {
            // Formatar tag de abertura
            formattedHtml += `${indent}<${node.nodeName.toLowerCase()}`;

            // Adicionar atributos formatados
            for (const attr of node.attributes) {
                formattedHtml += `\n${childIndent}${attr.name}="${attr.value}"`;
            }

            // Verificar se a tag é auto-fechada
            const isSelfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(node.nodeName.toLowerCase());
            if (node.children.length === 0 && isSelfClosing) {
                formattedHtml += ' />';
            } else {
                formattedHtml += '>';
                // Formatando filhos
                let childHtml = '';
                for (const child of node.childNodes) {
                    const childFormatted = formatNode(child, indentLevel + 1);
                    if (childFormatted) {
                        childHtml += `\n${childFormatted}`;
                    }
                }
                formattedHtml += childHtml;
                // Adicionar tag de fechamento
                formattedHtml += `\n${indent}</${node.nodeName.toLowerCase()}>`;
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            // Adicionar texto, removendo espaços em branco desnecessários
            const trimmedText = node.nodeValue.trim();
            if (trimmedText) {
                formattedHtml += trimmedText;
            }
        }
        return formattedHtml;
    }

    // Começa a formatação a partir do elemento raiz
    let result = formatNode(container.firstChild);

    // Remove linhas em branco desnecessárias
    result = result
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');

    return result;
}

function clearTree(iframe: HTMLIFrameElement): string {
    let ret = '';
    const div = document.createElement('div');
    const divRet = document.createElement('div');
    const body = iframe.contentDocument?.body
    if (!body) return ret;
    clearTree2(div, body as HTMLElement);
    clearTree3(divRet, div);
    return divRet.innerHTML;
}

function clearTree2(parent: HTMLElement, element: HTMLElement): HTMLElement {

    const tagname = element.tagName.toLowerCase();
    if (tagname.startsWith('ica-')) {

        const clone = element.cloneNode(false);
        const idEl = (clone as HTMLElement).id;
        (clone as HTMLElement).removeAttribute('idel');
        (clone as HTMLElement).removeAttribute('style');
        (clone as HTMLElement).removeAttribute('level');
        (clone as HTMLElement).removeAttribute('rendertype');
        if (idEl && idEl.startsWith('ica_')) (clone as HTMLElement).setAttribute('id', idEl.substring(4, idEl.length));

        parent.appendChild(clone);

        let children = [];
        if (element.shadowRoot) children = [...element.shadowRoot.children]
        else children = [...element.children]

        for (const child of children) {
            clearTree2(clone as HTMLElement, child as HTMLElement);
        }

    } else {

        let children = [];
        if (element.shadowRoot) children = [...element.shadowRoot.children]
        else children = [...element.children]
        for (const child of children) {
            clearTree2(parent, child as HTMLElement);
        }
    }
    return parent;
}

function clearTree3(parent: HTMLElement, element: HTMLElement) {

    let children = [...element.children];

    for (const child of children) {
        const tagname = child.tagName.toLowerCase();
        if (tagname.indexOf('-') > 0) {
            const clone = child.cloneNode(false);
            parent.appendChild(clone);
            clearTree3(clone as HTMLElement, child as HTMLElement);
        } else {
            clearTree3(parent, child as HTMLElement);
        }

    }
}


interface IDiffs {
    lineNumber: number,
    originalLine: string,
    modifiedLine: string
}
