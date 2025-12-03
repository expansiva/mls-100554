/// <mls shortName="wcdCommandAddImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const icaTagName = 'ica-apresentation-images-images-100554';
    const wcTagName = 'widget-image-100554';
    importFilesIfNeeded([icaTagName, wcTagName]);

    const elImage = document.createElement(icaTagName) as IcaLitElementBaseMethods;
    elImage.setAttribute('widget', 'widget-image-100554');
    elImage.setAttribute('src', args.src || '');

    const allImagesAp = countElementsWithTagName(param.overlay, icaTagName);
    const id = 'apImage' + (allImagesAp + 1);;
    elImage.id = PREFIX_ICA_ID + id;
    elImage.setAttribute('idEl', id);
    param.selectedIca.insertAdjacentElement('afterend', elImage);

    await elImage.updateComplete;
    param.selectedIca.remove();

    const { x, y, height, width } = elImage.getBoundingClientRect();
    if (!param.overlay.myItens) param.overlay.myItens = [];
    param.overlay.myItens.push({ element: elImage, depth: 0, x, y, height, width, opacity: elImage.style.opacity });
    param.overlay.createOverlayItems();
    setTimeout(() => { param.overlay.selectItem(elImage) }, 500);
    dispatchEventConciliate();

}

export async function executechange(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    globalWcd?.myParent?.remove();
    param.selectedIca.setAttribute('src', args.src || '');
    param.selectedIca.requestUpdate();
    dispatchEventConciliate();

}


interface IArgs {
    src: string
}