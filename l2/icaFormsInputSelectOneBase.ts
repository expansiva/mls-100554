/// <mls shortName="icaFormsInputSelectOneBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputSelectOneBase extends IcaLitElementBase {
    
    abstract hint: string | undefined; // An optional descriptive hint for the field
	abstract label: string | undefined; // A label to identify this field
	abstract options: any | undefined; 
	abstract selectedvalue: string | undefined;
	abstract required: boolean ; // Whether the field is required or optional
	abstract disabled: boolean; // Whether the field is ready for input or disabled

	public baseName:string=  'IcaFormsInputSelectOneBase';
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



