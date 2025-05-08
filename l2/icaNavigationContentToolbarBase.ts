/// <mls shortName="icaNavigationContentToolbarBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentToolbarBase extends StateLitElement {

    abstract items: string | undefined;
abstract orientation: string | undefined;
abstract disabled: string | undefined;


}
