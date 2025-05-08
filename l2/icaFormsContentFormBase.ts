/// <mls shortName="icaFormsContentFormBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {StateLitElement } from './_100554_stateLitElement';

export abstract class IcaFormsContentFormBase extends StateLitElement {
     
    abstract action: string | undefined;
	abstract method: string | undefined;
	abstract novalidate: string | undefined;
	abstract autocomplete: boolean;
	abstract disabled: boolean ;
	abstract validateonchange: boolean;
	abstract enctype: string | undefined;
	abstract name: string | undefined;
	abstract target: string| undefined;
	abstract autosave: boolean ;

}