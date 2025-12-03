/// <mls shortName="icaApresentationIndicatorBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationIndicatorBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract label: string | undefined;
    abstract state: string | undefined;

    public baseName:string=  'IcaApresentationIndicatorBase';
    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }

}

export interface IConfig {
    type: "progress" | "loading" | "status" | "badge" | string,
    value?: number,         // for progress
    max?: number,           // optional, default 100
    color?: string,         // optional: for status, badge
    size?: "sm" | "md" | "lg" | string,
    triggerValue?: string | boolean | number,  // optional: activate only when state == triggerValue
    inverted?: boolean      // optional: reverse behavior if state != triggerValue
}