/// <mls shortName="icaInteractionButtonBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaTypes';

export abstract class IcaInteractionButtonBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract notifyPath: string | undefined;
    abstract notifyValue: string | undefined;


    public baseName:string=  'IcaInteractionButtonBase';
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
    label?: string,
    icon?: string,
    type?: "onlyText" | "onlyIcon" | "full"
    disabled?: boolean,
    tooltip?: string
}