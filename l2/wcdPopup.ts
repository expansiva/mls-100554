/// <mls shortName="wcdPopup" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDToolboxItemEditTextMethodos, WCDPopupMethodos } from '/_100554_/l2/wcdTypes.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

export function initWcdPopup(): boolean {
  return true;
}

@customElement('wcd-popup-100554')
export class WCDPopup extends LitElement implements WCDPopupMethodos {

  public myParent: WCDToolboxItemEditTextMethodos | undefined;

  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: String }) buttons = 'bold,italic,dropcap,link,separator,h1,h2,h3,h4,separator,blockquote';

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

  public changeType(tp: string) {

    if (!this.myParent) return;
    this.myParent.changeType(tp);

  }

  private async loadComponent(button: string) {
    switch (button) {
      case 'bold':
        await import('/_100554_/l2/wcdPopupItemBold.js');
        return 'wcd-popup-item-bold-100554';
      case 'italic':
        await import('/_100554_/l2/wcdPopupItemItalic.js');
        return 'wcd-popup-item-italic-100554';
      case 'link':
        await import('/_100554_/l2/wcdPopupItemLink.js');
        return 'wcd-popup-item-link-100554';
      case 'separator':
        await import('/_100554_/l2/wcdPopupItemSeparator.js');
        return 'wcd-popup-item-separator-100554';
      case 'h1':
        await import('/_100554_/l2/wcdPopupItemH1.js');
        return 'wcd-popup-item-h1-100554';
      case 'h2':
        await import('/_100554_/l2/wcdPopupItemH2.js');
        return 'wcd-popup-item-h2-100554';
      case 'h3':
        await import('/_100554_/l2/wcdPopupItemH3.js');
        return 'wcd-popup-item-h3-100554';
      case 'h4':
        await import('/_100554_/l2/wcdPopupItemH4.js');
        return 'wcd-popup-item-h4-100554';
      case 'blockquote':
        await import('/_100554_/l2/wcdPopupItemBlockQuote.js');
        return 'wcd-popup-item-block-quote-100554';
      case 'dropcap':
        await import('/_100554_/l2/wcdPopupItemDropCap.js');
        return 'wcd-popup-item-drop-cap-100554';
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
        ${components.filter(Boolean).map(button => {
      const valid = this.isValid(button);
      return `<${button} ${!valid ? 'style="display:none"' : ''}></${button}>`
    }).join('')}
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

  isValid(name: string | null): boolean {
    if (!name) return false;
    if (name !== 'wcd-popup-item-drop-cap-100554') return true;
    return this.checkIsValidDropCap();
  }

  checkIsValidDropCap(): boolean {
    const contentEditable = this.parentElement?.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!contentEditable) return false;
    if (!globalWcd.elICA || globalWcd.elICA?.getAttribute('type') !== "p") return false;
    const isFirstWordSelected = this.isFirstWordSelected(contentEditable);
    return isFirstWordSelected;
  }

  isFirstWordSelected(contentEditableElement: HTMLElement) {

    const selection = window.getSelection();
    if (!selection || !contentEditableElement) return false;
    const range = selection.getRangeAt(0);
    if (!contentEditableElement.contains(range.commonAncestorContainer)) return false;
    const textContent = contentEditableElement.textContent?.trim() || '';
    const firstWord = textContent.split(/\s+/)[0];
    const firstWordStart = textContent.indexOf(firstWord);
    const firstWordEnd = firstWordStart + firstWord.length;
    const isFirstLetterUppercase = firstWord.charAt(0) === firstWord.charAt(0).toUpperCase();
    const selectionStart = range.startOffset;
    const selectionEnd = range.endOffset;
    const isPartOfFirstWordSelected = (selectionStart < firstWordEnd && selectionEnd > firstWordStart);
    return isPartOfFirstWordSelected && isFirstLetterUppercase;

  }


}

