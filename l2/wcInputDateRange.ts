/// <mls shortName="wcInputDateRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wc-input-date-range-100554')
export class WCInputDateRange extends LitElement {

    static styles = css`
    :host {
        display: block;
    }

    .input_container{
        display:flex;
        gap:1rem;
        align-items:center;
    }

    .input_control {
        display: block;
        flex:1;
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

    .form_hint{
        color: blue;
    }
    .form_error_message{
        color: red;
    }
    `

    @property({ type: String }) name: string = '';

    @property({ type: String }) label: string = '';

    @property({ type: String }) widget: string = '';

    @property({ type: String }) pattern: string = '';

    @property({ type: String }) errormessage: string = '';

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @property({ type: String }) valueInitial: string = '';

    @property({ type: String }) valueFinal: string = '';

    @property({ type: String }) separatorText: string = '';

    @query('.input_control.initial') inputInitial: HTMLInputElement | undefined;

    @query('.input_control.final') inputFinal: HTMLInputElement | undefined;


    error: string = '';

    render() {
        return html`
        <label class="form-control-label">
          ${this.label}
        </label>
        <div class="input_container">
            <input
                class="input_control initial"
                type="date"
                name=${ifDefined(this.name)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                min=${ifDefined(this.minvalue)}    
                .value=${this.valueInitial}
                ?autofocus=${this.autofocus}
                pattern=${ifDefined(this.pattern)}
                inputmode=${ifDefined(this.inputmode)}
                @input=${this.handleChange}
            />

            <span>${this.separatorText}</span>

            <input
                class="input_control final"
                type="date"
                name=${ifDefined(this.name)}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                ?required=${this.required}
                min=${ifDefined(this.valueInitial)}
                max=${ifDefined(this.maxvalue)}
                .value=${this.valueFinal}
                ?autofocus=${this.autofocus}
                pattern=${ifDefined(this.pattern)}
                inputmode=${ifDefined(this.inputmode)}
            />
        </div>
        <small class="form_hint">${this.hint}</small>

        <div class="form_error_message">${this.error}</div>
        `;
    }


    private handleChange() {
        if (!this.inputFinal || !this.inputInitial) return;

        let maxValue = this.inputInitial.value;

        this.inputFinal.min = maxValue;

        if (this.inputFinal.value < maxValue) {
            this.inputFinal.value = maxValue;
        }
    }
}