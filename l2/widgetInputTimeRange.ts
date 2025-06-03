/// <mls shortName="widgetInputTimeRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputTimeBase } from './_100554_icaFormsInputTimeBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/**
 * Widget para seleção de intervalo de horário com dois campos ('Início' e 'Fim'), validação para garantir que o horário final seja posterior ao inicial, exibição de erro e desativação do botão de envio em caso de sequência inválida, com incremento padrão de 15 minutos configurável e placeholders 'HH:MM'.
 */
@customElement('widget-input-time-range-100554')
export class WidgetInputTimeRange extends IcaFormsInputTimeBase {
  /**
   * Valor do horário inicial (bind).
   * @example "08:00"
   */
  @propertyDataSource({ type: String }) startValue: string | undefined;
  /**
   * Valor do horário final (bind).
   * @example "17:00"
   */
  @propertyDataSource({ type: String }) endValue: string | undefined;
  /**
   * Texto do rótulo para o campo de início.
   * @example "Início"
   */
  @propertyCompositeDataSource({ type: String }) labelStart: string | undefined;
  /**
   * Texto do rótulo para o campo de fim.
   * @example "Fim"
   */
  @propertyCompositeDataSource({ type: String }) labelEnd: string | undefined;
  /**
   * Placeholder para o campo de início, padrão 'HH:MM'.
   * @example "HH:MM"
   */
  @propertyCompositeDataSource({ type: String }) placeholderStart: string | undefined;
  /**
   * Placeholder para o campo de fim, padrão 'HH:MM'.
   * @example "HH:MM"
   */
  @propertyCompositeDataSource({ type: String }) placeholderEnd: string | undefined;
  /**
   * Incremento de minutos para seleção do horário, padrão 15 minutos.
   * @example 15
   */
  @propertyDataSource({ type: Number }) step: number = 15;
  /**
   * Mensagem de erro exibida quando o horário final não é posterior ao inicial.
   * @example "O horário final deve ser posterior ao inicial."
   */
  @propertyCompositeDataSource({ type: String }) errorMessage: string | undefined;
  /**
   * Flag para desativar o botão de envio quando o intervalo for inválido.
   * @example true
   */
  @propertyDataSource({ type: Boolean }) disableSubmit: boolean = false;
  /**
   * Nome do campo (herdado).
   */
  @propertyCompositeDataSource({ type: String }) name: string | undefined;
  /**
   * Rótulo do campo (herdado, não utilizado diretamente).
   */
  @propertyCompositeDataSource({ type: String }) label: string | undefined;
  /**
   * Dica do campo (herdado, não utilizado diretamente).
   */
  @propertyCompositeDataSource({ type: String }) hint: string | undefined;
  /**
   * Obrigatoriedade do campo (herdado).
   */
  @propertyDataSource({ type: Boolean }) required: boolean | undefined;
  /**
   * Desabilitado (herdado).
   */
  @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
  /**
   * Somente leitura (herdado).
   */
  @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
  /**
   * Autofocus (herdado).
   */
  @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
  /**
   * Valor do campo (herdado, não utilizado diretamente).
   */
  @propertyDataSource({ type: String }) value: string | undefined;
  /**
   * Pattern do campo (herdado).
   */
  @propertyDataSource({ type: String }) pattern: string | undefined;
  /**
   * Mensagem de erro do campo (herdado, não utilizada diretamente).
   */
  @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
  /**
   * Placeholder do campo (herdado, não utilizado diretamente).
   */
  @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
  /**
   * Aria-label para acessibilidade.
   * @example "Intervalo de horário"
   */
  @propertyDataSource({ type: String }) ariaLabel: string = '';
  private error: string = '';
  private isValidRange(): boolean {
    if (!this.startValue || !this.endValue) return true;
    return this.timeToMinutes(this.endValue) > this.timeToMinutes(this.startValue);
  }
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
  private handleStartChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.startValue = val;
    this.validateRange();
  }
  private handleEndChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.endValue = val;
    this.validateRange();
  }
  private validateRange() {
    if (!this.isValidRange()) {
      this.error = this.errorMessage || 'Horário final deve ser posterior ao inicial.';
      this.disableSubmit = true;
    } else {
      this.error = '';
      this.disableSubmit = false;
    }
    this.requestUpdate();
  }
  render() {
    return html`
      <div class="time-range-fields">
        <div class="time-field">
          <label>${this.labelStart || 'Início'}</label>
          <input
            type="time"
            name="${ifDefined(this.name ? this.name + '_start' : undefined)}"
            .value=${this.startValue || ''}
            placeholder="${this.placeholderStart || 'HH:MM'}"
            step="${this.step * 60}"
            ?required=${!!this.required}
            ?disabled=${!!this.disabled}
            ?readonly=${!!this.readonly}
            ?autofocus=${!!this.autofocus}
            aria-label="${this.ariaLabel} Início"
            @input=${this.handleStartChange.bind(this)}
          />
        </div>
        <div class="time-field">
          <label>${this.labelEnd || 'Fim'}</label>
          <input
            type="time"
            name="${ifDefined(this.name ? this.name + '_end' : undefined)}"
            .value=${this.endValue || ''}
            placeholder="${this.placeholderEnd || 'HH:MM'}"
            step="${this.step * 60}"
            ?required=${!!this.required}
            ?disabled=${!!this.disabled}
            ?readonly=${!!this.readonly}
            aria-label="${this.ariaLabel} Fim"
            @input=${this.handleEndChange.bind(this)}
          />
        </div>
      </div>
      <div class="error-message">${this.error}</div>
      <button type="submit" ?disabled=${this.disableSubmit} class="submit-btn">
        <span>Enviar</span>
      </button>
    `;
  }
}
