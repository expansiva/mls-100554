/// <mls shortName="wcdCommandAdd" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand, WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

export async function executeFromTag(tagBase: string, tagMain: string, ) {

    if (!globalWcd?.elICA) throw new Error('invalid param.selectedIca');

    const overlay = getOverlay();
    if (!overlay || typeof overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    importFilesIfNeeded([tagBase, tagMain]);

    const elBase = document.createElement(tagBase) as IcaLitElementBaseMethods;
    elBase.setAttribute('widget', tagMain);
    if ((elBase as any).setDefaultAttributes) (elBase as any).setDefaultAttributes();

    const allWidgets = countElementsWithTagName(overlay, tagBase);
    const id = 'widget' + (allWidgets + 1);;
    elBase.id = PREFIX_ICA_ID + id;
    elBase.setAttribute('idEl', id);

    globalWcd.elICA.insertAdjacentElement('afterend', elBase);
    globalWcd.elICA.remove();

    let { x, y, height, width } = elBase.getBoundingClientRect();
    height = height <= 0 ? 50 : height;
    width = width <= 0 ? 200 : width;

    if (!overlay.myItens) overlay.myItens = [];
    overlay.myItens.push({ element: elBase, depth: 0, x, y, height, width, opacity: elBase.style.opacity });
    overlay.createOverlayItems();

    setTimeout(() => { overlay.selectItem(elBase) }, 500);

    dispatchEventConciliate();

}

export function getOverlay(): WCDOverlayMethods | undefined {

    const b = document.querySelector('body');
    if (!b || b.children.length <= 0) return;
    const f = b.children[0] as HTMLElement;

    const nameOverlay = f.getAttribute('modeoverlay');
    if (!nameOverlay) return;

    const elOverlay = b.querySelector(nameOverlay) as WCDOverlayMethods;
    if (!elOverlay) return;

    return elOverlay;
    
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