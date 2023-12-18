/// <mls shortName="serviceListFiles" project="100554" enhancement="_100541_enhancementLit" groupName="other" />

    import { html, css, LitElement } from 'lit'; 
    import { customElement, property } from 'lit/decorators.js';

    @customElement('service-list-files-100554')
    export class ServiceListFiles extends LitElement {
        static styles = css`p { color: red }`;

        @property() 
        name: string = 'Somebody';

        render() {
            return html`<p> Hello, ${ this.name } !</p>`;
        }
    }
