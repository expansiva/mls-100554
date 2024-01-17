/// <mls shortName="codelensCustomElement" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';

export function initCodelensCustomElement() {
    return true;
}

@customElement('codelens-custom-element-100554')
export class CodeLensCustomElement100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    textCode = `
    import { customElement, LitElement, html } from 'lit';
    <br>
    <br>
    @customElement('my-custom-element')
    <br>
    class MyCustomElement extends LitElement {
    <br>
     [...]
    <br>
    }
    `
    render() {
        return html`
        <h1> @customElement</h1>
        <p> Is a powerful feature provided by Lit, a JavaScript library for building efficient and reactive web user interfaces. It is used to define and register custom elements with the browser's customElements API. Custom elements allow you to create reusable and self-contained components that can be used like standard HTML elements within your web application.  Usage To create a custom element using the @customElement decorator in Lit, you need to define a class that extends LitElement, the base class provided by Lit. This class will encapsulate the behavior, rendering, and updating logic for your custom element. 
        </p>
        <hr>
        <h2>Usage:</h2>
        <code>${unsafeHTML(this.textCode)}</code>
        <div>
            <p>The @customElement decorator automatically registers your custom element with the browser's customElements API using the specified tag name. In the example above, the custom element is registered with the tag name 'my-custom-element'. This allows you to use the custom element as if it were a standard HTML element within your application.</p>
        </div>
        <hr>
        <div class="container-image">
            <img src="https://lit.dev/images/docs/components/lit-element-inheritance.png" data-mlsline="11">
        </div>
        <a href="https://lit.dev/docs/components/overview/" target="_blank" data-mlsline="12">see more</a>
        `;
    }
}
