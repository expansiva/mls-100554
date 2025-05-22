/// <mls shortName="widgetDefaultGallery" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, ifDefined } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaApresentationGalleryBase } from './_100554_icaApresentationGalleryBase';
import { propertyDataSource } from './_100554_collabDecorators';
import type { IConfig } from './_100554_icaApresentationGalleryBase';
/// **collab_i18n_start**
const message_pt = {
    prev: 'Anterior',
    next: 'Próximo',
    noImage: 'Nenhuma imagem',
};
const message_en = {
    prev: 'Previous',
    next: 'Next',
    noImage: 'No image',
};
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
};
/// **collab_i18n_end**
/**
 * Widget para exibir uma imagem por vez com 100% de largura, mostrando o nome ou referência da imagem abaixo e botões para navegar entre as imagens.
 * @example
 * <widget-default-gallery-100554 config="{{page1.galleryConfig}}" selectedindex="{{page1.selectedIndex}}"></widget-default-gallery-100554>
 */
@customElement('widget-default-gallery-100554')
export class WidgetDefaultGallery extends IcaApresentationGalleryBase {
    /**
     * Configuração da galeria (array de imagens, etc)
     * @example
     * { recommendedWidget: 'gallery', images: ['url1','url2'], shownavigation: true }
     */
    @propertyDataSource({ type: String }) config: string | undefined;
    /**
     * Índice da imagem atualmente exibida
     * @example
     * "0"
     */
    @propertyDataSource({ type: String }) selectedindex: string | undefined;
    /**
     * Campo reservado para navegação (não utilizado neste widget)
     */
    @propertyDataSource({ type: String }) fornavigation: string | undefined;

    private get _configObj(): IConfig | undefined {
        if (!this.config) return undefined;
        try {
            return JSON.parse(this.config);
        } catch {
            return undefined;
        }
    }
    private get _selectedIndex(): number {
        const idx = Number(this.selectedindex);
        if (isNaN(idx) || !this._configObj || !Array.isArray(this._configObj.images)) return 0;
        if (idx < 0) return 0;
        if (idx >= this._configObj.images.length) return this._configObj.images.length - 1;
        return idx;
    }
    private get _currentImage(): string | undefined {
        const cfg = this._configObj;
        if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) return undefined;
        return cfg.images[this._selectedIndex];
    }
    private get _imageName(): string {
        const cfg = this._configObj;
        if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) return '';
        const img = cfg.images[this._selectedIndex];
        if (!img) return '';
        const parts = img.split('/');
        return parts[parts.length - 1];
    }
    private get _showNavigation(): boolean {
        const cfg = this._configObj;
        if (!cfg) return false;
        if (typeof cfg.shownavigation === 'boolean') return cfg.shownavigation;
        return true;
    }
    private get _lang(): MessageType {
        const lang = (navigator.language || 'en').slice(0, 2);
        return messages[lang] || messages['en'];
    }
    private _handlePrev() {
        const cfg = this._configObj;
        if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) return;
        const idx = this._selectedIndex;
        const newIdx = idx > 0 ? idx - 1 : 0;
        this.selectedindex = String(newIdx);
        this.requestUpdate();
    }
    private _handleNext() {
        const cfg = this._configObj;
        if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) return;
        const idx = this._selectedIndex;
        const newIdx = idx < cfg.images.length - 1 ? idx + 1 : cfg.images.length - 1;
        this.selectedindex = String(newIdx);
        this.requestUpdate();
    }
    private _onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this._handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this._handleNext();
        }
    }
    render() {
        const cfg = this._configObj;
        const hasImages = !!cfg && Array.isArray(cfg.images) && cfg.images.length > 0;
        return html`
<div class="gallery-container" tabindex="0" @keydown=${this._onKeyDown}>
${hasImages ? html`
<img class="gallery-image" src="${this._currentImage}" alt="${this._imageName}" />

${this._showNavigation && cfg.images.length > 1 ? html`
<div class="gallery-nav">
<button class="gallery-btn" @click=${this._handlePrev} ?disabled=${this._selectedIndex === 0}>${this._lang.prev}</button>
<button class="gallery-btn" @click=${this._handleNext} ?disabled=${this._selectedIndex === cfg.images.length - 1}>${this._lang.next}</button>
</div>
` : ''}
` : html`<div class="gallery-no-image">${this._lang.noImage}</div>`}
</div>
`;
    }
}
