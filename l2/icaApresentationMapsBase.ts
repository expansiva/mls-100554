/// <mls shortName="icaApresentationMapsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMapsBase extends StateLitElement {

    abstract config: IConfig | undefined;


}

export interface IConfig{
  latitude: number,
  longitude: number,
  zoom?: number,
  markers?: { lat: number, lng: number, label?: string }[],
  maptype?: "roadmap" | "satellite" | "terrain"
}