/// <mls fileReference="_100554_/l2/collabDOMSync.ts" enhancement="_100554_enhancementLit" />

import {CollabLitElement} from '/_100554_/l2/collabLitElement.js'

export function sync() {

    if (!window.preview.editor || !window.preview.iframe) return;
    const model = window.preview.editor.getModel();
    if (!model) return;
    const newHTMLOnlyICA = clearTree(window.preview.iframe)
    const formatedNewHTML = formatHtml(newHTMLOnlyICA);
    setValueInModeKeepingUndo(model, formatedNewHTML);

}

export function updateHTML(html: string, format: boolean = true) {

    if (!window.preview.editor || !window.preview.iframe) return;
    const model = window.preview.editor.getModel();
    if (!model) return;
    const newHTMLOnlyICA = html
    const formatedNewHTML = format ? formatHtml(newHTMLOnlyICA) : newHTMLOnlyICA;
    setValueInModeKeepingUndo(model, formatedNewHTML);

}

export function setValueInModeKeepingUndo(model: monaco.editor.ITextModel, newContent: string) {
    const editor = window.preview.editor;
    if (!editor)
        throw new Error('No find editor');

    if (!newContent) throw new Error('New content is empty');
    
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
    const placeholders: string[] = [];

    const escapedBlockRegex = /(&lt;[^]+?&gt;)/g;
    const htmlWithPlaceholders = html.replace(escapedBlockRegex, (match) => {
        const key = `__ESCAPED_BLOCK_${placeholders.length}__`;
        placeholders.push(match);
        return key;
    });

    const container = document.createElement('div');
    container.innerHTML = htmlWithPlaceholders.trim();

    function formatNode(node: any, indentLevel = 0): string {

        const indent = '\t'.repeat(indentLevel);
        const childIndent = '\t'.repeat(indentLevel + 1);
        let formattedHtml = '';

        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.nodeName.toLowerCase();
            formattedHtml += `${indent}<${tagName}`;

            for (const attr of node.attributes) {
                let attrValue = attr.value.replace(/'/g, '"');
                formattedHtml += `\n${childIndent}${attr.name}='${attrValue}'`;
            }

            formattedHtml += '>';

            let childHtml = '';
            for (const child of node.childNodes) {
                const childFormatted = formatNode(child, indentLevel + 1);
                if (childFormatted) {
                    childHtml += `\n${childFormatted}`;
                }
            }
            formattedHtml += childHtml;
            formattedHtml += `\n${indent}</${tagName}>`;
        } else if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            if (text.trim()) {
                formattedHtml += indent + text.trim();
            }
        } else if (node.nodeType === Node.COMMENT_NODE) {
            formattedHtml += `${indent}<!-- ${node.nodeValue?.trim()} -->`;
        }

        return formattedHtml;
    }

    let result = Array.from(container.childNodes)
        .map((child) => formatNode(child))
        .filter(Boolean)
        .join('\n');

    result = result
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');

    for (let i = 0; i < placeholders.length; i++) {
        const key = `__ESCAPED_BLOCK_${i}__`;
        result = result.replace(key, placeholders[i].trim());
    }

    return result;
}

function clearTree(iframe: HTMLIFrameElement): string {
    let ret = '';

    //const div = document.createElement('div');
    const divRet = document.createElement('div');
    const body = iframe.contentDocument?.body
    if (!body) return ret;
    clearTree2(divRet, body as HTMLElement);
    //clearTree3(divRet, div);
    return divRet.innerHTML;
}

function clearTree2(parent: HTMLElement, element: HTMLElement): HTMLElement {

    /*const tagname = element.tagName.toLowerCase();

    if (element && element.getAttribute('modeoverlay')) {
        const clone = element.cloneNode(false);
        //(clone as HTMLElement).removeAttribute('style');
        (clone as HTMLElement).removeAttribute('ori');
        (clone as HTMLElement).removeAttribute('level');
        parent.appendChild(clone);
        let children = [];
        if (element.shadowRoot) children = [...element.shadowRoot.children]
        else children = [...element.children]
        for (const child of children) {
            clearTree2(clone as HTMLElement, child as HTMLElement);
        }
    }*/

    //if (tagname.startsWith('ica-')) {
    if (element.hasAttribute('mls_origin')) {
        const clone = element.cloneNode(false) as HTMLElement;
        const idEl = (clone as HTMLElement).id;
        (clone as HTMLElement).removeAttribute('idel');
        (clone as HTMLElement).removeAttribute('mls_origin');
        //(clone as HTMLElement).removeAttribute('style');
        (clone as HTMLElement).removeAttribute('level');
        (clone as HTMLElement).removeAttribute('rendertype');
        if (idEl && idEl.startsWith('ica_')) (clone as HTMLElement).setAttribute('id', idEl.substring(4, idEl.length));

        parent.appendChild(clone);

        const v = (element as CollabLitElement).globalVariation;
        if (v > 0 && (element as any).originalAttrs) {

            (element as any).originalAttrs.forEach((atr:any) => {

                if(atr.name.indexOf('-') < 0 && !!atr.value) clone.setAttribute(atr.name, atr.value);
                
            })
        
        }

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
