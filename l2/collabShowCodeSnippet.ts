/// <mls shortName="collabShowCodeSnippet" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('collab-show-code-snippet-100554')
export class SimpleGreeting extends LitElement {

    // createRenderRoot() {
    //     return this;
    // }

    static styles = css`pre code.hljs {
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
}`;
    
    @property({ type: String }) code = `const user: User = {
        name: "Hayes",
        id: 0,
        };`;

    updated() {
    
        // Carregar o script do Highlight.js apenas uma vez
        if (!(window as any).hljsLoaded) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
            script.onload = () => {
                this.setCode();
            };
            document.head.appendChild(script);
            (window as any).hljsLoaded = true;
        } else {
            // Destaque o código dentro do elemento com a classe "code"
            this.setCode();
        }
    }
    
    setCode() {
        if (!this.shadowRoot) return;
        const codeBlocks = this.shadowRoot.querySelectorAll('.code');
        codeBlocks.forEach(block => {
            (window as any).hljs.highlightElement(
                block,
                { language: 'typescript' }
            )
        });
    }

    render() {
        return html`
      <!-- Aqui você pode adicionar um código HTML com a classe "code" que será destacado -->
      <pre><code class="code">${this.code}</code></pre>
    `;
    }
}
