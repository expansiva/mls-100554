/// <mls shortName="collabShowCodeSnippet" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { collab_check, collab_copy, collab_double_check } from './_100554_collabIcons'
import { CollabLitElement } from './_100554_collabLitElement';

export function initCollabShowCodeSnippet100554() {
  return true;
}
/// **collab_i18n_start**
const message_pt = {
  copy: 'Copiar',
  copied: 'Copiado',
  accept: 'Aceitar',
  accepted: 'Aceito'
}

const message_en = {
  copy: 'Copy',
  copied: 'Copied',
  accept: 'Accept',
  accepted: 'Accepted'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en-us': message_en,
  'pt-br': message_pt
}
/// **collab_i18n_end**

@customElement('collab-show-code-snippet-100554')
export class CollabShowCodeSnippet100554 extends CollabLitElement {

  private msg: MessageType = messages['en-us'];

  @property({ type: String, reflect: true }) language = 'typescript';

  @property({ type: Boolean, reflect: true }) withCopy = true;

  @property({ type: Boolean, reflect: true }) withAccept = false;

  @property({ type: Boolean }) coping = false;

  @property({ type: Boolean }) accepting = false;

  @query('.code')
  codeBlock: HTMLElement | undefined

  text = ``;

  onAccept: Function | undefined = () => { console.info('not implement') };

  set textIn(text: string) {
    this.text = text;
    if (!this.codeBlock) return;
    this.waitForLoadIfNeeded(() => {
      this.setCode();
    });
  }

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
        console.error(`Error on load highlight.js. please tyy again`);
      }
    };
    checkVariable();
  }


  setCode() {
    // const supportedLanguages = (window as any).hljs.listLanguages();
    if (!this.codeBlock) return;
    this.codeBlock.innerHTML = '';
    this.codeBlock.removeAttribute('data-highlighted');
    this.codeBlock.classList.add('language-' + this.language);
    const res = (window as any).hljs.highlight(this.text, { language: this.language });
    (window as any).hljs.highlightElement(this.codeBlock, { language: this.language });
    this.codeBlock.innerHTML = res.value;
  }

  private onCopyClick() {
    this.coping = true;
    navigator.clipboard.writeText(this.text)
    setTimeout(() => {
      this.coping = false;
    }, 3000)
  }

  private onAcceptClick() {
    if (this.onAccept && typeof this.onAccept === 'function') {
      this.accepting = true;
      this.onAccept();
      setTimeout(() => {
        this.accepting = false;
      }, 3000)
    }
  }

  render() {

    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
       <div class="actions">
            <span class="language">${this.language}</span>
            <div class="actions-list">
             ${this.withAccept ?
        this.renderWithAccept() : ''
      }
             ${this.withCopy ?
        this.renderWithCopy() : ''
      }
            </div>
       </div>

       <pre><code class="code"></code></pre>
    `;
  }

  private renderWithCopy() {
    return html`
      <div @click=${this.onCopyClick} class="action-item" style="display:${this.coping ? 'none' : 'flex'}">
        <div>
          ${collab_copy}
        </div>
        <span>${this.msg.copy}</span>
    </div>
    <div class="action-item copied" style="display:${this.coping ? 'flex' : 'none'}">
      ${collab_check}
      <span>${this.msg.copied}</span>
    </div>
    `
  }

  private renderWithAccept() {
    return html`
      <div @click=${this.onAcceptClick} class="action-item" style="display:${this.accepting ? 'none' : 'flex'}">
        <div>
          ${collab_check}
        </div>
        <span>${this.msg.accept}</span>
    </div>
    <div class="action-item accepted" style="display:${this.accepting ? 'flex' : 'none'}">
      ${collab_double_check}
      <span>${this.msg.accepted}Accepted</span>
    </div>
    `
  }

  static styles = css`
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
        background: #1E1E1E;
        color: #DCDCDC
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
