/// <mls shortName="mlsStartL1" project="100554" enhancement="_100541_enhancementLit" />

import { html, unsafeHTML, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mls-start-l1-100554')
export class MLSStartL1 extends LitElement {

  @property({ type: String }) html: string | null = null;
  @property({ type: Boolean }) loading: boolean = true;
  @property({ type: String }) msize: string | null = null;

  static get styles() {
    return css`
      :host {
        display:block;
        overflow: auto;
      
        padding: 0rem 3.5rem;
        font-family: 'Cambria', serif;
      }
      h1, h2, h3 ,h4 , h5, h6, h7 {
        letter-spacing: -0.011em;
      }
      ol > li , ul > li {
        margin-top:1em;
      }
      span, p {
          line-height: 32px;
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
    const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL1', '', '.html');
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
          <mls-start-checkbox-100554 level="1"></mls-start-checkbox-100554>
        </div>
        <div>${unsafeHTML(this.html || '')}</div>
        `}
      </div>
    `;
  }
}
