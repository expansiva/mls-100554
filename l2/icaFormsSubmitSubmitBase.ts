/// <mls shortName="icaFormsSubmitSubmitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsSubmitSubmitBase extends StateLitElement {
    
    abstract name: string | undefined;
	abstract title: string;
	abstract icon: string | undefined;
	abstract text: string | undefined;
	abstract disabled: boolean ; // Whether the field is ready for input or disabled
	abstract form: string | undefined; // The form element that the button is associated with (it is the owning form).

}



