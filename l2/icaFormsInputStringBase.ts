/// <mls shortName="icaFormsInputStringBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaFormsInputStringBase extends IcaLitElementBase {
    
    abstract name: string | undefined;
	abstract hint: string | undefined; // An optional descriptive hint for the field
	abstract value: string | undefined; // An optional descriptive hint for the field
	abstract label: string | undefined; // A label to identify this field
	abstract required: boolean ; // Whether the field is required or optional
	abstract disabled: boolean ; // Whether the field is ready for input or disabled
	abstract maxlength: number | undefined ; // Maximum length restriction for the input
	abstract minlength: number | undefined ; // Minimum length restriction for the input
	abstract placeholder: string| undefined; // Placeholder text for the input field
	abstract pattern: string| undefined; // A regular expression that the input's value must match
	abstract errormessage: string| undefined; // Custom error message to display when input validation fails
	abstract autofocus: boolean ; // Whether the field should be automatically focused on page load
	abstract autocapitalize: IAutoCapitalize ; // abstract autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' ; // Controls whether and how text input is automatically capitalized as it is entered by the user.
	abstract autocorrect: IAutocorrect | undefined; // abstract autocorrect: 'off' | 'on' ; // Indicates whether the browser's autocorrect feature is on or off.
	abstract autocomplete: string | undefined;
	abstract validationmessage: string | undefined;
	abstract debounce: string | undefined;
	abstract readonly: boolean;

	public mySymbol = 'fa-font';
	public baseName:string=  'IcaFormsInputStringBase';
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

export type IAutoCapitalize = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
export type IAutocorrect = 'off' | 'on';


