/// <mls shortName="icaApresentationTextRichBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationTextRichBase extends IcaLitElementBase {

  abstract content: string | undefined;
  abstract editable?: boolean;
  
  public baseName: string = 'IcaApresentationTextRichBase';
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

