/// <mls shortName="contentAccordion" project="100554" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'

@customElement('content-accordion-100554')
export class ContentAccordion extends CollabLitElement {

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
            <div class="accordion">
                ${this.navItems.map((item, i) => {
                    const content = this.contentItems[i];
                    return html`
                    <nav-item class="header" ?selected=${this.selectedIndex === i} @click=${() => this.toggle(i)}>
                        ${item.innerHTML}
                    </nav-item>
                    <content-item class="content" ?open=${this.selectedIndex === i}>
                        ${unsafeHTML(content?.innerHTML)}
                    </content-item>
                `;
                })}
            </div>
        `;
    }


    private toggle(index: number) {
        this.selectedIndex = this.selectedIndex === index ? -1 : index;
    }

}