/// <mls shortName="icaFormsSubmitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsSubmitBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract notify: string | undefined;

    public baseName: string = 'IcaFormsSubmitBase';
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
    buttons: IConfigItens[]
}

export interface IConfigItens {
    label: string,
    value: string
}