/// <mls shortName="wcdCommandAddCodeBlock" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { IWCDCommand } from '/_100554_/l2/wcdTypes.js';
import { dispatchEventConciliate, importFilesIfNeeded } from '/_100554_/l2/wcdCommandBase.js';
import { PREFIX_ICA_ID } from '/_100554_/l2/collabPageElement.js';
import { countElementsWithTagName } from '/_100554_/l2/wcdGlobal.js';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    const icaTagName = 'ica-apresentation-text-code-100554';
    const wcTagName = 'widget-text-code-100554';
    importFilesIfNeeded([icaTagName, wcTagName]);

    const widgetIca = icaTagName;
    const elDivider = document.createElement(widgetIca) as IcaLitElementBaseMethods;
    elDivider.setAttribute('widget', 'widget-text-code-100554');
    const allCode = countElementsWithTagName(param.overlay, icaTagName);

    const id = 'apCode' + (allCode + 1);;
    elDivider.id = PREFIX_ICA_ID + id;
    elDivider.setAttribute('idEl', id);

    param.selectedIca.insertAdjacentElement('afterend', elDivider);
    await elDivider.updateComplete;
    param.selectedIca.remove();

    const { x, y, height, width } = elDivider.getBoundingClientRect();
    if (!param.overlay.myItens) param.overlay.myItens = [];
    param.overlay.myItens.push({ element: elDivider, depth: 0, x, y, height, width, opacity: elDivider.style.opacity });
    param.overlay.createOverlayItems();
    setTimeout(() => { param.overlay.selectItem(elDivider); }, 500);
    dispatchEventConciliate();

}
