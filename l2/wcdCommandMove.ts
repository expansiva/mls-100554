/// <mls shortName="wcdCommandMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';
import { canMoveElement } from './_100554_icaBaseDescription2';


export function move(el: IcaLitElementBaseMethods, target: IcaLitElementBaseMethods, pos: 'above' | 'below' | 'inside') {

    const page = el.closest('*[modeoverlay]') as any;
    if (!page) throw new Error('Not found overlay');

    const father = target.parentElement as HTMLElement;
    const child = el.querySelector('#' + target.id);
    const parentICA = target.getIcaParent(target);

    if (el === target || child) {
        throw new Error('Not possible move');
    }

    switch (pos) {
        case 'above':
            insertAbove(father, el, target, parentICA);
            break;
        case 'below':
            insertBelow(father, el, target, parentICA);
            break;
        case 'inside':
            insertInside(el, target);
            break;
        default:
            '';
    }

    dispatchEventConciliate();
    page.recreateOverlay();

}

function insertAbove(father: HTMLElement, el: HTMLElement, target: HTMLElement, parentICA: IcaLitElementBaseMethods | undefined) {

    if (!parentICA) return;
    const canMove = canMoveElement(el as IcaLitElementBaseMethods, parentICA);
    if (!canMove) throw new Error('Movement not permitted');
    father.insertBefore(el, target);

}

function insertBelow(father: HTMLElement, el: HTMLElement, target: HTMLElement, parentICA: IcaLitElementBaseMethods | undefined) {

    if (!parentICA) return;
    const canMove = canMoveElement(el as IcaLitElementBaseMethods, parentICA);
    if (!canMove) throw new Error('Movement not permitted');
    father.insertBefore(el, target.nextSibling);

}

function insertInside(el: IcaLitElementBaseMethods, target: IcaLitElementBaseMethods) {

    const canMove = canMoveElement(el as IcaLitElementBaseMethods, target);
    if (!canMove) throw new Error('Movement not permitted');
    const elIn = target.querySelector(target.widget || '');
    if (elIn) elIn.appendChild(el);

}