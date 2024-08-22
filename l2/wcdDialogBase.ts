/// <mls shortName="wcdDialogBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabLitElement } from './_100554_collabLitElement';
import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export abstract class WcdDialogBase extends CollabLitElement {

    abstract execute: (args?: {}) => void

    get icaEl() { return undefined };

    get wcdOverlayEl(): WcdOverlayLitBase | null { return this.closest('wcd-toolbox-100554') as WcdOverlayLitBase  };

    // createRenderRoot() {
    //     return this;
    // }

}