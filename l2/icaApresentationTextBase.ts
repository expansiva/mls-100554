/// <mls shortName="icaApresentationTextBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextBase extends StateLitElement {

    abstract type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "blockquote" | "span";
    abstract text: string | undefined;
    
}
