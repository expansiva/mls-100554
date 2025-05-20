/// <mls shortName="icaApresentationTextRichBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextRichBase extends StateLitElement {

    abstract content: string | undefined;
    abstract config: IConfig | undefined;


}

interface IConfig{
  editable?: boolean
}