/// <mls shortName="icaNavigationTransitionBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaTypes';

export abstract class IcaNavigationTransitionBase extends IcaLitElementBase {

    abstract config: string | undefined;

    public baseName: string = 'IcaNavigationTransitionBase';
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
    type: "slide" | "fade" | "push-left" | "push-right" | "zoom",
    duration?: number,
    reverseOnBack?: boolean   // reverses direction if going back
}