/// <mls shortName="icaFormsRecordsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsRecordsBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selected: string | undefined;
    abstract title: string;
    abstract subtitle: string | undefined;
    abstract line1: string | undefined;
    abstract line2: string | undefined;
    abstract bottom: string | undefined;
    abstract image: string | undefined;
    abstract icon: string | undefined;
    abstract badge: string | undefined;

    public baseName: string = 'IcaFormsRecordsBase';
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

    table: string,
    range: { start: number, end: number },
    recommendedWidget: string,
    selectedField: string,

}
