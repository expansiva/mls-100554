/// <mls shortName="widgetInputPhone" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputMaskedBase } from './_100554_icaFormsInputMaskedBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    invalid: 'Telefone inválido',
    placeholder: 'Digite o telefone',
};
const message_en = {
    invalid: 'Invalid phone number',
    placeholder: 'Enter phone number',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Widget para entrada de telefone nacional brasileiro com máscara dinâmica.
 * Alterna entre formatos de telefone fixo e celular conforme a digitação.
 * Aceita apenas números válidos e exibe erro se o valor estiver incompleto.
 */
@customElement('widget-input-phone-100554')
export class WidgetInputPhone extends IcaFormsInputMaskedBase {
    /** Texto do rótulo exibido para o campo. Ex: "Telefone" */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Texto exibido como dica dentro do campo. */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /** Texto de ajuda ou instrução para o usuário. */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Nome do campo para binding de dados. Ex: "telefone" */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Valor atual do campo, apenas números válidos. Ex: "11999998888" */
    @propertyDataSource({ type: String }) value: string | undefined;
    /** Máscara dinâmica. Ex: "(99) 9999-9999" ou "(99) 99999-9999" */
    @propertyDataSource({ type: String }) mask: string | undefined;
    /** Define se o campo é obrigatório. */
    @propertyDataSource({ type: String }) required: boolean | undefined;
    /** Define se o campo está desabilitado. */
    @propertyDataSource({ type: String }) disabled: boolean | undefined;
    /** Define se o campo é somente leitura. */
    @propertyDataSource({ type: String }) readonly: boolean | undefined;
    /** Configuração para autocomplete do campo. */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;
    /** Mensagem exibida quando o valor está incompleto ou inválido. */
    @propertyDataSource({ type: String }) errormessage: string | undefined;

    private _error: string = '';
    private _lang: string = 'pt';
    private get _messages(): MessageType {
        return messages[this._lang] || messages['pt'];
    }

    private get _inputMask(): string {
        if (!this.value) return '(99) 9999-9999';
        const digits = this.value.replace(/\D/g, '');
        return digits.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
    }

    private _formatPhone(value: string): string {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 10) {
            return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, d1, d2, d3) => {
                return d1 ? `(${d1}${d2 ? `) ${d2}` : ''}${d3 ? `-${d3}` : ''}` : '';
            });
        } else {
            return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (m, d1, d2, d3) => {
                return d1 ? `(${d1}${d2 ? `) ${d2}` : ''}${d3 ? `-${d3}` : ''}` : '';
            });
        }
    }

    private _onInput(e: Event) {
        const input = e.target as HTMLInputElement;
        let digits = input.value.replace(/\D/g, '');
        if (digits.length > 11) digits = digits.slice(0, 11);
        this.value = digits;
        input.value = this._formatPhone(digits);
        this._validate();
    }

    private _onBlur() {
        this._validate();
    }

    private _validate() {
        const digits = (this.value || '').replace(/\D/g, '');
        if (digits.length === 10 || digits.length === 11) {
            this._error = '';
        } else if (digits.length === 0 && !this.required) {
            this._error = '';
        } else {
            this._error = this.errormessage || this._messages.invalid;
        }
    }

    render() {
        const placeholder = this.placeholder || this._messages.placeholder;
        const formattedValue = this._formatPhone(this.value || '');
        return html`
<div class="widget-input-phone">
<label ?hidden=${!this.label} class="form-control-label">${this.label}</label>
<input
 type="tel"
 inputmode="tel"
 name=${ifDefined(this.name)}
 .value=${formattedValue}
 placeholder=${placeholder}
 ?required=${this.required?.toString() === 'true'}
 ?disabled=${this.disabled?.toString() === 'true'}
 ?readonly=${this.readonly?.toString() === 'true'}
 autocomplete=${ifDefined(this.autocomplete)}
 aria-invalid=${this._error ? 'true' : 'false'}
 aria-describedby=${this.hint ? 'hint' : undefined}
 maxlength="15"
 @input=${this._onInput}
 @blur=${this._onBlur}
 />
${this.hint ? html`<div id="hint" class="form_hint">${this.hint}</div>` : ''}
${this._error ? html`<div class="form_error_message">${this._error}</div>` : ''}
</div>
`;
    }
}
