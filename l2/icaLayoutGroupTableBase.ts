/// <mls shortName="icaLayoutGroupTableBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaLayoutGroupTableBase extends IcaLitElement {

    abstract data: any[] | undefined; 
    abstract columns: string[] | undefined; 
    abstract maxcolumn: number | undefined;
    abstract striped: boolean | undefined; 
    abstract bordered: boolean | undefined; 

}