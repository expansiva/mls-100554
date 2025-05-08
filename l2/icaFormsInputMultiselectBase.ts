/// <mls shortName="icaFormsInputMultiselectBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsInputMultiselectBase extends StateLitElement {

    abstract hint: string | undefined;
abstract label: string | undefined;
abstract required: string | undefined;
abstract disabled: string | undefined;
abstract options: string | undefined;
abstract selectedvalue: string | undefined;


}
