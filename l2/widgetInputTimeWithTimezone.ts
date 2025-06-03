/// <mls shortName="widgetInputTimeWithTimezone" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputTimeBase } from './_100554_icaFormsInputTimeBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
  selectTimezone: 'Selecione o fuso horário',
  invalidTime: 'Horário inválido',
};
const message_en = {
  selectTimezone: 'Select timezone',
  invalidTime: 'Invalid time',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Widget para seleção de tempo (HH:MM:SS) com seleção de fuso horário (UTC offset), máscara, validação e ajuste automático.
 */
@customElement('widget-input-time-with-timezone-100554')
export class WidgetInputTimeWithTimezone extends IcaFormsInputTimeBase {
  /**
   * Nome do campo para binding de dados
   * @example name="horario"
   */
  @propertyCompositeDataSource({ type: String }) name: string | undefined;
  /**
   * Texto do rótulo exibido no campo
   * @example label="Horário"
   */
  @propertyCompositeDataSource({ type: String }) label: string | undefined;
  /**
   * Texto de dica exibida abaixo do campo, mostra horário convertido para o fuso local
   * @example hint="Horário local: 12:00:00"
   */
  @propertyCompositeDataSource({ type: String }) hint: string | undefined;
  /**
   * Mensagem exibida em caso de erro de validação
   * @example errormessage="Formato inválido"
   */
  @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
  /**
   * Valor do tempo no formato HH:MM:SS
   * @example value="13:45:00"
   */
  @propertyDataSource({ type: String }) value: string | undefined;
  /**
   * Expressão regular para validar o formato HH:MM:SS
   * @example pattern="^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$"
   */
  @propertyDataSource({ type: String }) pattern: string | undefined;
  /**
   * Máscara para entrada no formato HH:MM:SS
   * @example mask="99:99:99"
   */
  @propertyDataSource({ type: String }) mask: string | undefined;
  /**
   * Offset do fuso horário selecionado no dropdown (ex: -3, +0, +5.5)
   * @example timezoneOffset="-3"
   */
  @propertyDataSource({ type: String }) timezoneOffset: string | undefined;
  /**
   * Placeholder do campo
   * @example placeholder="00:00:00"
   */
  @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
  /**
   * Campo obrigatório
   * @example required={true}
   */
  @propertyDataSource({ type: Boolean }) required: boolean | undefined;
  /**
   * Desabilita o campo se true
   * @example disabled={true}
   */
  @propertyDataSource({ type: Boolean }) disabled: boolean | undefined;
  /**
   * Torna o campo somente leitura se true
   * @example readonly={true}
   */
  @propertyDataSource({ type: Boolean }) readonly: boolean | undefined;
  /**
   * Foco automático no campo ao carregar
   * @example autofocus={true}
   */
  @propertyDataSource({ type: Boolean }) autofocus: boolean = false;

  @propertyDataSource({ type: String }) ariaLabel: string = '';

  private _error: string = '';
  private _localHint: string = '';
  private _lang: string = 'pt';
  private _maskPattern = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  private _timezones = [
    { value: '-12', label: 'UTC-12:00' },
    { value: '-11', label: 'UTC-11:00' },
    { value: '-10', label: 'UTC-10:00' },
    { value: '-9', label: 'UTC-09:00' },
    { value: '-8', label: 'UTC-08:00' },
    { value: '-7', label: 'UTC-07:00' },
    { value: '-6', label: 'UTC-06:00' },
    { value: '-5', label: 'UTC-05:00' },
    { value: '-4', label: 'UTC-04:00' },
    { value: '-3', label: 'UTC-03:00' },
    { value: '-2', label: 'UTC-02:00' },
    { value: '-1', label: 'UTC-01:00' },
    { value: '0', label: 'UTC+00:00' },
    { value: '1', label: 'UTC+01:00' },
    { value: '2', label: 'UTC+02:00' },
    { value: '3', label: 'UTC+03:00' },
    { value: '3.5', label: 'UTC+03:30' },
    { value: '4', label: 'UTC+04:00' },
    { value: '4.5', label: 'UTC+04:30' },
    { value: '5', label: 'UTC+05:00' },
    { value: '5.5', label: 'UTC+05:30' },
    { value: '5.75', label: 'UTC+05:45' },
    { value: '6', label: 'UTC+06:00' },
    { value: '6.5', label: 'UTC+06:30' },
    { value: '7', label: 'UTC+07:00' },
    { value: '8', label: 'UTC+08:00' },
    { value: '8.75', label: 'UTC+08:45' },
    { value: '9', label: 'UTC+09:00' },
    { value: '9.5', label: 'UTC+09:30' },
    { value: '10', label: 'UTC+10:00' },
    { value: '10.5', label: 'UTC+10:30' },
    { value: '11', label: 'UTC+11:00' },
    { value: '12', label: 'UTC+12:00' },
    { value: '12.75', label: 'UTC+12:45' },
    { value: '13', label: 'UTC+13:00' },
    { value: '14', label: 'UTC+14:00' }
  ];

  connectedCallback() {
    super.connectedCallback();
    this._lang = (navigator.language || 'pt').startsWith('pt') ? 'pt' : 'en';
    this._updateHint();
  }

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let val = input.value;
    if (this.mask) {
      val = this._applyMask(val);
      input.value = val;
    }
    this.value = val;
    this._validate(val);
    this._updateHint();
    this.requestUpdate();
  }

  private _onTimezoneChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.timezoneOffset = select.value;
    this._updateHint();
    this.requestUpdate();
  }

  private _applyMask(val: string): string {
    // Mantém apenas dígitos e dois ':'
    let v = val.replace(/[^0-9:]/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    // Aplica máscara HH:MM:SS
    v = v.replace(/^(\d{2})(\d{0,2})(\d{0,2})$/, (m, h, m1, s) => {
      let out = h;
      if (m1) out += ':' + m1;
      if (s) out += ':' + s;
      return out;
    });
    return v;
  }

  private _validate(val: string) {
    let valid = false;
    if (this.pattern) {
      try {
        valid = new RegExp(this.pattern).test(val);
      } catch {
        valid = this._maskPattern.test(val);
      }
    } else {
      valid = this._maskPattern.test(val);
    }
    if (!valid) {
      this._error = this.errormessage || messages[this._lang].invalidTime;
    } else {
      this._error = '';
    }
  }

  private _updateHint() {
    if (!this.value || !this.timezoneOffset) {
      this._localHint = '';
      return;
    }
    const [h, m, s] = this.value.split(':').map(Number);
    if ([h, m, s].some(isNaN)) {
      this._localHint = '';
      return;
    }
    // Converte para UTC
    const base = new Date();
    base.setUTCHours(h, m, s, 0);
    // Ajusta para offset selecionado
    const offset = parseFloat(this.timezoneOffset);
    base.setTime(base.getTime() - offset * 60 * 60 * 1000);
    // Ajusta para local
    const local = new Date(base.getTime() + base.getTimezoneOffset() * 60000);
    const hh = String(local.getHours()).padStart(2, '0');
    const mm = String(local.getMinutes()).padStart(2, '0');
    const ss = String(local.getSeconds()).padStart(2, '0');
    this._localHint = `Local: ${hh}:${mm}:${ss}`;
  }

  render() {
    const msg = messages[this._lang];
    return html`
    <div class="input-time-tz__container">
      ${this.label ? html`<label class="input-time-tz__label">${this.label}</label>` : ''}
      <div class="input-time-tz__row">
        <input
          class="input-time-tz__input"
          type="text"
          .value=${this.value || ''}
          name=${ifDefined(this.name)}
          placeholder=${ifDefined(this.placeholder || '00:00:00')}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          ?autofocus=${this.autofocus}
          aria-label=${this.ariaLabel}
          maxlength="8"
          pattern=${ifDefined(this.pattern || '^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$')}
          @input=${this._onInput.bind(this)}
        />
        <select
          class="input-time-tz__select"
          .value=${this.timezoneOffset || '0'}
          @change=${this._onTimezoneChange.bind(this)}
          ?disabled=${this.disabled}
        >
          <option value="" disabled selected>${msg.selectTimezone}</option>
          ${this._timezones.map(tz => html`<option value="${tz.value}" ?selected=${this.timezoneOffset === tz.value}>${tz.label}</option>`)}
        </select>
      </div>
      <div class="input-time-tz__hint">${this._localHint || this.hint || ''}</div>
      <div class="input-time-tz__error">${this._error}</div>
    </div>
  `;
  }
}
