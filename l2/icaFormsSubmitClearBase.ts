/// <mls shortName="icaFormsSubmitClearBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsSubmitClearBase extends StateLitElement {

    abstract name: string | undefined;
    abstract title: string;
    abstract icon: string | undefined;
    abstract text: string | undefined;
    abstract disabled: string | undefined;
    abstract form: string | undefined;


}
