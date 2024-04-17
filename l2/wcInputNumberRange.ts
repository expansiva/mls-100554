/// <mls shortName="wcInputNumberRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wc-input-number-range-100554')
export class WCInputNumber extends LitElement {

    static styles = css`
    :host {
        display: flex;
        align-items: center;
        gap:1rem;
    }

    .form-control-label{
        width:100px;
    }

    .input_control {
        display: block;
        width:100px;
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

    @property({ type: String }) name: string = '';

    @property({ type: String }) label: string = ':';

    @property({ type: String }) widget: string = '';

    @property({ type: String }) pattern: string = '';

    @property({ type: String }) errormessage: string = '';

    @property({ type: Number }) maxvalue: number | undefined;

    @property({ type: Number }) minvalue: number | undefined;

    @property({ type: Number }) step: number | undefined;

    @property({ type: Number }) value: number = 0;

    @property({ type: Boolean }) required: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) readonly: boolean = false;

    @property({ type: Boolean }) autofocus: boolean = false;

    @property({ type: String }) hint: string = '';

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
            .value=${this.value.toString()}
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
        this.value = Number(sliderElement.value);
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
            this.error = this.errormessage;
            this.requestUpdate();
        }
    }
}