/// <mls shortName="icaApresentationTextTextBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextTextBase extends StateLitElement {

    abstract text: string | undefined; // An optional descriptive hint for the field
	abstract type: string | undefined; // A label to identify this field

}



