/// <mls shortName="icaApresentationSoundBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationSoundBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selected: string | undefined;

    public baseName:string=  'IcaApresentationSoundBase';
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
    recommendedWidget: "player" | "effects" | "podcast",
    src?: string,                  // for single audio
    sounds?: string[],            // for sound effects
    podcastepisodes?: string[],   // for podcast playlists
    autoplay?: boolean,
    controls?: boolean,
    loop?: boolean,
    preload?: "auto" | "metadata" | "none"
}