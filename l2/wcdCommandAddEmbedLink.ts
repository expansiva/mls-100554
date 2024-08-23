/// <mls shortName="wcdCommandAddEmbedLink" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(options: IWCDCommand) {


    if (!options.selectedIca) return;
    const args = options.args as IArgs;
    if (!args.url || typeof args.url !== 'string') throw new Error('Invalid args: url is missing or invalid');

    const elEmbedSocialMedia = document.createElement('ica-apresentation-embeds-social-media-100554') as IcaLitElementBase;
    elEmbedSocialMedia.setAttribute('widget', 'wc-embeds-social-media-100554');
    elEmbedSocialMedia.setAttribute('url', args.url || '');

    const allEmbedLinks = options.overlay.querySelectorAll('[widget="ica-apresentation-embeds-social-media-100554"]');

    const id = 'apEmbedLink' + (allEmbedLinks.length + 1);;
    elEmbedSocialMedia.id = PREFIX_ICA_ID + id;
    elEmbedSocialMedia.setAttribute('idEl', id);
    options.selectedIca.insertAdjacentElement('afterend', elEmbedSocialMedia);

    await elEmbedSocialMedia.updateComplete;
    options.selectedIca.remove();

    const { x, y, height, width } = elEmbedSocialMedia.getBoundingClientRect();
    if (!options.overlay.myItens) options.overlay.myItens = [];
    options.overlay.myItens.push({ element: elEmbedSocialMedia, depth: 0, x, y, height, width, opacity: elEmbedSocialMedia.style.opacity });
    options.overlay.createOverlayItems();
    setTimeout(() => { elEmbedSocialMedia.overlayRef?.click(); }, 500);

}

interface IArgs {
    url: string
}