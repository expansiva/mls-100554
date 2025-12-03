/// <mls shortName="icaApresentationTextCodeBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';
import { ActionTag } from '/_100554_/l2/icaTypes.js';

export abstract class IcaApresentationTextCodeBase extends IcaLitElementBase {

  abstract text: string | undefined;
  abstract language?: "ts" | "js" | "html" | "css" | "json" | "bash" | "sql" | "python" | string;

  public baseName: string = 'IcaApresentationTextCodeBase';
  public getActionsTags(): ActionTag[] {
    return [
      { name: "margin" },
      { name: "menu" },
      { name: "size" },
      { name: "edit-code" },
      { name: "title" },
      { name: "code-language" },
    ]
  }

  public setDefaultAttributes() {
    this.setAttribute('text', `const example = '123';`);
  }

}

