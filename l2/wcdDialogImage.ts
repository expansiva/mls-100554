/// <mls shortName="wcdDialogImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { getDSInstance, DesignSystemIO, IAssetsInfo } from './_100554_libDesignSystem';
import { execute } from './_100554_wcdCommandAddImage';
import { WCDOverlayMethods } from './_100554_wcdTypes';

@customElement('wcd-dialog-image-100554')
export class WcdDialogImage100554 extends LitElement {

    private dsInstance: DesignSystemIO | undefined;

    @property() images: IImageItem[] = [];

    @query('#file-input') inputFile: HTMLInputElement | undefined;

    private project: number | undefined;

    private async initDsInstance(project: number, dsIndex: number) {
        this.dsInstance = await getDSInstance(project, dsIndex);
        await this.dsInstance.init();
    }

    private lastHeight: string | undefined;

    async firstUpdated() {
        const { project } = mls.actual[5];
        if (!project) return;
        this.project = project;
        await this.initDsInstance(project, 0);
        this.images = await this.getImages(project);
    }

    private recalculeIcaHeight() {
        if (!window.wcdState) throw new Error('Invalid window.wcdState');
        if (!window.wcdState.elICA) throw new Error('Invalid window.wcdState.elICA');
        const height = this.getBoundingClientRect()?.height;
        if (this.lastHeight === undefined) this.lastHeight = window.wcdState.elICA.style.height;
        window.wcdState.elICA.style.height = height + 'px';
    }

    private async getImages(project: number) {
        if (!this.dsInstance || !this.dsInstance.assets) return [];
        const images: IImageItem[] = [];
        const list = this.dsInstance.assets.list;

        for await (const item of Object.entries(list)) {
            const [key, value] = item;
            const src = `/l3/${project}/${value.path}/${value.shortname}`;
            if (value.type === 'image') {
                const srcCache = await this.getUrlL3(src) || '';
                const newImageAssetsItem: IImageItem = {
                    ...value,
                    src,
                    srcCache
                }
                images.push(newImageAssetsItem);
            }
        }

        return images;
    }

    private async getUrlL3(src: string) {
        const parts = src.split('/');
        const folderNumber = parts[2];
        const dsNumber = "3";
        const remainingParts = parts.slice(3).join('_');
        const result = `${folderNumber}_${dsNumber}_${remainingParts}`;
        const storFile = mls.stor.files[result];
        if (!storFile) throw new Error('Invalid url');
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
        if (!this.dsInstance || !this.dsInstance.assets || !this.project) return;
        const dsName = this.dsInstance.dsname;
        const path = `ds/${dsName}/assets`
        await this.dsInstance.assets.add(path, file.name, [], '', 'image', file);
        this.images = await this.getImages(this.project);
        await this.updateComplete;
        const last = this.images[this.images.length - 1];
        this.handleClickGallery(last);
    }

    private async handleClickGallery(item: IImageItem) {

        if (!window.wcdState) throw new Error('Invalid window.wcdState');
        if (!window.wcdState.myParent) throw new Error('Invalid window.wcdState.myParent');
        if (!window.wcdState.elICA) throw new Error('Invalid window.wcdState.elICA');

        await execute({
            args: { src: item.src },
            overlay: window.wcdState.myParent.parentElement?.parentElement as WCDOverlayMethods,
            selectedIca: window.wcdState.elICA,
        });

    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('images')) {
            this.recalculeIcaHeight();
        }
    }

    disconnectedCallback() {
        if (!window.wcdState) throw new Error('Invalid window.wcdState');
        if (!window.wcdState.elICA) throw new Error('Invalid window.wcdState.elICA');
        window.wcdState.elICA.style.height = this.lastHeight || '';
        super.disconnectedCallback();
    }

    render() {
        return html`
            <div class="container">
                <div class="actions-buttons">
                    <button @click=${this.onUploadClick}>Upload</button>
                    <input @change=${this.onChangeImage} type="file" id="file-input" accept="image/*" style="display: none;">
                </div>
                <div class="gallery">
                    ${this.images.map((image) => {
            return html`<img @click=${() => { this.handleClickGallery(image) }} src=${image.srcCache} alt=${image.description}></img>`
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

interface IImageItem extends IAssetsInfo {
    src: string,
    srcCache: string,
}
