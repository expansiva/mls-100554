/// <mls shortName="wcInputColor" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wc-input-color-100554')
export class WcInputColor extends LitElement {

    static styles = css`
    :host {
        display: block;
    }
    
    .input_control {
        display: block;
        font-size: 1rem;
        cursor:pointer;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0.25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        outline:none;
    }
    .form_hint{
        color: blue;
    }
    .form_error_message{
        color: red;
    }
    `

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) label: string | undefined;

    @property({ type: String }) widget: string | undefined;

    @property({ type: String }) pattern: string | undefined;

    @property({ type: String }) errormessage: string | undefined;

    @property({ type: String }) value: string = '';

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string | undefined;

    @query('.input_control') input: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html`
        <label class="form-control-label">
          ${this.label}
        </label>

        <input
            class="input_control"
            type="color"
            name=${ifDefined(this.name)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            .value=${this.value}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}  
        />
        <small class="form_hint">${this.hint}</small>
        <div class="form_error_message">${this.error}</div>
        `;
    }


}
