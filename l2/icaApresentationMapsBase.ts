/// <mls shortName="icaApresentationMapsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationMapsBase extends IcaLitElementBase {

  abstract config: string | undefined;

  public baseName: string = 'IcaApresentationMapsBase';
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
  latitude: number,
  longitude: number,
  zoom?: number,
  markers?: { lat: number, lng: number, label?: string }[],
  maptype?: "roadmap" | "satellite" | "terrain"
}