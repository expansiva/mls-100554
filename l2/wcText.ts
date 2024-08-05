/// <mls shortName="wcText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, css , unsafeHTML} from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaApresentationTextTextBase } from './_100554_icaApresentationTextTextBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-text-100554')
export class WcInputText100554 extends IcaApresentationTextTextBase {

    @propertyDataSource({ type: String }) datasource: string | undefined;

    @property({ type: String }) text: string | undefined;

    @property({ type: String }) type: string | undefined;

    static styles = css``
    error: string = '';

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {

        let tag = '';
        switch (this.type) {
            case 'h1':
                tag = 'h1';
                break;
            case 'h2':
                tag = 'h2';
                break;
            case 'h3':
                tag = 'h3';
                break;
            case 'h4':
                tag = 'h4';
                break;
            case 'h5':
                tag = 'h5';
                break;
            case 'h6':
                tag = 'h6';
                break;
            case 'p':
                tag = 'p';
                break;
            default:
                tag = 'span';
        }

        return unsafeHTML(`<${tag}>${this.text}</${tag}>`)
    }

   

}