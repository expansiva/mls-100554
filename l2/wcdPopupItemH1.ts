/// <mls shortName="wcdPopupItemH1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, svg, LitElement, render, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from '/_100554_/l2/wcdPopupItem.js';
import { WCDPopupMethodos } from '/_100554_/l2/wcdTypes.js';

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

    const parent = this.getMyParent();
    if (!parent) return;

    parent.changeType(this.headerText);

  }

  getMyParent(): WCDPopupMethodos | undefined {

    const shadow = this.getRootNode() as ShadowRoot;
    if (!shadow) return;

    const parent = shadow.host as WCDPopupMethodos;

    if (!parent) return;

    return parent

  }

}
