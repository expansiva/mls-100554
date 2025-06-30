/// <mls shortName="widgetSelectOneScrollspySingle" project="100554" enhancement="_100554_enhancementLit" groupName="other">
import { html, repeat, ifDefined, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_collabDecorators';
/// **collab_i18n_start**
const message_pt = {
    selectSection: 'Selecione a seção',
};
const message_en = {
    selectSection: 'Select section',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget de seleção única baseado em lista lateral de links com auto-highlight por rolagem da página (scrollspy single).
 * Atualiza selectedvalue conforme a seção correspondente entra na viewport e permite scroll suave ao clicar nos itens, respeitando offset para cabeçalhos fixos.
 */
@customElement('widget-select-one-scrollspy-single-100554')
export class WidgetSelectOneScrollspySingle extends IcaFormsInputSelectOneBase {
    private myMessage: MessageType = messages['en'];
    /**
     * Valor selecionado atualmente, atualizado automaticamente conforme a seção correspondente entra na viewport.
     * @example selectedvalue="section1"
     */
    @propertyDataSource({ type: String }) selectedvalue: string = '';
    /**
     * Lista de opções para seleção, representando os links das seções.
     * @example options="[{label:'Seção 1', value:'section1', anchor:'#section1'}, ...]"
     */
    @propertyDataSource({ type: Array }) options: Array<{ label: string; value: string; anchor: string }> = [];
    /**
     * Deslocamento em pixels para compensar cabeçalhos fixos durante o scroll suave e detecção da seção visível.
     * @example offset="64"
     */
    @propertyDataSource({ type: Number }) offset: number = 0;
    /**
     * Configuração para ativar o comportamento de auto-highlight por rolagem da página (scrollspy single).
     * @example scrollspy="true"
     */
    @propertyDataSource({ type: Boolean }) scrollspy: boolean = true;
    /**
     * Define o comportamento do scroll ao clicar em um item, deve ser suave (smooth).
     * @example scrollBehavior="smooth"
     */
    @propertyDataSource({ type: String }) scrollBehavior: string = 'smooth';
    /**
     * Label do campo.
     * @example label="Seções"
     */
    @propertyCompositeDataSource({ type: String }) label: string = '';
    /**
     * Dica do campo.
     * @example hint="Escolha uma seção para navegar"
     */
    @propertyCompositeDataSource({ type: String }) hint: string = '';
    /**
     * Indica se o campo está desabilitado.
     * @example disabled="false"
     */
    @propertyDataSource({ type: Boolean }) disabled: boolean = false;
    /**
     * Indica se o campo é obrigatório.
     * @example required="false"
     */
    @propertyDataSource({ type: Boolean }) required: boolean = false;
    /**
     * Atributo ARIA label para acessibilidade.
     * @example ariaLabel="Lista de seções"
     */
    @propertyDataSource({ type: String }) ariaLabel: string = '';
    private _sectionObserver: IntersectionObserver | null = null;
    private _scrollingByClick = false;
    public async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.scrollspy) {
            this.setupScrollSpy();
        }
    }
    public async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('scrollspy') || changedProperties.has('options')) {
            this.cleanupScrollSpy();
            if (this.scrollspy) {
                this.setupScrollSpy();
            }
        }
    }
    private setupScrollSpy() {
        this.cleanupScrollSpy();
        if (!Array.isArray(this.options) || this.options.length === 0) return;
        const anchors = this.options.map(opt => {
            if (typeof opt.anchor === 'string' && opt.anchor.startsWith('#')) {
                return document.querySelector(opt.anchor);
            }
            return null;
        });
        const validSections = anchors.filter(Boolean) as Element[];
        if (validSections.length === 0) return;
        this._sectionObserver = new IntersectionObserver(
            (entries) => {
                if (this._scrollingByClick) return;
                let visibleEntry: IntersectionObserverEntry | null = null;
                let minTop = Number.POSITIVE_INFINITY;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const rect = entry.boundingClientRect;
                        if (rect.top >= 0 && rect.top < minTop) {
                            minTop = rect.top;
                            visibleEntry = entry;
                        }
                    }
                }
                if (visibleEntry) {
                    const idx = validSections.indexOf(visibleEntry.target);
                    if (idx !== -1 && this.options[idx]) {
                        const newValue = this.options[idx].value;
                        if (this.selectedvalue !== newValue) {
                            this.selectedvalue = newValue;
                            this.requestUpdate();
                        }
                    }
                }
            },
            {
                root: null,
                rootMargin: `-${this.offset}px 0px 0px 0px`,
                threshold: [0.5]
            }
        );
        validSections.forEach(section => {
            this._sectionObserver!.observe(section);
        });
    }
    private cleanupScrollSpy() {
        if (this._sectionObserver) {
            this._sectionObserver.disconnect();
            this._sectionObserver = null;
        }
    }
    private handleItemClick(option: { label: string; value: string; anchor: string }) {
        if (this.disabled) return;
        const anchor = typeof option.anchor === 'string' ? document.querySelector(option.anchor) : null;
        if (anchor) {
            this._scrollingByClick = true;
            const y = anchor.getBoundingClientRect().top + window.scrollY - (this.offset || 0);
            window.scrollTo({ top: y, behavior: this.scrollBehavior === 'smooth' ? 'smooth' : 'auto' });
            setTimeout(() => {
                this._scrollingByClick = false;
            }, 700);
        }
        if (this.selectedvalue !== option.value) {
            this.selectedvalue = option.value;
            this.requestUpdate();
        }
    }
    render() {
        return html`
<div class="widget-select-one-scrollspy-single__container" aria-label="${ifDefined(this.ariaLabel)}">
${this.label ? html`<div class="widget-select-one-scrollspy-single__label">${this.label}</div>` : ''}
${this.hint ? html`<div class="widget-select-one-scrollspy-single__hint">${this.hint}</div>` : ''}
<ul class="widget-select-one-scrollspy-single__list" role="listbox">
${repeat(
            this.options,
            ((item: { label: string; value: string; anchor: string }) => item.value) as () => string,
            ((option: { label: string; value: string; anchor: string }, idx: number) => html`
<li
role="option"
aria-selected="${this.selectedvalue === option.value ? 'true' : 'false'}"
tabindex="${this.selectedvalue === option.value ? '0' : '-1'}"
class="widget-select-one-scrollspy-single__item${this.selectedvalue === option.value ? ' widget-select-one-scrollspy-single__item--active' : ''}${this.disabled ? ' widget-select-one-scrollspy-single__item--disabled' : ''}"
@click="${() => this.handleItemClick(option)}"
>
<span>${option.label}</span>
</li>
`) as () => TemplateResult<1>
        )}
</ul>
</div>
`;
    }
}
