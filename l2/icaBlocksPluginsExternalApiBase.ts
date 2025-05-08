/// <mls shortName="icaBlocksPluginsExternalApiBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaBlocksPluginsExternalApiBase extends StateLitElement {

    abstract endpoint: string | undefined;
abstract params: string | undefined;
abstract method: string | undefined;


}
