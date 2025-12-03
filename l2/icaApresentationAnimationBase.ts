/// <mls shortName="icaApresentationAnimationBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationAnimationBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract content: string | undefined;
    abstract state: string | undefined;

    public mySymbol = 'fa-table-columns';
    public baseName = 'IcaApresentationAnimationBase'; 
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
    animation: "fadeIn" | "zoomIn" | "slideLeft" | string,
    trigger?: "onload" | "onclick" | "hover" | "manual" | "state",
    triggerValue?: string | number | boolean,  // activate only when state == triggerValue
    inverted?: boolean,                        // show when state != triggerValue
    duration?: number,     // in ms
    delay?: number,
    repeat?: number        // default = 1
}