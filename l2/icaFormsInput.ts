/// <mls shortName="icaFormsInput" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaForms } from './_100554_icaForms';

export abstract class IcaFormsInput extends IcaForms {
 
    abstract label: string; // A label to identify this field

    abstract hint: string; // An optional descriptive hint for the field

    abstract required: boolean; // Whether the field is required or optional"

    abstract disabled: boolean; // Whether the field is ready for input or disabled

    abstract readonly: boolean; // Makes the input readonly

    abstract pattern: string; // A regular expression that the input's value must match

    abstract errormessage: string; // Custom error message to display when input validation fails

    abstract autofocus: boolean; // Whether the field should be automatically focused on page load

    abstract name:string; //  The name of the input, submitted as a name/value pair with form data.

    abstract inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'; //Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual keyboard on supportive devices.

}
