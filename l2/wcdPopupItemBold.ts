/// <mls shortName="wcdPopupItemBold" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from '/_100554_/l2/wcdPopupItem.js'

@customElement('wcd-popup-item-bold-100554')
export class WCDPopupItemBold extends WCDPopupItem {

  getSvg(): TemplateResult {
    return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="18" font-weight="bold">B</text>
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
    // execCommand is obsolete, but still in use , ref: https://stackoverflow.com/questions/60581285/execcommand-is-now-obsolete-whats-the-alternative
    document.execCommand('bold', false);
  }
}
