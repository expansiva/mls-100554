/// <mls shortName="icaApresentationSoundBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationSoundBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract selected: string | undefined;


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