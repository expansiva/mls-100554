/// <mls shortName="icaFormsInputDataRange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaFormsInput } from './_100554_icaFormsInput';

export abstract class IcaFormsInputDateRange extends IcaFormsInput {

    abstract maxvalue: number | undefined; // Maximum value restriction for the input" },
    abstract minvalue: number | undefined; // Minimum value restriction for the input" },
    abstract separatorText: string; // A using betwwen two dates
    abstract valueInitial: string;
    abstract valueFinal: string;

}
