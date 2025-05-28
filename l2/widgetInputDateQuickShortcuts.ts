/// <mls shortName="widgetInputDateQuickShortcuts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputDateBase } from './_100554_icaFormsInputDateBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    shortcuts: 'Atalhos',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    nextWeek: 'Próxima semana',
    invalidPeriod: 'Data fora do período permitido',
};
const message_en = {
    shortcuts: 'Shortcuts',
    today: 'Today',
    tomorrow: 'Tomorrow',
    nextWeek: 'Next week',
    invalidPeriod: 'Date out of allowed period',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Widget de seleção de data com atalhos rápidos, validação de período, estado de erro, label e hint customizáveis, e suporte a teclado.
 */
@customElement('widget-input-date-quick-shortcuts-100554')
export class WidgetInputDateQuickShortcuts extends IcaFormsInputDateBase {
    /** Nome do campo para binding
     * @example name="dataNascimento"
     */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Texto de dica exibido abaixo do campo
     * @example hint="Selecione uma data válida"
     */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Data selecionada no campo (YYYY-MM-DD)
     * @example value="2025-05-26"
     */
    @propertyDataSource({ type: String }) value: string | undefined;
    /** Texto do rótulo do campo
     * @example label="Data de início"
     */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Campo obrigatório
     * @example required=true
     */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /** Campo desabilitado
     * @example disabled=true
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /** Expressão regular para validação
     * @example pattern="\\d{4}-\\d{2}-\\d{2}"
     */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /** Mensagem de erro customizada
     * @example errormessage="Data inválida"
     */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /** Autofocus no campo
     * @example autofocus=true
     */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /** Valor máximo permitido (YYYY-MM-DD)
     * @example maxvalue="2025-12-31"
     */
    @propertyDataSource({ type: String }) maxvalue: string | undefined;
    /** Valor mínimo permitido (YYYY-MM-DD)
     * @example minvalue="2020-01-01"
     */
    @propertyDataSource({ type: String }) minvalue: string | undefined;
    /** Campo somente leitura
     * @example readonly=true
     */
    @propertyDataSource({ type: Boolean }) readonly: boolean = false;
    /** Lista de atalhos rápidos para seleção de datas
     * @example quickShortcuts=['Hoje','Amanhã','Próxima semana']
     */
    @propertyDataSource() quickShortcuts: string[] = [message_pt.today, message_pt.tomorrow, message_pt.nextWeek];
    /** Habilita suporte a navegação e seleção via teclado
     * @example keyboardSupport=true
     */
    @propertyDataSource({ type: Boolean }) keyboardSupport: boolean = true;
    /** Configuração para validação de período entre minvalue e maxvalue
     * @example validationPeriod=true
     */
    @propertyDataSource({ type: Boolean }) validationPeriod: boolean = true;
    /** Indica se o campo está em estado de erro para feedback visual
     * @example errorState=true
     */
    @propertyDataSource({ type: Boolean }) errorState: boolean = false;

    private get _messages(): MessageType {
        const lang = (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
        return messages[lang];
    }

    private get _errorMessage(): string {
        if (this.errorState) {
            if (this.errormessage) return this.errormessage;
            return this._messages.invalidPeriod;
        }
        return '';
    }

    private _onInputChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const val = input.value;
        if (this.validationPeriod && !this._isDateInPeriod(val)) {
            this.errorState = true;
            this.value = val;
            this.requestUpdate();
            return;
        }
        this.value = val;
        this.errorState = false;
        this.requestUpdate();
    }

    private _isDateInPeriod(val: string): boolean {
        if (!val) return true;
        const date = new Date(val);
        if (this.minvalue && date < new Date(this.minvalue)) return false;
        if (this.maxvalue && date > new Date(this.maxvalue)) return false;
        return true;
    }

    private _shortcutToDate(shortcut: string): string {
        const today = new Date();
        if (shortcut === this._messages.today) {
            return today.toISOString().slice(0, 10);
        }
        if (shortcut === this._messages.tomorrow) {
            const d = new Date(today);
            d.setDate(d.getDate() + 1);
            return d.toISOString().slice(0, 10);
        }
        if (shortcut === this._messages.nextWeek) {
            const d = new Date(today);
            d.setDate(d.getDate() + 7);
            return d.toISOString().slice(0, 10);
        }
        return '';
    }

    private _onShortcutClick(shortcut: string) {
        const val = this._shortcutToDate(shortcut);
        if (val && (!this.validationPeriod || this._isDateInPeriod(val))) {
            this.value = val;
            this.errorState = false;
        } else {
            this.value = val;
            this.errorState = true;
        }
        this.requestUpdate();
    }

    private _onInputKeydown(e: KeyboardEvent) {
        if (!this.keyboardSupport) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const first = this.quickShortcuts && this.quickShortcuts.length ? 0 : -1;
            if (first >= 0) {
                const btn = this.renderRoot?.querySelector('.shortcut-btn');
                if (btn) (btn as HTMLElement).focus();
            }
        }
    }

    private _onShortcutKeydown(e: KeyboardEvent, idx: number) {
        if (!this.keyboardSupport) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const next = this.renderRoot?.querySelectorAll('.shortcut-btn')[idx + 1];
            if (next) (next as HTMLElement).focus();
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = this.renderRoot?.querySelectorAll('.shortcut-btn')[idx - 1];
            if (prev) (prev as HTMLElement).focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const input = this.renderRoot?.querySelector('input[type="date"]');
            if (input) (input as HTMLElement).focus();
        }
    }

    render() {
        return html`
<div class="widget-input-date-quick-shortcuts__container">
${this.label ? html`<label class="widget-input-date-quick-shortcuts__label">${this.label}</label>` : ''}
<input
 type="date"
 class="widget-input-date-quick-shortcuts__input${this.errorState ? ' widget-input-date-quick-shortcuts__input--error' : ''}"
 name=${ifDefined(this.name)}
 .value=${ifDefined(this.value)}
 ?disabled=${this.disabled}
 ?readonly=${this.readonly}
 ?required=${this.required}
 min=${ifDefined(this.minvalue)}
 max=${ifDefined(this.maxvalue)}
 pattern=${ifDefined(this.pattern)}
 ?autofocus=${this.autofocus}
 @input=${this._onInputChange}
 @keydown=${this._onInputKeydown}
 />
${this.hint ? html`<div class="widget-input-date-quick-shortcuts__hint">${this.hint}</div>` : ''}
${this.quickShortcuts && this.quickShortcuts.length ? html`
<div class="widget-input-date-quick-shortcuts__shortcuts" aria-label="${this._messages.shortcuts}">
${this.renderquickShortcuts()}
</div>
` : ''}
${this._errorMessage ? html`<div class="widget-input-date-quick-shortcuts__error">${this._errorMessage}</div>` : ''}
</div>
`;
    }

    private renderquickShortcuts() {
    
        if (typeof this.quickShortcuts === 'string') this.quickShortcuts = JSON.parse(this.quickShortcuts);
        if (this.quickShortcuts.length > 0) {
            return html`${this.quickShortcuts.map((shortcut, idx) => html`
<button
 type="button"
 class="shortcut-btn"
 @click=${() => this._onShortcutClick(shortcut)}
 @keydown=${(e: KeyboardEvent) => this._onShortcutKeydown(e, idx)}
 tabindex="0"
>${shortcut}</button>
`)}`
        }

        return html``;
    }
}
