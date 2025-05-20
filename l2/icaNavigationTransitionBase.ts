/// <mls shortName="icaNavigationTransitionBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationTransitionBase extends StateLitElement {

    abstract config: IConfig | undefined;


}

export interface IConfig {
    type: "slide" | "fade" | "push-left" | "push-right" | "zoom",
    duration?: number,
    reverseOnBack?: boolean   // reverses direction if going back
}