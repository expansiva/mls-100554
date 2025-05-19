/// <mls shortName="icaApresentationSoundBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationSoundBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selected: string | undefined;


}
