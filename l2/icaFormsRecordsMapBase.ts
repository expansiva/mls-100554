/// <mls shortName="icaFormsRecordsMapBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsRecordsMapBase extends IcaLitElementBase {

    abstract config: string | undefined;

    public baseName:string=  'IcaFormsRecordsMapBase';
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
    zoom: number,
    markers: [{ lat: number, lng: number, label: string }],
    maptype: string
}