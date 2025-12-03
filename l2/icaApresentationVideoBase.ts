/// <mls shortName="icaApresentationVideoBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationVideoBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selectedvideo: string | undefined;

    public baseName: string = 'IcaApresentationVideoBase';
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
    recommendedWidget: "embed" | "inline" | "playlist",
    src?: string,              // for single video (embed/inline)
    poster?: string,           // for inline (placeholder image)
    videos?: string[],         // for playlist
    autoplay?: boolean,
    controls?: boolean,
    loop?: boolean,
    preload?: "auto" | "metadata" | "none"
}