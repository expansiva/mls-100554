/// <mls shortName="wcdCommandMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';


export function move(el: IcaLitElementBaseMethods, target: IcaLitElementBaseMethods, pos: 'above' | 'below' | 'inside') {

    const page = el.closest('*[modeoverlay]') as any;
    if (!page) throw new Error('Not found overlay');

    const father = target.parentElement as HTMLElement;
    const child = el.querySelector('#' + target.id);

    if (el === target || child) {
        throw new Error('Not possible move');
    }

    switch (pos) {
        case 'above':
            father.insertBefore(el, target);
            break;
        case 'below':
            father.insertBefore(el, target.nextSibling);
            break;
        case 'inside':
            const elIn = target.querySelector(target.widget || '');
            if (elIn) elIn.appendChild(el);
            break;
        default:
            '';
    }

    dispatchEventConciliate();
    page.recreateOverlay();

}