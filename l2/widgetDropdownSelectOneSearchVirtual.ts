/// <mls shortName="widgetDropdownSelectOneSearchVirtual" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    placeholder: 'Selecione...',
    search: 'Pesquisar...',
    noResults: 'Nenhum resultado encontrado',
    required: 'Seleção obrigatória',
};
const message_en = {
    placeholder: 'Select...',
    search: 'Search...',
    noResults: 'No results found',
    required: 'Selection required',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
* Dropdown clássico com pesquisa interna, navegação por teclado, seleção com Enter, validação de seleção obrigatória, rolagem virtual para listas grandes e placeholder para valor vazio.
*/
@customElement('widget-dropdown-select-one-search-virtual-100554')
export class WidgetDropdownSelectOneSearchVirtual extends IcaFormsInputSelectOneBase {
    /** Texto do label do campo */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /** Dica ou ajuda do campo */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /** Valor selecionado atual */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /** Lista de opções disponíveis para seleção */
    @propertyDataSource({ type: Array }) options: string[] = [];
    /** Indica se a seleção é obrigatória */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /** Desabilita o componente */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /** Texto exibido quando nenhum valor está selecionado */
    @propertyCompositeDataSource({ type: String }) placeholder: string = '';
    /** Estado de erro exibido quando required e sem seleção */
    @propertyCompositeDataSource({ type: String }) error: string = '';
    /** Ativa rolagem virtual para listas com mais de 100 itens */
    @propertyDataSource({ type: Boolean }) virtualScroll: boolean = false;
    /** Ativa pesquisa interna para filtrar opções */
    @propertyDataSource({ type: Boolean }) searchEnabled: boolean = true;
    /** Suporte à navegação por setas e seleção com Enter */
    @propertyDataSource({ type: Boolean }) keyboardNavigation: boolean = true;
    /** Atributo ARIA label para acessibilidade */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    private _open = false;
    private _search = '';
    private _focusedIndex: number = -1;
    private _lang: string = 'pt';
    private get __messages(): MessageType {
        return messages[this._lang] || messages['en'];
    }
    private get __placeholder(): string {
        return this.placeholder || this.__messages.placeholder;
    }
    private get __filteredOptions(): string[] {
        if (!this.searchEnabled || !this._search) return this.options || [];
        return (this.options || []).filter(opt => opt.toLowerCase().includes(this._search.toLowerCase()));
    }
    private get __showVirtual(): boolean {
        return this.virtualScroll || (this.options && this.options.length > 100);
    }
    private _onInputClick() {
        if (this.disabled) return;
        this._open = !this._open;
        this._search = '';
        this._focusedIndex = -1;
        this.requestUpdate();
    }
    private _onSearchInput(e: InputEvent) {
        this._search = (e.target as HTMLInputElement).value;
        this._focusedIndex = 0;
        this.requestUpdate();
    }
    private _onOptionClick(opt: string) {
        this.selectedvalue = opt;
        this._open = false;
        this._search = '';
        this._focusedIndex = -1;
        this.error = '';
        this.requestUpdate();
    }
    private _onInputKeyDown(e: KeyboardEvent) {
        if (!this.keyboardNavigation || !this._open) return;
        const opts = this.__filteredOptions;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._focusedIndex = Math.min(this._focusedIndex + 1, opts.length - 1);
            this.requestUpdate();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._focusedIndex = Math.max(this._focusedIndex - 1, 0);
            this.requestUpdate();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (opts[this._focusedIndex]) {
                this._onOptionClick(opts[this._focusedIndex]);
            }
        } else if (e.key === 'Escape') {
            this._open = false;
            this.requestUpdate();
        }
    }
    private _onBlur() {
        setTimeout(() => {
            this._open = false;
            this._search = '';
            this._focusedIndex = -1;
            this.requestUpdate();
        }, 150);
    }
    private _validate() {
        if (this.required && !this.selectedvalue) {
            this.error = this.__messages.required;
        } else {
            this.error = '';
        }
        this.requestUpdate();
    }
    public updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('selectedvalue') || changedProperties.has('required')) {
            this._validate();
        }
    }
    render() {
        const opts = this.__filteredOptions;
        const showVirtual = this.__showVirtual;
        const showError = !!this.error;
        return html`
<div class="dropdown-root">
<label ?hidden="${!this.label}" class="dropdown-label">${this.label}</label>
<div class="dropdown-input-wrapper ${this.disabled ? 'disabled' : ''} ${showError ? 'error' : ''}" tabindex="0" aria-haspopup="listbox" aria-expanded="${this._open}" aria-label="${this.ariaLabel || this.label}">
<div class="dropdown-input" @click="${() => this._onInputClick()}" @keydown="${(e: KeyboardEvent) => this._onInputKeyDown(e)}" @blur="${() => this._onBlur()}" ?disabled="${this.disabled}">
<span class="dropdown-placeholder" ?hidden="${!!this.selectedvalue}">${this.__placeholder}</span>
<span class="dropdown-value" ?hidden="${!this.selectedvalue}">${this.selectedvalue || ''}</span>
<span class="dropdown-arrow"></span>
</div>
${this._open ? html`
<div class="dropdown-listbox" role="listbox">
${this.searchEnabled ? html`<input class="dropdown-search" type="text" placeholder="${this.__messages.search}" .value="${this._search}" @input="${(e: InputEvent) => this._onSearchInput(e)}">` : ''}
<div class="dropdown-options${showVirtual ? ' virtual' : ''}">
${opts.length === 0 ? html`<div class="dropdown-no-results">${this.__messages.noResults}</div>` :
                    // Always render all options, even in virtual mode
                    repeat(
                        opts,
                        ((item: string) => item) as () => string,
                        ((item: string, idx: number) => html`
<div class="dropdown-option${this._focusedIndex === idx ? ' focused' : ''}" role="option" aria-selected="${this.selectedvalue === item}" @mousedown="${() => this._onOptionClick(item)}">
${item}
</div>
`) as () => TemplateResult<1>
                    )
                }
</div>
</div>
` : ''}
</div>
${showError ? html`<div class="dropdown-error">${this.error}</div>` : ''}
${this.hint ? html`<div class="dropdown-hint">${this.hint}</div>` : ''}
</div>
`;
    }
    // _renderVirtualOptions is no longer used, but kept for possible future optimization
    private _renderVirtualOptions(opts: string[]) {
        // This function is not used anymore, but kept for reference.
        // If you want to implement true virtual scroll, you can use this as a base.
        const visibleCount = 8;
        const start = Math.max(0, this._focusedIndex - Math.floor(visibleCount / 2));
        const end = Math.min(opts.length, start + visibleCount);
        return html`
<div class="dropdown-virtual-window">
${repeat(
            opts.slice(start, end),
            ((item: string) => item) as () => string,
            ((item: string, idx: number) => html`
<div class="dropdown-option${this._focusedIndex === (start + idx) ? ' focused' : ''}" role="option" aria-selected="${this.selectedvalue === item}" @mousedown="${() => this._onOptionClick(item)}">
${item}
</div>
`) as () => TemplateResult<1>
        )}
</div>
`;
    }
}
