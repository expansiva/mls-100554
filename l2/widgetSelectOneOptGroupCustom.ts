/// <mls shortName="widgetSelectOneOptGroupCustom" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    searchPlaceholder: 'Buscar...',
    noResults: 'Nenhum resultado encontrado',
};
const message_en = {
    searchPlaceholder: 'Search...',
    noResults: 'No results found',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**

interface OptionItem {
    label: string;
    value: string;
}
interface OptionGroup {
    groupLabel: string;
    options: OptionItem[];
}

@customElement('widget-select-one-opt-group-custom-100554')
/**
 * Drop-down com agrupamento de opções em cabeçalhos não selecionáveis, filtro considerando grupo e opção, inspirado no Select2.
 * Suporta seleção única, cabeçalhos de grupo com estilo distinto, filtro responsivo.
 */
export class WidgetSelectOneOptGroupCustom extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['en'];
    /**
     * Texto do rótulo exibido no componente
     * @example label="País"
     */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
     * Texto de dica para o usuário
     * @example hint="Selecione um país"
     */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
     * Valor da opção selecionada
     * @example selectedvalue="BR"
     */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /**
     * Lista de opções agrupadas, cada grupo com label e array de opções
     * @example options="[{groupLabel: 'América', options: [{label: 'Brasil', value: 'BR'}]}]"
     */
    @propertyDataSource({ type: Array }) options: OptionGroup[] = [];
    /**
     * Desabilita o componente
     * @example disabled=true
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
     * Define se a seleção é obrigatória
     * @example required=true
     */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
     * Habilita filtro de busca que considera grupo e opção
     * @example filterable=true
     */
    @propertyDataSource({ type: Boolean }) filterable: boolean = true;
    /**
     * Estilo visual para cabeçalhos de grupo, com cor distinta
     * @example groupHeaderStyle="color: #1C91CD;"
     */
    @propertyDataSource({ type: String }) groupHeaderStyle: string = '';
    /**
     * Atributo aria-label para acessibilidade
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';

    private dropdownOpen: boolean = false;
    private filterText: string = '';
    private focusedIndex: number = -1;

    private get __options(): OptionGroup[] {
        if (!this.filterable || !this.filterText) return this.options || [];
        const filter = this.filterText.toLowerCase();
        return (this.options || []).map(group => {
            const groupMatch = group.groupLabel.toLowerCase().includes(filter);
            const filteredOptions = group.options.filter(opt =>
                opt.label.toLowerCase().includes(filter) || groupMatch
            );
            return {
                groupLabel: group.groupLabel,
                options: groupMatch ? group.options : filteredOptions
            };
        }).filter(g => g.options.length > 0);
    }

    private get selectedLabel(): string {
        for (const group of this.options || []) {
            for (const opt of group.options) {
                if (opt.value === this.selectedvalue) return opt.label;
            }
        }
        return '';
    }

    render() {
        return html`
<div class="select-container" @keydown="${this.handleKeyDown}">
${this.label ? html`<label class="select-label">${this.label}</label>` : ''}
<div class="select-dropdown ${this.dropdownOpen ? 'open' : ''} ${this.disabled ? 'disabled' : ''}" @click="${this.toggleDropdown}" tabindex="0" aria-label="${this.ariaLabel}" ?aria-disabled="${this.disabled}">
<span class="select-value">${this.selectedLabel || this.hint}</span>
<span class="select-arrow"></span>
</div>
${this.dropdownOpen && !this.disabled ? html`
<div class="dropdown-panel">
${this.filterable ? html`
<input class="dropdown-filter" type="text" .value="${this.filterText}" placeholder="${this.myMessage.searchPlaceholder}" @input="${this.onFilterInput}">
` : ''}
<div class="dropdown-list">
${this.__options.length === 0 ? html`<div class="dropdown-no-results">${this.myMessage.noResults}</div>` : ''}
${repeat(
            this.__options,
            ((group: OptionGroup) => group.groupLabel) as () => string,
            ((group: OptionGroup) => html`
<div class="dropdown-group">
<div class="dropdown-group-header" style="${ifDefined(this.groupHeaderStyle)}">${group.groupLabel}</div>
${repeat(
                group.options,
                ((opt: OptionItem) => opt.value) as () => string,
                ((opt: OptionItem, idx: number) => html`
<div class="dropdown-option ${this.selectedvalue === opt.value ? 'selected' : ''}"
@mousedown="${(e: Event) => this.selectOption(opt.value)}"
role="option"
aria-selected="${this.selectedvalue === opt.value ? 'true' : 'false'}">
${opt.label}
</div>
`) as () => TemplateResult<1>
            )}
</div>
`) as () => TemplateResult<1>
        )}
</div>
</div>
` : ''}
</div>
`;
    }

    private toggleDropdown = () => {
        if (this.disabled) return;
        this.dropdownOpen = !this.dropdownOpen;
        if (!this.dropdownOpen) {
            this.filterText = '';
            this.focusedIndex = -1;
        }
        this.requestUpdate();
    };

    private selectOption(value: string) {
        this.selectedvalue = value;
        this.dropdownOpen = false;
        this.filterText = '';
        this.focusedIndex = -1;
        this.requestUpdate();
    }

    private onFilterInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        this.filterText = target.value;
        this.focusedIndex = -1;
        this.requestUpdate();
    };

    private handleKeyDown = (e: KeyboardEvent) => {
        if (this.disabled) return;
        if (!this.dropdownOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            this.toggleDropdown();
            return;
        }
        if (!this.dropdownOpen) return;
        const flatOptions: OptionItem[] = [];
        for (const group of this.__options) {
            for (const opt of group.options) flatOptions.push(opt);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.focusedIndex = Math.min(flatOptions.length - 1, this.focusedIndex + 1);
            this.requestUpdate();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.focusedIndex = Math.max(0, this.focusedIndex - 1);
            this.requestUpdate();
        } else if (e.key === 'Enter' && this.focusedIndex >= 0) {
            e.preventDefault();
            const opt = flatOptions[this.focusedIndex];
            if (opt) this.selectOption(opt.value);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.dropdownOpen = false;
            this.filterText = '';
            this.focusedIndex = -1;
            this.requestUpdate();
        }
    };
}
