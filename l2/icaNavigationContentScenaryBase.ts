/// <mls shortName="icaNavigationContentScenaryBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaNavigationContentScenaryBase extends StateLitElement {

    abstract scenes: string | undefined;
abstract selectedscene: string | undefined;
abstract disabled: string | undefined;


}
