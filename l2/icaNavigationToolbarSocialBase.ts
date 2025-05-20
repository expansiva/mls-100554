/// <mls shortName="icaNavigationToolbarSocialBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationToolbarSocialBase extends StateLitElement {

    abstract config: IConfig | undefined;


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