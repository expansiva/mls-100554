/// <mls shortName="icaNavigationLinksAnchorsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksAnchorsBase extends StateLitElement {

    abstract href: string | undefined;
abstract target: string | undefined;
abstract rel: string | undefined;
abstract disabled: string | undefined;


}
