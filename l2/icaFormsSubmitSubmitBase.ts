/// <mls shortName="icaFormsSubmitSubmitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaFormsSubmitSubmitBase extends IcaLitElement {
    
    abstract name: string | undefined;
	abstract title: string;
	abstract icon: string | undefined;
	abstract text: string | undefined;
	abstract disabled: boolean ; // Whether the field is ready for input or disabled
	abstract form: string | undefined; // The form element that the button is associated with (it is the owning form).

}



