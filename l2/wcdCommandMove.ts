/// <mls shortName="wcdCommandMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { dispatchEventConciliate } from '/_100554_/l2/wcdCommandBase.js';
import { canMoveElement } from '/_100554_/l2/icaBaseDescription.js';

export function move(el: IcaLitElementBaseMethods, target: IcaLitElementBaseMethods, pos: 'above' | 'below' | 'inside', update: boolean = true) {

    const page = el.closest('*[modeoverlay]') as any;
    if (!page) throw new Error('Not found overlay');

    const father = target.parentElement as HTMLElement;
    const child = el.querySelector('#' + target.id);
    const parentICA = target.parentElement?.closest('*[mls_origin]') as IcaLitElementBaseMethods;//target.getIcaParent(target);

    if (el === target || child || !parentICA) {
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

    if (update) {
        dispatchEventConciliate();
        page.recreateOverlay();
    }

}


export function updateOverlay(el: IcaLitElementBaseMethods) {

    const page = el.closest('*[modeoverlay]') as any;
    if (!page) throw new Error('Not found overlay');
    dispatchEventConciliate();
    page.recreateOverlay();

}

function insertAbove(father: HTMLElement, el: HTMLElement, target: HTMLElement, parentICA: IcaLitElementBaseMethods | undefined): boolean {

    if (!parentICA) return false;
    const canMove = canMoveElement(el as IcaLitElementBaseMethods, parentICA);
    if (!canMove) return false;
    father.insertBefore(el, target);
    return true;

}

function insertBelow(father: HTMLElement, el: HTMLElement, target: HTMLElement, parentICA: IcaLitElementBaseMethods | undefined): boolean {

    if (!parentICA) return false;
    const canMove = canMoveElement(el as IcaLitElementBaseMethods, parentICA);
    if (!canMove) return false;
    father.insertBefore(el, target.nextSibling);
    return true;


}

function insertInside(el: IcaLitElementBaseMethods, target: IcaLitElementBaseMethods): boolean {

    const canMove = canMoveElement(el as IcaLitElementBaseMethods, target);
    if (!canMove) return false;
    const elIn = target;//target.querySelector(target.widget || '');
    if (elIn) elIn.appendChild(el);
    return true;

}