/// <mls shortName="widgetInputTimeIncrement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputTimeBase } from './_100554_icaFormsInputTimeBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    incHour: 'Incrementar hora',
    decHour: 'Decrementar hora',
    incMinute: 'Incrementar minuto',
    decMinute: 'Decrementar minuto',
    am: 'AM',
    pm: 'PM',
    invalid: 'Horário inválido',
};
const message_en = {
    incHour: 'Increase hour',
    decHour: 'Decrease hour',
    incMinute: 'Increase minute',
    decMinute: 'Decrease minute',
    am: 'AM',
    pm: 'PM',
    invalid: 'Invalid time',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget para entrada de tempo com incremento configurável, suporte a formatos 12h/24h, máscara HH:MM, validação por pattern e feedback visual de erro.
 * Ideal para agendamentos rápidos em dispositivos móveis ou POS.
 */
@customElement('widget-input-time-increment-100554')
export class WidgetInputTimeIncrement extends IcaFormsInputTimeBase {
    /**
     * Nome do campo para binding
     * @example name="horario"
     */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /**
     * Texto do rótulo do campo
     * @example label="Horário"
     */
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    /**
     * Texto de ajuda ou dica
     * @example hint="Informe o horário desejado"
     */
    @propertyCompositeDataSource({ type: String }) hint: string | undefined = '';
    /**
     * Define se o campo é obrigatório
     * @example required=true
     */
    @propertyDataSource({ type: Boolean }) required: boolean | undefined;
    /**
     * Desabilita o campo
     * @example disabled=true
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
    /**
     * Define o campo como somente leitura
     * @example readonly=true
     */
    @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
    /**
     * Foco automático no campo ao carregar
     * @example autofocus=true
     */
    @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
    /**
     * Valor atual do tempo no campo (HH:MM)
     * @example value="13:45"
     */
    @propertyDataSource({ type: String }) value: string | undefined;
    /**
     * Expressão regular para validação do formato HH:MM
     * @example pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
     */
    @propertyDataSource({ type: String }) pattern: string | undefined;
    /**
     * Mensagem exibida em caso de erro de validação
     * @example errormessage="Horário inválido"
     */
    @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
    /**
     * Placeholder do campo
     * @example placeholder="00:00"
     */
    @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
    /**
     * Incremento em minutos para os botões de mais/menos
     * @example step=5
     */
    @propertyDataSource({ type: Number }) step: number = 5;
    /**
     * Booleano para definir formato 24h (true) ou 12h com AM/PM (false)
     * @example format24h=true
     */
    @propertyDataSource({ type: Boolean }) format24h: boolean = true;
    /**
     * Exibe botões para incrementar/decrementar horas e minutos
     * @example showIncrementButtons=true
     */
    @propertyDataSource({ type: Boolean }) showIncrementButtons: boolean = true;
    /**
     * Máscara de digitação para o campo, padrão 'HH:MM'
     * @example mask="HH:MM"
     */
    @propertyDataSource({ type: String }) mask: string = 'HH:MM';
    /**
     * Exibe feedback visual em caso de erro de validação
     * @example showErrorFeedback=true
     */
    @propertyDataSource({ type: Boolean }) showErrorFeedback: boolean = true;
    /**
     * Acessibilidade: rótulo ARIA
     * @example ariaLabel="Campo de horário"
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    private error: string = '';
    private ampm: 'AM' | 'PM' = 'AM';
    private get __configStep() { return typeof this.step === 'number' && this.step > 0 ? this.step : 5; }
    private get __messages(): MessageType {
        return messages[(navigator.language || 'pt').startsWith('pt') ? 'pt' : 'en'];
    }
    private parseTime(val: string | undefined): { hour: number, minute: number } | null {
        if (!val) return null;
        const match = val.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;
        let hour = parseInt(match[1], 10);
        let minute = parseInt(match[2], 10);
        if (isNaN(hour) || isNaN(minute)) return null;
        return { hour, minute };
    }
    private formatTime(hour: number, minute: number): string {
        const h = hour < 10 ? '0' + hour : '' + hour;
        const m = minute < 10 ? '0' + minute : '' + minute;
        return `${h}:${m}`;
        //return `${h}`
    }
    private handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        let val = input.value;
        if (this.mask === 'HH:MM') {
            val = val.replace(/[^\d:]/g, '').slice(0, 5);
            if (val.length === 2 && !val.includes(':')) val += ':';
        }
        this.value = val;
        this.validate();
        this.requestUpdate();
    }
    private handleBlur() {
        this.validate();
        this.requestUpdate();
    }
    private validate() {
        if (!this.value) {
            this.error = '';
            return;
        }
        if (this.pattern) {
            const re = new RegExp(this.pattern);
            if (!re.test(this.value)) {
                this.error = this.errormessage || this.__messages.invalid;
                return;
            }
        }
        const parsed = this.parseTime(this.value);
        if (!parsed) {
            this.error = this.errormessage || this.__messages.invalid;
            return;
        }
        if (!this.format24h && (parsed.hour < 1 || parsed.hour > 12)) {
            this.error = this.errormessage || this.__messages.invalid;
            return;
        }
        if (parsed.minute < 0 || parsed.minute > 59) {
            this.error = this.errormessage || this.__messages.invalid;
            return;
        }
        this.error = '';
    }
    private increment(type: 'hour' | 'minute', dir: 1 | -1) {
        const parsed = this.parseTime(this.value);
        let hour = parsed ? parsed.hour : (this.format24h ? 0 : 12);
        let minute = parsed ? parsed.minute : 0;
        if (type === 'hour') {
            hour += dir;
            if (this.format24h) {
                if (hour > 23) hour = 0;
                if (hour < 0) hour = 23;
            } else {
                if (hour > 12) hour = 1;
                if (hour < 1) hour = 12;
            }
        } else {
            minute += dir * this.__configStep;
            if (minute > 59) {
                minute = minute % 60;
                hour += 1;
                if (this.format24h) {
                    if (hour > 23) hour = 0;
                } else {
                    if (hour > 12) hour = 1;
                }
            }
            if (minute < 0) {
                minute = 60 + minute;
                hour -= 1;
                if (this.format24h) {
                    if (hour < 0) hour = 23;
                } else {
                    if (hour < 1) hour = 12;
                }
            }
        }
        if (!this.format24h) {
            if (this.ampm === 'AM' && hour === 12 && dir === 1 && type === 'hour') this.ampm = 'PM';
            if (this.ampm === 'PM' && hour === 12 && dir === 1 && type === 'hour') this.ampm = 'AM';
        }
        this.value = this.formatTime(hour, minute);
        this.validate();
        this.requestUpdate();
    }
    private toggleAMPM() {        
        this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
        this.requestUpdate();
    }
    render() {
        const parsed = this.parseTime(this.value);
        let hour = parsed ? parsed.hour : (this.format24h ? 0 : 12);
        let minute = parsed ? parsed.minute : 0;
        let ampm = this.ampm;
        if (!this.format24h && parsed) {
            if (hour >= 12) ampm = 'PM';
            else ampm = 'AM';
        }
        const inputValue = this.value || '';
        return html`
<div class="input-time-wrapper">
${this.label ? html`<label class="input-time-label">${this.label}</label>` : nothing}
<div class="input-time-field ${this.showErrorFeedback && this.error ? 'input-time-error' : ''}">
${this.showIncrementButtons ? html`
<button type="button" class="btn-inc" @click=${() => this.increment('hour', 1)} ?disabled=${this.disabled || this.readonly} aria-label="${this.__messages.incHour}">↑</button>
` : nothing}
<input
class="input-time-input"
type="text"
inputmode="numeric"
maxlength="5"
placeholder=${ifDefined(this.placeholder || 'HH:MM')}
.value=${inputValue}
name=${ifDefined(this.name)}
?disabled=${this.disabled}
?readonly=${this.readonly}
?required=${this.required}
pattern=${ifDefined(this.pattern)}
autofocus=${this.autofocus}
aria-label=${this.ariaLabel}
@input=${this.handleInput}
@blur=${this.handleBlur}
/>
${this.showIncrementButtons ? html`
<button type="button" class="btn-dec" @click=${() => this.increment('hour', -1)} ?disabled=${this.disabled || this.readonly} aria-label="${this.__messages.decHour}">↓</button>
` : nothing}
<span class="input-time-sep">:</span>
${this.showIncrementButtons ? html`
<button type="button" class="btn-inc" @click=${() => this.increment('minute', 1)} ?disabled=${this.disabled || this.readonly} aria-label="${this.__messages.incMinute}">↑</button>
` : nothing}
<input
class="input-time-input input-time-minute"
type="text"
inputmode="numeric"
maxlength="2"
.value=${minute < 10 ? '0' + minute : '' + minute}
?disabled=${this.disabled}
?readonly=${this.readonly}
@input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 2);
                this.value = this.formatTime(hour, parseInt(v || '0', 10));
                this.validate();
                this.requestUpdate();
            }}
/>
${this.showIncrementButtons ? html`
<button type="button" class="btn-dec" @click=${() => this.increment('minute', -1)} ?disabled=${this.disabled || this.readonly} aria-label="${this.__messages.decMinute}">↓</button>
` : nothing}
${!this.format24h ? html`
<button type="button" class="btn-ampm" @click=${this.toggleAMPM} ?disabled=${this.disabled || this.readonly}>${this.ampm}</button>
` : nothing}
</div>
${this.hint ? html`<div class="input-time-hint">${this.hint}</div>` : nothing}
${this.showErrorFeedback && this.error ? html`<div class="input-time-error-message">${this.error}</div>` : nothing}
</div>
`;
    }
}
