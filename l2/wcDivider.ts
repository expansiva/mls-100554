/// <mls shortName="wcDivider" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { IcaLayoutFlowDividerBase } from './_100554_icaLayoutFlowDividerBase';

@customElement('wc-divider-100554')
export class WcDivider100554 extends IcaLayoutFlowDividerBase {

    static styles = css`
        :host {
            display:block; 
        }
        
        hr {
            display: block;
            border: 0;
            text-align: center;
            overflow: visible;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        hr:before{
            font-family: var(--font-family-primary);
            font-weight: 400;
            font-style: italic;
            font-size: var(--font-size-40);
            letter-spacing: .6em;
            content: attr(data-text);
            display: inline-block;
            margin-left: .6em;
            color: var(--text-primary-color);
            position: relative;
            top: -10px;
        }
    `;

    @property() text: string | undefined;

    render() {
        return html`<hr data-text=${this.text || '...'}></hr>`;
    }
}
