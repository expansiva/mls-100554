/// <mls shortName="wcdCommandDel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand, dispatchEventConciliate } from './_100554_wcdCommandBase';

export function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;

    e.preventDefault();

    if (!ica || !ica.overlayRef) return;

    if (e.key.toLocaleLowerCase() === 'backspace') {

        const sibling = ica.previousElementSibling as IcaLitElementBaseMethods;
        if (!sibling || !sibling.overlayRef) return;
        const index = overlay.myItens.findIndex(item => item.element === sibling);

        if (index !== -1) {
            overlay.myItens.splice(index, 1);
        }

        sibling.overlayRef.remove();
        sibling.remove();

    } else {

        const sibling = ica.previousElementSibling as IcaLitElementBaseMethods;
        const index = overlay.myItens.findIndex(item => item.element === ica);

        if (index !== -1) {
            overlay.myItens.splice(index, 1);
        }

        ica.overlayRef.remove();
        ica.remove();

        if (sibling && sibling.overlayRef) {
            sibling.overlayRef.click();
            sibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

    }

    dispatchEventConciliate();

}