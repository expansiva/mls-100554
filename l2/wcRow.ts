/// <mls shortName="wcRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowRow } from './_100554_icaLayoutFlowRow';

@customElement('wc-row-100554')
export class WcRow100554 extends IcaLayoutFlowRow {

    @property() hint: string | undefined;

    render() {
        return html`
        <div style="heigth=100%; width:auto; display:flex; gap:1rem;">
           <slot></slot>
        </div>`; 
    }
}
