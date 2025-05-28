/// <mls shortName="widgetInputBooleanSwitchModern" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputBooleanBase } from './_100554_icaFormsInputBooleanBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    required: 'Obrigatório',
}
const message_en = {
    required: 'Required',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
* Switch deslizante moderno para escolha binária, inspirado em Material UI e Ant Design.
* Suporta label opcional, acessibilidade, animação suave e indicação de erro para campos obrigatórios.
*/
@customElement('widget-input-boolean-switch-modern-100554')
export class WidgetInputBooleanSwitchModern extends IcaFormsInputBooleanBase {
    /**
    * Nome do campo para binding dinâmico.
    * @example name="aceita"
    */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /**
    * Texto opcional exibido como rótulo ao lado do switch.
    * @example label="Ativar notificações"
    */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /**
    * Dica ou ajuda exibida abaixo do switch.
    * @example hint="Você pode alterar depois."
    */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /**
    * Indica se o campo é obrigatório.
    * @example required=true
    */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /**
    * Desabilita a interação com o switch.
    * @example disabled=true
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /**
    * Torna o switch somente leitura.
    * @example readonly=true
    */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /**
    * Define se o switch recebe foco automaticamente.
    * @example autofocus=true
    */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /**
    * Estado atual do switch ("true" = ligado, "false" = desligado).
    * @example checked="true"
    */
    @propertyDataSource({ type: String }) checked: boolean | undefined;
    /**
    * Mensagem de erro customizada.
    * @example errormessage="Campo obrigatório."
    */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /**
    * Posição do label: 'left' ou 'right'.
    * @example labelPosition="left"
    */
    @propertyDataSource({ type: String }) labelPosition: 'left' | 'right' = 'right';
    
    /**
    * Duração da animação do switch em ms.
    * @example animationDuration=200
    */
    @propertyDataSource({ type: Number }) animationDuration: number = 200;

    private get isChecked(): boolean {
        return this.checked?.toString() === 'true' || this.checked === true;
    }
    private get isDisabled(): boolean {
        return !!this.disabled || !!this.readonly;
    }
    private get showError(): boolean {
        return !!this.errormessage;
    }
    private get langMessages(): MessageType {
        const lang = (navigator.language || 'en').slice(0, 2);
        return messages[lang] || messages['en'];
    }
    private onToggle(e: Event) {
        if (this.isDisabled) return;
        const newChecked = !this.isChecked;
        this.checked = newChecked ? true : false;
        this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true, composed: true }));
        this.requestUpdate();
    }
    private onKeyDown(e: KeyboardEvent) {
        if (this.isDisabled) return;
        if (e.code === 'Space' || e.code === 'Enter' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.onToggle(e);
        }
    }
    render() {
        const labelTemplate = this.label ? html`<span class="switch-label">${this.label}${this.required ? html`<span class="switch-required">*</span>` : ''}</span>` : null;
        return html`
<div class="switch-root${this.isDisabled ? ' switch-disabled' : ''}">
${this.labelPosition === 'left' ? labelTemplate : null}
<button
class="switch"
type="button"
role="switch"
aria-checked="${this.isChecked ? 'true' : 'false'}"
?disabled=${this.isDisabled}
tabindex="0"
autofocus=${ifDefined(this.autofocus ? true : undefined)}
@keydown=${this.onKeyDown}
@click=${this.onToggle}
style="--switch-animation-duration: ${this.animationDuration}ms;"
>
<span class="switch-track"></span>
<span class="switch-thumb"></span>
</button>
${this.labelPosition === 'right' ? labelTemplate : null}
${this.hint ? html`<div class="switch-hint">${this.hint}</div>` : ''}
${this.showError ? html`<div class="switch-error-message">${this.errormessage || this.langMessages.required}</div>` : ''}
</div>
`;
    }
}
