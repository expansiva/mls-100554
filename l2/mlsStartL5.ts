/// <mls shortName="mlsStartL5" project="100554" enhancement="_100541_enhancementLit" groupName="internal" />

import { html, unsafeHTML, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mls-start-l5-100554')
export class MLSStartL6 extends LitElement {

  @property({ type: String }) html: string | null = null;
  @property({ type: Boolean }) loading: boolean = true;
  @property({ type: String }) msize: string | null = null;

  static get styles() {
    return css`
      :host {
        display:block;
        overflow: auto;
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

    return 'l5';
    const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL5', '', '.html');
    const storFileHTML = mls.stor.files[key];
    let src: string | Blob;
    const info: mls.stor.IFileInfoValue | null = storFileHTML.getValueInfo ? await storFileHTML.getValueInfo() : null;
    const haveInfo: boolean = info && !!info.content;
    src = haveInfo ? info.content : await storFileHTML.getContent();
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
        : html`<div>${unsafeHTML(this.html)}</div>`}
      </div>
    `;


  }
}
