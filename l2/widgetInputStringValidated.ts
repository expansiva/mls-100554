/// <mls shortName="widgetInputStringValidated" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputStringBase, IAutoCapitalize, IAutocorrect } from './_100554_icaFormsInputStringBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    errorIcon: 'Erro',
};
const message_en = {
    errorIcon: 'Error',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

/**
* Campo de texto com validação visual imediata, mostrando erro em tempo real para padrões, tamanho máximo e obrigatoriedade.
* Ideal para formulários com validação imediata, como e-mails, CPF ou campos obrigatórios.
*/
@customElement('widget-input-string-validated-100554')
export class WidgetInputStringValidated extends IcaFormsInputStringBase {
    /**
    * Nome do campo para binding dinâmico
    * @example name="email"
    */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /**
    * Dica adicional para o usuário
    * @example hint="Digite seu e-mail"
    */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /**
    * Valor do campo
    * @example value="{{ui.form.email}}"
    */
    @propertyDataSource({ type: String }) value: string | undefined;
    /**
    * Texto do rótulo do campo
    * @example label="E-mail"
    */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /**
    * Indica se o campo é obrigatório
    * @example required=true
    */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
    * Define se o campo está desabilitado
    * @example disabled=true
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
    * Tamanho máximo permitido para o texto
    * @example maxlength=50
    */
    @propertyDataSource({ type: Number }) maxlength: number | undefined;
    /**
    * Tamanho mínimo permitido para o texto
    * @example minlength=5
    */
    @propertyDataSource({ type: Number }) minlength: number | undefined;
    /**
    * Texto de placeholder exibido no campo
    * @example placeholder="Digite aqui"
    */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /**
    * Expressão regular para validação do conteúdo
    * @example pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /**
    * Mensagem exibida quando a validação falha
    * @example errormessage="E-mail inválido"
    */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /**
    * Se o campo deve receber foco automaticamente
    */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /**
    * Controle de capitalização automática
    */
    @propertyDataSource({ type: String }) autocapitalize: IAutoCapitalize = 'off';
    /**
    * Controle de autocorreção
    */
    @propertyDataSource({ type: String }) autocorrect: IAutocorrect | undefined;
    /**
    * Sugestão de preenchimento automático
    */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;
    /**
    * Mensagem de validação customizada
    */
    @propertyDataSource({ type: String }) validationmessage: string | undefined;
    /**
    * Debounce para eventos
    */
    @propertyDataSource({ type: String }) debounce: string | undefined;
    /**
    * Define se o campo é somente leitura
    * @example readonly=true
    */
    @propertyDataSource({ type: Boolean }) readonly: boolean = false;

    private _touched = false;
    private _error = false;
    private _errorMessage = '';
    private myMessage: MessageType = messages['en'];

    private validate(val: string | undefined): boolean {
        if (this.required && (!val || val.trim() === '')) {
            this._errorMessage = this.errormessage || '';
            return false;
        }
        if (this.pattern && val !== undefined && val !== '') {
            try {
                const regex = new RegExp(this.pattern);
                if (!regex.test(val)) {
                    this._errorMessage = this.errormessage || '';
                    return false;
                }
            } catch {
                // padrão inválido, não valida
            }
        }
        if (this.maxlength !== undefined && val !== undefined && val.length > this.maxlength) {
            this._errorMessage = this.errormessage || '';
            return false;
        }
        return true;
    }

    private handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value = input.value;
        this._touched = true;
        this._error = !this.validate(this.value);
        this.requestUpdate();
    }

    render() {
        const showError = this._touched && this._error;
        return html`
<div class="input-string-validated__container">
${this.label ? html`<label class="input-string-validated__label">${this.label}${this.required ? html`<span class="input-string-validated__required">*</span>` : ''}</label>` : ''}
<div class="input-string-validated__input-wrapper">
<input
class="input-string-validated__input${showError ? ' input-string-validated__input--error' : ''}"
type="text"
name=${ifDefined(this.name)}
.placeholder=${ifDefined(this.placeholder)}
?disabled=${this.disabled}
?readonly=${this.readonly}
?required=${this.required}
maxlength=${ifDefined(this.maxlength)}
minlength=${ifDefined(this.minlength)}
pattern=${ifDefined(this.pattern)}
autofocus=${this.autofocus}
autocapitalize=${ifDefined(this.autocapitalize)}
autocorrect=${ifDefined(this.autocorrect)}
autocomplete=${ifDefined(this.autocomplete)}
.value=${this.value ?? ''}
@input=${this.handleInput}
/>
${showError ? html`<span class="input-string-validated__icon" aria-label="${this.myMessage.errorIcon}">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#FF4D4F"/><path d="M10 5V11" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14" r="1" fill="white"/></svg>
</span>` : ''}
</div>
${this.hint && !showError ? html`<div class="input-string-validated__hint">${this.hint}</div>` : ''}
${showError ? html`<div class="input-string-validated__error">${this._errorMessage}</div>` : ''}
</div>
`;
    }
}
