/// <mls shortName="widgetLockToggleAppleStyle" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
import { IcaFormsInputBooleanBase } from './_100554_icaFormsInputBooleanBase';
/// **collab_i18n_start**
const message_pt = {
    locked: 'Bloqueado',
    unlocked: 'Desbloqueado',
    required: 'Campo obrigatório',
};
const message_en = {
    locked: 'Locked',
    unlocked: 'Unlocked',
    required: 'Required field',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget toggle no formato de cadeado inspirado em Apple/iOS, com animação suave, label opcional, acessibilidade e indicação de erro.
 * Ideal para permissões, travamento de seções ou autenticação.
 * @example
 * <widget-lock-toggle-apple-style-100554 checked="{{ui.locked}}" label="Travar seção" ariaLabel="Travar seção" required="true"></widget-lock-toggle-apple-style-100554>
 */
@customElement('widget-lock-toggle-apple-style-100554')
export class WidgetLockToggleAppleStyle extends IcaFormsInputBooleanBase {
    /** Nome do campo para binding dinâmico */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Label opcional exibida ao lado do cadeado */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Texto de dica (não exibido neste widget) */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Indica se o campo é obrigatório */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /** Indica se o campo está desabilitado */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /** Indica se o campo é somente leitura */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /** Indica se o campo deve receber foco automaticamente */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /** Estado do toggle: true para cadeado fechado, false para aberto */
    @propertyDataSource({ type: Boolean }) checked: boolean | undefined;
    /** Mensagem de erro customizada */
    @propertyCompositeDataSource({ type: Boolean }) errormessage: string | undefined;
    /** Descrição para leitores de tela */

    @propertyDataSource({ type: Number }) animationDuration: number | undefined;
    private get _lang(): string {
        return (navigator.language || 'en').startsWith('pt') ? 'pt' : 'en';
    }
    private get _msg(): MessageType {
        return messages[this._lang];
    }
    private get _isError(): boolean {
        return !!this.required && !this.checked && !this.disabled && !this.readonly;
    }

    private _onToggle(e: Event) {
        e.preventDefault();
        if (this.disabled?.toString() === 'true' || this.readonly?.toString() === 'true') return;
        this.checked = this.checked?.toString() === 'true' ? false : true;
        this.requestUpdate();
    }
    private _onKeyDown(e: KeyboardEvent) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onToggle(e);
        }
    }
    render() {

        const duration = typeof this.animationDuration === 'number' ? `${this.animationDuration}ms` : '300ms';
        return html`
<div
class="lock-toggle-root${this._isError ? ' error' : ''}${this.disabled?.toString() === 'true' ? ' disabled' : ''}${this.readonly?.toString() === 'true' ? ' readonly' : ''}"
tabindex="${this.disabled?.toString() === 'true' || this.readonly?.toString() === 'true' ? -1 : 0}"
role="switch"
@keydown=${this._onKeyDown}
@click=${this._onToggle}
>
<span class="lock-toggle-icon" style="transition: color ${duration};">
${this.checked?.toString() === 'true' ? this._renderLocked(duration) : this._renderUnlocked(duration)}
</span>
${this.label ? html`<span class="lock-toggle-label">${this.label}</span>` : nothing}
</div>
${this._isError ? html`<div class="lock-toggle-error">${this.errormessage || this._msg.required}</div>` : nothing}
`;
    }
    private _renderLocked(duration: string) {
        return html`
<svg class="lock-svg" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style="transition: stroke ${duration}, fill ${duration};">
<rect x="7" y="13" width="14" height="9" rx="3" fill="none" stroke="var(--lock-color, #1C91CD)" stroke-width="2"/>
<path d="M9 13V9a5 5 0 0 1 10 0v4" fill="none" stroke="var(--lock-color, #1C91CD)" stroke-width="2"/>
<circle cx="14" cy="18" r="1.5" fill="var(--lock-color, #1C91CD)"/>
</svg>`;
    }
    private _renderUnlocked(duration: string) {
        return html`
<svg class="lock-svg" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style="transition: stroke ${duration}, fill ${duration};">
<rect x="7" y="13" width="14" height="9" rx="3" fill="none" stroke="var(--lock-color, #C0C0C0)" stroke-width="2"/>
<path d="M9 13V9a5 5 0 0 1 10 0" fill="none" stroke="var(--lock-color, #C0C0C0)" stroke-width="2"/>
<circle cx="14" cy="18" r="1.5" fill="var(--lock-color, #C0C0C0)"/>
</svg>`;
    }
}
