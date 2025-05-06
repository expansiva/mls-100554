/// <mls shortName="wcInputDateRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement'

@customElement('wc-input-date-range-100554')
export class WCInputDateRange extends StateLitElement {

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