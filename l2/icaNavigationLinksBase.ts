/// <mls shortName="icaNavigationLinksBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaNavigationLinksBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selected: string | undefined;

    public baseName: string = 'IcaNavigationLinksBase';
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