/// <mls shortName="icaFormsInputDateRangeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputDateRangeBase extends IcaLitElementBase {

    abstract name: string | undefined;
    abstract label: string | undefined;
    abstract hint: string | undefined;
    abstract required: boolean | undefined;
    abstract disabled: boolean | undefined;
    abstract readonly: boolean | undefined;
    abstract startvalue: string | undefined;
    abstract endvalue: string | undefined;
    abstract placeholder: string | undefined;
    abstract errormessage: string | undefined;
    abstract pattern: string | undefined;
    abstract autofocus: boolean;

    public baseName: string = 'IcaFormsInputDateRangeBase';
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