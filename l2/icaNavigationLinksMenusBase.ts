/// <mls shortName="icaNavigationLinksMenusBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationLinksMenusBase extends StateLitElement {

    abstract items: string | undefined;
abstract selecteditem: string | undefined;
abstract openstate: string | undefined;
abstract disabled: string | undefined;


}
