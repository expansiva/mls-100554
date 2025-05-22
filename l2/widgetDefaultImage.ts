/// <mls shortName="widgetDefaultImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaApresentationImageBase, IConfig } from './_100554_icaApresentationImageBase';
import { propertyDataSource } from './_100554_collabDecorators';

/**
 * Widget para exibir uma imagem em largura total, ideal para banners.
 * Suporta responsividade, acessibilidade e otimização de carregamento.
 * Baseado em IcaApresentationImageBase.
 */
@customElement('widget-default-image-100554')
export class WidgetDefaultImage extends IcaApresentationImageBase {
  /**
   * Configuração do componente, conforme interface IConfig.
   * Exemplo: '{"type":"image","src":"https://site.com/banner.jpg","alt":"Banner principal","width":"100%","height":"300px"}'
   */
  @propertyDataSource({ type: String }) config: string | undefined;

  render() {
    let cfg: IConfig | undefined;
    if (this.config) {
      try {
        cfg = JSON.parse(this.config) as IConfig;
      } catch {
        cfg = undefined;
      }
    }

    console.info({
      cfg
    })
    if (!cfg || cfg.type !== 'image' || !cfg.src) {
      return html`<div class="widget-default-image-100554__error">Imagem não configurada</div>`;
    }
    return html`
      <img
        src="${cfg.src}"
        alt="${cfg.alt ? cfg.alt : ''}"
        width="100%"
        style="display:block;width:100%;${cfg.height ? `height:${cfg.height};` : 'height:auto;'}object-fit:cover;${cfg.width ? `max-width:${cfg.width};` : ''}"
        loading="lazy"
      />
    `;
  }
}
