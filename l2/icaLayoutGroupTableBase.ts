/// <mls shortName="icaLayoutGroupTableBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaLayoutGroupTableBase extends StateLitElement {

    abstract data: any[] | undefined; 
    abstract columns: string[] | undefined; 
    abstract maxcolumn: number | undefined;
    abstract striped: boolean | undefined; 
    abstract bordered: boolean | undefined; 

}