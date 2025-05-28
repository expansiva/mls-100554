/// <mls shortName="widgetBooleanWithHint" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputBooleanBase } from './_100554_icaFormsInputBooleanBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    info: 'Informação',
};
const message_en = {
    info: 'Info',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget booleano com label, descrição/tooltip, ícone de informação para hint, estado de erro e acessibilidade, ideal para opções que exigem explicação extra.
 * Exemplo de uso:
 * <widget-boolean-with-hint-100554 label="Aceitar termos" hint="Você deve aceitar para continuar" checked="{{ui.config.termos}}" required="true" errormessage="Obrigatório" />
 */
@customElement('widget-boolean-with-hint-100554')
export class WidgetBooleanWithHint extends IcaFormsInputBooleanBase {
    /** Nome do campo para binding dinâmico. Exemplo: name="aceita" */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Texto do label exibido ao lado do campo. Exemplo: label="Aceitar termos" */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Texto da descrição/tooltip exibida ao passar o mouse sobre o ícone de informação. Exemplo: hint="Você deve aceitar para continuar" */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Indica se o campo é obrigatório. Exemplo: required="true" */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /** Indica se o campo está desabilitado. Exemplo: disabled="true" */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /** Indica se o campo está somente leitura. Exemplo: readonly="true" */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /** Define se o campo recebe foco automaticamente. Exemplo: autofocus="true" */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /** Estado booleano do campo (marcado ou não). Exemplo: checked="{{ui.config.termos}}" */
    @propertyDataSource({ type: Boolean }) checked: boolean | undefined;
    /** Mensagem de erro exibida abaixo da descrição se o campo obrigatório não estiver marcado. Exemplo: errormessage="Obrigatório" */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;

    
    private get _showError(): boolean {
        return !!this.errormessage;
    }
    private get _lang(): string {
        return (navigator.language || 'en').startsWith('pt') ? 'pt' : 'en';
    }
    render() {
        const msg = messages[this._lang] || messages['en'];
        return html`
<div class="widget-boolean-with-hint__container">
<label class="widget-boolean-with-hint__label">
<input
class="widget-boolean-with-hint__checkbox"
name=${ifDefined(this.name)}
?checked=${this.checked?.toString() === 'true'}
?disabled=${this.disabled?.toString() === 'true'}
?readonly=${this.readonly?.toString() === 'true'}
?required=${this.required}
type="checkbox"
@change=${this._onChange}
/>
<span class="widget-boolean-with-hint__label-text">${this.label}</span>
<span class="widget-boolean-with-hint__info" tabindex="0" aria-label="${msg.info}" title="${this.hint ?? ''}">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="8" fill="#1C91CD"/><text x="8" y="12" text-anchor="middle" font-size="10" fill="#fff" font-family="Arial" font-weight="bold">i</text></svg>
</span>
</label>
${this.hint ? html`<div class="widget-boolean-with-hint__hint">${this.hint}</div>` : ''}
${this._showError ? html`<div class="widget-boolean-with-hint__error">${this.errormessage}</div>` : ''}
</div>
`;
    }
    private _onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.checked = input.checked ;
        this.requestUpdate();
    }
}
