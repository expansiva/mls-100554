/// <mls shortName="icaBlocksPluginsCalendarBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaBlocksPluginsCalendarBase extends StateLitElement {

    abstract value: string | undefined;
abstract disabled: string | undefined;
abstract min: string | undefined;
abstract max: string | undefined;


}
