/// <mls shortName="widgetDefaultText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyCompositeDataSource } from './_100554_collabDecorators';
import { IcaApresentationTextBase } from './_100554_icaApresentationTextBase';

/**
 * Componente para apresentar texto formatado simples, como títulos, parágrafos e citações, com suporte a diferentes estilos visuais.
 * Permite seleção do tipo de texto (h1, h2, p, blockquote, span) e aceita HTML inline para formatação avançada.
 */
@customElement('widget-default-text-100554')
export class WidgetDefaultText extends IcaApresentationTextBase {


  @propertyCompositeDataSource({ type: String })
  text: string | undefined;

  @propertyCompositeDataSource({ type: String })
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "blockquote" | "span" = "p";

  render() {
    const tag = this.type || 'p';
    return html`${unsafeHTML(`<${tag}>${this.text}</${tag}>`)}`
  }
    
  
}
