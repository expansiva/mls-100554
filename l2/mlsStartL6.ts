/// <mls shortName="mlsStartL6" project="100554" enhancement="_100554_enhancementVanilla" groupName="internal" />

export class MLSStartL6 extends HTMLElement {
    
    async getHTMLFile() {
        const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL6', '', '.html');
        const storFileHTML = mls.stor.files[key];
        let src: string | Blob;
        const info: mls.stor.IFileInfoValue | null = storFileHTML.getValueInfo ? await storFileHTML.getValueInfo() : null;
        const haveInfo: boolean = info && !!info.content;
        src = haveInfo ? info.content : await storFileHTML.getContent();
        return src;
    }

    connectedCallback() {
        this.render();
    }

    async render() {
        const src = await this.getHTMLFile() as string;
        return this.innerHTML = src;
    }
}

customElements.define('mls-start-l6-100554', MLSStartL6);

/* import { html, unsafeHTML, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mls-start-l6-100554')
export class MLSStartL6 extends LitElement {

    async getHTMLFile() {
        const key = mls.stor.getKeyToFiles(100554, 2, 'mlsStartL6', '', '.html');
        const storFileHTML = mls.stor.files[key];
        let src: string | Blob;
        const info: mls.stor.IFileInfoValue | null = storFileHTML.getValueInfo ? await storFileHTML.getValueInfo() : null;
        const haveInfo: boolean = info && !!info.content;
        src = haveInfo ? info.content : await storFileHTML.getContent();
        return src;
    }

    async render() {
        const src = await this.getHTMLFile() as string;
        return html`${unsafeHTML(src)}`;
    }
}
 */