/// <mls shortName="wcdCommandAddVideo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const icaTagName = 'ica-apresentation-video-embedded-video-100554';
    const wcTagName = 'widget-video-100554';
    importFilesIfNeeded([icaTagName, wcTagName]);

    const elVideo = document.createElement(icaTagName) as IcaLitElementBaseMethods;
    elVideo.setAttribute('widget', wcTagName);
    elVideo.setAttribute('controls', 'true');
    elVideo.setAttribute('src', args.src || '');

    const allVideoAp = countElementsWithTagName(param.overlay, icaTagName);
    const id = 'apVideo' + (allVideoAp + 1);;
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