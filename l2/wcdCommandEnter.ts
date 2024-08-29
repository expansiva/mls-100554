/// <mls shortName="wcdCommandEnter" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand } from './_100554_wcdTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';

export function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;

    e.preventDefault();

    if (!ica) return;

    const elAdd = document.createElement('ica-apresentation-text-text-100554') as IcaLitElementBaseMethods;
    elAdd.setAttribute('widget', 'wc-text-100554');
    elAdd.setAttribute('type', 'p');
    elAdd.setAttribute('text', '');
    elAdd.id = 'ica_apText' + overlay.children.length + 1;

    ica.insertAdjacentElement('afterend', elAdd);
    const { x, y, height, width } = elAdd.getBoundingClientRect();
    overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });
    overlay.createOverlayItems()

    setTimeout(() => {
        param.overlay.selectItem(elAdd);
        elAdd.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    dispatchEventConciliate();

}