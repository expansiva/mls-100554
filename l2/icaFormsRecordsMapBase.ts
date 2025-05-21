/// <mls shortName="icaFormsRecordsMapBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsMapBase extends StateLitElement {

    abstract config: string | undefined;


}

export interface IConfig {
    latitude: number,
    longitude: number,
    zoom: number,
    markers: [{ lat: number, lng: number, label: string }],
    maptype: string
}