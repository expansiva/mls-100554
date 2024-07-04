/// <mls shortName="wcdToolboxItemBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { LitElement } from 'lit';
import { WCDToolbox } from './_100554_wcdToolbox';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

export abstract class WcdToolboxItemBase extends LitElement {

    abstract myParent: WCDToolbox | undefined;
    abstract elMain: HTMLElement | undefined;
    abstract elFCA: IcaLitElementBase | undefined;

}