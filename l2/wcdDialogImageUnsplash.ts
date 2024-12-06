/// <mls shortName="wcdDialogImageUnsplash" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { execute } from './_100554_wcdCommandAddImage';
import { WCDOverlayMethods } from './_100554_wcdTypes';
import { CollabLitElement } from './_100554_collabLitElement'
import { globalWcd } from './_100554_wcdState';

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
        if (!globalWcd.elICA) return;
        (globalWcd.elICA as any).style.height = this.lastHeight || '';
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

    static styles = css`

        :host{
            display:block;
            width:100%;
        }
        .container{
            padding:1rem;
        }

        .prompt-content{
            padding: 10px;
            display:flex;
            margin-bottom:1rem;
        }

        .prompt-content input {
            border:none;
            border-bottom: 1px solid var(--grey-color);
            outline:none;
            width: 100%;
            display: block;
            font-size: 1rem;
            line-height: 1.5;
            color: #000000;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .result-info{
            display:flex;
            justify-content:center;
            width:100%;
        }

        .result-info small{
            margin-left:auto;
            font-weight:200;
            font-size: var(--font-size-16);
            color: var(--grey-color-darker);
        }

        .result-info button{
            margin-left:auto;
            border:none;
            background: none;
            color: var(--text-color-primary);
            cursor:pointer;
        }

        .gallery {
            display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                grid-auto-rows: 200px;
                gap: 10px;
                padding: 10px;
        }

        .gallery .gallery-item {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, filter 0.3s ease;
            cursor:pointer;
            border-radius: 8px;
            position: relative;
        }

        .gallery .gallery-item p {
            position: absolute;
            bottom: 5px;
            left: 5px;
            font-size: var(--font-size-12);
            color: #ffffff;
            display:none;
        }

        .gallery img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 8px;
        }

        .gallery .gallery-item:hover{
            transform: scale(1.05);
        }

        .gallery .gallery-item:hover p{
            display:block;
        }
        .gallery .gallery-item img:hover {
            filter: brightness(0.4);
        }
        
        @media (max-width: 768px) {
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }
    `;
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
