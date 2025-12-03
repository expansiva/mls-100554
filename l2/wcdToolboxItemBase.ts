/// <mls shortName="wcdToolboxItemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {WCDToolboxMethodos, WCDToolboxItemMethodos} from '/_100554_/l2/wcdTypes.js';
import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

export abstract class WcdToolboxItemBase extends CollabLitElement implements WCDToolboxItemMethodos {

    public myParent: WCDToolboxMethodos | undefined;
    //public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBaseMethods | undefined;
    abstract args: string | undefined;

    constructor() {
        super();
        this.myParent = globalWcd.myParent;
        //this.elMain = globalWcd.elMain;
        this.elICA = globalWcd.elICA;
        
    }

    createRenderRoot() {
        return this;
    }

}