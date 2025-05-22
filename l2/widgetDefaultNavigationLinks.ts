/// <mls shortName="widgetDefaultNavigationLinks" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource } from './_100554_collabDecorators';
import { IcaNavigationLinksBase } from './_100554_icaNavigationLinksBase';
import type { IConfig } from './_100554_icaNavigationLinksBase';
/// **collab_i18n_start**
const message_pt = {
    nav: 'Navegação',
}
const message_en = {
    nav: 'Navigation',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
/**
* Componente de navegação do tipo anchor que permite rolar suavemente até seções específicas da página usando identificadores (#id).
* Exemplo de uso:
* <widget-default-navigation-links-100554 config="{{page1.navConfig}}"></widget-default-navigation-links-100554>
*/
@customElement('widget-default-navigation-links-100554')
export class WidgetDefaultNavigationLinks extends IcaNavigationLinksBase {
    /**
    * Configuração do widget, incluindo itens de navegação com label e href (essencial)
    * Exemplo: { recommendedWidget: 'anchor', items: [{ label: 'Seção 1', href: '#sec1' }] }
    */
    @propertyDataSource({ type: String }) config: string | undefined;
    /**
    * Valor bind para o item selecionado, atualizado automaticamente ao rolar ou clicar
    * Exemplo: '#sec1'
    */
    @propertyDataSource({ type: String }) selected: string | undefined;

    private _messages: MessageType = messages['en'];

    connectedCallback() {
        super.connectedCallback();
        this._bindScroll();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this._onScroll, true);
    }
    private _bindScroll() {
        const cfg = this._getConfig();
        if (cfg && cfg.recommendedWidget === 'anchor' && cfg.scrollSync) {
            window.addEventListener('scroll', this._onScroll, true);
        }
    }
    private _onScroll = () => {
        const cfg = this._getConfig();

        if (!cfg || !cfg.scrollSync) return;
        const offset = typeof cfg.offset === 'number' ? cfg.offset : 0;
        let found: string | undefined = undefined;
        for (const item of cfg.items) {
            if (item.href && item.href.startsWith('#')) {
                const el = document.getElementById(item.href.slice(1));
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top - offset <= 1) {
                        found = item.href;
                    }
                }
            }
        }
        if (found && found !== this.selected) {
            this.selected = found;
            this.requestUpdate();
        }
    };
    private _getConfig(): IConfig | undefined {
        if (!this.config) return undefined;
        try {
            return typeof this.config === 'string' ? JSON.parse(this.config) : this.config;
        } catch {
            return undefined;
        }
    }
    private _onClick(e: Event, href: string, disabled?: boolean) {
        if (disabled) {
            e.preventDefault();
            return;
        }
        if (href.startsWith('#')) {
            e.preventDefault();
            const el = document.getElementById(href.slice(1));
            if (el) {
                const cfg = this._getConfig();
                const offset = cfg && typeof cfg.offset === 'number' ? cfg.offset : 0;
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                this.selected = href;
                this.requestUpdate();
            }
        }
    }
    render() {
        const cfg = this._getConfig();

                console.info({
            cfgNav: cfg
        })
        if (!cfg || cfg.recommendedWidget !== 'anchor' || !cfg.items) return nothing;
        return html`
<nav aria-label="${this._messages.nav}" class="nav-anchor">
<ul class="nav-anchor-list">
${cfg.items.map(item => html`
<li>
<a
href="${item.href}"
?aria-current="${this.selected === item.href ? 'page' : nothing}"
class="nav-anchor-link${this.selected === item.href ? ' active' : ''}${item.disabled ? ' disabled' : ''}"
tabindex="${item.disabled ? -1 : 0}"
@click="${(e: Event) => this._onClick(e, item.href, item.disabled)}"
>${item.label}${item.badge !== undefined ? html`<span class="nav-anchor-badge">${item.badge}</span>` : nothing}</a>
</li>
`)}
</ul>
</nav>
`;
    }
}
