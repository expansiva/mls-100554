/// <mls shortName="icaApresentationTextCodeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { StateLitElement } from './_100554_stateLitElement';

export abstract class IcaApresentationTextCodeBase extends StateLitElement {

    abstract text: string | undefined;
    abstract config: IConfig | undefined;
    
}

interface IConfig{
  language?: "ts" | "js" | "html" | "css" | "json" | "bash" | "sql" | "python" | string
}