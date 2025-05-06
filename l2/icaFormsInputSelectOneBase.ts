/// <mls shortName="icaFormsInputSelectOneBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsInputSelectOneBase extends StateLitElement {
    
    abstract hint: string | undefined; // An optional descriptive hint for the field
	abstract label: string | undefined; // A label to identify this field
	abstract options: any | undefined; 
	abstract selectedvalue: string | undefined;
	abstract required: boolean ; // Whether the field is required or optional
	abstract disabled: boolean; // Whether the field is ready for input or disabled
	
}



