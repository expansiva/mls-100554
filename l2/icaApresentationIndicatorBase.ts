/// <mls shortName="icaApresentationIndicatorBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationIndicatorBase extends StateLitElement {

    abstract config: string | undefined;
abstract label: string | undefined;
abstract state: string | undefined;


}
