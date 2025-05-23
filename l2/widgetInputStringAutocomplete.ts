/// <mls shortName="widgetInputStringAutocomplete" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputStringBase, IAutoCapitalize, IAutocorrect } from './_100554_icaFormsInputStringBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
  noSuggestions: 'Nenhuma sugestão encontrada',
};
const message_en = {
  noSuggestions: 'No suggestions found',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
};
/// **collab_i18n_end**
/**
* Campo de texto com suporte a autocomplete dinâmico, exibindo sugestões em lista suspensa conforme o usuário digita, com navegação por teclado e seleção por Enter ou clique.
*/
@customElement('widget-input-string-autocomplete-100554')
export class WidgetInputStringAutocomplete extends IcaFormsInputStringBase {
  private messages: MessageType = messages['en'];
  /** Nome do campo para binding de dados
  * @example name="nome"
  */
  @propertyCompositeDataSource({ type: String }) name: string | undefined;
  /** Dica ou ajuda para o usuário
  * @example hint="Digite seu nome completo"
  */
  @propertyCompositeDataSource({ type: String }) hint: string | undefined;
  /** Valor atual do campo
  * @example value="João"
  */
  @propertyDataSource({ type: String }) value: string | undefined;
  /** Texto do rótulo do campo
  * @example label="Nome"
  */
  @propertyCompositeDataSource({ type: String }) label: string | undefined;
  /** Indica se o campo é obrigatório
  * @example required=true
  */
  @propertyDataSource({ type: Boolean }) required: boolean = false;
  /** Indica se o campo está desabilitado
  * @example disabled=true
  */
  @propertyDataSource({ type: Boolean }) disabled: boolean = false;
  /** Número máximo de caracteres permitidos
  * @example maxlength=50
  */
  @propertyDataSource({ type: Number }) maxlength: number | undefined;
  /** Número mínimo de caracteres permitidos
  * @example minlength=3
  */
  @propertyDataSource({ type: Number }) minlength: number | undefined;
  /** Texto exibido quando o campo está vazio
  * @example placeholder="Digite aqui"
  */
  @propertyCompositeDataSource({ type: String }) placeholder: string | undefined;
  /** Expressão regular para validação do texto
  * @example pattern="[A-Za-z]+"
  */
  @propertyDataSource({ type: String }) pattern: string | undefined;
  /** Mensagem exibida em caso de erro de validação
  * @example errormessage="Campo obrigatório"
  */
  @propertyCompositeDataSource({ type: String }) errormessage: string | undefined;
  /** Indica se o campo deve receber foco automaticamente
  * @example autofocus=true
  */
  @propertyDataSource({ type: Boolean }) autofocus: boolean = false;
  /** Controle de capitalização automática
  * @example autocapitalize="sentences"
  */
  @propertyDataSource({ type: String }) autocapitalize: IAutoCapitalize = 'off';
  /** Controle de autocorreção
  * @example autocorrect="off"
  */
  @propertyDataSource({ type: String }) autocorrect: IAutocorrect | undefined;
  /** Lista de sugestões para autocomplete
  * @example autocomplete="['Banana','Maçã','Uva']"
  */
  @propertyDataSource({ type: String }) autocomplete: string = "[]";
  /** Número máximo de sugestões exibidas na lista
  * @example maxSuggestions=5
  */
  @propertyDataSource({ type: Number }) maxSuggestions: number = 5;
  /** Mensagem de validação customizada
  * @example validationmessage="Inválido"
  */
  @propertyDataSource({ type: String }) validationmessage: string | undefined;
  /** Debounce para eventos
  * @example debounce="300"
  */
  @propertyDataSource({ type: String }) debounce: string | undefined;
  /** Indica se o campo é somente leitura
  * @example readonly=true
  */
  @propertyDataSource({ type: Boolean }) readonly: boolean = false;

  private showSuggestions = false;
  private filteredSuggestions: string[] = [];
  private activeIndex: number = -1;
  private inputElement?: HTMLInputElement;
  private lastValue: string = '';

