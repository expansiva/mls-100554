/// <mls shortName="icaApresentationMessageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessageBase extends StateLitElement {

    abstract config: IConfig | undefined;
    abstract state: string | undefined;


}

interface IConfig {
    recommendedWidget: "toast" | "snackbar" | "notification" | "alert" | "modal",
    duration?: number,              // in ms; optional if not transient
    closable?: boolean,
    actionText?: string,           // for snackbar-like interaction
    queue?: boolean,               // if true, messages stack or enqueue
    defaultType?: "info" | "warning" | "error" | "success" | string
}