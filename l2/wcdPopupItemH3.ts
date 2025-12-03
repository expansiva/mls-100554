/// <mls shortName="wcdPopupItemH3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WCDPopupItemH1 } from "/_100554_/l2/wcdPopupItemH1.js";

@customElement('wcd-popup-item-h3-100554')
export class WCDPopupItemH3 extends WCDPopupItemH1 {

    constructor() {
        super();
        this.headerText = 'H3';
    }

    getSvg(): TemplateResult {
        return svg`
      <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <text x="3" y="17" font-size="14" font-weight="bold">H3</text>
      </svg>
    `;
    }
}
