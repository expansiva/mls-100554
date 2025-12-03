/// <mls shortName="wcdPopupItemBlockQuote" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WCDPopupItemH1 } from "/_100554_/l2/wcdPopupItemH1.js";

@customElement('wcd-popup-item-block-quote-100554')
export class WCDPopupItemBlockQuote extends WCDPopupItemH1 {

    constructor() {
        super();
        this.headerText = 'blockquote';
    }

    getSvg(): TemplateResult {
        return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="14" font-weight="bold">"</text>
      </svg>
    `;
    }
}
