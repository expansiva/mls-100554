/// <mls shortName="wcDatePickerRangeCustom" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, nothing, ifDefined } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaFormsInputDateRangeBase } from './_100554_icaFormsInputDateRangeBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

/**  
 * Componente para seleção de intervalo de datas (date range picker), com suporte a limites mínimos/máximos e datas bloqueadas.
 *
 * Estrutura do render:
 * <div class="date-picker-range-wrapper">
 *   <div class="form_error_message">...</div> <!-- se erro -->
 *   <label>...</label>
 *   <div class="date-picker-input" tabindex="0">...</div>
 *   <div class="dropdown-calendar"> <!-- visível se aberto -->
 *     <div class="calendar-container">
 *       ...
 *     </div>
 *     <div class="calendar-actions">...</div>
 *   </div>
 *   <div class="form_hint_message">...</div>
 * </div>
 */
@customElement('wc-date-picker-range-custom-100554')
export class IcaDatePickerRangeCustom extends IcaFormsInputDateRangeBase {
  /** Data inicial do intervalo selecionado. Exemplo: "2024-06-01" */
  @propertyDataSource({ type: String }) startValue?: string; 
  /** Data final do intervalo selecionado. Exemplo: "2024-06-10" */
  @propertyDataSource({ type: String }) endValue?: string;
  /** Data mínima permitida para seleção. Exemplo: "2024-06-01" */
  @property({ type: String }) minvalue?: string;
  /** Data máxima permitida para seleção. Exemplo: "2024-12-31" */
  @property({ type: String }) maxvalue?: string;
  /** Lista de datas bloqueadas (formato ISO: "2024-06-05"). */
  @property({ type: Array }) blockedDates: string[] = [];
  /** Rótulo para o campo de seleção. */
  @property({ type: String }) label: string | undefined;
  /** Nome do campo. */
  @property({ type: String }) name: string | undefined;
  /** Placeholder exibido no input. */
  @property({ type: String }) placeHolder: string | undefined;
  /** Dica para o usuário. */
  @propertyCompositeDataSource({ type: String }) hint: string = '';
  /** Define se o campo é obrigatório. */
  @property({ type: Boolean }) required: boolean = false;
  /** Define se o widget está desabilitado. */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Define se o widget é somente leitura. */
  @property({ type: Boolean }) readonly: boolean = false;
  /** Define se o widget recebe foco automaticamente. */
  @property({ type: Boolean }) autofocus: boolean = false;
  /** Padrão para validação da data. */
  @property({ type: String }) pattern: string | undefined;
  /** Mensagem exibida em caso de erro de validação. */
  @property({ type: String }) errorMessage: string | undefined;

  /** Estado interno: mostra/oculta dropdown */
  @property({ type: Boolean }) private _opened: boolean = false;
  /** Estado interno: data inicial temporária da seleção */
  @property({ type: String }) private _tempStart?: string;
  /** Estado interno: data final temporária da seleção */
  @property({ type: String }) private _tempEnd?: string;
  /** Estado interno: mensagem de erro atual */
  @property({ type: String }) private _error: string = '';
  /** Estado interno: mês/ano visível à esquerda */
  @property({ type: Number }) private _monthLeft: number = new Date().getMonth();
  @property({ type: Number }) private _yearLeft: number = new Date().getFullYear();
  /** Estado interno: mês/ano visível à direita */
  @property({ type: Number }) private _monthRight: number = (new Date().getMonth() + 1) % 12;
  @property({ type: Number }) private _yearRight: number = new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();

  firstUpdated() {
    // Inicializa meses visíveis com base no valor selecionado
    const left = this.startValue ? new Date(this.startValue) : new Date();
    this._monthLeft = left.getMonth();
    this._yearLeft = left.getFullYear();
    const right = new Date(this._yearLeft, this._monthLeft + 1, 1);
    this._monthRight = right.getMonth();
    this._yearRight = right.getFullYear();
  }

  private _openDropdown() {
    if (this.disabled || this.readonly) return;
    this._opened = true;
    this._tempStart = this.startValue;
    this._tempEnd = this.endValue;
    this._error = '';
  }

  private _closeDropdown() {
    this._opened = false;
    this._error = '';
  }

