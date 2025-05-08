/// <mls shortName="icaApresentationSoundSoundEffectsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationSoundSoundEffectsBase extends StateLitElement {

    abstract sounds: string | undefined;
abstract selectedsound: string | undefined;
abstract autoplay: string | undefined;


}
