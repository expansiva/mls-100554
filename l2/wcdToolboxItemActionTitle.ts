/// <mls shortName="wcdToolboxItemActionTitle" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';

@customElement('wcd-toolbox-item-action-title-100554')
export class WcdToolboxItemActionTitle extends WcdToolboxItemBase {

    public args: string | undefined;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div>${this.elICA?.tagName.toLocaleLowerCase() || ''}</div>
            <style>${this.styles}</style>
        `;
    }


    private styles = `
        wcd-toolbox-item-action-title-100554 div {
            display:block;
            background: #4c4c4c;
            color: #fff;
            font-size: 11px;
            text-transform: lowercase;
            padding: 0 .5rem;
            height: 14px;
            border-radius: 5px;
            font-weight: normal;
            letter-spacing: -.5px;
            font-family: monospace;
            width: max-content;
        }

    `;

}