  render() {
    return html`
<div class="autocomplete-wrapper">
  <label ?hidden=${!this.label} class="form-control-label">${this.label}</label>
  <div class="input-suggestion-container">
    <input
      type="text"
      class="input_control"
      .value=${this.value ?? ''}
      name=${this.name ?? ''}
      ?disabled=${this.disabled.toString() === 'true'}
      ?readonly=${this.readonly.toString() === 'true'}
      ?required=${this.required.toString() === 'true'}
      maxlength=${this.maxlength ?? ''}
      minlength=${this.minlength ?? ''}
      placeholder=${this.placeholder ?? ''}
      pattern=${this.pattern ?? ''}
      ?autofocus=${this.autofocus}
      autocomplete="off"
      autocapitalize=${this.autocapitalize}
      autocorrect=${this.autocorrect ?? ''}
      aria-autocomplete="list"
      aria-expanded=${this.showSuggestions}
      aria-owns="suggestion-list"
      aria-activedescendant=${this.activeIndex >= 0 ? 'suggestion-' + this.activeIndex : nothing}
      @input=${this.onInput}
      @keydown=${this.onKeyDown}
      @focus=${this.onFocus}
      @blur=${this.onBlur}
      ${(el: HTMLInputElement) => { this.inputElement = el; }}
    />
    ${this.showSuggestions && this.filteredSuggestions.length > 0 ? html`
      <ul id="suggestion-list" class="suggestion-list" role="listbox">
        ${this.filteredSuggestions.map((s, i) => html`
          <li
            id="suggestion-${i}"
            class="suggestion-item${i === this.activeIndex ? ' active' : ''}"
            role="option"
            aria-selected=${i === this.activeIndex}
            @mousedown=${(e: MouseEvent) => this.onSuggestionClick(e, i)}
          >${s}</li>
        `)}
      </ul>
    ` : this.showSuggestions && this.value && this.filteredSuggestions.length === 0 ? html`
      <div class="no-suggestions">${this.messages.noSuggestions}</div>
    ` : nothing}
  </div>
  <div class="form_hint_message" ?hidden=${!this.hint}>${this.hint}</div>
  <div class="form_error_message" ?hidden=${!this.errormessage}>${this.errormessage}</div>
</div>
`;
  }

  private onInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    this.value = val;
    this.updateSuggestions(val);
    this.showSuggestions = true;
    this.activeIndex = -1;
    this.requestUpdate();
  };

  private updateSuggestions(val: string) {
    if (!val) {
      this.filteredSuggestions = [];
      return;
    }
    let autoComplete: string[] = [];
    try {
      autoComplete = this.autocomplete ? JSON.parse(this.autocomplete) : []; 
    } catch (e) {
      autoComplete = [];
    }
    const lowerVal = val.toLowerCase();
    this.filteredSuggestions = (autoComplete?? [])
      .filter(s => s.toLowerCase().includes(lowerVal))
      .slice(0, this.maxSuggestions);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.showSuggestions || this.filteredSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.filteredSuggestions.length;
      this.scrollToActive();
      this.requestUpdate();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
      this.scrollToActive();
      this.requestUpdate();
    } else if (e.key === 'Enter') {
      if (this.activeIndex >= 0 && this.activeIndex < this.filteredSuggestions.length) {
        e.preventDefault();
        this.selectSuggestion(this.activeIndex);
      }
    } else if (e.key === 'Escape') {
      this.showSuggestions = false;
      this.requestUpdate();
    }
  };

  private onFocus = () => {
    if (this.value) {
      this.updateSuggestions(this.value);
      this.showSuggestions = true;
      this.requestUpdate();
    }
  };

  private onBlur = (e: FocusEvent) => {
    setTimeout(() => {
      this.showSuggestions = false;
      this.requestUpdate();
    }, 120);
  };

  private onSuggestionClick(e: MouseEvent, idx: number) {
    e.preventDefault();
    this.selectSuggestion(idx);
  }

  private selectSuggestion(idx: number) {
    const suggestion = this.filteredSuggestions[idx];
    if (suggestion !== undefined) {
      this.value = suggestion;
      this.showSuggestions = false;
      this.filteredSuggestions = [];
      this.activeIndex = -1;
      this.requestUpdate();
      if (this.inputElement) {
        this.inputElement.blur();
      }
    }
  }

  private scrollToActive() {
    setTimeout(() => {
      const active = this.renderRoot.querySelector('.suggestion-item.active') as HTMLElement;
      if (active) {
        active.scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }
}
