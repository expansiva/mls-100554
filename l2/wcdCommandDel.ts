/// <mls shortName="wcdCommandDel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand, WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate } from '/_100554_/l2/wcdCommandBase.js';
import { findParentElementWithTagName } from '/_100554_/l2/wcdGlobal.js'

export function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;
    e.preventDefault();

    if (!ica || !ica.overlayRef) return;
    if (e.key.toLocaleLowerCase() === 'backspace') onBackspace(ica, overlay);
    else onDel(ica, overlay);

    dispatchEventConciliate();

}

function onDel(ica: IcaLitElementBaseMethods, overlay: WCDOverlayMethods) {
    let sibling = ica.previousElementSibling as IcaLitElementBaseMethods;
    const sectionParent = findParentElementWithTagName(ica, 'ica-layout-flow-section-100554') as HTMLElement;
    ica.remove();

    if (sectionParent) sibling = checkParentSection(sectionParent, sibling);

    overlay.refreshOverlay();
    setTimeout(() => {
        if (sibling && sibling.overlayRef) {
            sibling.overlayRef.click();
            sibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function onBackspace(ica: IcaLitElementBaseMethods, overlay: WCDOverlayMethods) {
    let sibling = ica.previousElementSibling as IcaLitElementBaseMethods;
    if (!sibling || !sibling.overlayRef) {
        sibling = findIcaParentSibling(ica) as IcaLitElementBaseMethods;
        if (!sibling || !sibling.overlayRef) return;
    }

    const sectionParent = findParentElementWithTagName(sibling, 'ica-layout-flow-section-100554') as HTMLElement;
    sibling.remove();
    if (sectionParent) sibling = checkParentSection(sectionParent, sibling);
    overlay.refreshOverlay();
    setTimeout(() => {
        if (sibling && sibling.overlayRef) {
            sibling.overlayRef.click();
            sibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);

}

function checkParentSection(sectionParent: HTMLElement, sibling: IcaLitElementBaseMethods): IcaLitElementBaseMethods {
    if (sectionParent) {
        const sectionWidgetName = sectionParent.getAttribute('widget') || '';
        const sectionEl = sectionParent.querySelector(sectionWidgetName);

        if (sectionEl && sectionEl.children.length === 0) {
            const previousOrNextSection = sectionParent.previousElementSibling || sectionParent.nextElementSibling;
            if (previousOrNextSection) {
                const sectionpreviousOrNextWidgetName = previousOrNextSection.getAttribute('widget') || '';
                if (sectionpreviousOrNextWidgetName) {
                    const sectionpreviousOrNextEl = previousOrNextSection.querySelector(sectionpreviousOrNextWidgetName);
                    if (sectionpreviousOrNextEl) sibling = sectionpreviousOrNextEl.children[sectionpreviousOrNextEl.childElementCount - 1] as IcaLitElementBaseMethods;
                }
            }
            sectionParent.remove();
        }

    }

    return sibling;
}

function findIcaParentSibling(icaBase: HTMLElement): IcaLitElementBaseMethods | undefined | null | Element {

    /*let parentElement = icaBase.parentElement as IcaLitElementBaseMethods;
    if (parentElement && !parentElement.tagName.toLocaleLowerCase().startsWith('ica-')) {
        return findIcaParentSibling(parentElement);
    }

    parentElement = parentElement.previousElementSibling as IcaLitElementBaseMethods;
    if (!parentElement) return undefined;
    const tag = parentElement.widget as string;
    const elPR = parentElement.querySelector(tag);
    if (elPR && elPR.children.length > 1) return elPR.children[elPR.children.length - 1];
    else if (parentElement) return parentElement;*/
    return undefined;
}


