/// <mls shortName="icaFormsInputString" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaFormsInputString extends IcaLitElement {
    
    abstract hint: string | undefined; // An optional descriptive hint for the field
	abstract label: string | undefined; // A label to identify this field
	abstract required: boolean ; // Whether the field is required or optional
	abstract disabled: boolean ; // Whether the field is ready for input or disabled
	abstract datasource: string | undefined; // A label to identify this field
	abstract maxlength: number | undefined ; // Maximum length restriction for the input
	abstract minlength: number | undefined ; // Minimum length restriction for the input
	abstract placeholder: string| undefined; // Placeholder text for the input field
	abstract pattern: string| undefined; // A regular expression that the input's value must match
	abstract errormessage: string| undefined; // Custom error message to display when input validation fails
	abstract autofocus: boolean ; // Whether the field should be automatically focused on page load
	abstract autoCapitalize: IAutoCapitalize | undefined; // abstract autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' ; // Controls whether and how text input is automatically capitalized as it is entered by the user.
	abstract autocorrect: IAutocorrect | undefined; // abstract autocorrect: 'off' | 'on' ; // Indicates whether the browser's autocorrect feature is on or off.

}

export type IAutoCapitalize = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
export type IAutocorrect = 'off' | 'on';


