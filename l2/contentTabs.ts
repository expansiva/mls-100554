/// <mls shortName="contentTabs" project="100554" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

@customElement('content-tabs-100554')
export class ContentTabs extends CollabLitElement {

    private navItems: HTMLElement[] = [];
    private contentItems: HTMLElement[] = [];
    @property({ type: Number, reflect: true }) selectedIndex = 0;

    connectedCallback() {
        super.connectedCallback();
        const div = document.createElement('div');
        div.innerHTML = this.innerHTML;
        this.innerHTML = ''; 
        this.navItems = Array.from(div.querySelectorAll('nav-item'));
        this.contentItems = Array.from(div.querySelectorAll('content-item'));
        
    } 

    render() {
        return html`
            ${this.renderNav()}
            ${this.renderContent()}
        `;
    }

    renderNav() {

        if (this.navItems.length === 0) return '';

        return html`
        <nav>
            ${this.navItems.map(
            (item, i) => html`
                <nav-item class="tab" ?selected=${this.selectedIndex === i} @click=${() => this.handleSelect(i)} >
                    ${item.innerHTML}
                </nav-item>
            `
        )}
        </nav>
        `

    }

    renderContent() {

        if (this.contentItems.length === 0) return '';

        return html`
        <section>
        ${this.contentItems.map(
            (content, i) => html`
            <content-item class="content" ?active=${this.selectedIndex === i}>
              ${unsafeHTML(content.innerHTML)}
            </content-item>
          `
        )}
      </section>
        `

    }

    private handleSelect(index: number) {
        this.selectedIndex = index;
    }
}
