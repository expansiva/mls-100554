/// <mls shortName="wcdCommandAddImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export function execCommandAddImage(overlay: WcdOverlayLitBase, selectedIca: IcaLitElementBase | undefined, args: {}) {

    if (!selectedIca) return;
    const elImage = document.createElement('ica-apresentation-images-images-100554') as IcaLitElementBase;

    elImage.setAttribute('widget', 'wc-image-100554');
    // elImage.setAttribute('src', args.src || '');
    elImage.id = 'ica_apImage' + overlay.children.length + 1;
    selectedIca.insertAdjacentElement('afterend', elImage);

}

interface IArgs {
    src: string,
    width?: string,
    height?: string,
}