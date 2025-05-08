/// <mls shortName="icaNavigationContentStepperBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentStepperBase extends StateLitElement {

    abstract steps: string | undefined;
abstract currentstep: string | undefined;
abstract disabled: string | undefined;


}
