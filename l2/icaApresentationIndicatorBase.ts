/// <mls shortName="icaApresentationIndicatorBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationIndicatorBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract label: string | undefined;
    abstract state: string | undefined;


}


interface IConfig {
    type: "progress" | "loading" | "status" | "badge" | string,
    value?: number,         // for progress
    max?: number,           // optional, default 100
    color?: string,         // optional: for status, badge
    size?: "sm" | "md" | "lg" | string,
    triggerValue?: string | boolean | number,  // optional: activate only when state == triggerValue
    inverted?: boolean      // optional: reverse behavior if state != triggerValue
}