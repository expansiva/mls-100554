/// <mls shortName="wcdCommandAddImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';

export async function execute(options: IWCDCommand) {

    if (!options.selectedIca) return;
    const args = options.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const elImage = document.createElement('ica-apresentation-images-images-100554') as IcaLitElementBase;
    elImage.setAttribute('widget', 'wc-image-100554');
    elImage.setAttribute('src', args.src || '');
    const allImages = options.overlay.querySelectorAll('ica-apresentation-images-images-100554')
    elImage.id = 'ica_apImage' + (allImages.length + 1);
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