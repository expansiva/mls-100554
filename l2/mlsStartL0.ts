/// <mls shortName="mlsStartL0" project="100554" enhancement="_100541_enhancementLit" />

import { html, unsafeHTML, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mls-start-l0-100554')
export class MLSStartL0 extends LitElement {

    @property({ type: String }) html: string | null = null;
    @property({ type: Boolean }) loading: boolean = true;
    @property({ type: String }) msize: string | null = null;

    static get styles() {
        return css`
      :host {
        display:block;
        overflow: auto;;
      }
    `;
    }

  async connectedCallback() {
        super.connectedCallback();
        await this.getHTMLFile();
        this.loading = false;
        this.requestUpdate(); // Trigger a re-render
    }

  async getHTMLFile() {
    const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL0', '', '.html');
    const storFileHTML = mls.stor.files[key];
    const info: mls.stor.IFileInfoValue | null = storFileHTML.getValueInfo ? await storFileHTML.getValueInfo() : null;
    const src = info && info.content ? info.content as string : await storFileHTML.getContent();
    this.html = src as string;
  }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        if (name === 'msize') {
            const [width, height] = newVal.split(',');
            this.style.height = height + 'px';
        }
    }

  render() {
    return html`
      <div>
        ${this.loading
        ? html`<p>Loading...</p>`
        : html`
        <div>
          <mls-start-checkbox-100554 level="0"></mls-start-checkbox-100554>
        </div>
        <div>${unsafeHTML(this.html || '')}</div>
        `}
      </div>
    `;
  }
}

