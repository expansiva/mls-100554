/// <mls shortName="wcdToolboxItemActionEditCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';

@customElement('wcd-toolbox-item-action-edit-code-100554')
export class WCDToolboxItemActionEditCode extends WcdToolboxItemBase {

    public args: string | undefined;

    private myInfos = { tp: "", attr: "text" }

    @query('#edittextwcd') contentEditables: HTMLElement | undefined;

    createRenderRoot() {
        return this;
    }

    disconnectedCallback() {
        if (this.elICA) this.elICA.style.visibility = '';
        this.fireChange();
        super.disconnectedCallback();
    }

    render() {
        if (this.args) {
            try {
                const i = JSON.parse(this.args);
                if (i.tp) this.myInfos.tp = i.tp;
                if (i.attr) this.myInfos.attr = i.attr;
            } catch (e) {
                throw new Error('Invalid args: ' + this.args);
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
        return html``;
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
        this.style.width = '100%;';
        const css = 'outline:none; position:relative; min-width:20px';
        this.text = this.elICA.getAttribute('text') || '';
        this.elICA.style.visibility = 'hidden';
        const ret = html`<pre style="white-space:pre-line;"><code id="edittextwcd" contenteditable="true" spellcheck="false" @keydown=${this.onKeyDown} style="${css}">${this.text}</code></pre>
            <style>
                #edittextwcd *{
                    margin:0px;
                    outline:none;
                }
            </style>
        `;

        setTimeout(() => {
            const el = this.querySelector('*[contenteditable]') as HTMLElement;
            if (!el) return;
            el.focus();
        }, 500);

        return ret;
    }

    private text = '';

    private onKeyDown(e: KeyboardEvent) {
        if (!this.myParent || !this.elICA) return;
        console.info(e)
        if ([ 'Backspace', 'c', 'v', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.stopPropagation();
        }

        if (e.shiftKey && e.key === 'Enter') {
            e.stopPropagation();
        }

        if (!this.contentEditables) return;
        const el = (this.elICA.shadowRoot ? this.elICA.shadowRoot.children[0] : this.elICA.children[0]) as HTMLElement;
        el.innerHTML = this.contentEditables.innerHTML + '<br><br><br>' as string;


    }

    private fireChange(): void {
        if (!this.elICA || !this.contentEditables) return;
        let aux = '';
        const lang = (document.documentElement.lang || '').toLowerCase();
        if ((this.elICA as any).globalVariation > 0 && lang !== '') aux = '-' + lang;
        const text = this.contentEditables?.textContent || '';
        this.elICA.setAttribute(this.myInfos.attr + aux, text);
        mls.events.fire([2], ['DOMSync'] as any);
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
                    name: 'edit-code',
                    args: '{"tp":"edit", "attr":"' + this.myInfos.attr + '"}',
                    position: 'p-l1',
                    toolboxOptions: { background: '#fff' }
                },

            ],
            false,
            'size'
        );


    }

    private backButton() {

    }

}