/// <mls shortName="icaApresentationImagesImagesBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationImagesImagesBase extends StateLitElement {

	abstract src: string | undefined;
	abstract alt: string | undefined;
	abstract width: string | undefined;
	abstract height: string | undefined;

	async firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
		super.firstUpdated(changedProperties);
		if (this.src && this.src.startsWith('/') && window['mls']) {
			const newSrc = await this.getUrlL3(this.src);
			if (newSrc) this.src = newSrc;
		}
	}

	private async getUrlL3(src: string) {
		//Example Url => /100554/l3/assets/image1 => 100554_3_assets_image1
		const result = src.replace(/^\/(\d+)\/l(\d+)\//, '$1_$2_').replace(/\//g, '_');
		const storFile = mls.stor.files[result];
		if (!storFile) throw new Error('Invalid url');
		const urlCache = await storFile.saveContentInCacheIfNeed()
		return urlCache;
	}


}

