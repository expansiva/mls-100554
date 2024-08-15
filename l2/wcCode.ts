/// <mls shortName="wcCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaApresentationTextCodeBase } from './_100554_icaApresentationTextCodeBase';


@customElement('wc-code-100554')
export class WcCode100554 extends IcaApresentationTextCodeBase {

    @property({ type: String, reflect: true }) language = 'typescript';

    @property({ type: Array }) languages = [];

    @property({ type: String, reflect: true }) text = '';

    @query('.code') codeBlock: HTMLElement | undefined;
    @query('select') select: HTMLSelectElement | undefined;

    updated(changedProperties: Map<string | number | symbol, unknown>) {

        if (changedProperties.has('language')) {
            if (!(window as any).hljsLoaded) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
                script.onload = () => {
                    (window as any).hljsLoaded = true;
                    this.setCode();
                };
                document.head.appendChild(script);
            } else {
                this.setCode();
            }
        }

        if (changedProperties.has('text')) {
            if (!this.codeBlock) return;
            this.waitForLoadIfNeeded(() => {
                this.setCode();
            });
        }

        if (changedProperties.has('languages')) {
            if (this.select) this.select.value = this.language;
        }

    }

    private waitForLoadIfNeeded(callback: () => void, timeout: number = 10000, interval: number = 100) {
        let elapsedTime = 0;
        const checkVariable = () => {
            if ((window as any).hljsLoaded) {
                callback();
            } else if (elapsedTime < timeout) {
                elapsedTime += interval;
                setTimeout(checkVariable, interval);
            } else {
                console.error(`Error on load highlight.js. please try again`);
            }
        };
        checkVariable();
    }


    setCode() {

        if (!this.codeBlock) return;
        this.codeBlock.innerHTML = '';
        this.codeBlock.removeAttribute('data-highlighted');
        this.codeBlock.classList.add('language-' + this.language);
        const that = this;
        this.waitForLoadIfNeeded(() => {
            if (!that.codeBlock) return;
            (window as any).hljs.configure({ ignoreUnescapedHTML: true });
            that.languages = (window as any).hljs.listLanguages();
            const res = (window as any).hljs.highlight(this.text, { language: that.language });
            that.codeBlock.removeAttribute("data-highlighted");
            (window as any).hljs.highlightElement(that.codeBlock, { language: that.language });
            that.codeBlock.innerHTML = res.value;
        });

    }

    firstUpdated() {
        this.setCode();
    }

    render() {
        return html`
        
       <pre>
            <select style="display:none;" .value=${this.language} @change=${(e:MouseEvent) => { this.onChangeLanguage(e) }}>
                ${this.languages.map((lang) => {
                    return html`<option value=${lang}>${lang}</option>`
                })}
            </select>
            <code class="code" contenteditable="false" spellcheck="false" @input=${this.onChangeText}></code>
       </pre>
    `;
    }

    private onChangeLanguage(e:MouseEvent) {
        const target = e.target as HTMLSelectElement;
        const value = target.value;
        this.language = value;        
    }

    private onChangeText(e: KeyboardEvent) {
        const target = e.target as HTMLElement;
        const val = target.textContent;

        const that = this;

        function setCursorToEnd(el: HTMLElement) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            if (!selection) return;
            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.waitForLoadIfNeeded(() => {
            if (!that.codeBlock) return;
            const res = (window as any).hljs.highlight(val, { language: that.language });
            that.codeBlock.removeAttribute("data-highlighted");
            (window as any).hljs.highlightElement(that.codeBlock, { language: that.language });
            that.codeBlock.innerHTML = res.value;
            setCursorToEnd(that.codeBlock);
        });
    }

    static styles = css`

    pre{
        position:relative;
    }
    pre select {
        position:absolute;
        top:62px;
        left:5px;
        border: none;
        outline:none;
    }
    pre code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em
      }
      code.hljs {
        padding: 3px 5px
      }
      /*
      * Visual Studio 2015 dark style
      * Author: Nicolas LLOBERA <nllobera@gmail.com>
      */
      .hljs {
        background: #fff;
        border: 1px solid var(--grey-color);
        color: #000;
        outline:none;
      }
      .hljs-keyword,
      .hljs-literal,
      .hljs-symbol,
      .hljs-name {
        color: #569CD6
      }
      .hljs-link {
        color: #569CD6;
        text-decoration: underline
      }
      .hljs-built_in,
      .hljs-type {
        color: #4EC9B0
      }
      .hljs-number,
      .hljs-class {
        color: #B8D7A3
      }
      .hljs-string,
      .hljs-meta .hljs-string {
        color: #D69D85
      }
      .hljs-regexp,
      .hljs-template-tag {
        color: #9A5334
      }
      .hljs-subst,
      .hljs-function,
      .hljs-title,
      .hljs-params,
      .hljs-formula {
        color: #DCDCDC
      }
      .hljs-comment,
      .hljs-quote {
        color: #57A64A;
        font-style: italic
      }
      .hljs-doctag {
        color: #608B4E
      }
      .hljs-meta,
      .hljs-meta .hljs-keyword,
      .hljs-tag {
        color: #9B9B9B
      }
      .hljs-variable,
      .hljs-template-variable {
        color: #BD63C5
      }
      .hljs-attr,
      .hljs-attribute {
        color: #9CDCFE
      }
      .hljs-section {
        color: gold
      }
      .hljs-emphasis {
        font-style: italic
      }
      .hljs-strong {
        font-weight: bold
      }
      /*.hljs-code {
        font-family:'Monospace';
      }*/
      .hljs-bullet,
      .hljs-selector-tag,
      .hljs-selector-id,
      .hljs-selector-class,
      .hljs-selector-attr,
      .hljs-selector-pseudo {
        color: #D7BA7D
      }
      .hljs-addition {
        background-color: #144212;
        display: inline-block;
        width: 100%
      }
      .hljs-deletion {
        background-color: #600;
        display: inline-block;
        width: 100%
      }
      pre {
        margin: 0;
      }
      .actions{
        height:30px; 
        background: #b4b4b4; 
        display:flex; 
        align-items:center;
        padding:0 1rem; 
        color:#fff;
        .actions-list{
          display:flex;
          gap:1rem;
        }
      }
      .language {
        flex:1;
      }
      
      .action-item{
        display:flex; 
        align-items:center;
        justify-content: center;
        cursor:pointer;
        min-width: 70px;
      }
      .accepted{
        cursor:default;
      }
      .copied {
        cursor:default;
      }
    `;

}