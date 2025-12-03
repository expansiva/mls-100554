/// <mls shortName="wcdDialogImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { getImages, addAssets } from '/_100554_/l2/designSystemBase.js';
import { execute, executechange } from '/_100554_/l2/wcdCommandAddImage.js';
import { WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

@customElement('wcd-dialog-image-100554')
export class WcdDialogImage100554 extends LitElement {

    private lastIca: HTMLElement | undefined;

    @property() images: IImageItem[] = [];

    @query('#file-input') inputFile: HTMLInputElement | undefined;

    private project: number | undefined;

    private lastHeight: string | undefined;

    async firstUpdated() {
        const project = mls.actualProject;
        if (!project) return;
        this.project = project;
        this.images = await this.getImages(project);
    }

    private recalculeIcaHeight() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');
        const height = this.getBoundingClientRect()?.height;
        if (this.lastHeight === undefined) this.lastHeight = globalWcd?.elICA?.style.height;
        (globalWcd.elICA as any).style.height = height + 'px';
    }

    private async getImages(project: number) {

        const images: IImageItem[] = [];
        const list = await getImages(project);

        for await (const item of Object.entries(list)) {
            const [key, value] = item;
            const src = `/${value.project}/l3/${value.folder}/${value.shortName}${value.extension}`;
            const srcCache = await this.getUrlL3(value) || '';
            const newImageAssetsItem: IImageItem = {
                ...value,
                src,
                srcCache
            }
            images.push(newImageAssetsItem);

        }

        return images;
    }

    private async getUrlL3(storFile: mls.stor.IFileInfo) {
        const urlCache = await storFile.saveContentInCacheIfNeed();
        return urlCache;
    }

    private onUploadClick() {
        if (!this.inputFile) return;
        this.inputFile.click();
    }

    private onChangeImage(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            this.addImage(input.files[0]);
        }
    }

    private async addImage(file: File) {
        if (!this.project) return;
        await addAssets(this.project, file);
        this.images = await this.getImages(this.project);
        await this.updateComplete;
        const last = this.images[this.images.length - 1];
        this.handleClickGallery(last);
    }

    private async handleClickGallery(item: IImageItem) {

        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.myParent) throw new Error('Invalid window.wcdState.myParent');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');

        const args = (this as any).args;

        if (args && args === 'change') {

            await executechange({
                args: { src: item.src },
                overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
                selectedIca: globalWcd.elICA as any,
            });
            return;

        }

        await execute({
            args: { src: item.src },
            overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
            selectedIca: globalWcd.elICA as any,
        });

    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('images')) {
            this.recalculeIcaHeight();
        }
    }

    disconnectedCallback() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (globalWcd.elICA) (globalWcd.elICA as any).style.height = this.lastHeight || '';
        else if (this.lastIca) this.lastIca.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    render() {
        this.lastIca = globalWcd.elICA;
        return html`
            <div class="container">
                <div class="actions-buttons">
                    <button @click=${this.onUploadClick}>Upload</button>
                    <input @change=${this.onChangeImage} type="file" id="file-input" accept="image/*" style="display: none;">
                </div>
                <div class="gallery">
                    ${this.images.map((image) => {
            return html`<img @click=${() => { this.handleClickGallery(image) }} src=${image.srcCache} alt=${image.shortName}></img>`
        })}
                </div>

            </div>

        `;
    }

    static styles = css`

        :host{
            display:block;
            width:100%
        }
        .container{
            padding:1rem;
        }
        .actions-buttons{
            padding: 10px;
            display:flex;
            justify-content:end;
            margin-bottom:1rem;
        }
        .actions-buttons button{

            background-color: var(--active-color);
            border-radius: 8px;
            border:none;
            box-shadow: 0px 1px 3px 0px var(--grey-color);
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap:.2rem;
            font-weight: 700;
            align-items: center;
            height: 40px;
            transition: height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
            padding: 0.5rem;
            color: #fff;;
            cursor:pointer;
            width:150px;
            outline:none;
            &:hover {
                opacity:.8;
            }
         }
        .gallery {
            display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                grid-auto-rows: 200px;
                gap: 10px;
                padding: 10px;
        }

        .gallery img {
            width: 100%;
            height: 100%;
            width: 100%;
            // object-fit: cover;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, filter 0.3s ease;
            cursor:pointer;
        }
        .gallery img:hover {
            transform: scale(1.05);
            filter: brightness(0.7);
        }
        
        @media (max-width: 768px) {
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }
    `;
}

interface IImageItem extends mls.stor.IFileInfo {
    src: string,
    srcCache: string,
}
