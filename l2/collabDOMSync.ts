/// <mls shortName="collabDOMSync" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export function sync() {

    if (!window.preview.editor || !window.preview.iframe) return;
    const model = window.preview.editor.getModel();
    if (!model) return;
    const newHTMLOnlyICA = clearTree(window.preview.iframe)
    const formatedNewHTML = formatHtml(newHTMLOnlyICA);
    const formatedOldHTML = formatHtml(model.getValue());
    const formatedNewHTMLArr = formatedNewHTML.split('\n');
    const formatedOldHTMLArr = formatedOldHTML.split('\n');

    if (formatedNewHTMLArr.length === formatedOldHTMLArr.length) {
        const diffs = getDiffs(formatedOldHTMLArr, formatedNewHTMLArr);
        applyDiffs(model, diffs);
    } else {
        setValueInModeKeepingUndo2(model, formatedNewHTML);
    }
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

function applyDiffs(originalModel: monaco.editor.ITextModel, diffs: IDiffs[]) {

    const editor = window.preview.editor;
    if (!editor) throw new Error('No find editor');
    editor.setModel(originalModel);
    const edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];

    diffs.forEach(diff => {
        if (!diff.lineNumber) return;
        const lines = originalModel.getLineCount();
        let lineContent = 0;

        if (diff.lineNumber <= lines) lineContent = originalModel.getLineLength(diff.lineNumber);
        else lineContent = diff.modifiedLine?.length || 0;

        let range: monaco.Range;
        range = new monaco.Range(diff.lineNumber, 1, diff.lineNumber, lineContent + 1)
        const edit: monaco.editor.IIdentifiedSingleEditOperation = {
            range,
            text: diff.modifiedLine || '',
            forceMoveMarkers: true,
        }
        edits.push(edit);
    });

    editor.executeEdits('my-source', edits);

}

function setValueInModeKeepingUndo2(model: monaco.editor.ITextModel, newContent: string) {
    const editor = window.preview.editor;
    if (!editor)
        throw new Error('No find editor');

    editor.setModel(model);
    const lastLineNumber = model.getLineCount();
    const lastLineLength = model.getLineLength(lastLineNumber);
    const range = new monaco.Range(1, 1, lastLineNumber, lastLineLength + 1);
    editor.pushUndoStop();
    editor.executeEdits('userEdit', [{
        range: range,
        text: newContent
    }]);
    editor.pushUndoStop();
    editor.layout();
}


export function formatHtml(html: string) {

    const container = document.createElement('div');
    container.innerHTML = html.trim();

    function formatNode(node: any, indentLevel = 0) {
        const indent = '\t'.repeat(indentLevel);
        const childIndent = '\t'.repeat(indentLevel + 1);
        let formattedHtml = '';

        if (node.nodeType === Node.ELEMENT_NODE) {

            formattedHtml += `${indent}<${node.nodeName.toLowerCase()}`;
            for (const attr of node.attributes) {
                formattedHtml += `\n${childIndent}${attr.name}="${attr.value}"`;
            }

            const isSelfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(node.nodeName.toLowerCase());
            if (node.children.length === 0 && isSelfClosing) {
                formattedHtml += ' />';
            } else {
                formattedHtml += '>';
                let childHtml = '';
                for (const child of node.childNodes) {
                    const childFormatted = formatNode(child, indentLevel + 1);
                    if (childFormatted) {
                        childHtml += `\n${childFormatted}`;
                    }
                }
                formattedHtml += childHtml;
                formattedHtml += `\n${indent}</${node.nodeName.toLowerCase()}>`;
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            const trimmedText = node.nodeValue.trim();
            if (trimmedText) {
                formattedHtml += trimmedText;
            }
        }
        return formattedHtml;
    }

    let result = formatNode(container.firstChild);

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

    if (element && element.getAttribute('modeoverlay')) {
        const clone = element.cloneNode(false);
        (clone as HTMLElement).removeAttribute('style');
        (clone as HTMLElement).removeAttribute('level');
        parent.appendChild(clone);
        let children = [];
        if (element.shadowRoot) children = [...element.shadowRoot.children]
        else children = [...element.children]
        for (const child of children) {
            clearTree2(clone as HTMLElement, child as HTMLElement);
        }
    }

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
