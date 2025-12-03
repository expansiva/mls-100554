/// <mls shortName="wcdPopupItemDropCap" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from '/_100554_/l2/wcdPopupItem.js'
import { globalWcd } from '/_100554_/l2/wcdState.js';

@customElement('wcd-popup-item-drop-cap-100554')
export class WCDPopupItemDropCap extends WCDPopupItem {

  getSvg(): TemplateResult {
    return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="16" font-size="12" font-weight="bold">T</text>
        <line x1="12" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="1"/>
        <line x1="12" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1"/>
        <line x1="12" y1="15" x2="20" y2="15" stroke="currentColor" stroke-width="1"/>
        <line x1="3" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="1"/>
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

    if (!globalWcd.elICA) throw new Error('Invalid wcdState.elICA');

    const wcdContent = globalWcd.myParent?.querySelector('#edittextwcd');
    if (!wcdContent) throw new Error('Invalid wcdContent id: #edittextwcd');

    globalWcd.elICA?.classList.toggle('dropcap');
    wcdContent.classList.toggle('dropcap');

  }

}