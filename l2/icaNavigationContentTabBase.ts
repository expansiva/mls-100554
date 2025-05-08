/// <mls shortName="icaNavigationContentTabBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentTabBase extends StateLitElement {

    abstract tabs: string | undefined;
abstract selectedtab: string | undefined;
abstract disabled: string | undefined;


}
