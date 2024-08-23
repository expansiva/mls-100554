/// <mls shortName="wcdCommandAddCodeBlock" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(options: IWCDCommand) {

    if (!options.selectedIca) return;

    const widgetIca = 'ica-apresentation-text-code-100554';

    const elDivider = document.createElement(widgetIca) as IcaLitElementBase;
    elDivider.setAttribute('widget', 'wc-code-100554');
    const allCode = options.overlay.querySelectorAll(`[widget="${widgetIca}"]`);

    const id = 'apCode' + (allCode.length + 1);;
    elDivider.id = PREFIX_ICA_ID + id;
    elDivider.setAttribute('idEl', id);

    options.selectedIca.insertAdjacentElement('afterend', elDivider);
    await elDivider.updateComplete;
    options.selectedIca.remove();

    const { x, y, height, width } = elDivider.getBoundingClientRect();
    if (!options.overlay.myItens) options.overlay.myItens = [];
    options.overlay.myItens.push({ element: elDivider, depth: 0, x, y, height, width, opacity: elDivider.style.opacity });
    options.overlay.createOverlayItems();
    setTimeout(() => { elDivider.overlayRef?.click(); }, 500);

}
