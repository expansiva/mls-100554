/// <mls shortName="wcdToolboxItemActionEditText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { initWcdPopup } from './_100554_wcdPopup';
import { WCDToolboxItemEditTextMethodos, WCDPopupMethodos } from './_100554_wcdTypes';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-toolbox-item-action-edit-text-100554')
export class WCDToolboxItemActionEditText extends WcdToolboxItemBase implements WCDToolboxItemEditTextMethodos {

    public myParent: WCDToolbox | undefined;
    public elMain: HTMLElement | undefined | any;
    public elICA: IcaLitElementBase | undefined | any;
    public args: string | undefined;

    private myInfos = { tp: "", attr: "text" }
    private myMsg: MessageType = messages['en'];


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
        if (this.myParent) this.myParent.onclick = (e: any) => this.clickButton(e);
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;
    }

    renderClick() {

        if (this.myParent) this.myParent.onclick = (e: any) => this.clickButton(e);
        return html``;
    }

    renderEdit() {

        if (!this.elICA || !this.myParent) return;

        this.style.left = '0';
        this.style.top = '0';
        this.style.background = '#fff';

        const ref = this.elICA.querySelector(this.elICA.widget);
        if (ref) this.elMain = ref;

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

        this.elMain.style.visibility = 'hidden';

        const ret = html`<div id="edittextwcd"  @keydown="${this.onkeyDown}" @mouseup="${this.mouseUP}" @input="${this.onInput}" style="${css}">${unsafeHTML(el.outerHTML)}
            </div>
            <style>
                #edittextwcd *{
                    margin:0px;
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
        }, 500);

        return ret;
    }



    //---------IMPLEMENTATION-----------------

    private firstText = '';
    private firstTag = '';
    private myTag = '';
    private myText = '';

    private fireChange(): void {

        if ((this.myText !== this.firstText) || (this.myTag !== this.firstTag)) {
            let aux = '';
            const lang = (document.documentElement.lang || '').toLowerCase();
            if (this.elICA.globalVariation > 0 && lang !== '') aux = '-' + lang;
            this.elICA.setAttribute(this.myInfos.attr + aux, this.myText);
            mls.events.fire([2], ['DOMSync'] as any);
        };

    }

    public changeType(tp: string) {

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
            bubbles: true, // Permite que o evento propague através do DOM
            cancelable: true, // Permite que o evento seja cancelado
            view: window, // Defina a janela para o evento
            clientX: 0, // Posição X do mouse
            clientY: 0 // Posição Y do mouse
        });


        
        setTimeout(() => {

            // Dispare o evento no elemento alvo
            newElement.dispatchEvent(mouseUpEvent);
            
        },500)

        el.remove();

        if (this.myParent) this.myParent.updateSize(this.elICA, this.myParent, true);
    }

    private moveSelectionToElement(newElement: HTMLElement) {

        const shadowSelection = this.getRootNode() as any;

        // Obter a seleção de texto
        const selection = shadowSelection.getSelection() as any;

        // Se há uma seleção no elemento com contentEditable
        if (selection.rangeCount > 0) {
            // Obtenha o range da seleção
            const range = selection.getRangeAt(0);

            // Obtenha o texto selecionado
            const selectedText = range.toString();

            // Obtenha a posição de início e fim da seleção no texto
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;

            // Agora vamos criar uma nova seleção no otherElement
            const newRange = document.createRange();

            // Achar o texto no otherElement e selecionar o mesmo texto
            const textNode = newElement.firstChild;

            if (!textNode) return;

            newRange.setStart(textNode, startOffset);
            newRange.setEnd(textNode, endOffset);

            // Limpa a seleção existente e adiciona a nova seleção
            const newSelection = shadowSelection.getSelection();
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);

        }

    }

    private onInput(e: MouseEvent) {
        e.stopPropagation();
        let me = e.target as HTMLElement;
        if (me.id !== 'edittextwcd') me = me.closest('#edittextwcd') as HTMLElement;

        if (!me || !this.elMain || !this.myParent) return;

        const el = (this.elMain.shadowRoot ? this.elMain.shadowRoot.children[0] : this.elMain.children[0]) as HTMLElement;

        el.innerText = me.innerText as string;
        this.myText = el.innerHTML as string;
    }

    private onkeyDown(e: any) {


        if (!this.myParent || !this.elMain) return;

        if (e.key === 'Enter') {
            e.stopPropagation();
            //e.preventDefault();
            //document.execCommand('insertText', false, '\n');
        } else if (e.key === 'Backspace') {
            e.stopPropagation();

        } else if (e.key === 'c') {
            e.stopPropagation();

        } else if (e.key === 'v') {
            e.stopPropagation();

        }

    }

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent) return;

        this.myParent.onclick = null;
        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: 'edit',
                    args: '{"tp":"edit", "attr":"' + this.myInfos.attr + '"}',
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

        // Obter a seleção de texto
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