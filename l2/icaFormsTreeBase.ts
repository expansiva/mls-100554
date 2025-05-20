/// <mls shortName="icaFormsTreeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsTreeBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract selectedvalues: string | undefined;
    abstract selectedkeys: string | undefined;


}

interface IConfig {
    table: string,
    columns: { key: string, value: string, icon: string },
    multiexpand: boolean,
    multiselect: boolean,
    cascadeSelect: boolean
}