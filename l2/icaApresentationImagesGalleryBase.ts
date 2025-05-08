/// <mls shortName="icaApresentationImagesGalleryBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationImagesGalleryBase extends StateLitElement {

    abstract images: string | undefined;
abstract selectedindex: string | undefined;
abstract thumbnails: string | undefined;
abstract shownavigation: string | undefined;


}
