/// <mls shortName="widgetSelectMultipleTagsCustom" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IcaFormsInputMultiselectBase } from './_100554_icaFormsInputMultiselectBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    clear: 'Limpar seleção',
    placeholder: 'Selecione...',
};
const message_en = {
    clear: 'Clear selection',
    placeholder: 'Select...',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
* Widget de seleção múltipla estilo tags, baseado em ica-forms-input-multiselect.
* Exibe opções em caixas arredondadas, mantém lista aberta, inclui ícone para limpar seleção e rolagem suave.
*/
@customElement('widget-select-multiple-tags-custom-100554')
export class WidgetSelectMultipleTagsCustom extends IcaFormsInputMultiselectBase {
    private myMessage: MessageType = messages['en'];
    /**
    * Texto do rótulo exibido
    * @example label="Categorias"
    */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
    * Texto de ajuda ou dica
    * @example hint="Escolha múltiplas opções"
    */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
    * Valores selecionados (binding)
    * @example selectedvalue="{{ui.form.categorias}}"
    */
    @propertyDataSource({ type: String }) selectedvalue: string = '';
    /**
    * Indica se a seleção é obrigatória
    * @example required="true"
    */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
    * Desabilita o componente
    * @example disabled="true"
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
    * Lista de opções disponíveis
    * @example options="['Tecnologia','Design','Marketing']"
    */
    @propertyDataSource({ type: String }) options: string = '';
    /**
    * Exibe ícone para limpar seleção
    * @example showClearIcon="true"
    */
    @propertyDataSource({ type: Boolean }) showClearIcon: boolean = true;
    /**
    * Mantém a lista de opções aberta após seleção
    * @example keepListOpen="true"
    */
    @propertyDataSource({ type: Boolean }) keepListOpen: boolean = false; // default now is false for dropdown behavior
    /**
    * Exibe opções em caixas com cantos arredondados
    * @example roundedCorners="true"
    */
    @propertyDataSource({ type: Boolean }) roundedCorners: boolean = true;
    /**
    * Habilita rolagem suave na lista de opções
    * @example smoothScroll="true"
    */
    @propertyDataSource({ type: Boolean }) smoothScroll: boolean = true;
    /**
    * Atributo aria-label para acessibilidade
    * @example ariaLabel="Seleção de categorias"
    */
    @propertyDataSource({ type: String }) ariaLabel: string = '';

    // Dropdown open/close state
    @state()
    private dropdownOpen: boolean = false;

    private get selectedArray(): string[] {
        if (!this.selectedvalue) return [];
        try {
            // Se já for array, retorna
            if (Array.isArray(this.selectedvalue)) return this.selectedvalue as unknown as string[];
            // Se for string JSON
            if (typeof this.selectedvalue === 'string') {
                const arr = JSON.parse(this.selectedvalue);
                if (Array.isArray(arr)) return arr;
                // Se for string separada por vírgula
                return this.selectedvalue.split(',').map(s => s.trim()).filter(Boolean);
            }
            return [];
        } catch {
            // fallback para string separada por vírgula
            return this.selectedvalue.split(',').map(s => s.trim()).filter(Boolean);
        }
    }
    private set selectedArray(val: string[]) {
        this.selectedvalue = JSON.stringify(val);
    }
    private get optionsArray(): string[] {
        if (!this.options) return [];
        try {
            if (Array.isArray(this.options)) return this.options as unknown as string[];
            if (typeof this.options === 'string') {
                // Tenta JSON
                const arr = JSON.parse(this.options);
                if (Array.isArray(arr)) return arr;
                // fallback: string separada por vírgula
                return this.options.split(',').map(s => s.trim()).filter(Boolean);
            }
            return [];
        } catch {
            return this.options.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    // Handle click outside to close dropdown
    connectedCallback() {
        super.connectedCallback?.();
        document.addEventListener('mousedown', this._onDocumentClick);
    }
    disconnectedCallback() {
        document.removeEventListener('mousedown', this._onDocumentClick);
        super.disconnectedCallback?.();
    }

    private _onDocumentClick = (e: MouseEvent) => {
        // Only close if dropdown is open and click is outside
        if (!this.dropdownOpen) return;
        const path = e.composedPath ? e.composedPath() : (e as any).path;
        if (!path?.includes?.(this)) {
            this.dropdownOpen = false;
            this.requestUpdate();
        }
    };

    private _toggleDropdown(e?: Event) {
        if (this.disabled) return;
        if (e) e.stopPropagation();
        this.dropdownOpen = !this.dropdownOpen;
        this.requestUpdate();
    }

    private _closeDropdown() {
        this.dropdownOpen = false;
        this.requestUpdate();
    }

    render() {
        return html`
<div class="select-multitag-root" role="listbox" aria-multiselectable="true" aria-label="${this.ariaLabel}">
${this.label ? html`<label class="select-multitag-label">${this.label}</label>` : ''}
<div class="select-multitag-control ${this.disabled ? 'disabled' : ''}"
  tabindex="0"
  @click="${this._toggleDropdown}"
  @keydown="${this._onControlKeydown}">
  ${this.selectedArray && this.selectedArray.length > 0 ? html`
    <div class="select-multitag-tags">
      ${repeat(
            this.selectedArray,
            ((item: string) => item) as () => string,
            ((item: string) => html`<span class="select-multitag-tag">${item}<button type="button" class="select-multitag-tag-remove" @click="${(e: Event) => this._removeTagClick(e, item)}" aria-label="Remove ${item}">&times;</button></span>`) as () => TemplateResult<1>
        )}
    </div>
  ` : html`<span class="select-multitag-placeholder">${this.myMessage.placeholder}</span>`}
  ${this.showClearIcon && this.selectedArray && this.selectedArray.length > 0 && !this.disabled ? html`
    <button type="button" class="select-multitag-clear" @click="${this.clearSelection}" aria-label="${this.myMessage.clear}">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#C0C0C0" stroke-width="2"/><path d="M5.5 5.5L10.5 10.5" stroke="#C0C0C0" stroke-width="2" stroke-linecap="round"/><path d="M10.5 5.5L5.5 10.5" stroke="#C0C0C0" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  ` : ''}
  <span class="select-multitag-arrow ${this.dropdownOpen ? 'open' : ''}"></span>
</div>
${this.hint ? html`<div class="select-multitag-hint">${this.hint}</div>` : ''}
${this.dropdownOpen ? html`
  <div class="select-multitag-list ${this.roundedCorners ? 'rounded' : ''} ${this.smoothScroll ? 'smooth-scroll' : ''}" tabindex="0">
    ${repeat(
            this.optionsArray,
            ((option: string) => option) as () => string,
            ((option: string) => html`
        <div class="select-multitag-option ${this.selectedArray && this.selectedArray.includes(option) ? 'selected' : ''} ${this.disabled ? 'disabled' : ''}"
          @mousedown="${(e: Event) => this.handleOptionClick(e, option)}"
          role="option"
          aria-selected="${this.selectedArray && this.selectedArray.includes(option) ? 'true' : 'false'}"
        >
          ${option}
        </div>
      `) as () => TemplateResult<1>
        )}
    <div class="select-multitag-list-actions">
      <button type="button" class="select-multitag-list-close" @click="${this._closeDropdown}">OK</button>
    </div>
  </div>
` : ''}
</div>
`;
    }

    private _removeTagClick(e: Event, item: string) {
        // Prevent dropdown toggle when clicking remove
        e.stopPropagation();
        this.removeTag(item);
    }

    private _onControlKeydown(e: KeyboardEvent) {
        // Open dropdown with ArrowDown/Enter/Space
        if (this.disabled) return;
        if (!this.dropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            this.dropdownOpen = true;
            this.requestUpdate();
        } else if (this.dropdownOpen && (e.key === 'Escape' || e.key === 'Tab')) {
            // Close dropdown with Escape or Tab
            this.dropdownOpen = false;
            this.requestUpdate();
        }
    }

    private handleOptionClick(e: Event, option: string) {
        if (this.disabled) return;
        e.preventDefault();
        let arr = this.selectedArray;
        if (arr.includes(option)) {
            arr = arr.filter(v => v !== option);
        } else {
            arr = [...arr, option];
        }
        this.selectedArray = arr;
        this.requestUpdate();
        // Dropdown closes after selection if keepListOpen is false
        if (!this.keepListOpen) {
            this.dropdownOpen = false;
            this.requestUpdate();
        }
    }
    private removeTag(option: string) {
        if (this.disabled) return;
        let arr = this.selectedArray;
        arr = arr.filter(v => v !== option);
        this.selectedArray = arr;
        this.requestUpdate();
    }
    private clearSelection(e?: Event) {
        if (e) e.stopPropagation(); // Prevent dropdown toggle
        if (this.disabled) return;
        this.selectedArray = [];
        this.requestUpdate();
    }
}
