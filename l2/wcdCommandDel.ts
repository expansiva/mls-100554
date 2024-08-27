/// <mls shortName="wcdCommandDel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand, dispatchEventConciliate } from './_100554_wcdCommandBase';

export function execute(param: IWCDCommand) {

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;

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

        if (sibling && sibling.overlayRef) {
            sibling.overlayRef.click();
            sibling.scrollIntoView({behavior:'smooth', block:'center'});
        }

    }

    dispatchEventConciliate();



}