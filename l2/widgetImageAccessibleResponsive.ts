/// <mls shortName="widgetImageAccessibleResponsive" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaApresentationImageBase, IConfig } from './_100554_icaApresentationImageBase';
import { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';

/**
 * Componente de imagem acessível, responsivo e otimizado para performance.
 * Suporta atributos alt, src, srcset, sizes, loading, decoding, width, height.
 * Permite uso em layouts responsivos e segue boas práticas de acessibilidade.
 *
 * Exemplo de uso:
 * <widget-image-accessible-responsive-100554
 *   .config="{{ type: 'image', src: 'url', alt: 'Descrição', width: '100%', height: 'auto' }}"
 * ></widget-image-accessible-responsive-100554>
 */
@customElement('widget-image-accessible-responsive-100554')
export class WidgetImageAccessibleResponsive extends IcaApresentationImageBase {
  /**
   * Configuração da imagem (herdado da base)
   * @example { type: 'image', src: 'url', alt: 'Descrição', width: '100%', height: 'auto' }
   */
  @propertyDataSource({ type: Object })
  config: IConfig | undefined;

  firstUpdated() {
    this.config = JSON.parse(this.config as any);
    
  }

  render() {
    // Garantir que config existe e é do tipo 'image' ou 'avatar'
    
    if (!this.config || (this.config.type !== 'image' && this.config.type !== 'avatar')) {
       return html``;
    }


    console.info('a')
    // alt é obrigatório para acessibilidade
    const altText = this.config.alt ?? '';
    // src é obrigatório
    const src = this.config.src ?? '';
    // width e height opcionais
    const width = this.config.width;
    const height = this.config.height;
    // srcset e sizes opcionais
    const srcset = (this as any).srcset ?? undefined;
    const sizes = (this as any).sizes ?? undefined;
    // loading e decoding opcionais
    const loading = (this as any).loading ?? 'lazy';
    const decoding = (this as any).decoding ?? undefined;
    return html`
     <img
       src=${ifDefined(src)}
       alt=${altText}
       width=${ifDefined(width)}
       height=${ifDefined(height)}
       srcset=${ifDefined(srcset)}
       sizes=${ifDefined(sizes)}
       loading=${ifDefined(loading)}
       decoding=${ifDefined(decoding)}
     />
   `;
  }
}
