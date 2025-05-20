/// <mls shortName="icaFormsSubmitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsSubmitBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract notify: string | undefined;


}

export interface IConfig {
    buttons: IConfigItens[]
}

export interface IConfigItens {
    label: string,
    value: string
}