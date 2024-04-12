/// <mls shortName="icaFormsInputString" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {  IcaFormsInput } from './_100554_icaFormsInput';

export abstract class IcaFormsInputString extends IcaFormsInput {

    abstract maxlength: number | undefined; // Maximum length restriction for the input" },
    abstract minlength: number | undefined; // Minimum length restriction for the input" },
    abstract placeholder: string; // Placeholder text for the input field"
    abstract autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' // Controls whether and how text input is automatically capitalized as it is entered by the user.
    abstract autocorrect: 'off' | 'on'; // Indicates whether the browser's autocorrect feature is on or off.
    abstract autocomplete: string; //Specifies what permission the browser has to provide assistance in filling out form field values.
    abstract value: string;
    
}
