/// <mls shortName="icaApresentationMessagesSnackbarBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationMessagesSnackbarBase extends StateLitElement {

    abstract message: string | undefined;
abstract actiontext: string | undefined;
abstract duration: string | undefined;


}
