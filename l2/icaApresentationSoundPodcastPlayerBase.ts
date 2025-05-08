/// <mls shortName="icaApresentationSoundPodcastPlayerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationSoundPodcastPlayerBase extends StateLitElement {

    abstract podcastepisodes: string | undefined;
abstract selectedepisode: string | undefined;
abstract autoplay: string | undefined;
abstract controls: string | undefined;
abstract loop: string | undefined;
abstract preload: string | undefined;


}
