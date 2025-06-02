/// <mls shortName="widgetDefaultInteractionButton" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, nothing, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaInteractionButtonBase, IConfig } from './_100554_icaInteractionButtonBase';
import { propertyDataSource } from './_100554_collabDecorators';
/**
 * Componente de botão que suporta texto, ícone SVG e execução de ação ao clicar.
 * Pode ser usado em toolbars, cards, modais ou listas de itens.
 * Suporta diferentes variantes visuais, ícones e comportamentos de clique.
 *
 * @example
 * <widget-default-interaction-button-100554 .config="{label: 'Salvar', icon: '<svg ...>', type: 'full'}"></widget-default-interaction-button-100554>
 */
@customElement('widget-default-interaction-button-100554')
export class WidgetDefaultInteractionButton extends IcaInteractionButtonBase {
  /**
   * Configuração do botão (label, icon, type, disabled, tooltip)
   * @example
   * { label: 'Salvar', icon: '<svg ...>', type: 'full', disabled: false, tooltip: 'Clique para salvar' }
   */
  @propertyDataSource({ type: String })
  config: string | undefined;

  /**
   * Caminho do estado a ser alterado ao clicar no botão
   * @example
   * "page1.buttonClicked"
   */
  @propertyDataSource({ type: String })
  notifyPath: string | undefined;

  /**
   * Valor a ser setado no estado ao clicar no botão
   * @example
   * true
   */
  @propertyDataSource({ type: String })
  notifyValue: string | undefined;

  private get parsedConfig(): IConfig {
    let cfg: IConfig = {};
    if (this.config) {
      try {
        cfg = JSON.parse(this.config);
      } catch {
        // fallback vazio
      }
    }
    return cfg;
  }

  private handleClick(e: Event) {
    if (this.parsedConfig.disabled) {
      e.preventDefault();
      return;
    }

    this.notifyPath = this.notifyValue;
    
  }

  render() {
    const cfg = this.parsedConfig;
    const isDisabled = !!cfg.disabled;
    const type = cfg.type || 'full';
    const showIcon = (type === 'onlyIcon' || type === 'full') && !!cfg.icon;
    const showLabel = (type === 'onlyText' || type === 'full') && !!cfg.label;
    return html`
      <button
        type="button"
        ?disabled=${isDisabled}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        title=${cfg.tooltip || ''}
        @click=${this.handleClick}
        tabindex="0"
      >
        ${showIcon ? html`<span class="icon" aria-hidden="true">${cfg.icon ? unsafeHTML(cfg.icon) : nothing}</span>` : nothing}
        ${showLabel ? html`<span class="label">${cfg.label}</span>` : nothing}
      </button>
    `;
  }
}
