/// <mls shortName="collabShowCodeSnippet" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('collab-show-code-snippet-100554')
export class SimpleGreeting extends LitElement {

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
      <pre class="theme-vs2015-min"><code class="code">${this.code}</code></pre>
    `;
    }
}
