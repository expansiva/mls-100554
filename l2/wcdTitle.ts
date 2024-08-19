/// <mls shortName="wcdTitle" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { WCDToolbox } from './_100554_wcdToolbox';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('wcd-title-100554')
export class WcdAdd100554 extends WcdToolboxItemBase {

    public myParent: WCDToolbox | undefined | any ;
    public elMain: HTMLElement | undefined | any;
    public elICA: IcaLitElementBase | undefined | any;
    public args: string | undefined;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div>${this.myParent?.widget || ''}</div>
            <style>${this.styles}</style>
        `;
    }


    private styles = `
        wcd-title-100554 div {
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
