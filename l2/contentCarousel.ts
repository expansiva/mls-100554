/// <mls shortName="contentCarousel" project="100554" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'

@customElement('content-carousel-100554')
export class ContentTabs extends CollabLitElement {

    private navItems: HTMLElement[] = [];
    private contentItems: HTMLElement[] = [];
    @property({ type: Number, reflect: true }) selectedIndex = 0;


    //------------------------------------------

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
            <div class="group">
                ${this.renderContent()}
                ${this.renderNav()}
            </div>
        `;
    }

    renderNav() {

        if (this.navItems.length === 0) return '';

        return html`
        <nav>
            <div class="contentTabNavList">
                <div class="contentTabNavList-itens">
                    ${this.navItems.map(
                        (item, i) => html`
                            <nav-item class="tab" ?selected=${this.selectedIndex === i} @click=${() => this.handleSelect(i)} >
                                ${item.innerHTML}
                            </nav-item>
                        `
                    )}
                </div>
                <div class="contentTabNavList-itens-nav">
                    <button @click=${this.handleClickPrevius}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
                    </button>
                    <button @click=${this.handleClickNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                    </button>
                </div>
            </div>
        </nav>
            
        `

    }

    renderContent() {

        if (this.contentItems.length === 0) return '';

        return html`
        <div class="sectionMain">
        ${this.contentItems.map(
            (content, i) => html`
            <content-item class="content" ?active=${this.selectedIndex === i}>
              ${unsafeHTML(content.innerHTML)}
            </content-item>
          `
        )}
      </div>
        `

    }

    //--------------------------------------
    private handleSelect(index: number) {
        this.selectedIndex = index;
    }

    private handleClickPrevius() {
        if (this.selectedIndex === 0) return;
        this.selectedIndex = this.selectedIndex - 1;
    }

    private handleClickNext() {
        if (this.selectedIndex === (this.navItems.length - 1)) return;
        this.selectedIndex = this.selectedIndex + 1;
    }
}