/// <mls shortName="icaApresentationGalleryBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationGalleryBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selectedindex: string | undefined;
    abstract fornavigation: string | undefined;


}

export interface IConfig{
  recommendedWidget: "gallery" | "carousel" | "slider",
  images: string[],               // array of image URLs
  thumbnails?: boolean,           // for gallery
  shownavigation?: boolean,       // for carousel/slider
  autoplay?: boolean,
  interval?: number,              // ms
  loop?: boolean
}