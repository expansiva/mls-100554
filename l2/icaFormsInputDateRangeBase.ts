/// <mls shortName="icaFormsInputDateRangeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement'
   
export abstract class IcaFormsInputDateRangeBase extends StateLitElement {

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

}