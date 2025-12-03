/// <mls shortName="icaNavigationMultiContentBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaNavigationMultiContentBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selected: string | undefined;

    public baseName: string = 'IcaNavigationMultiContentBase';
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
    layout: "horizontal" | "vertical" | "grid" | "overlay" | "tiles",
    sections: {
        id: string | number,
        ref: string, // local ref (ex: "#form1") or external (ex: "./page2")
        prefetch?: "hover",
        label?: string,
        icon?: string,
        visible?: boolean,
        resizable?: boolean,
        width?: string,  // optional width/height hints
        height?: string
    }[]
}