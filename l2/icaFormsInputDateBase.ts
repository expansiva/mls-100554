/// <mls shortName="icaFormsInputDateBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputDateBase extends IcaLitElementBase {

    abstract name: string | undefined;
    abstract hint: string | undefined; // An optional descriptive hint for the field
    abstract value: string | undefined; // An optional descriptive hint for the field
    abstract label: string | undefined; // A label to identify this field
    abstract required: boolean; // Whether the field is required or optional
    abstract disabled: boolean; // Whether the field is ready for input or disabled
    abstract pattern: string | undefined; // A regular expression that the input's value must match
    abstract errormessage: string | undefined; // Custom error message to display when input validation fails
    abstract autofocus: boolean; // Whether the field should be automatically focused on page load
    abstract maxvalue: string | undefined; // Maximum value restriction for the input
    abstract minvalue: string | undefined; // Minimum value restriction for the input
    abstract readonly: boolean;


    public baseName:string=  'IcaFormsInputDateBase';
    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
        ]
    }
}
