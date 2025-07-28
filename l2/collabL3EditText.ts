/// <mls shortName="collabL3EditText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { initState } from './_100554_collabState';
import './_100554_collabL3PreviewText';
import './_100554_collabL3PreviewTextAttr';
import './_100554_collabL3PreviewTextI18n';


@customElement('collab-l3-edit-text-100554')
export class CollabL3EditText extends CollabLitElement {

    @property({ type: Boolean }) dev: boolean = false ;
    @property({ type: Object }) target: HTMLElement | null = null;
    private json: IInfoEditLe | undefined;
    private baseTexti18n: string = '';

    private baseSearch = 'id';

    firstUpdated() {

        setTimeout(() => {
            if (!this.target) this.target = this.closest('body') as HTMLElement;
            this.getBaseI18n();
            this.json = this.process(this.target);
            this.initState(this.json);
            this.addEls(this.json);
            console.log(this.json);
        }, 200)

    }

    render() {
        if (this.dev) return html`<button @click="${this.save}">Save</button>`;
        return html``;
    }

    //--------IMPLEMENTS---------

    private getBaseI18n() {

        const info = (top as any)?.mls.actual[2].left
        if (!info) return;

        const models = (top as any)?.mls.editor.getModels(info.project, info.shortName);
        if (!models || !models.ts) return;

        const allTxt = models.ts.model.getValue() as string;
        const idxStart = allTxt.indexOf('/// **collab_i18n_start**');
        if (idxStart < 0) return;

        let txt = allTxt.substring(idxStart, allTxt.length);
        const idxEnd = txt.indexOf('/// **collab_i18n_end**');

        txt = txt.substring(0, idxEnd);

        this.baseTexti18n = txt;

    }

