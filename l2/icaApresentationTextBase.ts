/// <mls shortName="icaApresentationTextBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract text: string | undefined;


}


export interface IConfig {
    type: "text" | "quote" | "banner",
    multiline?: boolean,
    // quote-specific
    cite?: string,
    citeHref?: string,
    // banner-specific
    src?: string,
    alt?: string,
    href?: string, // optional link on click
    target?: "_blank" | "_self"
}