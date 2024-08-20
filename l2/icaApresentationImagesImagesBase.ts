/// <mls shortName="icaApresentationImagesImagesBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaApresentationImagesImagesBase extends IcaLitElement {

	abstract src: string | undefined;
	abstract alt: string | undefined;
	abstract width: string | undefined;
	abstract height: string | undefined;

	async firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
		super.firstUpdated(changedProperties);
		if (this.src && this.src.startsWith('/l3') && window['mls']) {
			const newSrc = await this.getUrlL3(this.src);
			if (newSrc) this.src = newSrc;
		}
	}

	private async getUrlL3(src: string) {
		//Example Url =>  /l3/100554/collabDesignsystem/assets/4e6a2cd7abfd6a977ccda9e00507fc5d.jpg
		const parts = src.split('/');
		const folderNumber = parts[2];
		const dsNumber = "3";
		const prefix = "ds_";
		const remainingParts = parts.slice(3).join('_');
		const result = `${folderNumber}_${dsNumber}_${prefix}${remainingParts}`;
		const storFile = mls.stor.files[result];
		if (!storFile) throw new Error('Invalid url');
		const urlCache = storFile.saveContentInCacheIfNeed()
		return urlCache;
	}


}

