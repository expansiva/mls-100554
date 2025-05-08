/// <mls shortName="icaApresentationTextBannerBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextBannerBase extends StateLitElement {

    abstract text: string | undefined;
abstract src: string | undefined;
abstract alt: string | undefined;


}
