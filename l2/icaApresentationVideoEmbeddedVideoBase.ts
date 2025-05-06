/// <mls shortName="icaApresentationVideoEmbeddedVideoBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationVideoEmbeddedVideoBase extends StateLitElement {

    abstract src: string | undefined;
    abstract autoplay: boolean;
    abstract controls: boolean | undefined;
    abstract loop: boolean | undefined;
    abstract preload: 'auto' | 'metadata' | 'none';

    async firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.src && this.src.startsWith('/') && window['mls']) {
            const newSrc = await this.getUrlL3(this.src);
            if (newSrc) this.src = newSrc;
        }
    }

    private async getUrlL3(src: string) {
        //Example Url => /100554/l3/assets/video1 => 100554_3_assets_video1
        const result = src.replace(/^\/(\d+)\/l(\d+)\//, '$1_$2_').replace(/\//g, '_');
        const storFile = mls.stor.files[result];
        if (!storFile) throw new Error('Invalid url');
        const urlCache = await storFile.saveContentInCacheIfNeed()
        return urlCache;
    }

}



