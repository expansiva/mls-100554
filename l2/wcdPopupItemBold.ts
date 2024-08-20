/// <mls shortName="wcdPopupItemBold" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, render, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDPopupItem } from './_100554_wcdPopupItem'

@customElement('wcd-popup-item-bold-100554')
export class WCDPopupItemBold extends WCDPopupItem {

 constructor() {
     super();
    console.log('in wcdPopupItemBold')
    this.label = 'Bold';
  }

//   static styles = [
//     WCDPopupItem.styles,
//     css`
//       :host {
//         width: 40px;
//         height: 40px;
//         display: inline-flex;
//         align-items: center;
//         justify-content: center;
//       }
//     `
//   ];

  // Handle the click event to apply bold to the selected text
  handleClick() {
    document.execCommand('bold', false, undefined);
    console.log(`Clicked: ${this.label}`);
  }
}
