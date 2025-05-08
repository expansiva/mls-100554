/// <mls shortName="icaApresentationImagesCarouselBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationImagesCarouselBase extends StateLitElement {

    abstract slides: string | undefined;
abstract autoplay: string | undefined;
abstract interval: string | undefined;
abstract loop: string | undefined;


}
