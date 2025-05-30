/// <mls shortName="widgetSocialToolbarVerticalAnimated" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaNavigationToolbarSocialBase, IConfig } from './_100554_icaNavigationToolbarSocialBase';
import { propertyDataSource } from './_100554_collabDecorators';
/**
 * Barra vertical fixa de ícones de redes sociais com animação de entrada, acessibilidade e efeito de destaque no foco/hover.
 * Ideal para landing pages e blogs.
 *
 * @example
 * <widget-social-toolbar-vertical-animated-100554 config="{{page1.socialConfig}}" tabindex="0" ariaLabel="Redes sociais" />
 */
@customElement('widget-social-toolbar-vertical-animated-100554')
export class WidgetSocialToolbarVerticalAnimated extends IcaNavigationToolbarSocialBase {
  /**
   * Configuração da barra de redes sociais.
   * @example
   * { items: [{ platform: 'twitter', href: '...', icon: '...', label: 'Twitter' }], layout: 'vertical', size: 'md' }
   */
  @propertyDataSource({ type: String }) config: string | undefined;
  /**
   * Ordem de foco para navegação por teclado.
   * @example
   * 0
   */
  @propertyDataSource({ type: Number }) tabindex: number = 0;
  /**
   * Descrição acessível para leitores de tela.
   * @example
   * 'Redes sociais'
   */
  @propertyDataSource({ type: String }) ariaLabel: string = '';
  /**
   * Efeito visual para destaque dos ícones ao receber foco ou hover.
   * @example
   * true
   */
  @propertyDataSource({ type: Boolean }) hoverFocusEffect: boolean = true;
  /**
   * Tipo de animação de entrada da barra.
   * @example
   * 'slide-in'
   */
  @propertyDataSource({ type: String }) animation: string = 'slide-in';
  /**
   * Posição fixa da barra na tela: 'left' ou 'right'.
   * @example
   * 'left'
   */
  @propertyDataSource({ type: String }) position: string = 'left';
  /**
   * Controle para manter a barra parcialmente visível quando minimizada.
   * @example
   * true
   */
  @propertyDataSource({ type: Boolean }) minimizedVisibility: boolean = true;
  /**
   * Layout da barra, fixado verticalmente.
   * @example
   * 'vertical'
   */
  @propertyDataSource({ type: String }) layout: string = 'vertical';
  /**
   * Tamanho dos ícones na barra.
   * @example
   * 'md'
   */
  @propertyDataSource({ type: String }) size: string = 'md';
  private get __config(): IConfig | undefined {
    if (!this.config) return undefined;
    try {
      return JSON.parse(this.config);
    } catch {
      return undefined;
    }
  }
  render() {
    const cfg = this.__config;
    if (!cfg || !cfg.items || !Array.isArray(cfg.items) || cfg.items.length === 0) {
      return html``;
    }
    const barPosition = this.position === 'right' ? 'right' : 'left';
    const animationClass = this.animation === 'slide-in' ? 'slide-in' : '';
    const minimized = this.minimizedVisibility ? 'minimized' : '';
    return html`
      <nav
        class="toolbar-vertical ${barPosition} ${animationClass} ${minimized}"
        aria-label=${ifDefined(this.ariaLabel || undefined)}
        tabindex=${ifDefined(this.tabindex)}
      >
        <ul class="toolbar-list">
          ${cfg.items.map((item, idx) => html`
            <li>
              <a
                href=${item.href}
                target="_blank"
                rel="noopener noreferrer"
                class="toolbar-icon ${this.hoverFocusEffect ? 'effect' : ''}"
                aria-label=${ifDefined(item.label || item.platform)}
                tabindex="0"
              >
                ${item.icon ? html`<img src="${item.icon}" alt="" />` : html`<span class="icon-default ${item.platform}"></span>`}
              </a>
            </li>
          `)}
        </ul>
      </nav>
    `;
  }
}
