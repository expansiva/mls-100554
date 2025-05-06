/// <mls shortName="wcInputDate" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined} from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputDateBase } from './_100554_icaFormsInputDateBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';

@customElement('wc-input-date-100554')
export class WCInputDateRange extends IcaFormsInputDateBase {

    @property({ type: String }) name: string = '';
    @propertyCompositeDataSource({ type: String }) label: string = '';
    @property({ type: String }) pattern: string = '';
    @property({ type: String }) errormessage: string = 'Data inválida';
    @property({ type: String }) maxvalue: string | undefined;
    @property({ type: String }) minvalue: string | undefined;
    @property({ type: Boolean }) required: boolean = false;
    @property({ type: Boolean }) disabled: boolean = false;
    @property({ type: Boolean }) readonly: boolean = false;
    @property({ type: Boolean }) autofocus: boolean = false;
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    @propertyDataSource({ type: String }) value: string | undefined;

    @query('input[type="date"]') input!: HTMLInputElement;

    error: string = '';

    render() {
        return html`
        <label class="form-control-label">${this.label}</label>
        <input
            class="input_control"
            type="date"
            name=${ifDefined(this.name)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            min=${ifDefined(this.minvalue)}
            max=${ifDefined(this.maxvalue)}
            value=${this.value}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}
            @input=${this.handleChange}
        />
        <small class="form_hint">${this.hint}</small>
        <div class="form_error_message">${this.error}</div>
        `;
    }

    private handleChange() {
        if (!this.input) return;
        const newval = this.input.value;

        if (this.isValidDate(newval)) {
            this.value = newval;
            this.error = '';
            this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
        } else {
            this.error = this.errormessage || '';
        }

        this.requestUpdate();
    }

    private isValidDate(value: string): boolean {
        if (!value) return false;
        const date = new Date(value);
        const minDate = this.minvalue ? new Date(this.minvalue) : null;
        const maxDate = this.maxvalue ? new Date(this.maxvalue) : null;
        return (!minDate || date >= minDate) && (!maxDate || date <= maxDate);
    }
}
