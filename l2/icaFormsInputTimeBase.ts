/// <mls shortName="icaFormsInputTimeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsInputTimeBase extends StateLitElement {

    abstract name: string | undefined;
    abstract label: string | undefined;
    abstract hint: string | undefined;
    abstract required: string | undefined;
    abstract disabled: string | undefined;
    abstract readonly: string | undefined;
    abstract autofocus: boolean ;
    abstract value: string | undefined;
    abstract pattern: string | undefined;
    abstract errormessage: string | undefined;
    abstract placeholder: string | undefined;


}
