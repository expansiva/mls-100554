/// <mls shortName="wcdPopupItemH1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from './_100554_wcdPopupItem'

@customElement('wcd-popup-item-h1-100554')
export class WCDPopupItemH1 extends WCDPopupItem {
    // this class is used by others files

    getSvg(): TemplateResult {
        return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="14" font-weight="bold">H1</text>
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

    public normalText = 'P';
    public headerText = 'H1';

    handleClick() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedElement = range.commonAncestorContainer;
            const parentElement = this.findParentParagraphOrHeading(selectedElement);
            if (parentElement) {
                if (parentElement.tagName === this.headerText) {
                    const p = document.createElement(this.normalText.toLowerCase());
                    p.innerHTML = parentElement.innerHTML;
                    parentElement.parentNode?.replaceChild(p, parentElement);
                } else if (parentElement.tagName === this.normalText) {
                    const header = document.createElement(this.headerText.toLowerCase());
                    header.innerHTML = parentElement.innerHTML;
                    parentElement.parentNode?.replaceChild(header, parentElement);
                }
            }
        }
    }

    findParentParagraphOrHeading(element: Node): HTMLElement | null {
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            const tagName = (element as HTMLElement).tagName;
            if (tagName === this.normalText || tagName === this.headerText) {
                return element as HTMLElement;
            }
            element = element.parentNode as Node;
        }
        return null;
    }
}
