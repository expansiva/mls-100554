/// <mls shortName="icaApresentationMessagesNotificationBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessagesNotificationBase extends StateLitElement {

    abstract message: string | undefined;
abstract type: string | undefined;
abstract duration: string | undefined;
abstract closable: string | undefined;


}
