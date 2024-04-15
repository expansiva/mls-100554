/// <mls shortName="icaFormsInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { IcaFormsInput } from './_100554_icaFormsInput';

export * from './_100554_icaFormsInput';

export abstract class IcaFormsInputNumber extends IcaFormsInput {
    
    abstract maxvalue: number | undefined; // Maximum value restriction for the input" },
    abstract minvalue: number | undefined; // Minimum value restriction for the input" },
    abstract step: number | undefined; // The step increment between values"
    abstract value: number;

}
