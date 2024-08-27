/// <mls shortName="wcdCommandEnter" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand, dispatchEventConciliate } from './_100554_wcdCommandBase';

export function execute(param: IWCDCommand) {

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;

    e.preventDefault();

    if (!ica) return;

    const elAdd = document.createElement('ica-apresentation-text-text-100554') as IcaLitElementBase;

    elAdd.setAttribute('widget', 'wc-text-100554');
    elAdd.setAttribute('type', 'p');
    elAdd.setAttribute('text', '');
    elAdd.id = 'ica_apText' + overlay.children.length + 1;

    ica.insertAdjacentElement('afterend', elAdd);

    const { x, y, height, width } = elAdd.getBoundingClientRect();

    overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });

    overlay.createOverlayItems()

    setTimeout(() => {
        elAdd.overlayRef?.click();
        elAdd.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    dispatchEventConciliate();

}