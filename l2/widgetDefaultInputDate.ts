/// <mls shortName="widgetDefaultInputDate" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
import { IcaFormsInputDateBase } from './_100554_icaFormsInputDateBase';
/// **collab_i18n_start**
const message_pt = {
  selectDate: 'Selecionar data',
  invalidDate: 'Data inválida',
  prevMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  prevYear: 'Ano anterior',
  nextYear: 'Próximo ano',
  today: 'Hoje',
};
const message_en = {
  selectDate: 'Select date',
  invalidDate: 'Invalid date',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  prevYear: 'Previous year',
  nextYear: 'Next year',
  today: 'Today',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Campo de data com calendário pop-up, seleção manual ou via calendário, bloqueio de datas fora do intervalo, destaque para datas inválidas, responsivo e acessível.
 * @example
 * <widget-default-input-date-100554 name="dataNascimento" value="{{ui.user.birthdate}}" minvalue="1900-01-01" maxvalue="2025-12-31"></widget-default-input-date-100554>
 */
@customElement('widget-default-input-date-100554')
export class WidgetDefaultInputDate extends IcaFormsInputDateBase {
  /** Nome do campo para binding de dados. Exemplo: "dataNascimento" */
  @propertyCompositeDataSource({ type: String }) name: string | undefined;
  /** Texto de ajuda ou dica para o usuário. Exemplo: "Informe sua data de nascimento" */
  @propertyCompositeDataSource({ type: String }) hint: string | undefined;
  /** Valor da data selecionada ou digitada. Exemplo: "2024-06-01" */
  @propertyDataSource({ type: String }) value: string | undefined;
  /** Texto do rótulo do campo. Exemplo: "Data de nascimento" */
  @propertyCompositeDataSource({ type: String }) label: string | undefined;
  /** Indica se o campo é obrigatório. Exemplo: true */
  @propertyDataSource({ type: Boolean }) required: boolean = false;
  /** Indica se o campo está desabilitado. Exemplo: false */
  @propertyDataSource({ type: Boolean }) disabled: boolean = false;
  /** Indica se o campo é somente leitura. Exemplo: false */
  @propertyDataSource({ type: Boolean }) readonly: boolean = false;
  /** Indica se o campo deve receber foco automaticamente. Exemplo: false */
  @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
  /** Padrão de validação para o formato da data. Exemplo: "\\d{4}-\\d{2}-\\d{2}" */
  @propertyDataSource({ type: String }) pattern: string | undefined;
  /** Mensagem de erro exibida quando a data é inválida. Exemplo: "Data inválida" */
  @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
  /** Data máxima permitida para seleção ou entrada. Exemplo: "2025-12-31" */
  @propertyDataSource({ type: String }) maxvalue: string | undefined;
  /** Data mínima permitida para seleção ou entrada. Exemplo: "1900-01-01" */
  @propertyDataSource({ type: String }) minvalue: string | undefined;

  private calendarOpen = false;
  private calendarMonth: number = new Date().getMonth();
  private calendarYear: number = new Date().getFullYear();
  private focusedDay: number | null = null;
  private locale: string = 'pt';

  private get msg(): MessageType {
    return messages[this.locale] || messages['en'];
  }

  private get inputValue(): string {
    return this.value || '';
  }

  private get minDate(): Date | undefined {
    return this.minvalue ? new Date(this.minvalue) : undefined;
  }
  private get maxDate(): Date | undefined {
    return this.maxvalue ? new Date(this.maxvalue) : undefined;
  }

  private get selectedDate(): Date | undefined {
    if (!this.value) return undefined;
    const d = new Date(this.value);
    return isNaN(d.getTime()) ? undefined : d;
  }

  private isDateValid(date: Date): boolean {
    if (isNaN(date.getTime())) return false;
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    return true;
  }

  private openCalendar() {
    if (this.disabled || this.readonly) return;
    this.calendarOpen = true;
    const refDate = this.selectedDate || new Date();
    this.calendarMonth = refDate.getMonth();
    this.calendarYear = refDate.getFullYear();
    this.focusedDay = refDate.getDate();
    this.requestUpdate();
  }

  private closeCalendar() {
    this.calendarOpen = false;
    this.focusedDay = null;
    this.requestUpdate();
  }

  private onInputChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.value = val;
    const d = new Date(val);
    if (!this.isDateValid(d)) {
      this.errormessage = this.msg.invalidDate;
    } else {
      this.errormessage = '';
    }
    this.requestUpdate();
  }

  private onInputFocus() {
    this.openCalendar();
  }

  private onInputBlur(e: FocusEvent) {
    setTimeout(() => {
      if (!this.shadowRoot?.activeElement || !this.shadowRoot.contains(document.activeElement)) {
        this.closeCalendar();
      }
    }, 150);
  }

  private onCalendarDayClick(day: number) {
    const date = new Date(this.calendarYear, this.calendarMonth, day);
    if (!this.isDateValid(date)) return;
    const iso = date.toISOString().slice(0, 10);
    this.value = iso;
    this.errormessage = '';
    this.closeCalendar();
    this.requestUpdate();
  }

  private prevMonth() {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.requestUpdate();
  }
  private nextMonth() {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.requestUpdate();
  }
  private prevYear() {
    this.calendarYear--;
    this.requestUpdate();
  }
  private nextYear() {
    this.calendarYear++;
    this.requestUpdate();
  }

  private renderCalendar() {
    const month = this.calendarMonth;
    const year = this.calendarYear;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay();
    const today = new Date();
    const selected = this.selectedDate;
    const weeks: Array<Array<number | null>> = [];
    let week: Array<number | null> = [];
    let day = 1;
    for (let i = 0; i < startWeekDay; i++) week.push(null);
    while (day <= daysInMonth) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      day++;
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return html`
      <div class="calendar-popup" role="dialog" aria-modal="true">
        <div class="calendar-header">
          <button type="button" class="nav-btn" @click=${this.prevYear} aria-label="${this.msg.prevYear}">&laquo;</button>
          <button type="button" class="nav-btn" @click=${this.prevMonth} aria-label="${this.msg.prevMonth}">&lsaquo;</button>
          <span class="calendar-title">${year} - ${('0' + (month + 1)).slice(-2)}</span>
          <button type="button" class="nav-btn" @click=${this.nextMonth} aria-label="${this.msg.nextMonth}">&rsaquo;</button>
          <button type="button" class="nav-btn" @click=${this.nextYear} aria-label="${this.msg.nextYear}">&raquo;</button>
        </div>
        <div class="calendar-grid" role="grid">
          <div class="calendar-row calendar-weekdays">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
          </div>
          ${weeks.map(week => html`
            <div class="calendar-row">
              ${week.map(dayNum => {
      if (!dayNum) return html`<span class="calendar-cell empty"></span>`;
      const date = new Date(year, month, dayNum);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selected && date.toDateString() === selected.toDateString();
      const isInvalid = !this.isDateValid(date);
      return html`<button
                  type="button"
                  class="calendar-cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isInvalid ? ' invalid' : ''}"
                  ?disabled=${isInvalid}
                  aria-selected=${isSelected}
                  tabindex="-1"
                  @click=${() => this.onCalendarDayClick(dayNum)}
                >${dayNum}</button>`;
    })}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  render() {
    const error = !!this.errormessage;
    return html`
      <div class="input-date-root${error ? ' error' : ''}">
        ${this.label ? html`<label class="input-date-label">${this.label}</label>` : nothing}
        <div class="input-date-wrapper">
          <input
            type="date"
            class="input-date-field"
            name=${ifDefined(this.name)}
            .value=${this.inputValue}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            min=${ifDefined(this.minvalue)}
            max=${ifDefined(this.maxvalue)}
            pattern=${ifDefined(this.pattern)}
            ?autofocus=${this.autofocus}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby="${this.hint ? 'hint' : ''}${error ? ' error' : ''}"
            @focus=${this.onInputFocus}
            @blur=${this.onInputBlur}
            @input=${this.onInputChange}
          />
          <button type="button" class="calendar-toggle" @click=${this.openCalendar} aria-label="${this.msg.selectDate}" ?disabled=${this.disabled || this.readonly} tabindex="-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="5" width="14" height="12" rx="2" stroke="#408EC8" stroke-width="1.5"/><path d="M7 3V7" stroke="#408EC8" stroke-width="1.5" stroke-linecap="round"/><path d="M13 3V7" stroke="#408EC8" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          ${this.calendarOpen ? this.renderCalendar() : nothing}
        </div>
        ${this.hint ? html`<div id="hint" class="input-date-hint">${this.hint}</div>` : nothing}
        ${error ? html`<div id="error" class="input-date-error">${this.errormessage}</div>` : nothing}
      </div>
    `;
  }
}
