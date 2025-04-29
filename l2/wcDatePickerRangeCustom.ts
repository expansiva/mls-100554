/// <mls shortName="wcDatePickerRangeCustom" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { IcaFormsInputDateRangeBase } from './_100554_icaFormsInputDateRangeBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';

/**
 * Custom date range picker component for selecting start and end dates.
 *
 * This component renders a date range picker with two consecutive months side by side,
 * allowing users to select a start and end date. It supports minimum and maximum date
 * constraints, blocked dates, and provides visual feedback for the selection process.
 *
 * @element wc-date-picker-range-custom-100554
 *
 * @csspart calendar - The calendar dropdown container
 * @csspart calendar-header - The header section of the calendar
 * @csspart calendar-grid - The grid containing days
 * @csspart calendar-day - Individual day cells
 * @csspart calendar-day-selected - Selected day cells
 * @csspart calendar-day-blocked - Blocked/disabled day cells
 * @csspart calendar-day-in-range - Days between selected start and end dates
 *
 * @fires change - When the date range selection changes
 *
 * @slot - Default slot for custom content
 *
 * @example
 * <wc-date-picker-range-custom-100554
 *   label=\"Select Date Range\"
 *   startValue=\"2023-01-01\"
 *   endValue=\"2023-01-07\"
 *   minvalue=\"2023-01-01\"
 *   maxvalue=\"2023-12-31\"
 *   blockedDates='[\"2023-01-15\", \"2023-01-16\"]'
 * ></wc-date-picker-range-custom-100554>
 */
@customElement('wc-date-picker-range-custom-100554')
export class WCDatePickerRangeCustom extends IcaFormsInputDateRangeBase {
  /**
   * The name attribute of the date range picker.
   */
  @property({ type: String }) name: string | undefined;

  /**
   * The label text for the date range picker.
   */
  @property({ type: String }) label: string | undefined;

  /**
   * Hint text to provide additional guidance to the user.
   */
  @propertyCompositeDataSource({ type: String }) hint?: string;

  /**
   * Whether the date range picker is required.
   */
  @property({ type: Boolean }) required?: boolean = false;

  /**
   * Whether the date range picker is disabled.
   */
  @property({ type: Boolean }) disabled?: boolean = false;

  /**
   * Whether the date range picker is readonly.
   */
  @property({ type: Boolean }) readonly?: boolean = false;

  /**
   * The start date of the selected range in ISO format (YYYY-MM-DD).
   */
  @propertyDataSource({ type: String }) startValue?: string;

  /**
   * The end date of the selected range in ISO format (YYYY-MM-DD).
   */
  @propertyDataSource({ type: String }) endValue?: string;

  /**
   * Placeholder text for the input field.
   */
  @property({ type: String }) placeHolder?: string = 'Select date range';

  /**
   * Error message to display when validation fails.
   */
  @property({ type: String }) errorMessage?: string = 'Invalid date range selection';

  /**
   * Pattern for date validation.
   */
  @property({ type: String }) pattern?: string;

  /**
   * Whether the component should receive focus automatically.
   */
  @property({ type: Boolean }) autofocus: boolean = false;

  /**
   * Minimum date allowed for selection in ISO format (YYYY-MM-DD).
   */
  @property({ type: String }) minvalue?: string;

  /**
   * Maximum date allowed for selection in ISO format (YYYY-MM-DD).
   */
  @property({ type: String }) maxvalue?: string;

  /**
   * List of dates that cannot be selected, in ISO format (YYYY-MM-DD).
   * Provided as a JSON string array.
   */
  @property({ type: String }) blockedDates?: string;

  /**
   * Reference to the input element.
   */
  @query('input') private inputElement?: HTMLInputElement;

  /**
   * Reference to the calendar dropdown element.
   */
  @query('.calendar-dropdown') private calendarDropdown?: HTMLDivElement;

  /**
   * Current error message to display.
   */
  @state() private error: string = '';

  /**
   * Whether the calendar dropdown is open.
   */
  @state() private isOpen: boolean = false;

  /**
   * The currently displayed month (0-11).
   */
  @state() private currentMonth: number = new Date().getMonth();

  /**
   * The currently displayed year.
   */
  @state() private currentYear: number = new Date().getFullYear();

  /**
   * The date that is currently being hovered.
   */
  @state() private hoverDate: Date | null = null;

  /**
   * The selection mode: 'start' or 'end'.
   */
  @state() private selectionMode: 'start' | 'end' = 'start';

  /**
   * Temporary start date during selection process.
   */
  @state() private tempStartDate: Date | null = null;

  /**
   * Temporary end date during selection process.
   */
  @state() private tempEndDate: Date | null = null;

  /**
   * Array of blocked dates parsed from the blockedDates property.
   */
  private get parsedBlockedDates(): Date[] {
    if (!this.blockedDates) return [];
    try {
      const dates = JSON.parse(this.blockedDates) as string[];
      return dates.map(dateStr => new Date(dateStr));
    } catch (e) {
      console.error('Error parsing blockedDates:', e);
      return [];
    }
  }

