/// <mls shortName="icaFormsInputColor" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaFormsInput } from './_100554_icaFormsInput';

export * from './_100554_icaFormsInput';

export abstract class IcaFormsInputColor extends IcaFormsInput {

    abstract format: IInputColorFormat; //The format to use. If opacity is enabled, these will translate to HEXA, RGBA, HSLA, and HSVA respectively. The color picker will accept user input in any format (including CSS color names) and convert it to the desired format.
  
    abstract value: string; // Represents the currently selected value in six-digit hexadecimal format (#RRGGBB) or rgba(r, g, b, a) function format.

}

export type IInputColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv'
