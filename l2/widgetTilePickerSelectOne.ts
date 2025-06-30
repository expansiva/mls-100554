/// <mls shortName="widgetTilePickerSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    select: 'Selecionar',
    selected: 'Selecionado',
};
const message_en = {
    select: 'Select',
    selected: 'Selected',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
* Widget para seleção visual de opções em formato de mini-cards (imagem + label), ideal para temas ou templates.
* Baseado em IcaFormsInputSelectOneBase.
*/
@customElement('widget-tile-picker-select-one-100554')
export class WidgetTilePickerSelectOne extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['en'];
    /**
    * Texto do rótulo exibido no widget
    * @example label="Escolha um tema"
    */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
    * Texto de dica para o usuário
    * @example hint="Selecione uma opção"
    */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
    * Valor da opção selecionada
    * @example selectedvalue="tema1"
    */
    @propertyDataSource({ type: String }) selectedvalue: string | undefined;
    /**
    * Lista de opções disponíveis para seleção, cada uma com imagem e label
    * @example options="[{ value: 'tema1', label: 'Tema Claro', image: 'img1.png' }]"
    */
    @propertyDataSource({ type: Array }) options: Array<{ value: string; label: string; image: string }> = [];
    /**
    * Desabilita o widget
    * @example disabled=true
    */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
    * Torna o widget somente leitura
    * @example readonly=true
    */
    @propertyDataSource({ type: Boolean }) readonly: boolean = false;
    /**
    * Configuração para grid responsiva que adapta o layout dos tiles conforme o tamanho da tela
    * @example responsiveGrid="{small:2,medium:3,large:4}"
    */
    @propertyDataSource({ type: Object }) responsiveGrid: { small?: number; medium?: number; large?: number } = {};
    /**
    * Atributo aria-label para acessibilidade
    * @example ariaLabel="Escolha um tema"
    */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    /**
    * Indica se a seleção é obrigatória
    * @example required=true
    */
    @propertyDataSource({ type: Boolean }) required: boolean = false;

    private get __options() {
        return Array.isArray(this.options) ? this.options : [];
    }
    private get __responsiveGrid() {
        return this.responsiveGrid || {};
    }
    private handleTileClick(option: { value: string }) {
        if (this.disabled || this.readonly) return;
        this.selectedvalue = option.value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: option.value } }));
        this.requestUpdate();
    }
    private handleTileKeyDown(e: KeyboardEvent, option: { value: string }) {
        if (this.disabled || this.readonly) return;
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.handleTileClick(option);
        }
    }
    render() {
        return html`
<div class="tile-picker-root">
${this.label ? html`<label class="tile-picker-label">${this.label}</label>` : ''}
${this.hint ? html`<div class="tile-picker-hint">${this.hint}</div>` : ''}
<div class="tile-picker-grid"
role="listbox"
aria-label="${this.ariaLabel}"
>
${repeat(
            this.__options,
            ((item: { value: string }) => item.value) as () => string,
            ((option: { value: string; label: string; image: string }, idx: number) => {
                const selected = this.selectedvalue === option.value;
                return html`
<div
class="tile-picker-tile${selected ? ' selected' : ''}${this.disabled ? ' disabled' : ''}${this.readonly ? ' readonly' : ''}"
tabindex="${this.disabled ? -1 : 0}"
role="option"
aria-selected="${selected ? 'true' : 'false'}"
@keydown="${(e: KeyboardEvent) => this.handleTileKeyDown(e, option)}"
@click="${() => this.handleTileClick(option)}"
>
<div class="tile-picker-image-wrap">
<img class="tile-picker-image" src="${option.image}" alt="${option.label}" />
${selected ? html`<span class="tile-picker-badge" aria-label="${this.myMessage.selected}">✓</span>` : ''}
</div>
<div class="tile-picker-tile-label">${option.label}</div>
</div>
`;
            }) as () => TemplateResult<1>
        )}
</div>
</div>
`;
    }
}
