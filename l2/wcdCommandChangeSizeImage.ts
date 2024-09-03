/// <mls shortName="wcdCommandChangeSizeImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand, WCDOverlayMethods } from './_100554_wcdTypes';
import { dispatchEventConciliate, importFilesIfNeeded } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';
import { findParentElementWithTagName, getSiblingsAfter, countElementsWithTagName } from './_100554_wcdGlobal';

export async function execute(param: IWCDCommand) {

    if (!param.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    const args = param.args as IArgs;
    if (!args.newSize || typeof args.newSize !== 'string' || !isValidSize(args.newSize)) throw new Error('Invalid args: newSize is missing or invalid');

    const icaSectionTagName = 'ica-layout-flow-section-100554';
    const wcSectionTagName = 'wc-section-100554';
    const icaTagName = 'ica-apresentation-images-images-100554';
    const wcTagName = 'wc-image-100554';

    const imports = [icaTagName, wcTagName, icaSectionTagName, wcSectionTagName];
    importFilesIfNeeded(imports);

    const parentSection = findParentElementWithTagName(param.selectedIca, icaSectionTagName);
    if (!parentSection) throw new Error('image is not in valid section');
    let oldSize: string = getOldSize(parentSection as HTMLElement)

    if (oldSize === 'inset' && (args.newSize === 'full' || args.newSize === 'outset')) {

        const siblings = getSiblingsAfter(param.selectedIca);
        const sectionImage = addSection(icaSectionTagName, wcSectionTagName, param.overlay, [param.selectedIca]);
        sectionImage.classList.add(args.newSize);
        parentSection.insertAdjacentElement('afterend', sectionImage);

        if (siblings.length > 0) {
            const sectionAfter = addSection(icaSectionTagName, wcSectionTagName, param.overlay, siblings);
            sectionAfter.classList.add('inset');
            sectionImage.insertAdjacentElement('afterend', sectionAfter);
            const isEmpty = (parentSection?.children[0]?.shadowRoot?.children || []).length === 0;
            if (isEmpty) {
                parentSection.remove();
                const indexOverlayParentSection = param.overlay.myItens.findIndex(item => item.element === parentSection);
                if (indexOverlayParentSection !== -1) param.overlay.myItens.splice(indexOverlayParentSection, 1);
            }
        }

        await sectionImage.updateComplete;
        selectIca(param.selectedIca, param.overlay)

    }

    if ((oldSize === 'full' || oldSize === 'outset') && args.newSize === 'inset') {

        let previousSection = parentSection.previousElementSibling;
        let nextSection = parentSection.nextElementSibling;

        const nextSectionIsInset = nextSection?.classList.contains('inset') || false;
        const previousSectionIsInset = previousSection?.classList.contains('inset') || false;
        const isEmptySections = !param.selectedIca.previousElementSibling && !param.selectedIca.nextElementSibling;

        if (!previousSection && !nextSectionIsInset || (!previousSectionIsInset && !nextSectionIsInset)) {
            // console.info('criar');
            return;
        }

        if ((!previousSection || !previousSectionIsInset) && nextSectionIsInset) {

            const nextChidrens = nextSection?.children[0]?.shadowRoot?.children || [];
            const firstChildrenNext = nextChidrens[0];
            if (firstChildrenNext) nextSection?.children[0]?.shadowRoot?.insertBefore(param.selectedIca, firstChildrenNext);
            else nextSection?.appendChild(param.selectedIca);

            if (isEmptySections) {
                parentSection.remove();
                const indexOverlayParentSection = param.overlay.myItens.findIndex(item => item.element === parentSection);
                if (indexOverlayParentSection !== -1) param.overlay.myItens.splice(indexOverlayParentSection, 1);
            }

        } else {

            if (!previousSection) return;

            const previousChildrens = previousSection.children[0]?.shadowRoot?.children || [];
            const nextChidrens = nextSection?.children[0]?.shadowRoot?.children || [];

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

    // dispatchEventConciliate();

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
    const { x, y, height, width } = selectedIca.getBoundingClientRect();
    if (!overlay.myItens) overlay.myItens = [];
    overlay.myItens.push({ element: selectedIca, depth: 0, x, y, height, width, opacity: selectedIca.style.opacity });
    overlay.createOverlayItems();
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