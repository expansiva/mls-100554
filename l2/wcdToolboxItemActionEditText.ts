/// <mls shortName="wcdToolboxItemActionEditText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';
import { initWcdPopup } from '/_100554_/l2/wcdPopup.js';
import { WCDPopupMethodos } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate } from '/_100554_/l2/wcdCommandBase.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

@customElement('wcd-toolbox-item-action-edit-text-100554')
export class WCDToolboxItemActionEditText extends WcdToolboxItemBase {

    public args: string | undefined;

    private myInfos = { tp: "", attr: "text", x: undefined, y: undefined }

    private oldStyle:string  = '';

    constructor() {
        super();
        initWcdPopup();
    }

    //-------COMPONENT---------------------

    createRenderRoot() {
        return this;
    }

    disconnectedCallback() {
        if (this.elICA) {
            this.elICA.style.cssText = this.oldStyle;
            if (!this.oldStyle) this.elICA.removeAttribute('style');
        }
        this.fireChange();

        super.disconnectedCallback();
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elICA || !this.myParent) return;

    }

    render() {

        if (this.args) {

            try {
                const i = JSON.parse(this.args);
                if (i.tp) this.myInfos.tp = i.tp;
                if (i.attr) this.myInfos.attr = i.attr;
                if (i.x) this.myInfos.x = i.x;
                if (i.y) this.myInfos.y = i.y;

                if (!i.x || !i.y) {
                    const initialclick = this.myParent?.getAttribute('initialclick');
                    if (initialclick) {
                        const arrayinitialclick = initialclick.split(',');
                        this.myInfos.x = arrayinitialclick[0] ? +arrayinitialclick[0] : 0 as any;
                        this.myInfos.y = arrayinitialclick[1] ? +arrayinitialclick[1] : 0 as any;
                    }
                }

            } catch (e) {

            }

        }

        switch (this.myInfos.tp) {
            case 'edit':
                return this.renderEdit();
            case 'click':
                return this.renderClick();
            default: return this.renderButton();
        }

    }

    renderButton() {
        if (this.myParent) this.myParent.onclick = (e: any) => this.clickButton(e, 'click');
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;
    }

    renderClick() {

        if (this.myParent) this.myParent.onclick = (e: any) => this.clickButton(e, 'click');
        return html``;
    }

    renderEdit() {

        if (!this.elICA || !this.myParent  ) return;

        this.style.left = '0';

        const el = (this.elICA.shadowRoot ? this.elICA.shadowRoot.children[0] : this.elICA.children[0]) as HTMLElement;

        if (!el) return html`Not found element`;

        const css = 'outline:none; position:relative; min-width:20px;';

        this.myParent.fcBeforeBackButton = this.backButton.bind(this);

        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.style.outline = 'none';

        this.firstText = el.innerHTML;
        this.myText = el.innerHTML;

        this.myTag = el.tagName;
        this.firstTag = el.tagName;

        if (this.myText !== '') this.style.top = '1px';

        this.oldStyle = this.elICA.style.cssText;
        this.elICA.style.visibility = 'hidden';

        this.hasDropCap = this.elICA.classList.contains('dropcap');

        const ret = html`<div id="edittextwcd" class="${this.hasDropCap ? 'dropcap' : ''}" @keydown="${this.onkeyDown}" @mouseup="${this.mouseUP}" @input="${this.onInput}" style="${css}">${unsafeHTML(el.outerHTML)}
            </div>
            <style>
                #edittextwcd *{
                    
                }
                #edittextwcd.dropcap p::first-letter{
                    font-size: 3em;
                    font-weight: bold;
                    float: left;
                    line-height: 1;
                    margin-right: 0.1em;
                }
                #edittextwcd blockquote{
                    border-left: 3px solid var(--text-primary-color-darker);
                    padding-left: 20px;
                    margin-left: -23px;
                    padding-bottom: 2px;
                }
            </style>
        `;




        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
        el.style.outline = '';

        setTimeout(() => {
            const el1 = this.querySelector('*[contenteditable]') as HTMLElement;
            if (!el1) return;
            el1.focus({ preventScroll: true });
            this.setCaret();
        }, 100);
        
        return ret;

    }



    //---------IMPLEMENTATION-----------------

    private firstText = '';
    private firstTag = '';
    private myTag = '';
    private myText = '';
    private hasDropCap: boolean = false;

    private setCaret(): void {
    
        if (this.myInfos.x === undefined || this.myInfos.y === undefined || (this.myInfos.x === 0 && this.myInfos.y === 0)) return;
        const range = document.caretRangeFromPoint(this.myInfos.x, this.myInfos.y);
        const selection = window.getSelection();

        if (!selection || !range || range.endContainer.nodeName !== '#text') return;

        selection.removeAllRanges();
        selection.addRange(range);

    }

    private fireChange(): void {

        const edit = this.querySelector('#edittextwcd');
        const actualDropCap = edit?.classList.contains('dropcap');

        if ((this.myText !== this.firstText) || (this.myTag !== this.firstTag) || this.hasDropCap !== actualDropCap) {
            if (!this.elICA) return;
            let aux = '';
            const lang = (document.documentElement.lang || '').toLowerCase();
            if (this.elICA.globalVariation && this.elICA.globalVariation > 0 && lang !== '') aux = '-' + lang;
            this.elICA.setAttribute(this.myInfos.attr + aux, this.myText);
            this.elICA.setAttribute(this.myInfos.attr, this.myText);

            if (actualDropCap) this.elICA.classList.add('dropcap');
            else this.elICA.classList.remove('dropcap');
            dispatchEventConciliate();
        };

    }

    public changeType(tp: string) {

        if (!this.elICA) return;

        const oldTp = this.elICA.getAttribute('type');

        if (oldTp === tp.toLocaleLowerCase()) {
            this.elICA.setAttribute('type', 'p');
            this.changeInEditor('p');
        } else {
            this.changeInEditor(tp.toLocaleLowerCase());
            this.elICA.setAttribute('type', tp.toLocaleLowerCase());
        }


    }

    private changeInEditor(tp: string) {

        if (!this.elICA) return;

        const edit = this.querySelector('#edittextwcd');
        if (!edit) return;

        const el = this.querySelector('*[contenteditable]') as HTMLElement;
        if (!el) return;

        this.myTag = tp;
        const newElement = document.createElement(tp);
        newElement.innerHTML = this.elICA.getAttribute(this.myInfos.attr) as string;
        newElement.setAttribute('contenteditable', 'true');
        newElement.setAttribute('spellcheck', 'false');
        newElement.style.outline = 'none';

        edit.appendChild(newElement);

        this.moveSelectionToElement(newElement)

        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 0,
            clientY: 0
        });



        setTimeout(() => {

            newElement.dispatchEvent(mouseUpEvent);

        }, 100)

        el.remove();

        if (this.elICA && this.myParent) this.myParent.updateSize(this.elICA, this.myParent, true);
    }

    private moveSelectionToElement(newElement: HTMLElement) {

        const shadowSelection = this.getRootNode() as any;

        const selection = shadowSelection.getSelection() as any;


        if (selection.rangeCount > 0) {

            const range = selection.getRangeAt(0);

            const selectedText = range.toString();

            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            const newRange = document.createRange();

            const textNode = newElement.firstChild;

            if (!textNode) return;

            newRange.setStart(textNode, startOffset);
            newRange.setEnd(textNode, endOffset);

            const newSelection = shadowSelection.getSelection();
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);

        }

    }

    private onInput(e: MouseEvent) {
        
        e.stopPropagation();
        let me = e.target as HTMLElement;
        if (me.id !== 'edittextwcd') me = me.closest('#edittextwcd') as HTMLElement;

        me = me.querySelector('*[contenteditable]') as HTMLElement

        if (!me  || !this.myParent || !this.elICA) return;

        const parent = this.parentElement;
        const elAdd:HTMLElement | undefined = parent ? parent.querySelector('wcd-add-100554') as HTMLElement : undefined;

        if (elAdd && me.innerHTML !== '') elAdd.style.display = 'none';
        else if (elAdd) elAdd.style.display = '';
        
        this.myText = me.innerHTML as string;
    }

    private onkeyDown(e: any) {
        
        if (!this.myParent || !this.elICA) return;

        /*if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            document.execCommand('insertLineBreak');
        }*/

        if (e.shiftKey && e.key === 'Enter') {
            e.stopPropagation();
        }

        if (['c', 'v', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            this.removePopUpIfNeeded();
            e.stopPropagation();
        }

        if (!e.shiftKey && e.key === 'Delete') {
            this.removePopUpIfNeeded();
            e.stopPropagation();
        }

        if (!e.shiftKey && e.key === 'Backspace') {
            this.removePopUpIfNeeded();
            e.stopPropagation();
        }

        if (e.key === 'ArrowUp') {


            const ret = this.isCaretInFirstLine();
            if (!ret) {
                e.stopPropagation();
                this.removePopUpIfNeeded();
            }

        }

        if (e.key === 'ArrowDown') {

            const ret = this.isCaretInLastLine();
            if (!ret) {
                e.stopPropagation();
                this.removePopUpIfNeeded();
            }

        }

        if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            e.stopPropagation();
            return;
        }

        if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            this.mouseUP(e);
        }

    }

    private isCaretInFirstLine() {

        const contentEditableElement = this.querySelector('*[contenteditable]') as HTMLElement
        const shadowSelection = this.getRootNode() as any;
        const selection = shadowSelection.getSelection() as any;

        if (contentEditableElement.innerText === '') return true;

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();

            if (rects.length > 0) {
                const firstLineRect = contentEditableElement.getClientRects()[0];
                const caretRect = rects[0];

                return (caretRect.top - 5) <= firstLineRect.top;
            }
        }
        return false;
    }

    private isCaretInLastLine() {

        const contentEditableElement = this.querySelector('*[contenteditable]') as HTMLElement
        const shadowSelection = this.getRootNode() as any;
        const selection = shadowSelection.getSelection() as any;


        if (contentEditableElement.innerText === '') return true;

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();

            if (rects.length > 0) {
                const rectArray = Array.from(contentEditableElement.getClientRects());
                const lastLineRect = rectArray[rectArray.length - 1];
                const caretRect = rects[0];

                return (caretRect.bottom + 5) >= lastLineRect.bottom;
            }
        }
        return false;
    }

    private clickButton(e: MouseEvent, tp: string = 'btn') {

        e.stopPropagation();

        if (!this.myParent) return;

        let aux = '"tp":"edit", "attr": "' + this.myInfos.attr + '"';
        if (tp !== 'btn') aux = aux + `, "x":${e.x}, "y":${e.y}`;

        this.myParent.onclick = null;
        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: 'edit',
                    args: '{' + aux + '}',
                    position: 'p-l1',
                    toolboxOptions: { background: '#fff' }
                },

            ],
            false,
            'size'
        )

    }

    private removePopUpIfNeeded(): void {

        const existingDiv = this.querySelector('wcd-popup-100554');
        const shadowSelection = this.getRootNode() as any;
        const selection = shadowSelection.getSelection() as any;

        if ( selection.toString() === '' && existingDiv) {
            existingDiv.remove();
        }
    }

    private mouseUP(e: MouseEvent) {

        let click = e.target as HTMLElement;
        if (!click) return;

        if (click.tagName && click.tagName.toLocaleLowerCase() !== 'wcd-popup-100554') {
            click = click.closest('wcd-popup-100554') as HTMLElement;

            if (click && click.tagName && click.tagName.toLocaleLowerCase() === 'wcd-popup-100554') return;
        } else if (click.tagName && click.tagName.toLocaleLowerCase() === 'wcd-popup-100554') return;

        const existingDiv = this.querySelector('wcd-popup-100554');
        if (existingDiv) {
            existingDiv.remove();
        }

        const shadowSelection = this.getRootNode() as any;

        const selection = shadowSelection.getSelection() as any;

        let selectedText = '';

        if (selection.rangeCount <= 0) return

        const range = selection.getRangeAt(0);
        selectedText = range.toString();

        if (selectedText === '') return;

        const rects = range.getClientRects();

        const father = this.querySelector('#edittextwcd');
        if (!father) return;

        const newDiv = document.createElement('wcd-popup-100554') as WCDPopupMethodos;
        father.appendChild(newDiv);

        const rectFather = father.getBoundingClientRect();
        const firstLineRect = rects[0];

        const left = (firstLineRect.left - rectFather.left);
        const top = (firstLineRect.top - rectFather.top) - newDiv.offsetHeight;

        newDiv.setAttribute('x', (left).toString());
        newDiv.setAttribute('y', (top).toString());
        newDiv.myParent = this;

        newDiv.style.transform = 'translate(-50%, -100%)';

        setTimeout(() => {

            const isVisible = this.isElementVisible(newDiv);
            if (!isVisible.visibleLeft) newDiv.style.transform = 'translate(0%, -100%)';
            if (!isVisible.visibleRight) newDiv.style.transform = 'translate(-100%, -100%)';

        }, 100);

    }

    private isElementVisible(element: HTMLElement): { visibleLeft: boolean, visibleRight: boolean } {
        const rect = element.getBoundingClientRect();
        return {
            visibleLeft: rect.left >= 0,
            visibleRight: rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        }
            ;
    }


    private backButton() {

        if (!this.myInfos.attr || !this.elICA) return;
        if (this.myText === this.firstText) return;

        this.fireChange();

        this.firstText = this.myText;

    }
}