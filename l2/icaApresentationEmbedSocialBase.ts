/// <mls shortName="icaApresentationEmbedSocialBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationEmbedSocialBase extends StateLitElement {

    abstract config: IConfig | undefined;


}

interface IConfig {
    recommendedWidget: "post" | "feed",
    url: string,                    // required: post or profile URL
    width?: string,                 // optional dimensions (ex: "100%", "300px")
    height?: string,
    refreshInterval?: number,      // in seconds, only for feeds
    limit?: number                 // max items, only for feeds
}