/// <mls shortName="icaApresentationVideoVideoPlaylistBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationVideoVideoPlaylistBase extends StateLitElement {

    abstract videos: string | undefined;
abstract selectedvideo: string | undefined;
abstract autoplay: string | undefined;
abstract controls: string | undefined;
abstract loop: string | undefined;


}
