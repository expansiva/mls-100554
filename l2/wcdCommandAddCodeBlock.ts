/// <mls shortName="wcdCommandAddCodeBlock" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand, dispatchEventConciliate } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(param: IWCDCommand) {

    if (!param?.selectedIca) throw new Error('invalid param.selectedIca');
    if (!param.overlay || typeof param.overlay.selectItem !== 'function') throw new Error('invalid param.overlay');

    const widgetIca = 'ica-apresentation-text-code-100554';
    const elDivider = document.createElement(widgetIca) as IcaLitElementBaseMethods;
    elDivider.setAttribute('widget', 'wc-code-100554');
    const allCode = param.overlay.querySelectorAll(`[widget="${widgetIca}"]`);

    const id = 'apCode' + (allCode.length + 1);;
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
