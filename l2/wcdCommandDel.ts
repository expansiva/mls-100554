/// <mls shortName="wcdCommandDel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export function excCommandDel(e: KeyboardEvent, overlay: WcdOverlayLitBase, ica: IcaLitElementBase | undefined) {

    e.preventDefault();

    if (!ica || !ica.overlayRef) return;

    if (e.key.toLocaleLowerCase() === 'backspace') {

        const sibling = ica.previousElementSibling as IcaLitElementBase;

        if (!sibling || !sibling.overlayRef) return;

        const index = overlay.myItens.findIndex(item => item.element === sibling);

        if (index !== -1) {
            overlay.myItens.splice(index, 1);
        }

        sibling.overlayRef.remove();
        sibling.remove();

    } else {

        const sibling = ica.previousElementSibling as IcaLitElementBase;

        const index = overlay.myItens.findIndex(item => item.element === ica);

        if (index !== -1) {
            overlay.myItens.splice(index, 1);
        }

        ica.overlayRef.remove();
        ica.remove();

        if (sibling && sibling.overlayRef) sibling.overlayRef.click();

    }



}