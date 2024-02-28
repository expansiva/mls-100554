/// <mls shortName="collabShowCodeSnippet" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('collab-show-code-snippet-100554')
export class CollabShowCodeSnippet100554 extends LitElement {

  @property({ type: String, reflect: true }) language = 'typescript';

  @property({ type: Boolean }) coping = false;

  @query('.code')
  codeBlock: HTMLElement | undefined

  text = '';

  set textIn(text: string) {
    this.text = text;
    if (!this.codeBlock) return;
    this.codeBlock.innerHTML = '';
    this.codeBlock.removeAttribute('data-highlighted');
    this.waitForLoadIfNeeded(() => {
      this.setCode();
    })
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

  render() {
    return html`
       <div class="actions">
            <span class="language">${this.language}</span>
            <div @click=${this.onCopyClick} class="cp copy" style="display:${this.coping ? 'none' : 'flex'}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>
              <span>Copy</span>
            </div>
            <div class="cp copied" style="display:${this.coping ? 'flex' : 'none'}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67375C18.5196 5.98487 18.6374 6.607 18.3262 7.06331L10.8262 18.0633C10.6585 18.3093 10.3898 18.4678 10.0934 18.4956C9.79688 18.5234 9.50345 18.4176 9.29289 18.2071L4.79289 13.7071C4.40237 13.3166 4.40237 12.6834 4.79289 12.2929C5.18342 11.9023 5.81658 11.9023 6.20711 12.2929L9.85368 15.9394L16.6738 5.93664C16.9849 5.48033 17.607 5.36263 18.0633 5.67375Z" fill="currentColor"></path></svg>
              <span>Copied</span>
            </div>

       </div>
       <pre><code class="code"></code></pre>
    `;
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
      }
      .language {
        flex:1;
      }
      .cp{
        display:flex; 
        align-items:center;
      }
      .copy {
        cursor:pointer;
      }
    `;

}
