/// <mls shortName="icaFormsContentFormBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsContentFormBase extends IcaLitElementBase {
     
    abstract action: string | undefined;
	abstract method: string | undefined;
	abstract novalidate: string | undefined;
	abstract autocomplete: boolean;
	abstract disabled: boolean ;
	abstract validateonchange: boolean;
	abstract enctype: string | undefined;
	abstract name: string | undefined;
	abstract target: string| undefined;
	abstract autosave: boolean;
	abstract formId: string | undefined;

	public baseName:string=  'IcaFormsContentFormBase';
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