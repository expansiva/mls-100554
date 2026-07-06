/// <mls fileReference="_100554_/l2/docMd.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';

@customElement('doc-md-100554')
export class DocMd extends CollabLitElement {

    
    @state() private _html = '';
    private _marked: any | undefined;
    private oriHtml: string | undefined;

    connectedCallback() {
        this.oriHtml = this.innerHTML;
        this.innerHTML = '';
        super.connectedCallback();
    }

    firstUpdated() {
        this.init();    
    }

    render() {
        return html`
            <div class="preview">${unsafeHTML(this._html)}</div>

        `;
    }


    private async _importMarked() {
        const url = 'https://cdn.jsdelivr.net/npm/marked@17.0.4/lib/marked.esm.js';
        const mod = await import(url);
        this._marked = mod.marked;
    
    }

    private async _parse() {
        if (!this._marked) return;
        this.style.display = '';
        this._html = await this._marked(this.oriHtml);
    }

    private async init() {
        
        await this._importMarked();
        this._parse()
    }
 
    
}