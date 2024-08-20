/// <mls shortName="wcdPopupItemH1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from './_100554_wcdPopupItem'

@customElement('wcd-popup-item-h1-100554')
export class WCDPopupItemH1 extends WCDPopupItem {

    getSvg(): TemplateResult {
        return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="18" font-weight="bold">H1</text>
      </svg>
    `;
    }

    render() {
        return html`
      <div @click=${this.handleClick} tabindex="-1">
      ${this.getSvg()}
      </div>
    `;
    }

    handleClick() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedElement = range.commonAncestorContainer;
            const parentElement = this.findParentParagraphOrHeading(selectedElement);
            if (parentElement) {
                if (parentElement.tagName === 'H1') {
                    const p = document.createElement('p');
                    p.innerHTML = parentElement.innerHTML;
                    parentElement.parentNode?.replaceChild(p, parentElement);
                } else if (parentElement.tagName === 'P') {
                    const h1 = document.createElement('h1');
                    h1.innerHTML = parentElement.innerHTML;
                    parentElement.parentNode?.replaceChild(h1, parentElement);
                }
            }
        }
    }

    findParentParagraphOrHeading(element: Node): HTMLElement | null {
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            const tagName = (element as HTMLElement).tagName;
            if (tagName === 'P' || tagName === 'H1') {
                return element as HTMLElement;
            }
            element = element.parentNode as Node;
        }
        return null;
    }
}
