/// <mls shortName="wcdCommandAddEmbedLink" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    const args = param.args as IArgs;
    if (!args.url || typeof args.url !== 'string') throw new Error('Invalid args: url is missing or invalid');

    const icaTagName = 'ica-apresentation-embeds-social-media-100554';
    const wcTagName = 'widget-embeds-social-media-100554';
    importFilesIfNeeded([icaTagName, wcTagName]);

    const elEmbedSocialMedia = document.createElement(icaTagName) as IcaLitElementBaseMethods;
    
    elEmbedSocialMedia.setAttribute('widget', wcTagName);
    elEmbedSocialMedia.setAttribute('url', args.url || '');

    const allEmbedLinks = countElementsWithTagName(param.overlay, icaTagName);
    const id = 'apEmbedLink' + (allEmbedLinks + 1);;
    elEmbedSocialMedia.id = PREFIX_ICA_ID + id;
    elEmbedSocialMedia.setAttribute('idEl', id);
    param.selectedIca.insertAdjacentElement('afterend', elEmbedSocialMedia);

    await elEmbedSocialMedia.updateComplete;
    param.selectedIca.remove();

    const { x, y, height, width } = elEmbedSocialMedia.getBoundingClientRect();
    if (!param.overlay.myItens) param.overlay.myItens = [];
    param.overlay.myItens.push({ element: elEmbedSocialMedia, depth: 0, x, y, height, width, opacity: elEmbedSocialMedia.style.opacity });
    param.overlay.createOverlayItems();
    setTimeout(() => { param.overlay.selectItem(elEmbedSocialMedia) }, 500);
    dispatchEventConciliate();
}

interface IArgs {
    url: string
}