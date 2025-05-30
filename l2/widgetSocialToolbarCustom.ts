/// <mls shortName="widgetSocialToolbarCustom" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaNavigationToolbarSocialBase } from './_100554_icaNavigationToolbarSocialBase';
import { propertyDataSource } from './_100554_collabDecorators';
import type { IConfig } from './_100554_icaNavigationToolbarSocialBase';
/// **collab_i18n_start**
const message_pt = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  facebook: 'Facebook',
  openInNewTab: 'Abrir em nova aba',
}
const message_en = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  facebook: 'Facebook',
  openInNewTab: 'Open in new tab',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**

/**
 * Barra horizontal de ícones de redes sociais para topo ou rodapé do site, com links externos, tooltips acessíveis, tamanhos configuráveis, espaçamento uniforme e efeitos hover personalizados.
 * @example
 * <widget-social-toolbar-custom-100554 .config="{{page1.socialConfig}}"></widget-social-toolbar-custom-100554>
 */
@customElement('widget-social-toolbar-custom-100554')
export class WidgetSocialToolbarCustom extends IcaNavigationToolbarSocialBase {
  /**
   * Configuração da barra de redes sociais
   * @example
   * { items: [{ platform: 'twitter', href: 'https://twitter.com', icon: '', label: 'Twitter' }], layout: 'horizontal', size: 'md' }
   */
  @propertyDataSource({ type: String }) config: string | undefined;

  private get _config(): IConfig | undefined {
    if (!this.config) return undefined;
    try {
      return typeof this.config === 'string' ? JSON.parse(this.config) : this.config;
    } catch {
      return undefined;
    }
  }

  private get _lang(): keyof typeof messages {
    return (navigator.language || 'en').startsWith('pt') ? 'pt' : 'en';
  }

  private get _msg(): MessageType {
    return messages[this._lang];
  }

  private get _sizeClass(): string {
    const size = this._config?.size || 'md';
    if (size === 'sm') return 'icon-sm';
    if (size === 'lg') return 'icon-lg';
    return 'icon-md';
  }

  private get _spacing(): string {
    // Espaçamento uniforme entre ícones
    return 'spacing-' + (this._config?.size || 'md');
  }

  private get _layoutClass(): string {
    return 'horizontal';
  }

  private get _toolbarPosition(): string {
    // Posição visual/topo ou rodapé
    return this._toolbarPos === 'footer' ? 'toolbar-footer' : 'toolbar-top';
  }

  private get _toolbarPos(): string {
    // Busca por data-position ou atributo position
    const pos = (this.getAttribute('position') || '').toLowerCase();
    if (pos === 'footer') return 'footer';
    return 'top';
  }

  private get _hoverEffect(): string {
    // Busca por data-hover-effect ou atributo hover-effect
    return this.getAttribute('hover-effect') || 'default';
  }

  private _getIcon(platform: string, icon?: string): unknown {
    // SVGs inline para plataformas conhecidas
    if (icon) return html`<img src="${icon}" alt="" aria-hidden="true" />`;
    switch (platform) {
      case 'twitter':
        return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22.46 5.93c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.13 12.13 0 0 1 3.1 4.86a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.28 4.28 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57.84-.6 1.57-1.35 2.15-2.21z"/></svg>`;
      case 'linkedin':
        return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/></svg>`;
      case 'github':
        return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z"/></svg>`;
      case 'facebook':
        return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>`;
      default:
        return html`<span aria-hidden="true">${platform[0]?.toUpperCase() || '?'}</span>`;
    }
  }

  render() {
    const cfg = this._config;
    if (!cfg || !Array.isArray(cfg.items) || !cfg.items.length) return nothing;
    return html`
      <nav class="toolbar ${this._layoutClass} ${this._toolbarPosition} ${this._hoverEffect}">
        <ul class="toolbar-list ${this._spacing}">
          ${cfg.items.map((item, idx) => {
      const label = item.label || this._msg[item.platform as keyof MessageType] || item.platform;
      return html`
              <li class="toolbar-item" role="none">
                <a
                  class="toolbar-link ${this._sizeClass}"
                  href="${item.href}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${label}"
                  tabindex="0"
                  role="link"
                  title="${label}"
                  @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') (e.currentTarget as HTMLElement).click(); }}
                >
                  <span class="toolbar-icon" aria-hidden="true">
                    ${this._getIcon(item.platform, item.icon)}
                  </span>
                  <span class="toolbar-tooltip" role="tooltip">${label}</span>
                </a>
              </li>
            `;
    })}
        </ul>
      </nav>
    `;
  }
}
