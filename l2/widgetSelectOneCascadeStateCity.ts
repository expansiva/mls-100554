/// <mls shortName="widgetSelectOneCascadeStateCity" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, ifDefined, repeat, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
  selectState: 'Selecione o estado',
  selectCity: 'Selecione a cidade',
  requiredState: 'Selecione um estado',
  requiredCity: 'Selecione uma cidade',
};
const message_en = {
  selectState: 'Select state',
  selectCity: 'Select city',
  requiredState: 'Please select a state',
  requiredCity: 'Please select a city',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
};
/// **collab_i18n_end**
/**
* Widget de seleção em cascata para formulários de endereço, permitindo escolher estado e cidade com atualização dinâmica das opções da cidade após seleção do estado.
* Agora recebe um único JSON com estrutura:
* [
* { value: 'SP', label: 'São Paulo', items: ['Franca', 'São Paulo', 'Campinas'] },
* ...
* ]
*/
@customElement('widget-select-one-cascade-state-city-100554')
export class WidgetSelectOneCascadeStateCity extends IcaFormsInputSelectOneBase {
  private myMessage: MessageType = messages['pt'];

  /**
   * Rótulo para o campo de seleção do estado
   * @example labelState="Estado"
   */
  @propertyCompositeDataSource({ type: String }) labelState: string = '';
  /**
   * Rótulo para o campo de seleção da cidade
   * @example labelCity="Cidade"
   */
  @propertyCompositeDataSource({ type: String }) labelCity: string = '';
  /**
   * Valor selecionado no campo estado
   * @example selectedState="SP"
   */
  @propertyDataSource({ type: String }) selectedState: string | undefined;
  /**
   * Valor selecionado no campo cidade
   * @example selectedCity="Campinas"
   */
  @propertyDataSource({ type: String }) selectedCity: string | undefined;
  /**
   * Lista de opções disponíveis para seleção do estado e cidades (unificado)
   * @example options="[{ value: 'SP', label: 'São Paulo', items: ['Campinas', ...] }]"
   */
  @propertyDataSource({ type: Array }) options: Array<{ value: string; label: string; items: string[] }> = [];
  /**
   * Define se a seleção de estado e cidade é obrigatória para validação
   * @example required=true
   */
  @propertyDataSource({ type: Boolean }) required: boolean = false;
  /**
   * Desabilita os campos de seleção quando verdadeiro
   * @example disabled=true
   */
  @propertyDataSource({ type: Boolean }) disabled: boolean = false;
  /**
   * Texto de dica
   * @example hint="Escolha o estado e a cidade"
   */
  @propertyCompositeDataSource({ type: String }) hint: string = '';
  /**
   * Atributo aria-label para acessibilidade
   * @example ariaLabel="Seleção de estado e cidade"
   */
  @propertyDataSource({ type: String }) ariaLabel: string = '';

  // Implementação dos membros abstratos herdados de IcaFormsInputSelectOneBase
  @propertyCompositeDataSource({ type: String }) label: string | undefined;
  // Deprecated: Not used anymore
  @propertyDataSource({ type: Array }) optionsState: any | undefined;
  @propertyDataSource({ type: Array }) optionsCity: any | undefined;
  @propertyDataSource({ type: String }) selectedvalue: string | undefined;

  errorState: string = '';
  errorCity: string = '';

  /**
   * Helper to get the current state object from options
   */
  private get currentStateObj() {
    return this.options.find(opt => opt.value === this.selectedState);
  }

  /**
   * Helper to get the list of cities for the selected state
   */
  private get currentCities(): string[] {
    const stateObj = this.currentStateObj;
    return stateObj && Array.isArray(stateObj.items) ? stateObj.items : [];
  }

  render() {
    const showCity = !!this.selectedState;
    return html`
      <div class="cascade-container" aria-label="${this.ariaLabel}">
        <div class="dropdown-group">
          <label class="dropdown-label" for="state-select">
            ${this.labelState || this.myMessage.selectState}${this.required ? ' *' : ''}
          </label>
          <select
            id="state-select"
            class="dropdown-select ${this.errorState ? 'error' : ''}"
            .value="${ifDefined(this.selectedState)}"
            ?disabled="${this.disabled}"
            aria-required="${this.required ? 'true' : 'false'}"
            @change="${this.handleStateChange}">
            <option value="">${this.myMessage.selectState}</option>
            ${repeat(
      this.options,
      ((item: { value: string; label: string }) => item.value) as (() => string),
      ((item: { value: string; label: string }) => html`<option value="${item.value}">${item.label}</option>`) as (() => TemplateResult<1>)
    )}
          </select>
          ${this.errorState ? html`<div class="error-message">${this.errorState}</div>` : ''}
        </div>
        <div class="dropdown-group city-group" style="${showCity ? 'max-height: 200px; opacity: 1;' : 'max-height: 0; opacity: 0;'}">
          <label class="dropdown-label" for="city-select">
            ${this.labelCity || this.myMessage.selectCity}${this.required ? ' *' : ''}
          </label>
          <select
            id="city-select"
            class="dropdown-select ${this.errorCity ? 'error' : ''}"
            .value="${ifDefined(this.selectedCity)}"
            ?disabled="${this.disabled || !showCity}"
            aria-required="${this.required ? 'true' : 'false'}"
            @change="${this.handleCityChange}">
            <option value="">${this.myMessage.selectCity}</option>
            ${repeat(
      this.currentCities,
      ((city: string) => city) as (() => string),
      ((city: string) => html`<option value="${city}">${city}</option>`) as (() => TemplateResult<1>)
    )}
          </select>
          ${this.errorCity ? html`<div class="error-message">${this.errorCity}</div>` : ''}
        </div>
        ${this.hint ? html`<div class="hint">${this.hint}</div>` : ''}
      </div>
    `;
  }

  /**
   * Handles state (master) dropdown change
   * Sets selectedState, resets selectedCity to first city of new state (if exists)
   * and emits 'state-changed' event
   */
  private handleStateChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const value = select.value || undefined;
    this.selectedState = value;
    // Set selectedCity to first city of the selected state (if exists)
    const stateObj = this.options.find(opt => opt.value === value);
    if (stateObj && Array.isArray(stateObj.items) && stateObj.items.length > 0) {
      this.selectedCity = stateObj.items[0];
    } else {
      this.selectedCity = undefined;
    }
    this.errorState = '';
    this.errorCity = '';
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('state-changed', { detail: { state: value } }));
  };

  /**
   * Handles city (detail) dropdown change
   * Sets selectedCity and emits 'city-changed' event
   */
  private handleCityChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const value = select.value || undefined;
    this.selectedCity = value;
    this.errorCity = '';
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('city-changed', { detail: { city: value } }));
  };

  /**
   * Validates required fields
   */
  public validate(): boolean {
    let valid = true;
    this.errorState = '';
    this.errorCity = '';
    if (this.required) {
      if (!this.selectedState) {
        this.errorState = this.myMessage.requiredState;
        valid = false;
      }
      if (!this.selectedCity) {
        this.errorCity = this.myMessage.requiredCity;
        valid = false;
      }
    }
    this.requestUpdate();
    return valid;
  }
}
