/// <mls shortName="icaNavigationLinksBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract selected: string | undefined;


}

interface IConfig {
    recommendedWidget: "link" | "menu" | "button" | "breadcrumb" | "anchor", // default = "link"
    scrollSync?: boolean,      // if true, updates selected as the user scrolls
    offset?: number,           // pixels from top to consider section active
    items: {
        label: string,
        href: string,            // can be external ("/produtos") or anchor ("#faq")
        icon?: string,
        badge?: string | number,
        disabled?: boolean
    }[]
}