    private process(root: HTMLElement): IInfoEditLe {
        const inner: Record<string, { old_v: string, new_v: string, ori: string, textNode: Text, tag: string }> = {};
        const attr: Record<string, { old_v: string, new_v: string, attr: string, ori: string, textNode: Text }> = {};
        const i18n: Record<string, { key: string, old_v: string, new_v: string, textNode: Text[] }> = {};

        const isWrapper = (el: Element | null) =>
            el?.tagName?.toLowerCase() === 'collab-l3-preview-text' ||
            el?.tagName?.toLowerCase() === 'collab-l3-preview-text-attr';

        const traverse = (node: HTMLElement) => {
            if (isWrapper(node)) return;

            const elOri = node.closest('*['+this.baseSearch+']') as HTMLElement;
            const ori = elOri ? elOri.getAttribute(this.baseSearch) as string : '';

            if (!elOri) {
                Array.from(node.children).forEach((child) => {
                    if (child instanceof HTMLElement) {
                        traverse(child);
                    }
                });
            }

            // Nó de texto simples ou dinâmico
            node.childNodes.forEach((childNode, index) => {

                const vl = node.textContent?.trim() || '';
                if (childNode.nodeType !== Node.TEXT_NODE || !vl) return;

                const textContent = childNode.textContent || '';
                if (!textContent.trim()) return;
                const prev = childNode.previousSibling;
                const isLitDynamic = prev && prev.nodeType === Node.COMMENT_NODE && prev.nodeValue?.startsWith('?lit$');

                if (isLitDynamic) {
                    let searchPos = 0;
                    let idx = -1;
                    let varName = 'unknown';
                    let keyName = 'unknown_key';

                    while (true) {
                        idx = this.baseTexti18n.indexOf(textContent, searchPos);
                        if (idx === -1) break;

                        // Confirma se está entre aspas corretamente
                        const charBefore = this.baseTexti18n[idx - 1];
                        const charAfter = this.baseTexti18n[idx + textContent.length];
                        const validQuotes = [`'`, `"`];

                        if (validQuotes.includes(charBefore) && validQuotes.includes(charAfter) && charBefore === charAfter) {
                            // Encontrar '{' anterior
                            const braceStart = this.baseTexti18n.lastIndexOf('{', idx);
                            // Encontrar '=' anterior ao '{'
                            const equalIndex = this.baseTexti18n.lastIndexOf('=', braceStart);
                            const varDecl = this.baseTexti18n.substring(0, equalIndex).trim();
                            const varNameMatch = /([a-zA-Z0-9_]+)\s*$/.exec(varDecl);
                            varName = varNameMatch ? varNameMatch[1] : 'unknown';

                            // Extrair chave do objeto antes do texto
                            const objSection = this.baseTexti18n.substring(braceStart, idx);
                            const keyMatch = objSection.match(/([a-zA-Z0-9_]+)\s*:\s*['"`][^'"`]*$/);
                            if (keyMatch) {
                                keyName = keyMatch[1];
                                break; // Achou ocorrência correta e chave válida
                            }
                        }

                        // Continua procurando
                        searchPos = idx + textContent.length;
                    }

                    if (idx !== -1) {
                        const i18nKey = `${varName}_${keyName}`;
                        if (!i18n[i18nKey]) {
                            i18n[i18nKey] = { key: keyName, old_v: textContent, new_v: textContent, textNode: [childNode as Text] };
                        } else {
                            i18n[i18nKey].textNode.push(childNode as Text);
                        }
                    }
                } else if (elOri && elOri.childNodes && elOri.childNodes[0].nodeType !== Node.COMMENT_NODE) {
                    // Texto simples (não dinâmico)
                    const tag = node.tagName.toLowerCase();
                    const key = tag + '_' + ori + '_' + index;
                    if (!inner[key]) {
                        inner[key] = { old_v: textContent, ori: `${this.baseSearch}="${ori}"`, new_v: textContent, textNode: childNode as Text, tag };
                    }
                }

            });


            // Atributos visíveis no DOM renderizado
            for (const attrName of node.getAttributeNames()) {
                if (['innertext', 'innerhtml', 'style', 'id', 'class', 'clb_id', this.baseSearch].includes(attrName.toLocaleLowerCase())) continue;

                const value = node.getAttribute(attrName);
                if (!value) continue;

                const tag = node.tagName.toLowerCase();
                const key = `${tag.replace(/\-/g, '_')}_${attrName}_${ori}`;

                // Procurar texto visível igual ao valor do atributo
                const matches: Text[] = [];
                node.querySelectorAll('*').forEach((child) => {
                    child.childNodes.forEach((n) => {
                        if (n.nodeType === Node.TEXT_NODE && n.textContent?.includes(value)) {
                            matches.push(n as Text);
                        }
                    });
                });

                if (matches.length > 0) {
                    matches.forEach((textNode) => {

                        attr[key] = { old_v: value, new_v: value, attr: attrName, ori: `${this.baseSearch}="${ori}"`, textNode: textNode };
                    });
                }
            }

            // Continua percorrendo a árvore
            Array.from(node.children).forEach((child) => {
                if (child instanceof HTMLElement) {
                    traverse(child);
                }
            });
        };

        traverse(root);

        return { i18n, inner, attr };
    }


    private initState(json: IInfoEditLe) {
        initState('collabl3edit', json);
    }

    private addEls(json: IInfoEditLe) {

        const inners = Object.keys(json.inner);
        inners.forEach((key) => {

            const inner = json.inner[key];
            const wrapper = document.createElement('collab-l3-preview-text-100554');
            wrapper.setAttribute('value', `{{ collabl3edit.inner.${key}.new_v }}`);
            wrapper.setAttribute('contenteditable', 'true');
            (wrapper as any).info = inner;

            // Substitui apenas o TextNode original
            inner.textNode.parentNode?.replaceChild(wrapper, inner.textNode);

        });

        const attrs = Object.keys(json.attr);
        attrs.forEach((key) => {

            const attr = json.attr[key];
            const wrapper = document.createElement('collab-l3-preview-text-attr-100554');
            wrapper.setAttribute('value', `{{ collabl3edit.attr.${key}.new_v }}`);
            wrapper.setAttribute('attr', attr.attr);

            (wrapper as any).info = attr;
            attr.textNode.parentNode?.replaceChild(wrapper, attr.textNode);

        });

        const i18ns = Object.keys(json.i18n);
        i18ns.forEach((key) => {

            const i18n = json.i18n[key];
            i18n.textNode.forEach((t) => {
                const wrapper = document.createElement('collab-l3-preview-text-i18n-100554');
                wrapper.setAttribute('value', `{{ collabl3edit.i18n.${key}.new_v }}`);
                (wrapper as any).info = i18n;
                t.parentNode?.replaceChild(wrapper, t);
            })
        });

    }

    public async save() {

        if (!this.json) return;

        const info = (top as any)?.mls.actual[2].left
        if (!info) return;

        const models = (top as any)?.mls.editor.getModels(info.project, info.shortName);
        if (!models || !models.ts) return;

        let edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];

        const inners = Object.keys(this.json.inner);
        for await (const key of inners) {
            const inner = this.json?.inner[key];

            if (!inner || (inner && inner.old_v === inner.new_v)) continue;

            const edt = await this.replaceValueAfterKeyWithUndo(models.ts.model, inner.ori, inner.old_v, inner.new_v);

            edits = [...edits, ...edt];
        }

        const attrs = Object.keys(this.json.attr);
        for await (const key of attrs) {
            const attr = this.json?.attr[key];

            if (!attr || (attr && attr.old_v === attr.new_v)) continue;

            const edt = await this.replaceAttributeValueWithUndo(models.ts.model, attr.ori, attr.old_v, attr.new_v);

            edits = [...edits, ...edt];
        }

        const i18ns = Object.keys(this.json.i18n);
        for await (const key of i18ns) {
            const i18n = this.json?.i18n[key];

            if (!i18n || (i18n && i18n.old_v === i18n.new_v)) continue;

            const edt = await this.replaceI18nValueWithUndo(models.ts.model, i18n.key, i18n.old_v, i18n.new_v);

            edits = [...edits, ...edt];
        }


        if (edits.length > 0) {
            models.ts.model.pushEditOperations([], edits, () => null);
            return true;
        } else {
            return false;
        }
    }

    private async replaceValueAfterKeyWithUndo(
        model: monaco.editor.ITextModel,
        key: string,
        oldValue: string,
        newValue: string,
        replaceOnlyFirst: boolean = true
    ): Promise<monaco.editor.IIdentifiedSingleEditOperation[]> {

        const fullText = model.getValue();
        const edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];
        let searchStartIndex = 0;


        let keyIndex = fullText.indexOf(key, searchStartIndex);
        while (keyIndex !== -1) {

            const afterKeyStart = keyIndex + key.length;
            const nextKeyIndex = fullText.indexOf(key, afterKeyStart);

            const afterKeyEnd = nextKeyIndex !== -1 ? nextKeyIndex : fullText.length;

            const afterKeyText = fullText.substring(afterKeyStart, afterKeyEnd);

            if (replaceOnlyFirst) {

                const oldValueIndex = afterKeyText.indexOf(oldValue);

                if (oldValueIndex !== -1) {
                    // Calcula índices absolutos no texto completo
                    const startIndex = afterKeyStart + oldValueIndex;
                    const endIndex = startIndex + oldValue.length;

                    // Converte para posição linha/coluna no Monaco
                    const startPos = model.getPositionAt(startIndex);
                    const endPos = model.getPositionAt(endIndex);

                    // Prepara operação de edição para substituir oldValue por newValue
                    edits.push({
                        range: new monaco.Range(
                            startPos.lineNumber,
                            startPos.column,
                            endPos.lineNumber,
                            endPos.column
                        ),
                        text: newValue,
                        forceMoveMarkers: true,
                    });
                }
            } else {
                // Substitui todas as ocorrências do oldValue após a key
                let relativeSearchIndex = 0;

                while (true) {
                    const oldValueIndex = afterKeyText.indexOf(oldValue, relativeSearchIndex);
                    if (oldValueIndex === -1) break;

                    const startIndex = afterKeyStart + oldValueIndex;
                    const endIndex = startIndex + oldValue.length;

                    const startPos = model.getPositionAt(startIndex);
                    const endPos = model.getPositionAt(endIndex);

                    edits.push({
                        range: new monaco.Range(
                            startPos.lineNumber,
                            startPos.column,
                            endPos.lineNumber,
                            endPos.column
                        ),
                        text: newValue,
                        forceMoveMarkers: true,
                    });

                    relativeSearchIndex = oldValueIndex + oldValue.length;
                }
            }
            searchStartIndex = afterKeyEnd;
            keyIndex = fullText.indexOf(key, searchStartIndex);
        }


        return edits;

    }

