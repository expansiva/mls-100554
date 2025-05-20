/// <mls shortName="widgetDefaultText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyCompositeDataSource } from './_100554_collabDecorators';
import { IcaApresentationTextBase } from './_100554_icaApresentationTextBase';
/**
 * Componente para exibir texto simples, podendo ser texto fixo ou dinâmico.
 * Suporta variações de apresentação: texto, citação (quote) e banner.
 */
@customElement('widget-default-text-100554')
export class WidgetDefaultText extends IcaApresentationTextBase {
  /**
   * Texto simples a ser exibido, pode conter binding para texto dinâmico.
   * @example "Olá, {{userName}}!"
   */
  @propertyCompositeDataSource({ type: String }) text: string | undefined;
  /**
   * Configuração de apresentação do texto.
   * @example { type: 'quote', cite: 'Autor', citeHref: 'https://...' }
   */
  @propertyCompositeDataSource({ type: Object }) config: {
    type: 'text' | 'quote' | 'banner',
    multiline?: boolean,
    cite?: string,
    citeHref?: string,
    src?: string,
    alt?: string,
    href?: string,
    target?: '_blank' | '_self'
  } | undefined;
  
  render() {
    const cfg = this.config || { type: 'text' };
    const multiline = cfg.multiline ?? false;
    const textContent = this.text || '';
    if (cfg.type === 'banner' && cfg.src) {
      const img = html`<img class="banner-img" src="${cfg.src}" alt="${cfg.alt || ''}" />`;
      const content = html`
        <div class="banner-content">
          ${img}
          ${textContent ? html`<span class="banner-text">${multiline ? textContent.split('\n').map(line => html`<span>${line}</span><br />`) : textContent}</span>` : ''}
        </div>
      `;
      return cfg.href ? html`<a class="banner-link" href="${cfg.href}" target="${ifDefined(cfg.target)}" rel="noopener noreferrer">${content}</a>` : content;
    }
    if (cfg.type === 'quote') {
      return html`
        <blockquote class="quote-block">
          <span class="quote-text">${multiline ? textContent.split('\n').map(line => html`<span>${line}</span><br />`) : textContent}</span>
          ${cfg.cite ? html`
            <footer class="quote-footer">
              ${cfg.citeHref ? html`<a href="${cfg.citeHref}" target="_blank" rel="noopener noreferrer">${cfg.cite}</a>` : cfg.cite}
            </footer>
          ` : ''}
        </blockquote>
      `;
    }
    // type: text (default)
    const inner = multiline ? textContent.split('\n').map(line => html`<span>${line}</span><br />`) : textContent;
    const textEl = html`<span class="text-content">${inner}</span>`;
    return cfg.href ? html`<a class="text-link" href="${cfg.href}" target="${ifDefined(cfg.target)}" rel="noopener noreferrer">${textEl}</a>` : textEl;
  }
}
