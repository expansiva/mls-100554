/// <mls shortName="wcdCommandEnter" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export function excCommandEnter(e: InputEvent, overlay: WcdOverlayLitBase, ica: IcaLitElementBase | undefined) {

    e.preventDefault();

    if (!ica) return;
    
    const elAdd = document.createElement('ica-apresentation-text-text-100554') as IcaLitElementBase;

    elAdd.setAttribute('widget', 'wc-text-100554');
    elAdd.setAttribute('type', 'p');
    elAdd.setAttribute('text', '');
    elAdd.id = 'ica_apText' + overlay.children.length + 1;

    ica.insertAdjacentElement('afterend', elAdd);

    setTimeout(() => {

        const { x, y, height, width } = elAdd.getBoundingClientRect();

        overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });

        overlay.createOverlayItems()

        setTimeout(() => {elAdd.overlayRef?.click();}, 500);

    }, 500);

}