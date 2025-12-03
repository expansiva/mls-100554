/// <mls shortName="wcdPopupItemLink" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from '/_100554_/l2/wcdPopupItem.js'

@customElement('wcd-popup-item-link-100554')
export class WCDPopupItemLink extends WCDPopupItem {

  getSvg(): TemplateResult {
    return svg`
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.59 13.41L13.42 10.59C13.79 10.22 13.79 9.61 13.42 9.24C13.05 8.87 12.44 8.87 12.07 9.24L9.24 12.07C8.87 12.44 8.87 13.05 9.24 13.42C9.61 13.79 10.22 13.79 10.59 13.41Z" />
        <path d="M19 10.25C19 6.95 16.55 4.5 13.25 4.5H12.58C12.03 4.5 11.67 5.15 12 5.64C12.22 5.96 12.55 6.25 13.25 6.25C15.32 6.25 17 7.93 17 10C17 12.07 15.32 13.75 13.25 13.75C12.55 13.75 12.22 14.04 12 14.36C11.67 14.85 12.03 15.5 12.58 15.5H13.25C16.55 15.5 19 13.05 19 9.75V10.25Z" />
        <path d="M4.75 14C4.75 17.3 7.2 19.75 10.5 19.75H11.17C11.72 19.75 12.08 19.1 11.75 18.61C11.53 18.29 11.2 18 10.5 18C8.43 18 6.75 16.32 6.75 14.25C6.75 12.18 8.43 10.5 10.5 10.5C11.2 10.5 11.53 10.21 11.75 9.89C12.08 9.4 11.72 8.75 11.17 8.75H10.5C7.2 8.75 4.75 11.2 4.75 14Z" />
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
        const url = prompt('Enter the URL:');
        if (url) document.execCommand('createlink', false, url)
        else document.execCommand('unlink', false)
    }
}