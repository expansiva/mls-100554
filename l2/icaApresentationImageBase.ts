/// <mls shortName="icaApresentationImageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationImageBase extends IcaLitElementBase {

    abstract config: string | undefined;

    public baseName: string = 'IcaApresentationImageBase';
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
    type: "image" | "icon" | "avatar",
    src?: string,         // for image or avatar
    icon?: string,        // for icon
    alt?: string,
    width?: string,
    height?: string,
    size?: string,        // icon or avatar
    color?: string,       // icon only
    shape?: "circle" | "square" // avatar only
}