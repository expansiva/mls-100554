/// <mls shortName="wcdPopupItemSeparator" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from '/_100554_/l2/wcdPopupItem.js'

@customElement('wcd-popup-item-separator-100554')
export class WCDPopupItemSeparator extends WCDPopupItem {

static styles = css`
    :host {
      display: inline-block;
      width: 1px;
      height: 22px;
      background-color: rgba(255, 255, 255, 0.3); /* Cor da linha separadora */
      margin: 0 8px; /* Espaçamento à esquerda e à direita da linha */
      vertical-align: middle;
    }
  `;

  render() {
    return html`<div></div>`;
  }
  
}