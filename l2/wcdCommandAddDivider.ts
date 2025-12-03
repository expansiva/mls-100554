/// <mls shortName="wcdCommandAddDivider" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { findParentElementWithTagName, getSiblingsAfter, countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    const icaSectionTagName = 'ica-layout-flow-section-100554';
    const wcSectionTagName = 'widget-section-100554';
    const icaTagName = 'ica-layout-flow-divider-100554';
    const wcTagName = 'widget-divider-100554';

    const imports = [icaTagName, wcTagName, icaSectionTagName, wcSectionTagName];
    importFilesIfNeeded(imports);

    const elDivider = document.createElement(icaTagName) as IcaLitElementBaseMethods;
    elDivider.setAttribute('widget', wcTagName);
    const allFlowDividers = countElementsWithTagName(param.overlay, icaTagName);
    const id = 'apDivider' + (allFlowDividers + 1);;
    elDivider.id = PREFIX_ICA_ID + id;
    elDivider.setAttribute('idEl', id);

    const siblings = getSiblingsAfter(param.selectedIca);
    const sectionNew = addSection(icaSectionTagName, wcSectionTagName, param.overlay, [elDivider, ...siblings]);
    const parentSection = findParentElementWithTagName(param.selectedIca, icaSectionTagName);

    if (!parentSection) return;
    parentSection.insertAdjacentElement('afterend', sectionNew);

    await sectionNew.updateComplete;
    param.selectedIca.remove();

    await elDivider.updateComplete;
    const { x, y, height, width } = elDivider.getBoundingClientRect();
    if (!param.overlay.myItens) param.overlay.myItens = [];
    param.overlay.myItens.push({ element: elDivider, depth: 0, x, y, height, width, opacity: elDivider.style.opacity });
    param.overlay.createOverlayItems();
    setTimeout(() => { param.overlay.selectItem(elDivider); }, 500);

    dispatchEventConciliate();


}

function addSection(icaSectionTagName: string, wcSectionTagName: string, overlay: HTMLElement, childrens: Element[]) {
    const elSection = document.createElement(icaSectionTagName) as IcaLitElementBaseMethods;
    elSection.setAttribute('widget', wcSectionTagName);
    const allSections = countElementsWithTagName(overlay, icaSectionTagName);
    const id = 'flowSection' + (allSections + 1);;
    elSection.id = PREFIX_ICA_ID + id;
    elSection.setAttribute('idEl', id);
    elSection.classList.add('inset');

    childrens.forEach((child) => {
        elSection.appendChild(child);
    });
    return elSection;
}
