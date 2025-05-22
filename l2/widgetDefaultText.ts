/// <mls shortName="widgetDefaultText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
import { IcaApresentationTextBase } from './_100554_icaApresentationTextBase';
import type { IConfig } from './_100554_icaApresentationTextBase';

/**
 * Widget para exibir texto simples, podendo ser texto fixo ou dinâmico via binding.
 * Suporta diferentes tipos de exibição e acessibilidade básica.
 */
@customElement('widget-default-text-100554')
export class WidgetDefaultText extends IcaApresentationTextBase {
  /**
   * Configuração do widget, define tipo, multiline, citações, links, etc.
   * @example
   * config = '{"type":"text","multiline":true}'
   */
  @propertyDataSource({ type: String })
  config: string | undefined;

  /**
   * Texto a ser exibido, pode ser texto simples ou binding.
   * @example
   * text = 'Olá mundo!'
   */
  @propertyCompositeDataSource({ type: String })
  text: string | undefined;

  render() {
    let cfg: IConfig = { type: 'text' };
    if (this.config) {
      try {
        cfg = { ...cfg, ...JSON.parse(this.config) };
      } catch (e) {
        // fallback para text
        cfg = { type: 'text' };
      }
    }
    const isQuote = cfg.type === 'quote';
    const isBanner = cfg.type === 'banner';
    const isMultiline = !!cfg.multiline;
    const Tag = isQuote ? 'blockquote' : isBanner ? 'div' : 'span';
    const textContent = isMultiline && this.text ? this.text.split('\n').map((line, i) => html`<span>${line}</span>${i < this.text!.split('\n').length - 1 ? html`<br>` : ''}`) : this.text;
    let inner: any = textContent;
    if (cfg.href) {
      inner = html`<a href=${cfg.href} target=${ifDefined(cfg.target)} rel="noopener noreferrer">${textContent}</a>`;
    }
    if (isQuote) {
      return html`
        <blockquote class="quote">
          <p>${unsafeHTML(inner)}</p>
          ${cfg.cite ? html`<footer>
            ${cfg.citeHref ? html`<a href=${cfg.citeHref} target="_blank" rel="noopener noreferrer">${cfg.cite}</a>` : cfg.cite}
          </footer>` : ''}
        </blockquote>
      `;
    }
    if (isBanner) {
      return html`
        <div class="banner">
          ${unsafeHTML(inner)}
        </div>
      `;
    }
    return html`<span class="text">${unsafeHTML(inner)}</span>`;
  }
}
