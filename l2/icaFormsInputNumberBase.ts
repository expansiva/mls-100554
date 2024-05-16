/// <mls shortName="icaFormsInputNumberBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement'

export abstract class IcaFormsInputNumberBase extends IcaLitElement {

	abstract hint: string | undefined; // An optional descriptive hint for the field
	abstract label: string | undefined; // A label to identify this field
	abstract datasource: number | undefined; // A label to identify this field
	abstract required: boolean; // Whether the field is required or optional
	abstract disabled: boolean; // Whether the field is ready for input or disabled
	abstract maxvalue: number | undefined; // Maximum value restriction for the input
	abstract minvalue: number | undefined; // Minimum value restriction for the input
	abstract step: number | undefined; // The step increment between values
	abstract placeholder: string | undefined; // Placeholder text for the input field
	abstract pattern: string | undefined; // A regular expression that the input's value must match
	abstract errormessage: string | undefined; // Custom error message to display when input validation fails
	abstract autofocus: boolean; // Whether the field should be automatically focused on page load

}


