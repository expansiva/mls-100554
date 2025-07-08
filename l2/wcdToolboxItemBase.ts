/// <mls shortName="wcdToolboxItemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {WCDToolboxMethodos, WCDToolboxItemMethodos} from './_100554_wcdTypes';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { CollabLitElement } from './_100554_collabLitElement';
import { globalWcd } from './_100554_wcdState';

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