/// <mls shortName="wcInputText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputStringBase } from './_100554_icaFormsInputStringBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

@customElement('wc-input-text-100554')
export class WcInputText100554 extends IcaFormsInputStringBase {

    @propertyDataSource({ type: String }) datasource: string | undefined;

    @property({ type: String }) name: string | undefined;

    @propertyDataSource({ type: String }) label: string | undefined;

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

    @propertyDataSource({ type: String }) hint: string | undefined;

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
        const input = event.target as HTMLInputElement;
        this.datasource = input.value;
    }

}
