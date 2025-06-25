/// <mls shortName="widgetRadioListVerticalSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, TemplateResult, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    selectOne: 'Selecione uma opção',
    hint: 'Dica',
};
const message_en = {
    selectOne: 'Select one option',
    hint: 'Hint',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget de seleção única em lista vertical com ícones de rádio, labels e hints opcionais, suporte a teclado e acessibilidade.
 * Baseado em IcaFormsInputSelectOneBase.
 */
@customElement('widget-radio-list-vertical-select-one-100554')
export class WidgetRadioListVerticalSelectOne extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['en'];
    /**
     * Valor selecionado atualmente
     * @example selectedvalue="SP"
     */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /**
     * Lista de opções visíveis para seleção
     * @example options="[{ value: 'SP', label: 'São Paulo', hint: 'Capital financeira' }]"
     */
    @propertyDataSource({ type: Array }) options: Array<{ value: string; label?: string; hint?: string; ariaLabel?: string }> = [];
    /**
     * Texto do label para o grupo
     * @example label="Estado"
     */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
     * Texto de dica opcional para o grupo
     * @example hint="Escolha um estado"
     */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
     * Atributo aria-label para acessibilidade por item
     * @example ariaLabel="Opção de estado"
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    /**
     * Suporte à navegação e seleção via teclado
     * @example keyboardSupport=true
     */
    @propertyDataSource({ type: Boolean }) keyboardSupport: boolean = true;
    /**
     * Permite seleção ao clicar em qualquer parte da linha do item
     * @example selectOnRowClick=true
     */
    @propertyDataSource({ type: Boolean }) selectOnRowClick: boolean = true;
    /**
     * Indica se o campo está desabilitado
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
     * Indica se o campo é obrigatório
     */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    private focusedIndex: number = -1;
    render() {
        return html`
<div class="radio-list-vertical-root" role="radiogroup" aria-label="${ifDefined(this.label || this.ariaLabel)}">
${this.label ? html`<div class="radio-list-label">${this.label}</div>` : ''}
${this.hint ? html`<div class="radio-list-hint">${this.hint}</div>` : ''}
<ul class="radio-list-ul">
${repeat(
            this.options,
            ((item: { value: string }) => item.value) as () => string,
            ((item: { value: string; label?: string; hint?: string; ariaLabel?: string }, idx: number) => this.renderRadioItem(item, idx)) as () => TemplateResult<1>
        )}
</ul>
</div>
`;
    }
    private renderRadioItem(item: { value: string; label?: string; hint?: string; ariaLabel?: string }, idx: number): TemplateResult<1> {
        const checked = this.selectedvalue === item.value;
        const isFocused = this.focusedIndex === idx;
        return html`
<li class="radio-list-li ${checked ? 'selected' : ''} ${isFocused ? 'focused' : ''}"
tabindex="${this.getTabIndex(idx)}"
role="radio"
aria-checked="${checked ? 'true' : 'false'}"
aria-label="${ifDefined(item.ariaLabel || item.label || this.ariaLabel)}"
@click="${() => this.handleSelect(idx)}"
@keydown="${(e: KeyboardEvent) => this.handleKeyDown(e, idx)}"
>
<span class="radio-icon" aria-hidden="true">
${checked ? this.renderRadioCheckedIcon() : this.renderRadioUncheckedIcon()}
</span>
<span class="radio-label">${item.label || item.value}</span>
${item.hint ? html`<span class="radio-hint">${item.hint}</span>` : ''}
</li>
`;
    }
    private renderRadioCheckedIcon(): TemplateResult<1> {
        return html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#1C91CD" stroke-width="2"/><circle cx="10" cy="10" r="5" fill="#1C91CD"/></svg>`;
    }
    private renderRadioUncheckedIcon(): TemplateResult<1> {
        return html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#C0C0C0" stroke-width="2" fill="none"/></svg>`;
    }
    private handleSelect(idx: number): void {
        if (this.disabled) return;
        const item = this.options[idx];
        if (!item) return;
        this.selectedvalue = item.value;
        this.focusedIndex = idx;
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent('change', { detail: { value: item.value } }));
    }
    private handleKeyDown(e: KeyboardEvent, idx: number): void {
        if (!this.keyboardSupport || this.disabled) return;
        const max = this.options.length - 1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const next = idx < max ? idx + 1 : 0;
            this.focusedIndex = next;
            this.focusItem(next);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = idx > 0 ? idx - 1 : max;
            this.focusedIndex = prev;
            this.focusItem(prev);
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.handleSelect(idx);
        }
    }
    private focusItem(idx: number): void {
        const items = this.shadowRoot?.querySelectorAll('.radio-list-li');
        if (items && items[idx]) {
            (items[idx] as HTMLElement).focus();
        }
    }
    private getTabIndex(idx: number): number {
        if (this.disabled) return -1;
        if (this.selectedvalue !== undefined) {
            return this.options[idx].value === this.selectedvalue ? 0 : -1;
        }
        return idx === 0 ? 0 : -1;
    }
    public async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.selectedvalue !== undefined) {
            const idx = this.options.findIndex(opt => opt.value === this.selectedvalue);
            this.focusedIndex = idx >= 0 ? idx : 0;
        } else {
            this.focusedIndex = 0;
        }
    }
    public async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
    }
}
