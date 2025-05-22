/// <mls shortName="widgetDefaultToolbarSocial" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaNavigationToolbarSocialBase, IConfig } from './_100554_icaNavigationToolbarSocialBase';
import { propertyDataSource } from './_100554_collabDecorators';
/**
 * Toolbar social para exibir ícones clicáveis de mídias sociais populares, facilitando o acesso rápido aos perfis.
 * @example
 * <widget-default-toolbar-social-100554 .config="{...}" />
 */
@customElement('widget-default-toolbar-social-100554')
export class WidgetDefaultToolbarSocial extends IcaNavigationToolbarSocialBase {
    /**
     * Configuração da toolbar social.
     * @example
     * '{"items":[{"platform":"twitter","href":"https://twitter.com/usuario"}]}'
     */
    @propertyDataSource({ type: String })
    config: string | undefined;
    private get parsedConfig(): IConfig {
        try {
            if (!this.config) return { items: [] };
            const cfg = JSON.parse(this.config) as IConfig;
            return {
                items: Array.isArray(cfg.items) ? cfg.items : [],
                layout: cfg.layout === 'vertical' ? 'vertical' : 'horizontal',
                size: cfg.size === 'sm' || cfg.size === 'lg' ? cfg.size : 'md',
            };
        } catch {
            return { items: [] };
        }
    }
    private getIcon(platform: string, icon?: string): string {
        if (icon) return icon;
        switch (platform) {
            case 'twitter':
                return 'M19.633 7.997c.013.176.013.353.013.53 0 5.386-4.099 11.6-11.6 11.6-2.304 0-4.447-.676-6.25-1.84.324.038.636.05.973.05 1.91 0 3.668-.636 5.075-1.71-1.786-.037-3.293-1.21-3.816-2.825.25.037.5.062.763.062.362 0 .724-.05 1.062-.137-1.862-.375-3.262-2.012-3.262-3.974v-.05c.55.3 1.188.487 1.862.512a4.07 4.07 0 01-1.812-3.387c0-.75.2-1.45.55-2.05 2.012 2.462 5.025 4.075 8.425 4.25-.062-.3-.1-.612-.1-.925 0-2.25 1.812-4.075 4.075-4.075 1.175 0 2.238.5 2.984 1.312.925-.175 1.8-.512 2.587-.975-.3.938-.938 1.712-1.75 2.212.825-.1 1.613-.312 2.35-.637-.55.825-1.25 1.55-2.05 2.125z';
            case 'linkedin':
                return 'M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.5 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z';
            case 'github':
                return 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.3-5.466-1.334-5.466-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.587 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z';
            case 'facebook':
                return 'M17 1h-3a6 6 0 00-6 6v3H5a1 1 0 00-1 1v3a1 1 0 001 1h3v7a1 1 0 001 1h3a1 1 0 001-1v-7h2.293a1 1 0 00.707-1.707L17 11V8a1 1 0 00-1-1h-2V7a2 2 0 012-2h2a1 1 0 001-1V2a1 1 0 00-1-1z';
            case 'instagram':
                return 'M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z';
            case 'whatsapp':
                return 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.075-.792.372s-1.04 1.016-1.04 2.48 1.065 2.876 1.213 3.075c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z';

            default:
                return '';
        }
    }

    render() {
        const { items, layout, size } = this.parsedConfig;
        return html`
<nav part="toolbar" role="navigation" aria-label="Social toolbar" class="toolbar toolbar--${layout} toolbar--${size}">
${items.map(item => html`
<a
part="icon-link"
class="toolbar__icon-link"
href=${ifDefined(item.href)}
target="_blank"
rel="noopener noreferrer"
aria-label=${ifDefined(item.label || item.platform)}
title=${ifDefined(item.label || item.platform)}
>
<svg
part="icon"
class="toolbar__icon"
viewBox="0 0 24 24"
fill="currentColor"
aria-hidden="true"
focusable="false"
>
<path d=${this.getIcon(item.platform, item.icon)}></path>
</svg>
</a>
`)}
</nav>
`;
    }
}
