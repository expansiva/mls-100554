/// <mls shortName="wcdPopup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './_100554_wcdPopupItemBold';
import './_100554_wcdPopupItemItalic';
import './_100554_wcdPopupItemLink';
import './_100554_wcdPopupItemSeparator';
import './_100554_wcdPopupItemH1';

export function initWcdPopup(): boolean {
  return true;
}

@customElement('wcd-popup-100554')
export class WCDPopup extends LitElement {

  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: String }) buttons = '';

  static styles = css`
    :host {
      position: absolute;
      display: block;
      background-color: black;
      color: white;
      padding: 8px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      font-family: sans-serif;
      z-index: 1000;
    }
    .popup-content {
      display: flex;
      align-items: center;
    }
    ::slotted(*) {
      margin: 0 4px;
    }
  `;

  // Render the popup at the specified position
  render() {
    return html`
      <div class="popup-content" style="top: ${this.y}px; left: ${this.x}px; height: 40px">
            <wcd-popup-item-bold-100554></wcd-popup-item-bold-100554>
            <wcd-popup-item-italic-100554></wcd-popup-item-italic-100554>
            <wcd-popup-item-link-100554></wcd-popup-item-link-100554>
            <wcd-popup-item-separator-100554></wcd-popup-item-separator-100554>
            <wcd-popup-item-h1-100554></wcd-popup-item-h1-100554>
      </div>
    `;
  }

  // Update position based on x and y properties
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.left = `${this.x}px`;
      this.style.top = `${this.y}px`;
    }
  }
}

