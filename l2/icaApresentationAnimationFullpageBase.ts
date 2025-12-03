/// <mls shortName="icaApresentationAnimationFullpageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationAnimationFullpageBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract state: string | undefined;

    public baseName: string = 'IcaApresentationAnimationFullpageBase';
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
    recommendedWidget: "confetti" | "fireworks" | "radial-splash" | "balloon-explode" | string,
    trigger: "manual" | "onload" | "onclick" | "page-enter" | "page-exit" | "state",
    triggerValue?: string | number | boolean,
    inverted?: boolean,
    duration?: number,
    intensity?: number,
    once?: boolean
}