  private _onInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._openDropdown();
    }
  }

  private _onDayClick(dateStr: string) {
    if (!this._tempStart || (this._tempStart && this._tempEnd)) {
      // Começa nova seleção
      this._tempStart = dateStr;
      this._tempEnd = undefined;
      this._error = '';
    } else if (this._tempStart && !this._tempEnd) {
      if (dateStr < this._tempStart) {
        this._error = this.errorMessage || 'A data final deve ser posterior à data inicial.';
        return;
      }
      this._tempEnd = dateStr;
      this._error = '';
    }
  }

  private _onConfirm() {
    if (!this._tempStart || !this._tempEnd) {
      this._error = this.errorMessage || 'Selecione o período completo.';
      return;
    }
    if (this._tempStart > this._tempEnd) {
      this._error = this.errorMessage || 'A data final deve ser posterior à inicial.';
      return;
    }
    this.startValue = this._tempStart;
    this.endValue = this._tempEnd;
    this._opened = false;
    this._error = '';
    this.requestUpdate();
  }

  private _onClear() {
    this._tempStart = undefined;
    this._tempEnd = undefined;
    this.startValue = undefined;
    this.endValue = undefined;
    this._error = '';
    this._opened = false;
  }

  private _isBlocked(dateStr: string): boolean {
    return this.blockedDates && this.blockedDates.includes(dateStr);
  }

  private _isDisabled(date: Date): boolean {
    const iso = date.toISOString().slice(0, 10);
    if (this.minvalue && iso < this.minvalue) return true;
    if (this.maxvalue && iso > this.maxvalue) return true;
    if (this._isBlocked(iso)) return true;
    return false;
  }

  private _isInRange(dateStr: string): boolean {
    if (this._tempStart && this._tempEnd) {
      return dateStr >= this._tempStart && dateStr <= this._tempEnd;
    }
    return false;
  }

  private _isSelected(dateStr: string): boolean {
    return dateStr === this._tempStart || dateStr === this._tempEnd;
  }

  private _renderCalendar(month: number, year: number, side: 'left' | 'right') {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const todayStr = new Date().toISOString().slice(0, 10);
    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay(); // 0 (domingo) ... 6 (sábado)
    const weeks: Array<Array<Date | null>> = [];
    let week: Array<Date | null> = [];
    // Preenche dias do mês anterior
    for (let i = 0; i < startWeekDay; i++) {
      week.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    // Preenche dias do mês seguinte
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    const monthLabel = `${year}-${String(month + 1).padStart(2, '0')}`;
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return html`
      <div class="calendar">
        <div class="calendar-header">
          <span class="calendar-label">${monthLabel}</span>
        </div>
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            ${weekDays.map(wd => html`<span class="weekday">${wd}</span>`)}
          </div>
          ${weeks.map(
      week => html`<div class="calendar-week">
              ${week.map(day => {
        if (!day) return html`<span class="calendar-day empty"></span>`;
        const iso = day.toISOString().slice(0, 10);
        const isToday = iso === todayStr;
        const isDisabled = this._isDisabled(day);
        const isBlocked = this._isBlocked(iso);
        const isInRange = this._isInRange(iso);
        const isSelected = this._isSelected(iso);
        return html`
                  <button
                    class="calendar-day${isToday ? ' today' : ''}${isDisabled ? ' disabled' : ''}${isBlocked ? ' blocked' : ''}${isInRange ? ' in-range' : ''}${isSelected ? ' selected' : ''}"
                    ?disabled=${isDisabled}
                    @click=${() => this._onDayClick(iso)}
                    tabindex="-1"
                    aria-label=${iso}
                  >${day.getDate()}</button>
                `;
      })}
            </div>`
    )}
        </div>
      </div>
    `;
  }

  private _prevMonth() {
    // Move ambos os meses para trás
    let leftMonth = this._monthLeft - 1;
    let leftYear = this._yearLeft;
    if (leftMonth < 0) {
      leftMonth = 11;
      leftYear--;
    }
    let rightMonth = leftMonth + 1;
    let rightYear = leftYear;
    if (rightMonth > 11) {
      rightMonth = 0;
      rightYear++;
    }
    this._monthLeft = leftMonth;
    this._yearLeft = leftYear;
    this._monthRight = rightMonth;
    this._yearRight = rightYear;
  }
  private _nextMonth() {
    // Move ambos os meses para frente
    let leftMonth = this._monthLeft + 1;
    let leftYear = this._yearLeft;
    if (leftMonth > 11) {
      leftMonth = 0;
      leftYear++;
    }
    let rightMonth = leftMonth + 1;
    let rightYear = leftYear;
    if (rightMonth > 11) {
      rightMonth = 0;
      rightYear++;
    }
    this._monthLeft = leftMonth;
    this._yearLeft = leftYear;
    this._monthRight = rightMonth;
    this._yearRight = rightYear;
  }

  render() {
    const displayValue = this.startValue && this.endValue
      ? `${this.startValue} até ${this.endValue}`
      : (this.placeHolder || 'Selecione o período');
    return html`
      <div class="date-picker-range-wrapper">
        ${this._error ? html`<div class="form_error_message">${this._error}</div>` : nothing}
        ${this.label ? html`<label class="form-control-label">${this.label}${this.required ? html`<span class="required">*</span>` : nothing}</label>` : nothing}
        <div
          class="date-picker-input"
          tabindex="0"
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @click=${this._openDropdown}
          @keydown=${this._onInputKeyDown}
        >
          <span class="date-picker-value">${displayValue}</span>
          <span class="date-picker-icon">&#128197;</span>
        </div>
        ${this._opened ? html`
          <div class="dropdown-calendar">
            <div class="calendar-controls">
              <button class="calendar-nav prev" @click=${this._prevMonth} aria-label="Mês anterior">&#8592;</button>
              <button class="calendar-nav next" @click=${this._nextMonth} aria-label="Próximo mês">&#8594;</button>
            </div>
            <div class="calendar-container">
              ${this._renderCalendar(this._monthLeft, this._yearLeft, 'left')}
              ${this._renderCalendar(this._monthRight, this._yearRight, 'right')}
            </div>
            <div class="calendar-actions">
              <button class="calendar-action confirm" @click=${this._onConfirm} ?disabled=${!(this._tempStart && this._tempEnd)}>Confirmar</button>
              <button class="calendar-action clear" @click=${this._onClear}>Limpar</button>
              <button class="calendar-action close" @click=${this._closeDropdown}>Fechar</button>
            </div>
          </div>
        ` : nothing}
        ${this.hint ? html`<div class="form_hint_message">${this.hint}</div>` : nothing}
      </div>
    `;
  }
}

