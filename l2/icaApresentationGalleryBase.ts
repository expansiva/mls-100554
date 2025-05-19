/// <mls shortName="icaApresentationGalleryBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationGalleryBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selectedindex: string | undefined;
    abstract fornavigation: string | undefined;


}
