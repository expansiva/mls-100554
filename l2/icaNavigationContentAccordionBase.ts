/// <mls shortName="icaNavigationContentAccordionBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentAccordionBase extends StateLitElement {

    abstract text: string | undefined;
    abstract open: boolean;

}