  /**
   * Minimum date as a Date object.
   */
  private get minDate(): Date | null {
    return this.minvalue ? new Date(this.minvalue) : null;
  }

  /**
   * Maximum date as a Date object.
   */
  private get maxDate(): Date | null {
    return this.maxvalue ? new Date(this.maxvalue) : null;
  }

  /**
   * Start date as a Date object.
   */
  private get startDate(): Date | null {
    return this.startValue ? new Date(this.startValue) : null;
  }

  /**
   * End date as a Date object.
   */
  private get endDate(): Date | null {
    return this.endValue ? new Date(this.endValue) : null;
  }

  /**
   * Formatted display value for the input field.
   */
  private get displayValue(): string {
    if (this.startValue && this.endValue) {
      return `${this.formatDate(new Date(this.startValue))} - ${this.formatDate(new Date(this.endValue))}`;
    }
    return this.placeHolder || '';
  }

  /**
   * Lifecycle method called when the component is first connected to the DOM.
   */
  connectedCallback() {
    super.connectedCallback();
    // Initialize current month/year based on startValue if available
    if (this.startValue) {
      const date = new Date(this.startValue);
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
    }

    // Set up click outside listener
    document.addEventListener('click', this.handleClickOutside);
  }

  /**
   * Lifecycle method called when the component is disconnected from the DOM.
   */
  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
    super.disconnectedCallback();
  }

  /**
   * Handles clicks outside the component to close the dropdown.
   */
  private handleClickOutside = (event: MouseEvent) => {
    if (this.isOpen && !this.contains(event.target as Node)) {
      this.isOpen = false;
    }
  };

  /**
   * Toggles the calendar dropdown.
   */
  private toggleCalendar() {
    if (this.disabled || this.readonly) return;
    this.isOpen = !this.isOpen;

    // Initialize temp dates when opening
    if (this.isOpen) {
      this.tempStartDate = this.startDate;
      this.tempEndDate = this.endDate;
      this.selectionMode = 'start';
    }
  }

  /**
   * Formats a date as MM/DD/YYYY.
   */
  private formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  /**
   * Checks if a date is blocked.
   */
  private isDateBlocked(date: Date): boolean {
    // Check if date is in blocked dates
    const isBlocked = this.parsedBlockedDates.some(blockedDate =>
      blockedDate.getFullYear() === date.getFullYear() &&
      blockedDate.getMonth() === date.getMonth() &&
      blockedDate.getDate() === date.getDate()
    );

    // Check if date is outside min/max range
    const isTooEarly = this.minDate ? date < this.minDate : false;
    const isTooLate = this.maxDate ? date > this.maxDate : false;

    return isBlocked || isTooEarly || isTooLate;
  }

  /**
   * Checks if a date is the current date.
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  /**
   * Checks if a date is selected (either start or end date).
   */
  private isSelected(date: Date): boolean {
    if (this.tempStartDate &&
        date.getDate() === this.tempStartDate.getDate() &&
        date.getMonth() === this.tempStartDate.getMonth() &&
        date.getFullYear() === this.tempStartDate.getFullYear()) {
      return true;
    }

    if (this.tempEndDate &&
        date.getDate() === this.tempEndDate.getDate() &&
        date.getMonth() === this.tempEndDate.getMonth() &&
        date.getFullYear() === this.tempEndDate.getFullYear()) {
      return true;
    }

    return false;
  }

  /**
   * Checks if a date is in the selected range (between start and end).
   */
  private isInRange(date: Date): boolean {
    if (!this.tempStartDate || (!this.tempEndDate && !this.hoverDate)) return false;

    const endDate = this.tempEndDate || this.hoverDate;
    if (!endDate) return false;

    return date > this.tempStartDate && date < endDate;
  }

  /**
   * Handles date selection.
   */
  private handleDateSelect(date: Date) {
    if (this.isDateBlocked(date)) return;

    if (this.selectionMode === 'start') {
      this.tempStartDate = date;
      this.tempEndDate = null;
      this.selectionMode = 'end';
    } else {
      // Ensure end date is after start date
      if (this.tempStartDate && date < this.tempStartDate) {
        this.error = 'End date must be after start date';
        return;
      }

      this.tempEndDate = date;
      this.selectionMode = 'start';

      // Finalize selection
      this.startValue = this.tempStartDate ? this.formatISODate(this.tempStartDate) : undefined;
      this.endValue = this.tempEndDate ? this.formatISODate(this.tempEndDate) : undefined;
      this.error = '';
      this.isOpen = false;
    }
  }

  /**
   * Formats a date as YYYY-MM-DD (ISO format).
   */
  private formatISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Handles mouse enter on a date cell.
   */
  private handleDateHover(date: Date) {
    if (this.selectionMode === 'end' && this.tempStartDate) {
      this.hoverDate = date;
    }
  }

  /**
   * Handles mouse leave on a date cell.
   */
  private handleDateLeave() {
    this.hoverDate = null;
  }

  /**
   * Navigates to the previous month.
   */
  private prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  /**
   * Navigates to the next month.
   */
  private nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  /**
   * Generates the days for a month.
   */
  private getDaysInMonth(month: number, year: number): Date[] {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push(prevDate);
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from next month to complete the last week
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }

  /**
   * Gets the month name.
   */
  private getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }

  /**
   * Renders the component.
   */
  render() {
    const currentMonthDays = this.getDaysInMonth(this.currentMonth, this.currentYear);
    const nextMonthIndex = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
    const nextMonthYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    const nextMonthDays = this.getDaysInMonth(nextMonthIndex, nextMonthYear);

    return html`
      <div class=\"date-range-picker\">
        ${this.error ? html`<div class=\"error-message\">${this.error}</div>` : ''}

        <label class=\"form-control-label\" for=\"date-range-input\">
          ${this.label}
        </label>

        <div class=\"input-container\">
          <input
            id=\"date-range-input\"
            class=\"date-range-input\"
            type=\"text\"
            name=${this.name || ''}
            ?disabled=${this.disabled}
            ?readonly=${true}
            ?required=${this.required}
            .value=${this.displayValue}
            ?autofocus=${this.autofocus}
            @click=${this.toggleCalendar}
          />
          <button
            type=\"button\"
            class=\"calendar-toggle\"
            ?disabled=${this.disabled || this.readonly}
            @click=${this.toggleCalendar}
          >
            📅
          </button>
        </div>

        ${this.hint ? html`<div class=\"hint-text\">${this.hint}</div>` : ''}

        ${this.isOpen ? html`
          <div class=\"calendar-dropdown\">
            <div class=\"calendar-container\">
              <!-- First Month -->
              <div class=\"calendar\">
                <div class=\"calendar-header\">
                  <button type=\"button\" class=\"nav-button\" @click=${this.prevMonth}>&#10094;</button>
                  <div class=\"month-year\">${this.getMonthName(this.currentMonth)} ${this.currentYear}</div>
                </div>
                <div class=\"weekdays\">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div class=\"days\">
                  ${currentMonthDays.map(date => {
                    const isCurrentMonth = date.getMonth() === this.currentMonth;
                    const isBlocked = this.isDateBlocked(date);
                    const isSelectedDate = this.isSelected(date);
                    const isInSelectedRange = this.isInRange(date);
                    const isTodayDate = this.isToday(date);

                    return html`
                      <button
                        type=\"button\"
                        class=\"day ${isCurrentMonth ? 'current-month' : 'other-month'}
                               ${isSelectedDate ? 'selected' : ''}
                               ${isInSelectedRange ? 'in-range' : ''}
                               ${isBlocked ? 'blocked' : ''}
                               ${isTodayDate ? 'today' : ''}\"
                        ?disabled=${isBlocked}
                        @click=${() => this.handleDateSelect(date)}
                        @mouseenter=${() => this.handleDateHover(date)}
                        @mouseleave=${this.handleDateLeave}
                      >
                        ${date.getDate()}
                      </button>
                    `;
                  })}
                </div>
              </div>

              <!-- Second Month -->
              <div class=\"calendar\">
                <div class=\"calendar-header\">
                  <div class=\"month-year\">${this.getMonthName(nextMonthIndex)} ${nextMonthYear}</div>
                  <button type=\"button\" class=\"nav-button\" @click=${this.nextMonth}>&#10095;</button>
                </div>
                <div class=\"weekdays\">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div class=\"days\">
                  ${nextMonthDays.map(date => {
                    const isCurrentMonth = date.getMonth() === nextMonthIndex;
                    const isBlocked = this.isDateBlocked(date);
                    const isSelectedDate = this.isSelected(date);
                    const isInSelectedRange = this.isInRange(date);
                    const isTodayDate = this.isToday(date);

                    return html`
                      <button
                        type=\"button\"
                        class=\"day ${isCurrentMonth ? 'current-month' : 'other-month'}
                               ${isSelectedDate ? 'selected' : ''}
                               ${isInSelectedRange ? 'in-range' : ''}
                               ${isBlocked ? 'blocked' : ''}
                               ${isTodayDate ? 'today' : ''}\"
                        ?disabled=${isBlocked}
                        @click=${() => this.handleDateSelect(date)}
                        @mouseenter=${() => this.handleDateHover(date)}
                        @mouseleave=${this.handleDateLeave}
                      >
                        ${date.getDate()}
                      </button>
                    `;
                  })}
                </div>
              </div>
            </div>

            <div class=\"calendar-footer\">
              <div class=\"selection-status\">
                ${this.selectionMode === 'start' ? 'Select start date' : 'Select end date'}
              </div>
              <button type=\"button\" class=\"close-button\" @click=${() => this.isOpen = false}>Close</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}