/// <mls shortName="widgetDefaultInputBoolean" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputBooleanBase } from './_100554_icaFormsInputBooleanBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    required: 'Campo obrigatório',
};
const message_en = {
    required: 'Required field',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
* Checkbox tradicional para formulários, com label à direita, suporte a teclado, foco visual e acessibilidade aprimorada.
*/
@customElement('widget-default-input-boolean-100554')
export class WidgetDefaultInputBoolean extends IcaFormsInputBooleanBase {
    /**
    * Nome do campo para binding de dados
    * @example name="aceita"
    */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /**
    * Texto exibido à direita do checkbox
    * @example label="Aceito os termos"
    */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /**
    * Texto de ajuda complementar
    * @example hint="Você deve aceitar para continuar"
    */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /**
    * Define se o campo é obrigatório
    * @example required=true
    */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /**
    * Define se o campo está desabilitado
    * @example disabled=true
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /**
    * Define se o campo é somente leitura
    * @example readonly=true
    */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /**
    * Define se o campo recebe foco automático
    * @example autofocus=true
    */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /**
    * Estado marcado ou desmarcado do checkbox
    * @example checked="true"
    */
    @propertyDataSource() checked: boolean | undefined;
    /**
    * Mensagem exibida em caso de erro de validação
    * @example errormessage="Você deve aceitar os termos"
    */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    
    /**
    * ID do elemento que descreve o campo para acessibilidade
    * @example ariaDescribedBy="hint-id"
    */
    @propertyCompositeDataSource({ type: String }) ariaDescribedBy: string | undefined;
    
    @propertyDataSource({ type: Boolean }) showErrorState: boolean | undefined;
    /**
    * Suporte completo a navegação por teclado
    * @example keyboardNavigationSupport=true
    */
    @propertyDataSource({ type: Boolean }) keyboardNavigationSupport: boolean | undefined;
    /**
    * Indica foco visual claro para acessibilidade
    * @example visualFocus=true
    */
    @propertyDataSource({ type: Boolean }) visualFocus: boolean | undefined;
    private get _hasError(): boolean {
        const required = !!this.required;
        const checked = this.checked?.toString() === 'true' || this.checked === true;
        return !!this.showErrorState && required && !checked;
    }
    private get _errorMessage(): string {
        if (this._hasError) {
            return this.errormessage || messages['pt'].required;
        }
        return '';
    }
    private _onInputChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.checked = input.checked ? true : false;
        this.requestUpdate();
    }
    private _onKeyDown(e: KeyboardEvent) {
        if (!this.keyboardNavigationSupport) return;
        if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const input = this.shadowRoot?.getElementById('checkbox-input') as HTMLInputElement;
            if (input && !this.disabled && !this.readonly) {
                input.checked = !input.checked;
                this.checked = input.checked ? true : false;
                this.requestUpdate();
                input.focus();
            }
        }
    }
    render() {
        const checked = this.checked?.toString() === 'true' || this.checked === true;

        console.info(this.checked)
        return html`
<div class="checkbox-wrapper${this._hasError ? ' error' : ''}${this.visualFocus ? ' visual-focus' : ''}">
<label class="checkbox-label">
<input
id="checkbox-input"
type="checkbox"
name=${ifDefined(this.name)}
?checked=${checked?.toString() === 'true'}
?disabled=${this.disabled?.toString() === 'true'}
?readonly=${this.readonly?.toString() === 'true'}
?required=${this.required?.toString() === 'true'}
?autofocus=${this.autofocus}
@change=${this._onInputChange}
@keydown=${this._onKeyDown}
/>
<span class="custom-checkbox"></span>
<span class="checkbox-text">${this.label}</span>
</label>
${this.hint ? html`<div class="checkbox-hint">${this.hint}</div>` : ''}
${this._hasError ? html`<div class="checkbox-error">${this._errorMessage}</div>` : ''}
</div>
`;
    }
}
