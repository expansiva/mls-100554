/// <mls shortName="icaApresentationMessagesAlertBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessagesAlertBase extends StateLitElement {

    abstract message: string | undefined;
abstract type: string | undefined;
abstract closable: string | undefined;


}
