/// <mls shortName="icaApresentationAnimationBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationAnimationBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract content: string | undefined;
    abstract state: string | undefined;


}

export interface IConfig {
    animation: "fadeIn" | "zoomIn" | "slideLeft" | string,
    trigger?: "onload" | "onclick" | "hover" | "manual" | "state",
    triggerValue?: string | number | boolean,  // activate only when state == triggerValue
    inverted?: boolean,                        // show when state != triggerValue
    duration?: number,     // in ms
    delay?: number,
    repeat?: number        // default = 1
}