/// <mls shortName="icaApresentationEmbedSocialBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationEmbedSocialBase extends IcaLitElementBase {

    abstract config: string | undefined;
    
    public baseName: string = 'IcaApresentationEmbedSocialBase';
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
    recommendedWidget: "post" | "feed",
    url: string,                    // required: post or profile URL
    width?: string,                 // optional dimensions (ex: "100%", "300px")
    height?: string,
    refreshInterval?: number,      // in seconds, only for feeds
    limit?: number                 // max items, only for feeds
}