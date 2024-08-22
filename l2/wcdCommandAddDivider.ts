/// <mls shortName="wcdCommandAddDivider" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IWCDCommand } from './_100554_wcdCommandBase';
import { PREFIX_ICA_ID } from './_100554_collabPageElement';

export async function execute(options: IWCDCommand) {

    if (!options.selectedIca) return;

    const elDivider = document.createElement('ica-layout-flow-divider-100554') as IcaLitElementBase;
    elDivider.setAttribute('widget', 'wc-divider-100554');
    const allFlowDividers = options.overlay.querySelectorAll('[widget="ica-layout-flow-divider-100554"]');

    const id = 'apDivider' + (allFlowDividers.length + 1);;
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

