/// <mls shortName="icaApresentationMessagesModalBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessagesModalBase extends StateLitElement {

    abstract title: string;
    abstract content: string | undefined;
    abstract open: string | undefined;
    abstract closable: string | undefined;


}
