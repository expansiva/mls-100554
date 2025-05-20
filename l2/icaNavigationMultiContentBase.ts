/// <mls shortName="icaNavigationMultiContentBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationMultiContentBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract selected: string | undefined;


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