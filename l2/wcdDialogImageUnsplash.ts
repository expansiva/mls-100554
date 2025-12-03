/// <mls shortName="wcdDialogImageUnsplash" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { execute, executechange } from '/_100554_/l2/wcdCommandAddImage.js';
import { WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'
import { globalWcd } from '/_100554_/l2/wcdState.js';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    results: 'resultados',
    next: 'Próximo',
    placeholder: 'digite palavras chaves para buscar no Unsplash, e pressione Enter'

}
const message_en = {
    loading: 'Loading...',
    results: 'results',
    next: 'Next',
    placeholder: 'type keywords to search Unsplash, and press Enter'
}
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-dialog-image-unsplash-100554')
export class WcdDialogImageUnsplash100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @query('#prompt-input') prompt: HTMLInputElement | undefined;

    @property() images: IUnsplashImage[] = [];

    @property() totalResults: number = 0;

    private totalPages: number = 0;

    private actualPage: number = 1;

    private query: string = '';

    private lastQuery: string = '';

    private perPage = 12;

    private clientId: string = 'UEmilNZzuDCesxf1L__2J4T18vdlj6jHMsdeFet3WTQ';

    private lastHeight: string | undefined;

    private lastIca: HTMLElement | undefined;

    private async getImages() {

        const encodedQuery = encodeURIComponent(this.query);
        fetch(`https://api.unsplash.com/search/photos?query=${encodedQuery}&page=${this.actualPage}&per_page=${this.perPage}&client_id=${this.clientId}`)
            .then(response => response.json())
            .then(data => {
                this.totalPages = data.total_pages;
                this.totalResults = data.total;
                this.images = data.results;
            })
            .catch(error => console.error('Error:', error));
        return [];
    }

    private async handleKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        if (event.key === 'Enter') {
            if (this.lastQuery !== this.query) {
                this.actualPage = 1;
            }
            if (!this.query) {
                this.images = [];
                this.totalResults = 0;
                this.actualPage = 1;
                return;
            }
            await this.getImages();

        }
    }

    private async handleNext() {
        this.actualPage += 1;
        if (this.actualPage > this.totalPages) return;
        await this.getImages();
    }


    private handleInput(event: KeyboardEvent) {
        event.stopPropagation();
        this.query = (event.target as HTMLInputElement)?.value || '';
    }

    private async handleGalleryClick(item: IUnsplashImage) {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.myParent) throw new Error('Invalid window.wcdState.myParent');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');

        const args = (this as any).args;

        if (args && args === 'change') {

            await executechange({
                args: { src: item.urls.full },
                overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
                selectedIca: globalWcd.elICA as any,
            });
            return;

        }

        await execute({
            args: { src: item.urls.full },
            overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
            selectedIca: globalWcd.elICA as any,
        });

    }

    private recalculeIcaHeight() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        const height = this.getBoundingClientRect()?.height;
        if (this.lastHeight === undefined) this.lastHeight = (globalWcd.elICA as any).style.height;
        (globalWcd.elICA as any).style.height = height + 'px';
    }

    disconnectedCallback() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (globalWcd.elICA) (globalWcd.elICA as any).style.height = this.lastHeight || '';
        else if (this.lastIca) this.lastIca.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('images')) {
            this.recalculeIcaHeight();
        }
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.prompt) this.prompt.focus();
    }

    render() {

        this.lastIca = globalWcd.elICA;
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

            <div class="container">

                <div class="prompt-content">
                    <input
                    @input=${this.handleInput.bind(this)} 
                    @keydown=${this.handleKeyDown.bind(this)} 
                    type="text" 
                    id="prompt-input"
                    placeholder=${this.msg.placeholder}
                    />
                </div>

                <div class="result-info" style=${this.query === '' ? 'display:none;' : 'display:flex;'}>
                    <small>
                        ${this.totalResults} ${this.msg.results}</small>
                    <button @click=${this.handleNext.bind(this)}>${this.msg.next}</button>

                </div>

                <div class="gallery">
                    ${this.images.map((image) => {
            return html`
                        <div @click=${() => { this.handleGalleryClick(image) }} class="gallery-item">
                            <img src=${image.urls.small}></img>
                            <p>${image.user.first_name}</p>
                        </div>`
        })}
                </div>

            </div>

        `;
    }
}

interface IUnsplashImage {
    alt_description: string,
    alternative_slugs: IUnsplashAlternativeSlugs,
    asset_type: "photo",
    created_at: string,
    description: string,
    height: number,
    width: number,
    id: string,
    liked_by_user: boolean,
    likes: number,
    links: {
        download: string,
        download_location: string,
        html: string,
        self: string,
    },
    promoted_at: string,
    slug: string,
    tags: {},
    updated_at: string,
    urls: {
        full: string,
        raw: string,
        regular: string,
        small: string,
        small_s3: string,
        thumb: string,
    }
    user: IUnsplashUser,
}
interface IUnsplashAlternativeSlugs {
    [key: string]: string
}
interface IUnsplashUser {
    bio: string,
    first_name: string,
    id: string,
    last_name: string,
    links: {
        followers: string,
        following: string,
        html: string,
        likes: string,
        photos: string,
        portfolio: string,
        self: string,
    },
    location: string,
    name: string,
    portfolio_url: string,
    profile_image: {
        large: string,
        medium: string,
        small: string,
    },
    total_collections: number,
    total_illustrations: number,
    total_likes: number,
    total_photos: number,
    total_promoted_illustrations: number,
    total_promoted_photos: number,
    twitter_username: string,
    updated_at: string,
    username: string



}
