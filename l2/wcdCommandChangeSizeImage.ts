/// <mls shortName="wcdCommandChangeSizeImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand, WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { findParentElementWithTagName, getSiblingsAfter, getSiblingsBefore, countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';

export async function execute(param: IWCDCommand) {

    if (!param.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.newSize || typeof args.newSize !== 'string' || !isValidSize(args.newSize)) throw new Error('Invalid args: newSize is missing or invalid');

    const icaSectionTagName = 'ica-layout-flow-section-100554';
    const wcSectionTagName = 'widget-section-100554';
    const icaTagName = 'ica-apresentation-images-images-100554';
    const wcTagName = 'widget-image-100554';

    const imports = [icaTagName, wcTagName, icaSectionTagName, wcSectionTagName];
    importFilesIfNeeded(imports);

    const parentSection = findParentElementWithTagName(param.selectedIca, icaSectionTagName);
    if (!parentSection) throw new Error('image is not in valid section');
    let oldSize: string = getOldSize(parentSection as HTMLElement)
    let previousSection = parentSection.previousElementSibling;
    let nextSection = parentSection.nextElementSibling;
    const nextSectionIsInset = nextSection?.classList.contains('inset') || false;
    const previousSectionIsInset = previousSection?.classList.contains('inset') || false;

    if (oldSize === 'inset' && (args.newSize === 'full' || args.newSize === 'outset')) {

        const siblingsAfter = getSiblingsAfter(param.selectedIca);
        const siblingsBefore = getSiblingsBefore(param.selectedIca);
        const siblings = siblingsAfter.concat(siblingsBefore);

        if (!previousSection && !nextSectionIsInset && siblings.length === 0) {

            const [wc] = parentSection.children;
            allowedSizes.forEach((size) => {
                parentSection?.classList.remove(size);
                wc?.classList.remove(size);
            });
            parentSection?.classList.add('outset');
            wc?.classList.add('outset');

        } else {

            const sectionImage = addSection(icaSectionTagName, wcSectionTagName, param.overlay, [param.selectedIca]);
            sectionImage.classList.add(args.newSize);
            parentSection.insertAdjacentElement('afterend', sectionImage);

            if (siblingsAfter.length > 0) {
                const sectionAfter = addSection(icaSectionTagName, wcSectionTagName, param.overlay, siblingsAfter);
                sectionAfter.classList.add('inset');
                sectionImage.insertAdjacentElement('afterend', sectionAfter);
                const isEmpty = (parentSection?.children[0]?.children || []).length === 0;
                if (isEmpty) {
                    parentSection.remove();
                    const indexOverlayParentSection = param.overlay.myItens.findIndex(item => item.element === parentSection);
                    if (indexOverlayParentSection !== -1) param.overlay.myItens.splice(indexOverlayParentSection, 1);
                }
            }

            await sectionImage.updateComplete;
        }

    }

    if ((oldSize === 'full' || oldSize === 'outset') && args.newSize === 'inset') {

        const isEmptySections = !param.selectedIca.previousElementSibling && !param.selectedIca.nextElementSibling;

        if (!previousSection && !nextSectionIsInset || (!previousSectionIsInset && !nextSectionIsInset)) {
            const [wc] = parentSection.children;
            allowedSizes.forEach((size) => {
                parentSection?.classList.remove(size);
                wc?.classList.remove(size);
            });
            parentSection?.classList.add('inset');
            wc?.classList.add('inset');

        } else if ((!previousSection || !previousSectionIsInset) && nextSectionIsInset) {

            const nextChidrens = nextSection?.children[0]?.children || [];
            const firstChildrenNext = nextChidrens[0];
            if (firstChildrenNext) nextSection?.children[0]?.insertBefore(param.selectedIca, firstChildrenNext);
            else nextSection?.appendChild(param.selectedIca);
            if (isEmptySections) {
                parentSection.remove();
                const indexOverlayParentSection = param.overlay.myItens.findIndex(item => item.element === parentSection);
                if (indexOverlayParentSection !== -1) param.overlay.myItens.splice(indexOverlayParentSection, 1);
            }

        } else {

            if (!previousSection) return;

            const previousChildrens = previousSection.children[0]?.children || [];
            const nextChidrens = nextSection?.children[0]?.children || [];

            const lastChildrenPrevious = previousChildrens[previousChildrens.length - 1];
            lastChildrenPrevious.insertAdjacentElement('afterend', param.selectedIca);

            if (isEmptySections) {
                Array.from(nextChidrens).reverse().forEach((child) => {
                    if (param.selectedIca) param.selectedIca.insertAdjacentElement('afterend', child);
                });

                parentSection.remove();
                const indexOverlayParentSection = param.overlay.myItens.findIndex(item => item.element === parentSection);
                if (indexOverlayParentSection !== -1) param.overlay.myItens.splice(indexOverlayParentSection, 1);

                if (nextSection) {
                    nextSection.remove();
                    const indexOverlayNextSection = param.overlay.myItens.findIndex(item => item.element === nextSection);
                    if (indexOverlayNextSection !== -1) param.overlay.myItens.splice(indexOverlayNextSection, 1);
                }

            } else if (parentSection) {

                const [wc] = parentSection.children;
                allowedSizes.forEach((size) => {
                    parentSection?.classList.remove(size);
                    wc?.classList.remove(size);
                });
                parentSection?.classList.add('inset');
                wc?.classList.add('inset');
            }

        }

    }

    if ((args.newSize === 'outset' && oldSize === 'full') || (args.newSize === 'full' && oldSize === 'outset')) {
        parentSection.classList.remove(oldSize);
        parentSection.classList.add(args.newSize);
        const [wc] = parentSection.children;
        if (wc) {
            wc.classList.remove(oldSize);
            wc.classList.add(args.newSize);
        }
    }

    param.overlay.refreshOverlay();
    selectIca(param.selectedIca, param.overlay);
    dispatchEventConciliate();

}

const allowedSizes: Sizes[] = ['full', 'outset', 'inset'];

function isValidSize(size: any): size is Sizes {
    return allowedSizes.includes(size);
}

function getOldSize(parentSection: HTMLElement) {
    let oldSize: string = 'full';
    parentSection.classList.forEach((cls: string) => {
        if (allowedSizes.includes(cls as any)) oldSize = cls;
    });
    return oldSize;
}

function selectIca(selectedIca: any, overlay: WCDOverlayMethods) {
    setTimeout(() => { overlay.selectItem(selectedIca as IcaLitElementBaseMethods); }, 500);
}

function addSection(icaSectionTagName: string, wcSectionTagName: string, overlay: HTMLElement, childrens: Element[]) {
    const elSection = document.createElement(icaSectionTagName) as IcaLitElementBaseMethods;
    elSection.setAttribute('widget', wcSectionTagName);
    const allSections = countElementsWithTagName(overlay, icaSectionTagName);
    const id = 'flowSection' + (allSections + 1);;
    elSection.id = PREFIX_ICA_ID + id;
    elSection.setAttribute('idEl', id);
    childrens.forEach((child) => {
        elSection.appendChild(child);
    });
    return elSection;
}

interface IArgs {
    newSize: Sizes
}

type Sizes = 'full' | 'outset' | 'inset'