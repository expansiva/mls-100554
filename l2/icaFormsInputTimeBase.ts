/// <mls shortName="icaFormsInputTimeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputTimeBase extends IcaLitElementBase {

    abstract name: string | undefined;
    abstract label: string | undefined;
    abstract hint: string | undefined;
    abstract required: boolean | undefined;
    abstract disabled: boolean | undefined;
    abstract readonly: boolean | undefined;
    abstract autofocus: boolean;
    abstract value: string | undefined;
    abstract pattern: string | undefined;
    abstract errormessage: string | undefined;
    abstract placeholder: string | undefined;


    public baseName: string = 'IcaFormsInputTimeBase';
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
