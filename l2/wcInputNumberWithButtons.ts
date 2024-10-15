/// <mls shortName="wcInputNumberWithButtons" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';
import { IcaFormsInputNumberBase } from './_100554_icaFormsInputNumberBase';

@customElement('wc-input-number-with-buttons-100554')
export class WCInputNumber extends IcaFormsInputNumberBase {


    @property({ type: String }) name: string | undefined;

    @propertyDataSource({ type: String }) datasource: number | undefined;

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

    error: string = '';

    render() {
        return html`
        <label class="form-control-label" for="input">
          ${this.label}
        </label>

        <div>
            <button @click=${this.handleMinusClick}> - </button>
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
            <button @click=${this.handlePlusClick} > + </button>
        </div>


        <div class="form_error_message">${this.error}</div>
        `;
    }


    private handleMinusClick() {

        if (!this.input) return;
        let newval = +this.input.value - 1
        if (!isNaN(newval) && (this.minvalue === undefined || (newval >= this.minvalue))) {
            this.datasource = newval;
        }
    }

    private handlePlusClick() {
        if (!this.input) return;
        let newval = +this.input.value + 1
        if (!isNaN(newval) && (this.maxvalue === undefined || (newval <= this.maxvalue))) {
            this.datasource = newval;
        }
    }

    private handleChange() {
        if (!this.input) return;
        let newval = +this.input.value;
        this.checkNewVal(newval);
    }

    private checkNewVal(value: number) {
        if (!isNaN(value)
            && (this.minvalue === undefined || (value >= this.minvalue))
            && (this.maxvalue === undefined || (value <= this.maxvalue))
        ) {
            this.datasource = value;
            this.error = '';
            this.requestUpdate();
        } else {
            this.error = this.errormessage || '';
            this.requestUpdate();
        }
    }
}
