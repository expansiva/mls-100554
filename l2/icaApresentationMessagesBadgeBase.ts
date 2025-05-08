/// <mls shortName="icaApresentationMessagesBadgeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessagesBadgeBase extends StateLitElement {

    abstract text: string | undefined;
abstract type: string | undefined;
abstract icon: string | undefined;


}
