/// <mls shortName="icaFormsRecordsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsRecordsBase extends StateLitElement {

    abstract config: string | undefined;
    abstract selected: string | undefined;
    abstract title: string;
    abstract subtitle: string | undefined;
    abstract line1: string | undefined;
    abstract line2: string | undefined;
    abstract bottom: string | undefined;
    abstract image: string | undefined;
    abstract icon: string | undefined;
    abstract badge: string | undefined;


}

export interface IConfig {

    table: string, 
    range: { start: number, end: number },
    recommendedWidget:string, 
    selectedField:string,
    
}
