/// <mls shortName="mlsStartL2" project="100554" enhancement="_100541_enhancementLit" />

import { html, unsafeHTML, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('mls-start-l2-100554')
export class MLSStartL2 extends LitElement {

  @property({ type: String }) html: string | null = null;
  @property({ type: Boolean }) loading: boolean = true;
  @property({ type: String }) msize: string | null = null;

  @query('#l2check') check: HTMLInputElement;

  static get styles() {
    return css`
      :host {
        display:block;
        overflow: auto;
      }
    `;
  }
  
  private state: boolean[] = [];
  private getData() {
    let data: boolean[] = [true, true, true, true, true, true, true, true]
    const dataStr = localStorage.getItem('collabcodes-showstart');
    if (dataStr) data = JSON.parse(dataStr);
    this.state = data;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.getData();
    await this.getHTMLFile();
    this.loading = false;
    this.requestUpdate(); // Trigger a re-render
  }

  async getHTMLFile() {

    const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL2', '', '.html');
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
  changeStatusService() {
    this.state[2] = this.check.checked;
    localStorage.setItem('collabcodes-showstart', JSON.stringify(this.state));
  }

  render() {

    console.info(this.state[2])
    return html`
      <div>
        ${this.loading
        ? html`<p>Loading...</p>`
        : html`
        <div>
          <input
            id="l2check"
            type="checkbox"
            .checked=${(this.state[2])} 
            @change="${this.changeStatusService}">
          </input> Mostrar este service na primeira vez que entrar neste módulo </div>
        <div>${unsafeHTML(this.html)}</div>
        `}
      </div>
    `;
  }
}
