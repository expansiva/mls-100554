/// <mls shortName="icaLayoutFlowSplitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaLayoutFlowSplitBase extends StateLitElement {

    abstract direction: string | undefined;
abstract ratio: string | undefined;
abstract gutter: string | undefined;


}
