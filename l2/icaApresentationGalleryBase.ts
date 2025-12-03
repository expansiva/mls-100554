/// <mls shortName="icaApresentationGalleryBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationGalleryBase extends IcaLitElementBase {

  abstract config: string | undefined;
  abstract selectedindex: string | undefined;
  abstract fornavigation: string | undefined;

  public baseName: string = 'IcaApresentationGalleryBase';
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
  recommendedWidget: "gallery" | "carousel" | "slider",
  images: string[],               // array of image URLs
  thumbnails?: boolean,           // for gallery
  shownavigation?: boolean,       // for carousel/slider
  autoplay?: boolean,
  interval?: number,              // ms
  loop?: boolean
}