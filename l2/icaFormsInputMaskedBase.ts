/// <mls shortName="icaFormsInputMaskedBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsInputMaskedBase extends StateLitElement {

    abstract label: string | undefined;
abstract placeholder: string | undefined;
abstract hint: string | undefined;
abstract name: string | undefined;
abstract value: string | undefined;
abstract mask: string | undefined;
abstract required: string | undefined;
abstract disabled: string | undefined;
abstract readonly: string | undefined;
abstract autocomplete: string | undefined;


}
