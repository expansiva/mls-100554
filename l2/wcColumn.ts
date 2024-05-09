/// <mls shortName="wcColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowColumn } from './_100554_icaLayoutFlowColumn';

@customElement('wc-column-100554')
export class WcColumn100554 extends IcaLayoutFlowColumn {
    render() {
        return html`
        <div>
             <slot></slot>
        </div>`
    }

}

