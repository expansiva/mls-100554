/// <mls shortName="wcdToolboxItemActionEditText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement} from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { initWcdPopup } from './_100554_wcdPopup';
import { WCDPopupMethodos } from './_100554_wcdTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';


@customElement('wcd-toolbox-item-action-edit-text-100554')
export class WCDToolboxItemActionEditText extends WcdToolboxItemBase {

    public args: string | undefined;

    private myInfos = { tp: "", attr: "text", x: undefined, y:undefined  }


    constructor() {
        super();
        initWcdPopup();
    }

    //-------COMPONENT---------------------

    createRenderRoot() {
        return this;
    }

    disconnectedCallback() {

        if (this.elMain) this.elMain.style.visibility = '';
        this.fireChange();
        super.disconnectedCallback();
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elMain || !this.myParent) return;

    }

    render() {

        if (this.args) {

            try {
                const i = JSON.parse(this.args);
                if (i.tp) this.myInfos.tp = i.tp;
                if (i.attr) this.myInfos.attr = i.attr;
                if (i.x) this.myInfos.x = i.x;
                if (i.y) this.myInfos.y = i.y;
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

        if (!this.elICA || !this.myParent || !this.elICA.widget) return;

        this.style.left = '0';
        this.style.background = '#fff';

        const ref = this.elICA.querySelector(this.elICA.widget);
        if (ref) this.elMain = ref as HTMLElement;

        if (!this.elMain) return;

        const el = (this.elMain.shadowRoot ? this.elMain.shadowRoot.children[0] : this.elMain.children[0]) as HTMLElement;

        if (!el) return html`Not found element`;


        const css = 'outline:none; position:relative; min-width:20px';

        this.myParent.fcBeforeBackButton = this.backButton.bind(this);

        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.style.outline = 'none';

        this.firstText = el.innerHTML;
        this.myText = el.innerHTML;

        this.myTag = el.tagName;
        this.firstTag = el.tagName;

        if(this.myText !== '') this.style.top = '1px';

        this.elMain.style.visibility = 'hidden';

        const ret = html`<div id="edittextwcd"  @keydown="${this.onkeyDown}" @mouseup="${this.mouseUP}" @input="${this.onInput}" style="${css}">${unsafeHTML(el.outerHTML)}
            </div>
            <style>
                #edittextwcd *{
                    
                }
            </style>
        `;

        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
        el.style.outline = '';

        setTimeout(() => {
            const el = this.querySelector('*[contenteditable]') as HTMLElement;
            if (!el) return;
            el.focus();
            this.setCaret();
        }, 500);

        return ret;
    }



    //---------IMPLEMENTATION-----------------

    private firstText = '';
    private firstTag = '';
    private myTag = '';
    private myText = '';

    private setCaret(): void {

        if (this.myInfos.x === undefined || this.myInfos.y === undefined) return;
        const range = document.caretRangeFromPoint(this.myInfos.x, this.myInfos.y);
        const selection = window.getSelection();

        if (!selection || !range) return;

        selection.removeAllRanges();
        selection.addRange(range);

    }

    private fireChange(): void {

        if ((this.myText !== this.firstText) || (this.myTag !== this.firstTag)) {
            if (!this.elICA ) return;
            let aux = '';
            const lang = (document.documentElement.lang || '').toLowerCase();
            if (this.elICA.globalVariation && this.elICA.globalVariation > 0 && lang !== '') aux = '-' + lang;
            this.elICA.setAttribute(this.myInfos.attr + aux, this.myText);
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

        const edit = this.querySelector('#edittextwcd');
        if (!edit) return;

        const el = this.querySelector('*[contenteditable]') as HTMLElement;
        if (!el) return;

        this.myTag = tp;
        const newElement = document.createElement(tp);
        newElement.innerHTML = el.innerHTML;
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
            
        },100)

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

        if (!me || !this.elMain || !this.myParent) return;

        const el = (this.elMain.shadowRoot ? this.elMain.shadowRoot.children[0] : this.elMain.children[0]) as HTMLElement;

        el.innerHTML = me.innerHTML as string;
        this.myText = el.innerHTML as string;
    }

    private onkeyDown(e: any) {


        if (!this.myParent || !this.elMain) return;

        if(['Enter', 'Backspace', 'Delete', 'c', 'v', 'ArrowLeft', 'ArrowRight'].includes(e.key)){
            e.stopPropagation();
        } 

    }

    private clickButton(e: MouseEvent, tp:string = 'btn') {

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
                    args: '{'+aux+'}',
                    position: 'p-l1',
                    toolboxOptions: { background: '#fff' }
                },

            ],
            false,
            'size'
        )

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



    }


    private backButton() {

        if (!this.myInfos.attr || !this.elICA) return;
        if (this.myText === this.firstText) return;

        this.fireChange();

        this.firstText = this.myText;

    }
}