    private async replaceAttributeValueWithUndo(
        model: monaco.editor.ITextModel,
        key: string,
        oldValue: string,
        newValue: string,
        replaceOnlyFirst: boolean = true
    ): Promise<monaco.editor.IIdentifiedSingleEditOperation[]> {

        const fullText = model.getValue();
        const edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];

        let searchStartIndex = 0;
        let keyIndex = fullText.indexOf(key, searchStartIndex);

        while (keyIndex !== -1) {
            // Encontrar o caractere '<' antes da key
            const tagStartIndex = fullText.lastIndexOf('<', keyIndex);
            // Encontrar o caractere '>' depois da key
            const tagEndIndex = fullText.indexOf('>', keyIndex);

            if (tagStartIndex !== -1 && tagEndIndex !== -1 && tagEndIndex > tagStartIndex) {
                // Pegamos o conteúdo da tag inteira onde a key está
                const tagContent = fullText.substring(tagStartIndex, tagEndIndex + 1);

                if (replaceOnlyFirst) {
                    // Substitui somente a primeira ocorrência de oldValue dentro da tag
                    const relativeIndex = tagContent.indexOf(oldValue);
                    if (relativeIndex !== -1) {
                        const startIndex = tagStartIndex + relativeIndex;
                        const endIndex = startIndex + oldValue.length;

                        const startPos = model.getPositionAt(startIndex);
                        const endPos = model.getPositionAt(endIndex);

                        edits.push({
                            range: new monaco.Range(
                                startPos.lineNumber,
                                startPos.column,
                                endPos.lineNumber,
                                endPos.column
                            ),
                            text: newValue,
                            forceMoveMarkers: true,
                        });
                    }
                } else {
                    // Substitui todas as ocorrências de oldValue dentro da tag
                    let offset = 0;
                    while (true) {
                        const relativeIndex = tagContent.indexOf(oldValue, offset);
                        if (relativeIndex === -1) break;

                        const startIndex = tagStartIndex + relativeIndex;
                        const endIndex = startIndex + oldValue.length;

                        const startPos = model.getPositionAt(startIndex);
                        const endPos = model.getPositionAt(endIndex);

                        edits.push({
                            range: new monaco.Range(
                                startPos.lineNumber,
                                startPos.column,
                                endPos.lineNumber,
                                endPos.column
                            ),
                            text: newValue,
                            forceMoveMarkers: true,
                        });

                        offset = relativeIndex + oldValue.length;
                    }
                }

                // Move o ponteiro de busca para depois do final da tag
                searchStartIndex = tagEndIndex + 1;
            } else {
                // Se não encontrou delimitadores de tag válidos, avança o ponteiro
                searchStartIndex = keyIndex + key.length;
            }

            keyIndex = fullText.indexOf(key, searchStartIndex);
        }

