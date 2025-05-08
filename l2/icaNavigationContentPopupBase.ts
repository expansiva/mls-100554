/// <mls shortName="icaNavigationContentPopupBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentPopupBase extends StateLitElement {

    abstract open: string | undefined;
    abstract title: string;
    abstract content: string | undefined;
    abstract modal: string | undefined;


}
