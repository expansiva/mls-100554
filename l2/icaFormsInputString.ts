/// <mls shortName="icaFormsInputString" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaFormsInput } from './_100554_icaFormsInput';

export * from './_100554_icaFormsInput';

export abstract class IcaFormsInputString extends IcaFormsInput {

    abstract maxlength: number | undefined; // Maximum length restriction for the input" },
    abstract minlength: number | undefined; // Minimum length restriction for the input" },
    abstract placeholder: string | undefined;; // Placeholder text for the input field"
    abstract autoCapitalize: IAutoCapitalizeOptions | undefined; // Controls whether and how text input is automatically capitalized as it is entered by the user.
    abstract autocorrect: IAutoCorrectOptions | undefined; // Indicates whether the browser's autocorrect feature is on or off.
    abstract autocomplete: string | undefined;; //Specifies what permission the browser has to provide assistance in filling out form field values.
    abstract value: string;

}

export type IAutoCapitalizeOptions = 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
export type IAutoCorrectOptions = 'off' | 'on' 
