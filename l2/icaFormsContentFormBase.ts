/// <mls shortName="icaFormsContentFormBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaFormsContentFormBase extends IcaLitElement {
     
    abstract action: string | undefined;
	abstract method: string | undefined;
	abstract novalidate: string | undefined;
	abstract autocomplete: boolean;
	abstract disabled: boolean ;
	abstract validateOnChange: boolean;
	abstract enctype: string | undefined;
	abstract name: string | undefined;
	abstract target: string| undefined;
	abstract autosave: boolean ;

}