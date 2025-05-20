/// <mls shortName="icaApresentationAnimationFullpageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationAnimationFullpageBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract state: string | undefined;


}

export interface IConfig {
    recommendedWidget: "confetti" | "fireworks" | "radial-splash" | "balloon-explode" | string,
    trigger: "manual" | "onload" | "onclick" | "page-enter" | "page-exit" | "state",
    triggerValue?: string | number | boolean,
    inverted?: boolean,
    duration?: number,
    intensity?: number,
    once?: boolean
}