/// <mls shortName="wcdCommandAddVideo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(options: IWCDCommand) {

    if (!options.selectedIca) return;
    const args = options.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const elVideo = document.createElement('ica-apresentation-video-embedded-video-100554') as IcaLitElementBase;
    elVideo.setAttribute('widget', 'wc-video-100554');
    elVideo.setAttribute('controls', 'true');
    elVideo.setAttribute('src', args.src || '');

    const allVideoAp = options.overlay.querySelectorAll('[widget="ica-apresentation-video-embedded-video-100554"]');
    const id = 'apVideo' + (allVideoAp.length + 1);;
    elVideo.id = PREFIX_ICA_ID + id;
    elVideo.setAttribute('idEl', id);
    options.selectedIca.insertAdjacentElement('afterend', elVideo);

    await elVideo.updateComplete;
    options.selectedIca.remove();

    const { x, y, height, width } = elVideo.getBoundingClientRect();
    if (!options.overlay.myItens) options.overlay.myItens = [];
    options.overlay.myItens.push({ element: elVideo, depth: 0, x, y, height, width, opacity: elVideo.style.opacity });
    options.overlay.createOverlayItems();
    setTimeout(() => { elVideo.overlayRef?.click(); }, 500);

}

interface IArgs {
    src: string
}