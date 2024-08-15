/// <mls shortName="icaLayoutFlowDividerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement'

export abstract class IcaLayoutFlowDividerBase extends IcaLitElement {

    abstract text: string | undefined; // An optional text for the divider
 
}