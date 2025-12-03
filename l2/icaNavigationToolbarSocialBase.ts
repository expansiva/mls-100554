/// <mls shortName="icaNavigationToolbarSocialBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaNavigationToolbarSocialBase extends IcaLitElementBase {

    abstract config: string | undefined;

    public baseName: string = 'IcaNavigationToolbarSocialBase';
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
    items: {
        platform: "twitter" | "linkedin" | "github" | "facebook" | string,
        href: string,
        icon?: string,     // default: inferred by platform
        label?: string     // optional text for accessibility
    }[],
    layout?: "horizontal" | "vertical",
    size?: "sm" | "md" | "lg"
}