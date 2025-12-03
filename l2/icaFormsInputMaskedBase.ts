/// <mls shortName="icaFormsInputMaskedBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputMaskedBase extends IcaLitElementBase {

    abstract label: string | undefined;
    abstract placeholder: string | undefined;
    abstract hint: string | undefined;
    abstract name: string | undefined;
    abstract value: string | undefined;
    abstract mask: string | undefined;
    abstract required: boolean | undefined;
    abstract disabled: boolean | undefined;
    abstract readonly: boolean | undefined;
    abstract autocomplete: string | undefined;

    public baseName:string=  'IcaFormsInputMaskedBase';
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
