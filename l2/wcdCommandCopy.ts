/// <mls shortName="wcdCommandCopy" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { WCDOverlayMethods, IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate } from '/_100554_/l2/wcdCommandBase.js';

var infoCopy: IcaLitElementBaseMethods | undefined = undefined;

export function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;

    e.preventDefault();
    if (!e.ctrlKey && !e.metaKey) return;
    if (e.key.toLocaleLowerCase() === 'c') excCopy(ica);
    else if (e.key.toLocaleLowerCase() === 'v') excPaste(overlay, ica);

}

function excCopy(ica: IcaLitElementBaseMethods) {
    infoCopy = ica;
}

function excPaste(overlay: WCDOverlayMethods, ica: IcaLitElementBaseMethods) {

    if (!infoCopy) return;
    const elAdd = infoCopy.cloneNode(false) as IcaLitElementBaseMethods;
    ica.insertAdjacentElement('afterend', elAdd);

    setTimeout(() => {

        const { x, y, height, width } = elAdd.getBoundingClientRect();
        overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });
        overlay.createOverlayItems();
        setTimeout(() => { overlay.selectItem(elAdd); }, 500);

    }, 500);

    dispatchEventConciliate();

}