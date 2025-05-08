/// <mls shortName="icaLayoutFlowGridBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaLayoutFlowGridBase extends StateLitElement {

    abstract rows: string | undefined;
abstract columns: string | undefined;
abstract gap: string | undefined;


}
