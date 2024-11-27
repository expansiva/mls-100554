/// <mls shortName="wcdToolboxItemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {WCDToolboxMethodos, WCDToolboxItemMethodos} from './_100554_wcdTypes';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { CollabLitElement } from './_100554_collabLitElement';
import { Window } from './_100554_wcdState';

export abstract class WcdToolboxItemBase extends CollabLitElement implements WCDToolboxItemMethodos {

    public myParent: WCDToolboxMethodos | undefined;
    public elMain: HTMLElement | undefined;
    public elICA: IcaLitElementBaseMethods | undefined;
    abstract args: string | undefined;

    constructor() {
        super();
        this.myParent = (window as any as Window).wcdState.myParent as any;
        this.elMain = (window as any as Window).wcdState.elMain;
        this.elICA = (window as any as Window).wcdState.elICA as any;
        
    }

    createRenderRoot() {
        return this;
    }

}