/// <mls shortName="widgetInputTimeDialMaterial" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputTimeBase } from './_100554_icaFormsInputTimeBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    selectTime: 'Selecionar horário',
    invalid: 'Horário inválido',
    am: 'AM',
    pm: 'PM',
}
const message_en = {
    selectTime: 'Select time',
    invalid: 'Invalid time',
    am: 'AM',
    pm: 'PM',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
 * Widget para seleção de horário com seletor circular tipo relógio (dial), alternância entre modos 12h/24h, rotação suave do ponteiro, suporte a teclado, autofocus e validação por pattern.
 */
@customElement('widget-input-time-dial-material-100554')
export class WidgetInputTimeDialMaterial extends IcaFormsInputTimeBase {
    /** Nome do campo para binding de dados
     * @example "horario"
     */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Texto do rótulo exibido no campo
     * @example "Horário"
     */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /** Dica ou ajuda exibida abaixo do campo
     * @example "Selecione um horário válido"
     */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined;
    /** Indica se o campo é obrigatório
     * @example true
     */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /** Indica se o campo está desabilitado
     * @example true
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /** Indica se o campo está somente leitura
     * @example true
     */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /** Define se o campo recebe foco automaticamente
     * @example true
     */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /** Valor do horário selecionado (formato HH:mm ou hh:mm)
     * @example "13:45"
     */
    @propertyDataSource({ type: String }) value: string | undefined;
    /** Expressão regular para validação do valor do horário
     * @example "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
     */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /** Mensagem exibida em caso de erro de validação
     * @example "Horário inválido"
     */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /** Placeholder do campo
     * @example "00:00"
     */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /** Alterna entre modo 12 horas (true) e 24 horas (false)
     * @example true
     */
    @propertyDataSource({ type: Boolean }) mode12h: boolean = false;
    /** Habilita rotação suave do ponteiro do relógio
     * @example true
     */
    @propertyDataSource({ type: Boolean }) smoothRotation: boolean = true;
    /** Habilita suporte a navegação e entrada via teclado
     * @example true
     */
    @propertyDataSource({ type: Boolean }) keyboardSupport: boolean = true;
    /** Atributo aria-label para acessibilidade
     * @example "Selecionar horário"
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    private _open: boolean = false;
    private _selecting: 'hour' | 'minute' = 'hour';
    private _tempHour: number = 12;
    private _tempMinute: number = 0;
    private _tempAmPm: 'AM' | 'PM' = 'AM';
    private _error: string = '';
    private get __config() { return this.pattern; }
    private get _locale(): MessageType {
        return messages['pt'];
    }
    private get _displayValue(): string {
        if (!this.value) return '';
        return this.value;
    }
    private _parseValue(val: string | undefined): { hour: number, minute: number, ampm?: 'AM' | 'PM' } {
        if (!val) return { hour: 12, minute: 0, ampm: 'AM' };
        const m12 = this.mode12h;
        const m = val.match(/^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i);
        if (!m) return { hour: 12, minute: 0, ampm: 'AM' };
        let hour = parseInt(m[1], 10);
        let minute = parseInt(m[2], 10);
        let ampm: 'AM' | 'PM' = 'AM';
        if (m12) {
            if (m[3]) ampm = m[3].toUpperCase() === 'PM' ? 'PM' : 'AM';
            if (hour === 0) hour = 12;
            if (hour > 12) hour = hour - 12;
        }
        return { hour, minute, ampm };
    }
    private _formatValue(hour: number, minute: number, ampm?: 'AM' | 'PM'): string {
        if (this.mode12h) {
            const h = hour < 10 ? '0' + hour : '' + hour;
            const m = minute < 10 ? '0' + minute : '' + minute;
            return `${h}:${m} ${ampm || 'AM'}`;
        } else {
            const h24 = this.mode12h && ampm === 'PM' ? (hour === 12 ? 12 : hour + 12) : (hour === 12 && ampm === 'AM' ? 0 : hour);
            const h = h24 < 10 ? '0' + h24 : '' + h24;
            const m = minute < 10 ? '0' + minute : '' + minute;
            return `${h}:${m}`;
        }
    }
    private _openDial() {
        if (this.disabled || this.readonly) return;
        const parsed = this._parseValue(this.value);
        this._tempHour = parsed.hour;
        this._tempMinute = parsed.minute;
        this._tempAmPm = parsed.ampm || 'AM';
        this._selecting = 'hour';
        this._open = true;
        this._error = '';
        this.requestUpdate();
    }
    private _closeDial() {
        this._open = false;
        this._error = '';
        this.requestUpdate();
    }
    private _onDialSelect(e: CustomEvent) {
        const { hour, minute, ampm } = e.detail;
        const val = this._formatValue(hour, minute, ampm);
        if (this.pattern && !(new RegExp(this.pattern).test(val))) {
            this._error = this.errormessage || this._locale.invalid;
            return;
        }
        this.value = val;
        this._closeDial();
    }
    private _onInput(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        if (this.pattern && !(new RegExp(this.pattern).test(val))) {
            this._error = this.errormessage || this._locale.invalid;
        } else {
            this._error = '';
        }
        this.value = val;
        this.requestUpdate();
    }
    private _toggleMode12h() {
        if (this.disabled || this.readonly) return;
        this.mode12h = !this.mode12h;
        const parsed = this._parseValue(this.value);
        this.value = this._formatValue(parsed.hour, parsed.minute, parsed.ampm);
        this.requestUpdate();
    }
    private _onDialHourSelect(hour: number) {
        this._tempHour = hour;
        this._selecting = 'minute';
        this.requestUpdate();
    }
    private _onDialMinuteSelect(minute: number) {
        this._tempMinute = minute;
        if (this.mode12h) {
            this.requestUpdate();
        } else {
            this._onDialConfirm();
        }
    }
    private _onDialAmPmSelect(ampm: 'AM' | 'PM') {
        this._tempAmPm = ampm;
        this._onDialConfirm();
    }
    private _onDialConfirm() {
        const val = this._formatValue(this._tempHour, this._tempMinute, this._tempAmPm);
        if (this.pattern && !(new RegExp(this.pattern).test(val))) {
            this._error = this.errormessage || this._locale.invalid;
            return;
        }
        this.value = val;
        this._closeDial();
    }
    private _onDialCancel() {
        this._closeDial();
    }
    private _onInputKeyDown(e: KeyboardEvent) {
        if (!this.keyboardSupport) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._openDial();
        }
    }
    render() {
        return html`
<div class="cc-time-field">
<label class="cc-label">${this.label || this._locale.selectTime}${this.required ? '*' : nothing}</label>
<div class="cc-input-wrap">
<input
class="cc-input"
type="text"
inputmode="numeric"
?disabled=${this.disabled}
?readonly=${this.readonly}
?required=${this.required}
placeholder=${ifDefined(this.placeholder)}
.value=${this._displayValue}
autofocus=${this.autofocus}
aria-label=${this.ariaLabel || this.label || this._locale.selectTime}
@focus=${() => { if (this.autofocus) this._openDial(); }}
@keydown=${this._onInputKeyDown}
@input=${this._onInput}
/>
<button class="cc-dial-btn" type="button" @click=${this._openDial} ?disabled=${this.disabled || this.readonly} tabindex="-1">
<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
</button>
${this.mode12h !== undefined ? html`<button class="cc-mode-btn" type="button" @click=${this._toggleMode12h} ?disabled=${this.disabled || this.readonly} tabindex="-1">${this.mode12h ? '12h' : '24h'}</button>` : nothing}
</div>
${this.hint ? html`<div class="cc-hint">${this.hint}</div>` : nothing}
${this._error ? html`<div class="cc-error">${this._error}</div>` : nothing}
${this._open ? this._renderDial() : nothing}
</div>
`;
    }
    private _renderDial() {
        const hour = this._tempHour;
        const minute = this._tempMinute;
        const ampm = this._tempAmPm;
        const selecting = this._selecting;
        const mode12h = this.mode12h;
        const hours = mode12h ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
        return html`
<div class="cc-dial-modal" tabindex="-1">
<div class="cc-dial-backdrop" @click=${this._onDialCancel}></div>
<div class="cc-dial-content">
<div class="cc-dial-header">
<span class="cc-dial-hour ${selecting === 'hour' ? 'active' : ''}" @click=${() => { this._selecting = 'hour'; this.requestUpdate(); }}>${hour < 10 ? '0' + hour : hour}</span>:
<span class="cc-dial-minute ${selecting === 'minute' ? 'active' : ''}" @click=${() => { this._selecting = 'minute'; this.requestUpdate(); }}>${minute < 10 ? '0' + minute : minute}</span>
${mode12h ? html`<span class="cc-dial-ampm">
<button class="cc-ampm-btn ${ampm === 'AM' ? 'active' : ''}" @click=${() => this._onDialAmPmSelect('AM')}>${this._locale.am}</button>
<button class="cc-ampm-btn ${ampm === 'PM' ? 'active' : ''}" @click=${() => this._onDialAmPmSelect('PM')}>${this._locale.pm}</button>
</span>` : nothing}
</div>
<div class="cc-dial-body">
${selecting === 'hour' ? html`
<div class="cc-dial-clock">
${hours.map(h => {
            const angle = (360 / hours.length) * h - 90;
            const rad = angle * Math.PI / 180;
            const x = 50 + 40 * Math.cos(rad);
            const y = 50 + 40 * Math.sin(rad);
            return html`<button class="cc-dial-num ${h === hour ? 'selected' : ''}" style="left:${x}%;top:${y}%" @click=${() => this._onDialHourSelect(h)}>${mode12h && h === 0 ? 12 : h}</button>`;
        })}

</div>
` : html`
<div class="cc-dial-clock">
${minutes.map(m => {
            const angle = (360 / minutes.length) * (m / 5) - 90;
            const rad = angle * Math.PI / 180;
            const x = 50 + 40 * Math.cos(rad);
            const y = 50 + 40 * Math.sin(rad);
            return html`<button class="cc-dial-num ${m === minute ? 'selected' : ''}" style="left:${x}%;top:${y}%" @click=${() => this._onDialMinuteSelect(m)}>${m < 10 ? '0' + m : m}</button>`;
        })}

</div>
`}
</div>
<div class="cc-dial-actions">
<button class="cc-dial-cancel" @click=${this._onDialCancel}>Cancelar</button>
<button class="cc-dial-ok" @click=${this._onDialConfirm}>OK</button>
</div>
</div>
</div>
`;
    }
}
