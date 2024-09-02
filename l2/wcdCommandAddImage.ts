/// <mls shortName="wcdCommandAddImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand } from './_100554_wcdTypes';
import { dispatchEventConciliate, importFilesIfNeeded } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.src || typeof args.src !== 'string') throw new Error('Invalid args: src is missing or invalid');

    const icaTagName = 'ica-apresentation-images-images-100554';
    const wcTagName = 'wc-image-100554';
    importFilesIfNeeded([icaTagName, wcTagName]);

    const elImage = document.createElement(icaTagName) as IcaLitElementBaseMethods;
    elImage.setAttribute('widget', 'wc-image-100554');
    elImage.setAttribute('src', args.src || '');
    const allImagesAp = param.overlay.querySelectorAll(`[widget="${icaTagName}"]`);
    const id = 'apImage' + (allImagesAp.length + 1);;
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


interface IArgs {
    src: string
}