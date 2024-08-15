/// <mls shortName="icaApresentationTextCodeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaApresentationTextCodeBase extends IcaLitElement {

    abstract text: string | undefined;
    abstract language: string | undefined;
	abstract languages: string[] | undefined; 
    
}
