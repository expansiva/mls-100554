/// <mls shortName="codelensComponentDetails" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export function initCodelensComponentDetails() {
    return true;
}
@customElement('codelens-component-details-100554')
export class CodeLensComponentDetails100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    textCode = `
        /**
         <br>
         * @mlsComponentDetails {"webComponentDependencies": ["my-web-component-100541"]}
        <br>
         */
        <br>
        <br>

        import { html, LitElement } from 'lit';
        <br>
        import { customElement } from 'lit/decorators.js';
        <br>
         <br>
        @customElement('example-100541')
        <br>
        export class Example extends LitElement { [...] }

    `
    render() {
        return html`
        <h1> mlsComponentDetails</h1>
        <p> The parameter mlsComponentDetails is used to determine if there are any dependencies on any web components. This definition is important for the proper functioning/compilation of the component.<br>
        To make this definition, use JsDoc at the beginning of the file, setting the mlsComponentDetails tag.
        </p>
        
        <hr>
        <h2>Usage:</h2>
        <code>${unsafeHTML(this.textCode)}</code>

        `;
    }
}
