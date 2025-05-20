/// <mls shortName="icaApresentationVideoBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationVideoBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract selectedvideo: string | undefined;


}

interface IConfig {
    recommendedWidget: "embed" | "inline" | "playlist",
    src?: string,              // for single video (embed/inline)
    poster?: string,           // for inline (placeholder image)
    videos?: string[],         // for playlist
    autoplay?: boolean,
    controls?: boolean,
    loop?: boolean,
    preload?: "auto" | "metadata" | "none"
}