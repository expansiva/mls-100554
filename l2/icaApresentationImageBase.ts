/// <mls shortName="icaApresentationImageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationImageBase extends StateLitElement {

    abstract config: IConfig | undefined;


}

interface IConfig {
    type: "image" | "icon" | "avatar",
    src?: string,         // for image or avatar
    icon?: string,        // for icon
    alt?: string,
    width?: string,
    height?: string,
    size?: string,        // icon or avatar
    color?: string,       // icon only
    shape?: "circle" | "square" // avatar only
}