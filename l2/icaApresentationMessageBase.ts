/// <mls shortName="icaApresentationMessageBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationMessageBase extends IcaLitElementBase {

    abstract config: string | undefined;
    abstract state: string | undefined;

    public baseName: string = 'IcaApresentationMessageBase';
    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }
}

export interface IConfig {
    recommendedWidget: "toast" | "snackbar" | "notification" | "alert" | "modal",
    duration?: number,              // in ms; optional if not transient
    closable?: boolean,
    actionText?: string,           // for snackbar-like interaction
    queue?: boolean,               // if true, messages stack or enqueue
    defaultType?: "info" | "warning" | "error" | "success" | string
}