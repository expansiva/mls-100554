/// <mls shortName="wcdCommandAddVideo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand, dispatchEventConciliate } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const elVideo = document.createElement('ica-apresentation-video-embedded-video-100554') as IcaLitElementBaseMethods;
    elVideo.setAttribute('widget', 'wc-video-100554');
    elVideo.setAttribute('controls', 'true');
    elVideo.setAttribute('src', args.src || '');

    const allVideoAp = param.overlay.querySelectorAll('[widget="ica-apresentation-video-embedded-video-100554"]');
    const id = 'apVideo' + (allVideoAp.length + 1);;
    elVideo.id = PREFIX_ICA_ID + id;
    elVideo.setAttribute('idEl', id);
    param.selectedIca.insertAdjacentElement('afterend', elVideo);

    await elVideo.updateComplete;
    param.selectedIca.remove();

    const { x, y, height, width } = elVideo.getBoundingClientRect();
    if (!param.overlay.myItens) param.overlay.myItens = [];
    param.overlay.myItens.push({ element: elVideo, depth: 0, x, y, height, width, opacity: elVideo.style.opacity });
    param.overlay.createOverlayItems();
    setTimeout(() => { param.overlay.selectItem(elVideo); }, 500);
    dispatchEventConciliate();
}

interface IArgs {
    src: string
}