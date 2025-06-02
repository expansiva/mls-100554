/// <mls shortName="icaInteractionButtonBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaInteractionButtonBase extends StateLitElement {

    abstract config: string | undefined;
    abstract notifyPath: string | undefined;
    abstract notifyValue: string | undefined;

}

export interface IConfig {
    label?: string,
    icon?: string,
    type?: "onlyText" | "onlyIcon" | "full"
    disabled?: boolean,
    tooltip?: string
}