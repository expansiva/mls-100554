/// <mls shortName="icaFormsInputMultiselectBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputMultiselectBase extends IcaLitElementBase {

    abstract hint: string | undefined;
    abstract label: string | undefined;
    abstract required: boolean | undefined;
    abstract disabled: boolean | undefined;
    abstract options: string | undefined;
    abstract selectedvalue: string | undefined;


    public baseName:string=  'IcaFormsInputMultiselectBase';
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
