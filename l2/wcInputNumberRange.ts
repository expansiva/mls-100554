/// <mls shortName="wcInputNumberRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-input-number-range-100554')
export class WCInputNumber extends IcaFormsInputNumberBase {

    @propertyDataSource({ type: String }) value: number | undefined;

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

    @propertyCompositeDataSource({ type: String }) hint: string = '';

    @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';

    @query('input[type="number"]') input: HTMLInputElement | undefined;
    @query('input[type="range"]') range: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html`
        <label class="form-control-label" for="input">
          ${this.label}
        </label>

        <input 
            type="range"
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            min=${ifDefined(this.minvalue)}    
            max=${ifDefined(this.maxvalue)}
            step=${ifDefined(this.step as number)}
            .value=${this.value}
            @input=${this.handleSliderChange}
        />

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
            .value=${this.value}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}
            inputmode=${ifDefined(this.inputmode)}
            @input=${this.handleChange}
        />

        <div class="form_error_message">${this.error}</div>
        `;
    }

    private handleSliderChange(event: Event) {
        const sliderElement = event.target as HTMLInputElement;
        if (this.input) {
            this.input.value = sliderElement.value
            this.value = +sliderElement.value;
        }
    }

    private handleChange() {
        if (!this.input) return;
        let newval = +this.input.value;

        if (!isNaN(newval)
            && (this.minvalue === undefined || (newval >= this.minvalue))
            && (this.maxvalue === undefined || (newval <= this.maxvalue))
        ) {
            if (this.range) this.range.value = newval.toString();
            this.value = newval;
            this.error = '';
            this.requestUpdate();
        } else {
            this.error = this.errormessage || '';
            this.requestUpdate();
        }
    }
}