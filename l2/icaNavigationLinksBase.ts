/// <mls shortName="icaNavigationLinksBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksBase extends StateLitElement {

    abstract config: any | undefined;
    abstract selected: string | undefined;


}
