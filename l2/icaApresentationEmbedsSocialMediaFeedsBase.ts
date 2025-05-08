/// <mls shortName="icaApresentationEmbedsSocialMediaFeedsBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationEmbedsSocialMediaFeedsBase extends StateLitElement {

    abstract url: string | undefined;
abstract refreshinterval: string | undefined;
abstract limit: string | undefined;


}
