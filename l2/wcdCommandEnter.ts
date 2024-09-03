/// <mls shortName="wcdCommandEnter" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand } from './_100554_wcdTypes';
import { dispatchEventConciliate, importFilesIfNeeded } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';
import { findParentElementWithTagName, countElementsWithTagName } from './_100554_wcdGlobal';

export function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');
    if (!param.args || !(param.args instanceof KeyboardEvent)) throw new Error('invalid param.args');

    const e = param.args as KeyboardEvent;
    const ica = param.selectedIca;
    const overlay = param.overlay;
    e.preventDefault();
    if (!ica) return;

    const icaSectionTagName = 'ica-layout-flow-section-100554';
    const wcSectionTagName = 'wc-section-100554';
    const icaTagName = 'ica-apresentation-text-text-100554';
    const wcTagName = 'wc-text-100554';

    const imports = [icaTagName, wcTagName, icaSectionTagName, wcSectionTagName];
    importFilesIfNeeded(imports);

    const elAdd = document.createElement('ica-apresentation-text-text-100554') as IcaLitElementBaseMethods;
    elAdd.setAttribute('widget', 'wc-text-100554');
    elAdd.setAttribute('type', 'p');
    elAdd.setAttribute('text', '');

    const allTexts = countElementsWithTagName(overlay, icaSectionTagName);
    elAdd.id = 'ica_apText' + (allTexts + 1);
    if (e.altKey) elAdd.setAttribute('addOpen', 'true');

    const parentSection = findParentElementWithTagName(param.selectedIca, icaSectionTagName);

    if (parentSection && (parentSection.classList.contains('full') || parentSection.classList.contains('outset'))) {
        let nextSection = parentSection.nextElementSibling;

        if (nextSection && nextSection.classList.contains('inset')) {
            const nextChidrens = nextSection?.children[0]?.shadowRoot?.children || [];
            const firstChildrenNext = nextChidrens[0];
            if (firstChildrenNext) nextSection?.children[0]?.shadowRoot?.insertBefore(elAdd, firstChildrenNext);
            else nextSection?.appendChild(param.selectedIca);

        } else {
            const sectionImage = addSection(icaSectionTagName, wcSectionTagName, param.overlay, [elAdd]);
            parentSection.insertAdjacentElement('afterend', sectionImage);
        }

    } else {
        ica.insertAdjacentElement('afterend', elAdd);
    }

    const { x, y, height, width } = elAdd.getBoundingClientRect();
    overlay.myItens.push({ element: elAdd, depth: 0, x, y, height, width, opacity: elAdd.style.opacity });
    overlay.createOverlayItems()

    setTimeout(() => {
        param.overlay.selectItem(elAdd);
        elAdd.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    dispatchEventConciliate();

}

function addSection(icaSectionTagName: string, wcSectionTagName: string, overlay: HTMLElement, childrens: Element[]) {
    const elSection = document.createElement(icaSectionTagName) as IcaLitElementBaseMethods;
    elSection.setAttribute('widget', wcSectionTagName);
    const allSections = countElementsWithTagName(overlay, icaSectionTagName);
    const id = 'flowSection' + (allSections + 1);;
    elSection.classList.add('inset');
    elSection.id = PREFIX_ICA_ID + id;
    elSection.setAttribute('idEl', id);
    childrens.forEach((child) => {
        elSection.appendChild(child);
    });
    return elSection;
}