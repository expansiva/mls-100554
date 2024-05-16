/// <mls shortName="wcInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-input-number-100554')
export class WCInputNumber extends IcaFormsInputNumberBase {

    static styles = css`
    :host {
        display: block;
    }

    .input_control {
        display: block;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
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
    .form_error_message{
        color: red;
    }
    `

    @propertyDataSource({ type: String }) datasource: number | undefined;

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) placeholder: string | undefined;

    @propertyCompositeDataSource({ type: String }) label: string | undefined;

    @property({ type: String }) pattern: string | undefined;

    @property({ type: String }) errormessage: string | undefined;

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Number }) step: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @query('.input_control') input: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html`
        <label class="form-control-label" for="input">
          ${this.label}
        </label>

        <input
            id="input"
            class="input_control"
            type="number"
            name=${ifDefined(this.name)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            min=${ifDefined(this.minvalue)}    
            max=${ifDefined(this.maxvalue)}
            step=${ifDefined(this.step as number)}
            .value=${this.datasource}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}
            inputmode=${ifDefined(this.inputmode)}
            @input=${this.handleChange}
        />

        <div class="form_error_message">${this.error}</div>
        `;
    }


    private handleChange() {
        if (!this.input) return;
        let newval = +this.input.value;
        if (!isNaN(newval)
            && (this.minvalue === undefined || (newval >= this.minvalue))
            && (this.maxvalue === undefined || (newval <= this.maxvalue))
        ) {
            this.datasource = newval;
            this.error = '';
            this.requestUpdate();
        } else {
            this.error = this.errormessage || '';
            this.requestUpdate();
        }
    }
}
