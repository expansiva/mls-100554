/// <mls shortName="widgetSelectOneAutocompleteMaterial" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    noResults: 'Nenhum resultado',
    loading: 'Carregando...'
}
const message_en = {
    noResults: 'No results',
    loading: 'Loading...'
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
* Combo-box autocompletar inspirado no Material UI Autocomplete.
* Filtra sugestões conforme o usuário digita, mostra mensagem quando não há resultados,
* suporta foco acessível com aria-activedescendant e exibe spinner de carregamento para opções remotas.
*/
@customElement('widget-select-one-autocomplete-material-100554')
export class WidgetSelectOneAutocompleteMaterial extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['pt'];
    /** Texto do rótulo exibido no campo */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /** Texto de ajuda exibido abaixo do campo */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /** Valor selecionado atualmente */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /** Lista de opções para seleção, pode ser estática ou atualizada dinamicamente */
    @propertyDataSource({ type: Array }) options: string[] = [];
    /** Indica se o campo é obrigatório */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /** Indica se o campo está desabilitado */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /** Indica se o spinner de carregamento deve ser exibido durante busca remota */
    @propertyDataSource({ type: Boolean }) loading: boolean = false;
    /** Mensagem exibida quando não há resultados para o filtro */
    @propertyDataSource({ type: String }) noResultsMessage: string = '';
    /** ID do elemento ativo para acessibilidade aria-activedescendant */
    @propertyDataSource({ type: String }) ariaActivedescendant: string = '';
    /** Nome do campo para formulários */
    @propertyCompositeDataSource({ type: String }) name: string | undefined;
    /** Atributo aria-label para acessibilidade */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    inputValue: string = '';
    private focusedIndex: number = -1;
    private dropdownOpen: boolean = false;
    private filteredOptions: string[] = [];
    private mouseOverList: boolean = false;
    render() {
        const showDropdown = this.dropdownOpen && (this.inputValue.length > 0 || this.loading);
        const filtered = this.getFilteredOptions();
        const hasResults = filtered.length > 0;
        const noResultsMsg = this.noResultsMessage || this.myMessage.noResults;
        return html`
<div class="autocomplete-root">
<label ?hidden="${!this.label}" class="autocomplete-label">${this.label}</label>
<div class="autocomplete-input-wrapper">
<input
class="autocomplete-input"
type="text"
?disabled="${this.disabled}"
?required="${this.required}"
.name="${ifDefined(this.name)}"
.value="${this.inputValue}"
@input="${this.handleInput}"
@focus="${this.handleFocus}"
@blur="${this.handleBlur}"
@keydown="${this.handleKeydown}"
autocomplete="off"
role="combobox"
aria-autocomplete="list"
aria-expanded="${showDropdown}"
aria-activedescendant="${this.ariaActivedescendant}"
aria-label="${this.ariaLabel}"
/>
${this.loading ? html`<span class="autocomplete-spinner" aria-label="${this.myMessage.loading}"></span>` : ''}
</div>
${this.hint ? html`<div class="autocomplete-hint">${this.hint}</div>` : ''}
${showDropdown ? html`
<ul class="autocomplete-list" role="listbox" @mousedown="${this.handleListMouseDown}" @mouseleave="${this.handleListMouseLeave}">
${this.loading ? html`
<li class="autocomplete-loading">${this.myMessage.loading}</li>
` : hasResults ? repeat(
            filtered,
            ((item: string) => item) as () => string,
            ((option: string, idx: number) => html`
<li
id="option-${idx}"
class="autocomplete-option${this.focusedIndex === idx ? ' focused' : ''}${this.selectedvalue === option ? ' selected' : ''}"
role="option"
aria-selected="${this.selectedvalue === option}"
@click="${() => this.selectOption(option)}"
@mousemove="${() => this.setFocusedIndex(idx)}"
>
${option}
</li>
`) as () => TemplateResult<1>
        ) : html`
<li class="autocomplete-no-results">${noResultsMsg}</li>
`}
</ul>
` : ''}
</div>
`;
    }
    private getFilteredOptions(): string[] {
        if (!this.inputValue) return this.options || [];
        const val = this.inputValue.toLowerCase();
        return (this.options || []).filter(opt => opt.toLowerCase().includes(val));
    }
    private handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        this.inputValue = target.value;
        this.dropdownOpen = true;
        this.focusedIndex = -1;
        this.requestUpdate();
    }
    private handleFocus() {
        this.dropdownOpen = true;
        this.requestUpdate();
    }
    private handleBlur() {
        if (!this.mouseOverList) {
            this.dropdownOpen = false;
            this.focusedIndex = -1;
            this.requestUpdate();
        }
    }
    private handleListMouseDown() {
        this.mouseOverList = true;
    }
    private handleListMouseLeave() {
        this.mouseOverList = false;
    }
    private handleKeydown(e: KeyboardEvent) {
        const filtered = this.getFilteredOptions();
        if (!this.dropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            this.dropdownOpen = true;
            this.requestUpdate();
            return;
        }
        if (e.key === 'ArrowDown') {
            if (filtered.length === 0) return;
            this.focusedIndex = (this.focusedIndex + 1) % filtered.length;
            this.updateAriaActiveDescendant();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (filtered.length === 0) return;
            this.focusedIndex = (this.focusedIndex - 1 + filtered.length) % filtered.length;
            this.updateAriaActiveDescendant();
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (this.focusedIndex >= 0 && this.focusedIndex < filtered.length) {
                this.selectOption(filtered[this.focusedIndex]);
                this.dropdownOpen = false;
                this.focusedIndex = -1;
                this.requestUpdate();
            }
        } else if (e.key === 'Escape') {
            this.dropdownOpen = false;
            this.focusedIndex = -1;
            this.requestUpdate();
        }
    }
    private setFocusedIndex(idx: number) {
        this.focusedIndex = idx;
        this.updateAriaActiveDescendant();
        this.requestUpdate();
    }
    private updateAriaActiveDescendant() {
        if (this.focusedIndex >= 0) {
            this.ariaActivedescendant = `option-${this.focusedIndex}`;
        } else {
            this.ariaActivedescendant = '';
        }
    }
    private selectOption(option: string) {
        this.selectedvalue = option;
        this.inputValue = option;
        this.dropdownOpen = false;
        this.focusedIndex = -1;
        this.requestUpdate();
    }
}
