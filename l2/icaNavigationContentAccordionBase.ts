/// <mls shortName="icaNavigationContentAccordionBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElement } from './_100554_icaLitElement';

export abstract class IcaNavigationContentAccordionBase extends IcaLitElement {

    abstract text: string | undefined;
    abstract open: boolean;

}



