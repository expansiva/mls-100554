/// <mls shortName="widgetSocialToolbarCustomizable" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, ifDefined, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaNavigationToolbarSocialBase, IConfig } from './_100554_icaNavigationToolbarSocialBase';
import { propertyDataSource } from './_100554_collabDecorators';
/**
 * Widget de barra social personalizável: permite ordenar, adicionar/remover plataformas, tema light/dark, ícones customizados, tooltips e layout horizontal/vertical.
 * Ideal para painéis administrativos ou sites multiusuário.
 * @example
 * <widget-social-toolbar-customizable-100554 .config="{{page1.socialConfig}}"></widget-social-toolbar-customizable-100554>
 */
@customElement('widget-social-toolbar-customizable-100554')
export class WidgetSocialToolbarCustomizable extends IcaNavigationToolbarSocialBase {
 /**
  * Configuração da barra social.
  * @example
  * {
  *   items: [
  *     { platform: 'twitter', href: 'https://twitter.com', icon: '', label: 'Twitter' },
  *     { platform: 'github', href: 'https://github.com', icon: '', label: 'GitHub' }
  *   ],
  *   layout: 'horizontal',
  *   size: 'md'
  * }
  */
 @propertyDataSource({ type: String }) config: string | undefined;
 render() {
  let cfg: IConfig | undefined;
  try {
   cfg = this.config ? JSON.parse(this.config) : undefined;
  } catch {
   cfg = undefined;
  }
  if (!cfg || !Array.isArray(cfg.items) || cfg.items.length === 0) {
   return html`<div class="toolbar-empty">No social items configured.</div>`;
  }
  const layout = cfg.layout === 'vertical' ? 'vertical' : 'horizontal';
  const theme = (cfg as any).theme === 'dark' ? 'dark' : 'light';
  const size = cfg.size === 'sm' || cfg.size === 'lg' ? cfg.size : 'md';
  // Ordenação por ordem explícita se houver, senão mantém ordem
  const items = [...cfg.items].sort((a, b) => {
   const ao = (a as any).order ?? 0;
   const bo = (b as any).order ?? 0;
   return ao - bo;
  });
  // Map de ícones padrão
  const defaultIcons: Record<string, string> = {
   twitter: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.93 8.93 0 0 1-2.83 1.08 4.48 4.48 0 0 0-7.63 4.08A12.72 12.72 0 0 1 3.1 4.86a4.48 4.48 0 0 0 1.39 5.98c-.73-.02-1.42-.22-2.02-.56v.06a4.48 4.48 0 0 0 3.6 4.4c-.34.09-.7.14-1.07.14-.26 0-.51-.02-.76-.07a4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.19 0-.37-.01-.56.88-.64 1.65-1.44 2.26-2.36z" fill="currentColor"/></svg>',
   github: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" fill="currentColor"/></svg>',
   linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.61 2.01 3.61 4.62v5.58z" fill="currentColor"/></svg>',
   facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22.68 0h-21.36c-.73 0-1.32.59-1.32 1.32v21.36c0 .73.59 1.32 1.32 1.32h11.49v-9.29h-3.13v-3.62h3.13v-2.67c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11v9.29h6.09c.73 0 1.32-.59 1.32-1.32v-21.36c0-.73-.59-1.32-1.32-1.32z" fill="currentColor"/></svg>'
  };
  return html`
   <nav class="toolbar-root ${layout} ${theme} ${size}" role="navigation" aria-label="Social toolbar">
    ${items.map(item => {
      const iconSvg = item.icon ? html`<span class="toolbar-icon" aria-hidden="true" .innerHTML=${item.icon}></span>` :
        (defaultIcons[item.platform] ? html`<span class="toolbar-icon" aria-hidden="true" .innerHTML=${defaultIcons[item.platform]}></span>` : nothing);
      return html`
        <a
          class="toolbar-link"
          href="${item.href}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${ifDefined(item.label || item.platform)}"
          title="${ifDefined(item.label || item.platform)}"
        >
          ${iconSvg}
        </a>
      `;
    })}
   </nav>
  `;
 }
}