        return edits;
    }

    private async replaceI18nValueWithUndo(
        model: monaco.editor.ITextModel,
        key: string,
        oldValue: string,
        newValue: string,
        replaceOnlyFirst: boolean = true
    ): Promise<monaco.editor.IIdentifiedSingleEditOperation[]> {
        const fullText = model.getValue();
        const edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];

        const startMarker = '/// **collab_i18n_start**';
        const endMarker = '/// **collab_i18n_end**';

        let searchIndex = 0;

        while (true) {
            const blockStart = fullText.indexOf(startMarker, searchIndex);
            if (blockStart === -1) break;

            const blockEnd = fullText.indexOf(endMarker, blockStart);
            if (blockEnd === -1) break;

            const blockContent = fullText.substring(blockStart, blockEnd + endMarker.length);

            let offset = 0;
            while (true) {
                const oldIdx = blockContent.indexOf(oldValue, offset);
                if (oldIdx === -1) break;

                // Verifica se antes do oldValue há a chave correta
                const beforeValue = blockContent.substring(0, oldIdx);
                const keyPattern = new RegExp(`${key}\\s*:\\s*['"\`]?$`, 'm');
                if (keyPattern.test(beforeValue)) {
                    const startIndex = blockStart + oldIdx;
                    const endIndex = startIndex + oldValue.length;

                    const startPos = model.getPositionAt(startIndex);
                    const endPos = model.getPositionAt(endIndex);

                    edits.push({
                        range: new monaco.Range(
                            startPos.lineNumber,
                            startPos.column,
                            endPos.lineNumber,
                            endPos.column
                        ),
                        text: newValue,
                        forceMoveMarkers: true,
                    });

                    if (replaceOnlyFirst) break;
                }

                offset = oldIdx + oldValue.length;
            }

            if (replaceOnlyFirst && edits.length > 0) break;

            searchIndex = blockEnd + endMarker.length;
        }

        return edits;
    }

}

interface IInfoEditLe {
    i18n: Record<string, { key: string, old_v: string, new_v: string, textNode: Text[] }>,
    inner: Record<string, { old_v: string, new_v: string, ori: string, textNode: Text, tag: string }>,
    attr: Record<string, { old_v: string, new_v: string, attr: string, ori: string, textNode: Text }>
}