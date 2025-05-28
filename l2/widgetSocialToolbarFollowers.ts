/// <mls shortName="widgetSocialToolbarFollowers" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource } from './_100554_collabDecorators';
import { IcaNavigationToolbarSocialBase, IConfig } from './_100554_icaNavigationToolbarSocialBase';
/// **collab_i18n_start**
const message_pt = {
  loading: 'Carregando...',
  followers: 'seguidores',
  connections: 'conexões',
};
const message_en = {
  loading: 'Loading...',
  followers: 'followers',
  connections: 'connections',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
};
/// **collab_i18n_end**

/**
 * Barra horizontal compacta de ícones de redes sociais com exibição do número de seguidores/conexões, tooltips customizáveis, layout responsivo e estados de carregamento.
 * Ideal para portfólios e perfis pessoais.
 */
@customElement('widget-social-toolbar-followers-100554')
export class WidgetSocialToolbarFollowers extends IcaNavigationToolbarSocialBase {
  /**
   * Configuração da barra de redes sociais.
   * @example
   * { items: [{ platform: 'twitter', href: '...', icon: '...', label: 'Twitter' }], layout: 'horizontal', size: 'sm' }
   */
  @propertyDataSource({ type: String }) config: string | undefined;

  /**
   * Template customizável para tooltips. Use {{label}}, {{followers}}, {{platform}}.
   * @example
   * 'Siga no {{platform}}: {{followers}} seguidores'
   */
  @propertyDataSource({ type: String }) tooltipTemplate: string | undefined;

  /**
   * Estado visual para indicar carregamento dos números de seguidores.
   * @example
   * true
   */
  @propertyDataSource({ type: Boolean }) loadingState: boolean = false;

  /**
   * Largura em pixels para ativar layout empilhado verticalmente em telas pequenas.
   * @example
   * 600
   */
  @propertyDataSource({ type: Number }) responsiveBreakpoint: number = 600;

  /**
   * Idioma da interface ('en' ou 'pt').
   * @example
   * 'pt'
   */
  @propertyDataSource({ type: String }) lang: string = 'en';

  private followersMap: Record<string, number | undefined> = {};
  private loadingMap: Record<string, boolean> = {};

