/// <mls shortName="icaFormsInputDateRangeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement'
   
export abstract class IcaFormsInputDateRangeBase extends StateLitElement {

	abstract name: string | undefined;
    abstract label?: string;
    abstract hint?: string;
	abstract required?: boolean;
    abstract disabled?: boolean;
    abstract readonly?: boolean;
	abstract startValue?: string;
	abstract endValue?: string;
	abstract placeHolder?: string;
	abstract errorMessage?: string;
    abstract pattern?: string;
    // abstract autofocus: boolean;

}