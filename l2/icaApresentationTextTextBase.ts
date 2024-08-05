/// <mls shortName="icaApresentationTextTextBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaApresentationTextTextBase extends IcaLitElement {

    abstract text: string | undefined; // An optional descriptive hint for the field
	abstract type: string | undefined; // A label to identify this field

}



