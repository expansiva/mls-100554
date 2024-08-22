/// <mls shortName="wcdCommandAddImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(options: IWCDCommand) {

    if (!options.selectedIca) return;
    const args = options.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const elImage = document.createElement('ica-apresentation-images-images-100554') as IcaLitElementBase;
    elImage.setAttribute('widget', 'wc-image-100554');
    elImage.setAttribute('src', args.src || '');

    const allImagesAp = options.overlay.querySelectorAll('[widget="ica-apresentation-images-images-100554"]');

    const id = 'apImage' + (allImagesAp.length + 1);;
    elImage.id = PREFIX_ICA_ID + id;
    elImage.setAttribute('idEl', id);
    options.selectedIca.insertAdjacentElement('afterend', elImage);

    await elImage.updateComplete;
    options.selectedIca.remove();

    const { x, y, height, width } = elImage.getBoundingClientRect();
    if (!options.overlay.myItens) options.overlay.myItens = [];
    options.overlay.myItens.push({ element: elImage, depth: 0, x, y, height, width, opacity: elImage.style.opacity });
    options.overlay.createOverlayItems();
    setTimeout(() => { elImage.overlayRef?.click(); }, 500);

}

interface IArgs {
    src: string
}