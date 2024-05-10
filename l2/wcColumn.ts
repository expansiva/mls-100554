/// <mls shortName="wcColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowColumnBase } from './_100554_icaLayoutFlowColumnBase';

@customElement('wc-column-100554')
export class WcColumn extends IcaLayoutFlowColumnBase {

    static styles = css`
    :host {
        display: block;
    }`

    render() {
        return html`
        <div>
             <slot></slot>
        </div>`
    }

}

