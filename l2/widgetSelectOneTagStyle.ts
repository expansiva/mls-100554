/// <mls shortName="widgetSelectOneTagStyle" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined, repeat, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    clear: 'Limpar',
    placeholder: 'Selecione',
};
const message_en = {
    clear: 'Clear',
    placeholder: 'Select',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
* Widget de seleção múltipla com visual de tags, inspirado no Ant Design Select (modo multiple).
* Exibe opções em caixas arredondadas, fecha ao selecionar, mostra tags selecionadas e ícone para limpar.
* Suporta rolagem suave em listas longas e acessibilidade.
*/
@customElement('widget-select-one-tag-style-100554')
export class WidgetSelectOneTagStyle extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['en'];
    /** Texto do rótulo exibido para o campo */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /** Texto de dica para o usuário */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /** Lista de valores das opções selecionadas */
    @propertyDataSource({ type: Array }) selectedvalue: any = [];
    /** Lista de opções disponíveis para seleção */
    @propertyDataSource({ type: Array }) options: any = [];
    /** Indica se o campo está desabilitado */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /** Exibe ícone para limpar a seleção */
    @propertyDataSource({ type: Boolean }) clearIconVisible: boolean = true;
    /** Exibe opções em caixas com cantos arredondados */
    @propertyDataSource({ type: Boolean }) roundedCorners: boolean = true;
    /** Fecha a lista de opções automaticamente ao selecionar */
    @propertyDataSource({ type: Boolean }) closeOnSelect: boolean = false; // For multi-select, default is false
    /** Ativa rolagem suave em listas longas */
    @propertyDataSource({ type: Boolean }) smoothScroll: boolean = true;
    /** Atributo aria-label para acessibilidade */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    /** Indica se o campo é obrigatório */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    private dropdownOpen: boolean = false;
    private focusedIndex: number = -1;
    // Helper to get options as array
    private get __options(): string[] {
        return Array.isArray(this.options) ? this.options : [];
    }
    // Helper to get selected labels as array
    private get __selectedLabels(): string[] {
        // Defensive: always return array
        if (!Array.isArray(this.selectedvalue)) return [];
        return this.selectedvalue.filter((opt: any) => typeof opt === 'string');
    }
    // Toggle dropdown open/close
    private handleToggleDropdown() {
        if (this.disabled) return;
        this.dropdownOpen = !this.dropdownOpen;
        // Focus on first selected or first option
        if (this.__selectedLabels.length > 0) {
            this.focusedIndex = this.__options.findIndex(opt => opt === this.__selectedLabels[0]);
        } else {
            this.focusedIndex = 0;
        }
        this.requestUpdate();
    }
    // Handle selecting or unselecting an option (multi-select logic)
    private handleSelectOption(option: string) {
        if (this.disabled) return;
        let selected = Array.isArray(this.selectedvalue) ? [...this.selectedvalue] : [];
        const idx = selected.indexOf(option);
        if (idx === -1) {
            selected.push(option);
        } else {
            selected.splice(idx, 1);
        }
        this.selectedvalue = selected;
        if (this.closeOnSelect) {
            this.dropdownOpen = false;
        }
        this.focusedIndex = this.__options.findIndex(opt => opt === option);
        // Dispatch change event with array of selected values
        this.dispatchEvent(new CustomEvent('change', { detail: { value: selected } }));
        this.requestUpdate();
    }
    // Handle clearing all selections
    private handleClearSelection(e: Event) {
        e.stopPropagation();
        if (this.disabled) return;
        // Always set to empty array for multi-select
        this.selectedvalue = [];
        this.focusedIndex = -1;
        // Dispatch change event with empty array
        this.dispatchEvent(new CustomEvent('change', { detail: { value: [] } }));
        this.requestUpdate();
    }
    // Handle removing a single tag (deselect)
    private handleRemoveTag(e: Event, tag: string) {
        e.stopPropagation();
        if (this.disabled) return;
        let selected = Array.isArray(this.selectedvalue) ? [...this.selectedvalue] : [];
        selected = selected.filter((val: any) => val !== tag);
        this.selectedvalue = selected;
        this.focusedIndex = -1;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: selected } }));
        this.requestUpdate();
    }
    // Keyboard navigation for multi-select
    private handleKeyDown(e: KeyboardEvent) {
        if (!this.dropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            this.dropdownOpen = true;
            if (this.__selectedLabels.length > 0) {
                this.focusedIndex = this.__options.findIndex(opt => opt === this.__selectedLabels[0]);
            } else {
                this.focusedIndex = 0;
            }
            this.requestUpdate();
            return;
        }
        if (!this.dropdownOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.focusedIndex = (this.focusedIndex + 1) % this.__options.length;
            this.scrollToFocused();
            this.requestUpdate();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.focusedIndex = (this.focusedIndex - 1 + this.__options.length) % this.__options.length;
            this.scrollToFocused();
            this.requestUpdate();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (this.focusedIndex >= 0 && this.focusedIndex < this.__options.length) {
                this.handleSelectOption(this.__options[this.focusedIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.dropdownOpen = false;
            this.requestUpdate();
        }
    }
    // Scroll to focused item if needed
    private scrollToFocused() {
        if (!this.smoothScroll) return;
        const list = this.renderRoot?.querySelector('.select-dropdown-list');
        const item = list?.children?.[this.focusedIndex] as HTMLElement | undefined;
        if (item && list) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    // Blur closes dropdown
    private handleBlur(e: FocusEvent) {
        setTimeout(() => {
            this.dropdownOpen = false;
            this.requestUpdate();
        }, 100);
    }
    render() {
        return html`
<div class="select-tag-style-wrapper" @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e)}" tabindex="0" aria-label="${this.ariaLabel}" @blur="${(e: FocusEvent) => this.handleBlur(e)}">
${this.label ? html`<label class="select-label">${this.label}</label>` : ''}
<div class="select-field ${this.disabled ? 'disabled' : ''} ${this.dropdownOpen ? 'open' : ''}" @click="${() => this.handleToggleDropdown()}" part="field">
${this.__selectedLabels.length > 0 ? html`
${this.__selectedLabels.map(tag => html`
<span class="select-tag">
${tag}
${!this.disabled ? html`
<button class="select-tag-remove-btn" type="button" title="${this.myMessage.clear}" @click="${(e: Event) => this.handleRemoveTag(e, tag)}" tabindex="-1" aria-label="${this.myMessage.clear}">
<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 1 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06z" fill="#bfbfbf"/></svg>
</button>
` : ''}
</span>
`)}
` : html`<span class="select-placeholder">${this.myMessage.placeholder}</span>`}
${this.clearIconVisible && this.__selectedLabels.length > 0 && !this.disabled ? html`
<button class="select-clear-btn" type="button" title="${this.myMessage.clear}" @click="${(e: Event) => this.handleClearSelection(e)}" tabindex="-1" aria-label="${this.myMessage.clear}">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 1 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06z" fill="#bfbfbf"/></svg>
</button>
` : ''}
<span class="select-arrow" aria-hidden="true">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#bfbfbf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
</span>
</div>
${this.hint ? html`<div class="select-hint">${this.hint}</div>` : ''}
${this.dropdownOpen ? html`
<ul class="select-dropdown-list${this.smoothScroll ? ' smooth-scroll' : ''}" role="listbox">
${repeat(
            this.__options,
            ((item: string) => item) as (() => string),
            ((option: string, idx: number) => html`
<li class="select-dropdown-item${this.roundedCorners ? ' rounded' : ''}${this.__selectedLabels.includes(option) ? ' selected' : ''}${this.focusedIndex === idx ? ' focused' : ''}" role="option" aria-selected="${this.__selectedLabels.includes(option)}" @click="${() => this.handleSelectOption(option)}">
${option}
</li>
`) as (() => TemplateResult<1>)
        )}
</ul>
` : ''}
</div>
`;
    }
}
