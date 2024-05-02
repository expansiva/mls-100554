/// <mls shortName="icaDeepLinking" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';

@customElement('ica-deep-linking-100554')
export class IcaDeepLinking100554 extends IcaLitElement {

    @property() url: string | undefined;

    @property() params: Set<IUrlParams> = new Set<IUrlParams>();

    @property() trace: string[] = [];

    @property() develpoment: boolean = false;

    exec(params: Set<IUrlParams>) {
        this.trace.push(`Find elements in page`);
        this.findAndChangeElementsInPage(params);
    }

    private findAndChangeElementsInPage(params: Set<IUrlParams>) {
        const allElements = document.querySelectorAll('*');
        const pathToChange = this.findParameterReferences(allElements, Array.from(params));
        for (let changes of pathToChange) {
            this.trace.push(`Set state: key => ${changes.key} value => ${changes.value} `);
            window.globalStateManagment.setState(changes.key, changes.value)
        }
    }

    private findParameterReferences(elements: NodeListOf<Element>, parameters: IUrlParams[]): IFieldRc[] {
        const fields: IField[] = [];

        parameters.forEach(param => {
            const paramName = param.key.split('.').pop(); // Pegando apenas o último nó do nome do parâmetro
            elements.forEach(element => {
                const attributes = element.getAttributeNames();
                attributes.forEach(attribute => {
                    const attributeValue = element.getAttribute(attribute);
                    if (attributeValue) {
                        const matches = attributeValue.match(new RegExp(`{{\\s*[^{}]*\\b${paramName}\\b[^{}]*\\s*}}`, 'g'));
                        if (matches) {
                            matches.forEach(match => {
                                fields.push({
                                    fieldName: `${element.tagName.toLowerCase()}[${attribute}]`,
                                    value: match,
                                    newValue: param.value
                                });
                            });
                        }
                    }
                });
            });
        });

        fields.forEach(field => {
            field.value = field.value.replace(/{{|}}/g, ''); // Remove '{{' , '}}'
        });

        const uniqueValues: { [key: string]: string } = {};
        fields.forEach(field => {
            if (!uniqueValues[field.value]) {
                uniqueValues[field.value] = field.newValue;
            }
        });
        return Object.entries(uniqueValues).map(([key, value]) => ({ key, value }));
    }

    private setParamsByUrl() {
        this.trace.push(`---------------------------- `);
        this.trace.push(`Set params by url: ${this.url} `);
        if (!this.url) return;
        const urlParams = new URLSearchParams(this.url.substring(this.url.indexOf('?') + 1));
        this.params = new Set();
        for (const [key, value] of urlParams) {
            this.params.add({ key, value });
        }
    }

    private setParamsByPrompt(value: string) {

        this.trace.push(`---------------------------- `);
        const jsonParams: IUrlParams[] = JSON.parse(value);
        this.trace.push(`Set params by prompt: ${JSON.stringify(jsonParams)} `);
        this.params = new Set();
        for (const obj of jsonParams) {
            this.params.add({ key: obj.key, value: obj.value });
        }
    }

    private createPrompt() {
        return html`
      <textarea
      rows="10"
      style="width:100%;"
      placeholder="Alterar o globalState..."
      .value = ${JSON.stringify(Array.from(this.params), null, 2) || ''}
      @input=${(e: InputEvent) => this.handleChange((e.target as HTMLInputElement).value)}>
    `;
    }


    private createDetailsIcon() {
        return html`
      <details>
        <summary>Trace</summary>
        <div style="margin-left:2rem;">
            <pre style="white-space: pre-line;font-size: 12px;">
                ${this.trace.join('\n')}
            </pre>
        </div>

      </details>
    `;
    }

    private getAllWebComponentTags(): string[] {
        const webComponentTags: string[] = [];
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (element.tagName.includes('-')) {
                webComponentTags.push(element.tagName.toLowerCase());
            }
        });
        return webComponentTags;
    }

    private timeoutChangePrompt: number = 0;
    private handleChange(inputValue: string) {
        if (this.timeoutChangePrompt) clearTimeout(this.timeoutChangePrompt);
        this.timeoutChangePrompt = setTimeout(() => {
            this.setParamsByPrompt(inputValue);
            this.exec(this.params);
        }, 1000);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('url')) {
            const allWcs = this.getAllWebComponentTags();

            this.trace.push('Check and waiting all web components defined');
            Promise.all(allWcs.map((wc) => customElements.whenDefined(wc))).then(async () => {
                this.setParamsByUrl();
                this.exec(this.params);
            });
        }
    }

    renderOptional() {
        return html`
            ${this.createPrompt()}
            ${this.createDetailsIcon()}
        `
    }

    render() {
        return html`${this.develpoment ? this.renderOptional() : '' }`;
    }

}

interface IUrlParams {
    key: string,
    value: string
}

interface IField {
    fieldName: string;
    value: string;
    newValue: string,
}

interface IFieldRc {
    key: string;
    value: string;
}

