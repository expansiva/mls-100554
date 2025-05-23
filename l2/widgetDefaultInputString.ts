/// <mls shortName="widgetDefaultInputString" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputStringBase, IAutoCapitalize, IAutocorrect } from './_100554_icaFormsInputStringBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    chars: 'caracteres',
    min: 'mín.',
    max: 'máx.'
}
const message_en = {
    chars: 'characters',
    min: 'min.',
    max: 'max.'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
* Campo de texto com contador de caracteres em tempo real, acessível e com suporte a maxlength/minlength.
*/
@customElement('widget-default-input-string-100554')
export class WidgetDefaultInputString extends IcaFormsInputStringBase {
    /**
    * Nome do campo para binding e formulários
    * @example name="nome"
    */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /**
    * Texto de ajuda ou dica para o usuário
    * @example hint="Digite seu nome completo"
    */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /**
    * Valor atual do campo, suporta binding
    * @example value="{{ui.form.nome}}"
    */
    @propertyDataSource({ type: String }) value: string | undefined;
    /**
    * Texto do rótulo do campo
    * @example label="Nome"
    */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /**
    * Define se o campo é obrigatório
    * @example required=true
    */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
    * Define se o campo está desabilitado
    * @example disabled=true
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
    * Número máximo de caracteres permitidos
    * @example maxlength=50
    */
    @propertyDataSource({ type: Number }) maxlength: number | undefined;
    /**
    * Número mínimo de caracteres requeridos
    * @example minlength=5
    */
    @propertyDataSource({ type: Number }) minlength: number | undefined;
    /**
    * Texto de placeholder exibido quando vazio
    * @example placeholder="Digite aqui"
    */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /**
    * Expressão regular para validação
    * @example pattern="[A-Za-z ]+"
    */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /**
    * Mensagem exibida em caso de erro de validação
    * @example errormessage="Campo obrigatório"
    */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /**
    * Define se o campo recebe foco automaticamente
    * @example autofocus=true
    */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /**
    * Controle de capitalização automática
    * @example autocapitalize="sentences"
    */
    @propertyDataSource({ type: String }) autocapitalize: IAutoCapitalize = 'off';
    /**
    * Controle de autocorreção
    * @example autocorrect="on"
    */
    @propertyDataSource({ type: String }) autocorrect: IAutocorrect | undefined;
    /**
    * Sugestão de preenchimento automático
    * @example autocomplete="name"
    */
    @propertyDataSource({ type: String }) autocomplete: string | undefined;
    /**
    * Mensagem de validação customizada
    * @example validationmessage="Preencha corretamente"
    */
    @propertyDataSource({ type: String }) validationmessage: string | undefined;
    /**
    * Debounce para eventos
    * @example debounce="300"
    */
    @propertyDataSource({ type: String }) debounce: string | undefined;
    /**
    * Define se o campo é somente leitura
    * @example readonly=true
    */
    @propertyDataSource({ type: Boolean }) readonly: boolean = false;
    /**
    * Posição do contador de caracteres (ex: canto inferior direito)
    * @example counterPosition="bottom-right"
    */
    @propertyDataSource({ type: String }) counterPosition: string = 'bottom-right';
    private get _lang(): string {
        return (navigator.language || 'en').startsWith('pt') ? 'pt' : 'en';
    }
    private get _messages(): MessageType {
        return messages[this._lang] || messages['en'];
    }
    private get _currentLength(): number {
        return (this.value || '').length;
    }
    private get _showError(): boolean {
        if (typeof this.minlength === 'number' && this._currentLength < this.minlength) return true;
        if (typeof this.maxlength === 'number' && this._currentLength > this.maxlength) return true;
        return false;
    }
    render() {
        const counter = this.maxlength !== undefined
            ? html`<span class="counter" aria-live="polite">${this._currentLength}/${this.maxlength}</span>`
            : html``;
        return html`
<div class="input-string-wrapper">
${this.label ? html`<label class="form-control-label" for="input-string">${this.label}${this.required ? html`<span aria-hidden="true">*</span>` : ''}</label>` : ''}
<div class="input-area">
<input
id="input-string"
class="input-string-field${this._showError ? ' error' : ''}"
type="text"
name=${ifDefined(this.name)}
?disabled=${this.disabled.toString() === 'true'}
?readonly=${this.readonly.toString() === 'true'}
?required=${this.required.toString() === 'true'}
maxlength=${ifDefined(this.maxlength)}
minlength=${ifDefined(this.minlength)}
placeholder=${ifDefined(this.placeholder)}
pattern=${ifDefined(this.pattern)}
autofocus=${this.autofocus}
autocapitalize=${ifDefined(this.autocapitalize)}
autocorrect=${ifDefined(this.autocorrect)}
autocomplete=${ifDefined(this.autocomplete)}
.value=${this.value || ''}
@input=${this._onInput}
aria-describedby="${this.hint ? 'hint' : ''} ${this.errormessage ? 'error-message' : ''}"
/>
${counter}
</div>
${this.hint ? html`<div id="hint" class="form-hint">${this.hint}</div>` : ''}
${this._showError && this.errormessage ? html`<div id="error-message" class="form-error-message">${this.errormessage}</div>` : ''}
</div>
`;
    }
    private _onInput = (e: Event) => {
        const input = e.target as HTMLInputElement;
        this.value = input.value;
        this.requestUpdate();
    };
}
