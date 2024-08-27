/// <mls shortName="wcdToolboxItemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { WCDToolbox } from './_100554_wcdToolbox';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { CollabLitElement } from './_100554_collabLitElement';

export abstract class WcdToolboxItemBase extends CollabLitElement {

    abstract myParent: WCDToolbox | undefined;
    abstract elMain: HTMLElement | undefined;
    abstract elICA: IcaLitElementBaseMethods | undefined;
    abstract args: string | undefined;

    createRenderRoot() {
        return this;
    }

}