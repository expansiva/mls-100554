/// <mls shortName="wcInputText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputString } from './_100554_icaFormsInputString';
import { propertyDataSource } from './_100554_icaLitElement';

@customElement('wc-input-text-100554')
export class WcInputText100554 extends IcaFormsInputString {

    static styles = css`
    :host {
        display: block;
    }
    
    .input_control {
        display: block;
        width:100%;
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
    @propertyDataSource({ type: String }) datasource: string | undefined;

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

    @property({ type: String }) autocorrect: 'off' | 'on' | undefined = undefined;

    @property({ type: String }) autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | undefined = undefined; 

    @query('.input_control') input: HTMLInputElement | undefined;

    error: string = '';

    render() {
        return html`
        <label class="form-control-label">
          ${this.label}
        </label>

        <input
            class="input_control"
            type="text"
            name=${ifDefined(this.name)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            maxlength=${ifDefined(this.minlength)}    
            minlength=${ifDefined(this.maxlength)}
            autocomplete=${ifDefined(this.autocomplete)}
            placeholder=${ifDefined(this.placeholder)}
            .value=${this.datasource || ''}
            ?autofocus=${this.autofocus}
            pattern=${ifDefined(this.pattern)}
            @input=${this.handleChange}

        
        />
        <small class="form_hint">${this.hint}</small>
        <div class="form_error_message">${this.error}</div>
        `;
    }

    handleChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.datasource = selectElement.value;
    }

}