  connectedCallback() {
    super.connectedCallback();
    this.fetchFollowers();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('config')) {
      this.fetchFollowers();
    }
  }

  private get configObj(): IConfig | undefined {
    if (!this.config) return undefined;
    try {
      return JSON.parse(this.config);
    } catch {
      return undefined;
    }
  }

  private get i18n(): MessageType {
    return messages[this.lang] || messages['en'];
  }

  private async fetchFollowers() {
    const config = this.configObj;
    if (!config || !config.items) return;
    this.loadingMap = {};
    this.followersMap = {};
    this.loadingState = true;
    await Promise.all(
      config.items.map(async (item) => {
        this.loadingMap[item.platform] = true;
        let followers: number | undefined = undefined;
        try {
          followers = await this.getFollowersCount(item.platform, item.href);
        } catch {
          followers = undefined;
        }
        this.followersMap[item.platform] = followers;
        this.loadingMap[item.platform] = false;
        this.requestUpdate();
      })
    );
    this.loadingState = false;
    this.requestUpdate();
  }

  // Simulação de busca de seguidores (substitua por integração real)
  private async getFollowersCount(platform: string, href: string): Promise<number | undefined> {
    // Simulação: Twitter = 1234, LinkedIn = 567, GitHub = 42, Facebook = 9999
    await new Promise((r) => setTimeout(r, 500));
    switch (platform) {
      case 'twitter': return 1234;
      case 'linkedin': return 567;
      case 'github': return 42;
      case 'facebook': return 9999;
      default: return Math.floor(Math.random() * 1000);
    }
  }

  private renderTooltip(item: any, followers: number | undefined): string {
    if (!this.tooltipTemplate) {
      if (followers !== undefined) {
        return `${item.label || item.platform}: ${followers} ${this.i18n.followers}`;
      }
      return item.label || item.platform;
    }
    return this.tooltipTemplate
      .replace(/{{label}}/g, item.label || item.platform)
      .replace(/{{platform}}/g, item.platform)
      .replace(/{{followers}}/g, followers !== undefined ? String(followers) : this.i18n.loading);
  }

  render() {
    const config = this.configObj;
    if (!config || !config.items) return nothing;
    const layout = config.layout || 'horizontal';
    const size = config.size || 'sm';
    return html`
      <nav
        class="toolbar toolbar--${layout} toolbar--${size}"
        role="navigation"
        aria-label="Social Media Toolbar"
      >
        ${config.items.map((item) => {
      const followers = this.followersMap[item.platform];
      const isLoading = this.loadingMap[item.platform];
      const tooltip = this.renderTooltip(item, followers);
      return html`
            <a
              class="toolbar__item"
              href=${item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label=${item.label || item.platform}
              title=${tooltip}
            >
              <span class="toolbar__icon">
                ${this.renderIcon(item.platform, item.icon)}
              </span>
              <span class="toolbar__followers">
                ${isLoading
          ? html`<span class="toolbar__loading">${this.i18n.loading}</span>`
          : followers !== undefined
            ? html`${followers}`
            : ''}
              </span>
            </a>
          `;
    })}
      </nav>
    `;
  }

  private renderIcon(platform: string, icon?: string) {
    // SVGs inline para Twitter, LinkedIn, GitHub, Facebook
    if (icon) {
      return html`<img src="${icon}" alt="" class="toolbar__icon-img" />`;
    }
    switch (platform) {
      case 'twitter':
        return html`<svg class="toolbar__icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M20 3.924a8.19 8.19 0 0 1-2.357.646A4.117 4.117 0 0 0 19.448 2.3a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 9.85 7.03a11.65 11.65 0 0 1-8.457-4.287a4.106 4.106 0 0 0 1.27 5.482A4.073 4.073 0 0 1 .8 7.13v.052a4.106 4.106 0 0 0 3.292 4.025a4.095 4.095 0 0 1-1.852.07a4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 17.544a11.616 11.616 0 0 0 6.29 1.844c7.547 0 11.675-6.155 11.675-11.49c0-.175-.004-.349-.012-.522A8.18 8.18 0 0 0 20 3.924z" fill="#1da1f2"/></svg>`;
      case 'linkedin':
        return html`<svg class="toolbar__icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18.146 18.146h-3.356v-5.146c0-1.227-.022-2.807-1.711-2.807c-1.713 0-1.975 1.338-1.975 2.72v5.233H7.749V7.5h3.223v1.453h.045c.449-.849 1.547-1.744 3.183-1.744c3.406 0 4.035 2.242 4.035 5.158v6.779zM3.339 6.047a1.946 1.946 0 1 1 0-3.892a1.946 1.946 0 0 1 0 3.892zm1.68 12.099H1.66V7.5h3.359v10.646zM19.998 0H.002C.002 0 0 .002 0 .002v19.996c0 .001.002.002.002.002h19.996c.001 0 .002-.001.002-.002V.002c0-.001-.001-.002-.002-.002z" fill="#0077b5"/></svg>`;
      case 'github':
        return html`<svg class="toolbar__icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 .297c-5.523 0-10 4.477-10 10c0 4.418 2.867 8.166 6.839 9.489c.5.092.682-.217.682-.482c0-.237-.009-.868-.014-1.703c-2.782.604-3.369-1.342-3.369-1.342c-.454-1.154-1.11-1.462-1.11-1.462c-.908-.62.069-.608.069-.608c1.004.07 1.532 1.031 1.532 1.031c.892 1.529 2.341 1.088 2.91.832c.092-.646.35-1.088.636-1.339c-2.221-.253-4.555-1.111-4.555-4.943c0-1.091.39-1.984 1.029-2.683c-.103-.253-.446-1.272.098-2.65c0 0 .84-.269 2.75 1.025a9.564 9.564 0 0 1 2.5-.336c.849.004 1.705.115 2.5.336c1.909-1.294 2.748-1.025 2.748-1.025c.546 1.378.202 2.397.1 2.65c.64.699 1.028 1.592 1.028 2.683c0 3.841-2.337 4.687-4.566 4.936c.359.309.678.919.678 1.852c0 1.336-.012 2.415-.012 2.744c0 .267.18.579.688.481C17.135 18.46 20 14.713 20 10.297c0-5.523-4.477-10-10-10z" fill="#181717"/></svg>`;
      case 'facebook':
        return html`<svg class="toolbar__icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.525 0h-15.05C1.108 0 0 1.108 0 2.475v15.05C0 18.892 1.108 20 2.475 20h8.099v-7.294H8.077v-2.845h2.497V7.691c0-2.466 1.507-3.808 3.711-3.808c1.057 0 1.964.079 2.229.114v2.583h-1.53c-1.199 0-1.432.57-1.432 1.406v1.844h2.864l-.373 2.845h-2.491V20h4.882C18.892 20 20 18.892 20 17.525v-15.05C20 1.108 18.892 0 17.525 0z" fill="#1877f3"/></svg>`;
      default:
        return html`<span class="toolbar__icon-generic">${platform.charAt(0).toUpperCase()}</span>`;
    }
  }
}
