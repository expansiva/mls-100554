/// <mls fileReference="_100554_/l2/widgetSelect.ts" enhancement="_blank"/>

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query } from 'lit/decorators.js';
import {CollabLitElement} from '/_102029_/l2/collabLitElement.js'

@customElement('widget-select-100554')
export class WcInputText100554 extends CollabLitElement {  

    autocapitalize: any = "off";
    validationmessage: string | undefined;
    debounce: string | undefined;

    
    @property({ type: String }) value: string | undefined;

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) label: string | undefined;

    @property({ type: String }) pattern: string | undefined;

    @property({ type: String }) errormessage: string | undefined;

    @property({ type: String }) placeholder: string | undefined;

    @property({ type: String }) autocomplete: string | undefined;

    @property({ type: Number }) maxlength: number | undefined = undefined;

    @property({ type: Number }) minlength: number | undefined = undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string | undefined;

    @property({ type: String }) options: string | undefined;

    get _options() {
     
        if (this.options) return JSON.parse(this.options);
        else return []
    }

    error: string = '';

    render() {
        return html`
        <label class="form-control-label">
          ${this.label}
        </label>

        <select
            class="input_control"
            name=${ifDefined(this.name)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            .value=${this.value || ''}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}

        
        >
            ${this._options.map((s:string) => html`<option value="${s}">${s}</option>`)}
        </select>
        <small class="form_hint">${this.hint}</small>
        <div class="form_error_message">${this.error}</div>
        `;
    }

    handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
    }

}