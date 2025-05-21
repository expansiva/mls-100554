/// <mls shortName="icaNavigationContentBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selected: string | undefined;


}

export interface IConfig {
    recommendedWidget: "tab" | "stepper" | "scenary" | "accordion" | "toolbar" | "popup" | "none",
    headerVisible?: boolean,
    sections: {
        id: number,
        ref: string,               // local ref (ex: "#form1") or external (ex: "./page2")
        prefetch?: "hover",
        label?: string,            // section label
        icon?: string,             // optional icon
        badge?: string | number,   // optional badge (count, status, etc.)
        visible?: boolean,         // false = hidden from header, but content remains accessible
        disabled?: boolean         // disables interaction
    }[]
}