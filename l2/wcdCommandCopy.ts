/// <mls shortName="wcdCommandCopy" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

var infoCopy:IcaLitElementBase | undefined = undefined;

export function excCommandCopy(e: KeyboardEvent, overlay: WcdOverlayLitBase, ica: IcaLitElementBase | undefined) {

    e.preventDefault();

    if (!ica) return;

    if (!e.ctrlKey && !e.metaKey) return;

    if (e.key.toLocaleLowerCase() === 'c') excCopy(ica);
    else if (e.key.toLocaleLowerCase() === 'v') excPaste(overlay, ica);
    
    
}

function excCopy(ica: IcaLitElementBase) {
    infoCopy = ica;
}

function excPaste(overlay: WcdOverlayLitBase, ica: IcaLitElementBase) {

    if (!infoCopy) return;

    const elAdd = infoCopy.cloneNode(false) as IcaLitElementBase;

    ica.insertAdjacentElement('afterend', elAdd);

    setTimeout(() => {

        const { x, y, height, width } = elAdd.getBoundingClientRect();

        overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });

        overlay.createOverlayItems()

        setTimeout(() => {elAdd.overlayRef?.click();}, 500);

    }, 500);

}