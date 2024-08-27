/// <mls shortName="wcdPopup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export function initWcdPopup(): boolean {
  return true;
}

@customElement('wcd-popup-100554')
export class WCDPopup extends LitElement {

  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: String }) buttons = 'bold,italic,link,separator,h1,h2,h3,h4,separator,blockquote';

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

  :host::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid black;
  }

  .popup-content {
    display: flex;
    align-items: center;
  }

  ::slotted(*) {
    margin: 0 4px;
  }
`;

  private async loadComponent(button: string) {
    switch (button) {
      case 'bold':
        await import('./_100554_wcdPopupItemBold');
        return 'wcd-popup-item-bold-100554';
      case 'italic':
        await import('./_100554_wcdPopupItemItalic');
        return 'wcd-popup-item-italic-100554';
      case 'link':
        await import('./_100554_wcdPopupItemLink');
        return 'wcd-popup-item-link-100554';
      case 'separator':
        await import('./_100554_wcdPopupItemSeparator');
        return 'wcd-popup-item-separator-100554';
      case 'h1':
        await import('./_100554_wcdPopupItemH1');
        return 'wcd-popup-item-h1-100554';
      case 'h2':
        await import('./_100554_wcdPopupItemH2');
        return 'wcd-popup-item-h2-100554';
      case 'h3':
        await import('./_100554_wcdPopupItemH3');
        return 'wcd-popup-item-h3-100554';
      case 'h4':
        await import('./_100554_wcdPopupItemH4');
        return 'wcd-popup-item-h4-100554';
      case 'blockquote':
        await import('./_100554_wcdPopupItemBlockQuote');
        return 'wcd-popup-item-block-quote-100554';
      default:
        console.error('invalid button name: "' + button + '"');
        return null;
    }
  }

  async firstUpdated() {
    const buttonsArray = this.buttons.split(',').map(button => button.trim());
    const components: (string | null)[] = await Promise.all(buttonsArray.map(button => this.loadComponent(button)));
    this.shadowRoot!.innerHTML = `
      <div class="popup-content" style="top: ${this.y}px; left: ${this.x}px; height: 40px">
        ${components.filter(Boolean).map(button => `<${button}></${button}>`).join('')}
      </div>
    `;
  }

  render() {
    return html`<div class="popup-content" style="height: 40px;"></div>`;
  }

  // Update position based on x and y properties
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.left = `${this.x}px`;
      this.style.top = `${this.y}px`;
    }
  }
}

