/// <mls shortName="wcdPopupItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wcd-popup-item-100554')
export class WCDPopupItem extends LitElement {

    constructor() {
        super();
    }

  static styles = css`
    :host {
      display: inline-block;
      padding: 8px 12px;
      background-color: #333;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    :host(:hover) {
      background-color: #444;
    }
  `;

  // Default onClick handler, should be overridden by child classes
  handleClick() {
    console.log(`wcd popup click not implemented`);
  }

  render() {
    return html`
      <div @click=${this.handleClick}>
        ?
      </div>
    `;
  }
}

