/// <mls shortName="icaFormsInputBooleanBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsInputBooleanBase extends StateLitElement {

    abstract name: string | undefined;
    abstract label: string | undefined;
    abstract hint: string | undefined;
    abstract required: boolean | undefined;
    abstract disabled: boolean | undefined;
    abstract readonly: boolean | undefined;
    abstract autofocus: boolean ;
    abstract checked: boolean | undefined;
    abstract errormessage: string | undefined;


}
