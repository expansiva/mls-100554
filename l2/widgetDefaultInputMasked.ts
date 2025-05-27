/// <mls shortName="widgetDefaultInputMasked" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputMaskedBase } from './_100554_icaFormsInputMaskedBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    error: 'Valor inválido',
};
const message_en = {
    error: 'Invalid value',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Widget personalizado para entrada de texto com máscaras dinâmicas definidas pelo usuário, incluindo validação e exibição visual de erros.
 */
@customElement('widget-default-input-masked-100554')
export class WidgetDefaultInputMasked extends IcaFormsInputMaskedBase {
    /** Texto do rótulo do campo
     * @example label="CPF"
     */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Texto de espaço reservado
     * @example placeholder="Digite o CPF"
     */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /** Dica para o usuário
     * @example hint="Somente números"
     */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Nome do campo para binding
     * @example name="cpf"
     */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Valor atual do campo
     * @example value="123.456.789-00"
     */
    @propertyDataSource({ type: String }) value: string | undefined;
    /** Máscara dinâmica aplicada ao campo
     * @example mask="999.999.999-99"
     */
    @propertyDataSource({ type: String }) mask: string | undefined;
    /** Indica se o campo é obrigatório
     * @example required="true"
     */
    @propertyDataSource({ type: String }) required: boolean | undefined;
    /** Indica se o campo está desabilitado
     * @example disabled="true"
     */
    @propertyDataSource({ type: String }) disabled: boolean | undefined;
    /** Indica se o campo é somente leitura
     * @example readonly="true"
     */
    @propertyDataSource({ type: String }) readonly: boolean | undefined;
    /** Configura autocomplete do campo
     * @example autocomplete="on"
     */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;
    /** Mensagem de erro exibida quando a validação falha
     * @example errormessage="CPF inválido"
     */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /** Expressão regular para validação do valor
     * @example validationpattern="^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$"
     */
    @propertyCompositeDataSource({ type: String }) validationpattern: string | undefined;
    /** Controla a exibição visual do erro
     * @example showerror="true"
     */
    @propertyCompositeDataSource({ type: String }) showerror: string | undefined;

    private _error: boolean = false;
    private _errorMessage: string = '';
    private _lang: string = 'pt';
    private get _messages(): MessageType {
        return messages[this._lang] || messages['en'];
    }

    private _onInput(e: Event) {
        const input = e.target as HTMLInputElement;
        let rawValue = input.value;
        if (this.mask) {
            rawValue = this._applyMask(rawValue, this.mask);
            input.value = rawValue;
        }
        this.value = rawValue;
        this._validate(rawValue);
        this.requestUpdate();
    }

    private _applyMask(value: string, mask: string): string {
        let v = value.replace(/\D/g, '');
        let m = mask;
        let masked = '';
        let vi = 0;
        for (let mi = 0; mi < m.length && vi < v.length; mi++) {
            if (m[mi] === '9') {
                masked += v[vi];
                vi++;
            } else {
                masked += m[mi];
            }
        }
        return masked;
    }

    private _validate(value: string) {
        if (this.validationpattern) {
            try {
                const regex = new RegExp(this.validationpattern);
                if (!regex.test(value)) {
                    this._error = true;
                    this._errorMessage = this.errormessage || this._messages.error;
                } else {
                    this._error = false;
                    this._errorMessage = '';
                }
            } catch {
                this._error = true;
                this._errorMessage = this._messages.error;
            }
        } else {
            this._error = false;
            this._errorMessage = '';
        }
    }

    render() {
        const showError = this.showerror === 'true' && this._error;
        return html`
<div class="input-masked-wrapper">
${this.label ? html`<label class="input-masked-label">${this.label}</label>` : ''}
<input
class="input-masked-input${showError ? ' input-masked-error' : ''}"
.type="text"
name=${ifDefined(this.name)}
.placeholder=${ifDefined(this.placeholder)}
?disabled=${this.disabled?.toString() === 'true'}
?readonly=${this.readonly?.toString() === 'true'}
?required=${this.required?.toString() === 'true'}
autocomplete=${ifDefined(this.autocomplete)}
.value=${this.value ?? ''}
@input=${this._onInput.bind(this)}
aria-invalid=${showError ? 'true' : 'false'}
aria-describedby=${showError ? 'input-masked-error-message' : undefined}
/>
${this.hint ? html`<div class="input-masked-hint">${this.hint}</div>` : ''}
${showError ? html`<div id="input-masked-error-message" class="input-masked-error-message">${this._errorMessage}</div>` : ''}
</div>
`;
    }
}
