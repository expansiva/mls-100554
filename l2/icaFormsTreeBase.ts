/// <mls shortName="icaFormsTreeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaTypes';

export abstract class IcaFormsTreeBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract selectedvalues: string | undefined;
    abstract selectedkeys: string | undefined;


    public baseName: string = 'IcaFormsTreeBase';
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
    columns: { key: string, value: string, icon: string },
    multiexpand: boolean,
    multiselect: boolean,
    cascadeSelect: boolean
}