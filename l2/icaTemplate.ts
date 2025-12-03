/// <mls shortName="icaTemplate" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from '/_100554_/l2/icaTypes.js';
import { IcaLitElementBase } from '/_100554_/l2/icaLitElementBase.js';

@customElement('ica-template-100554')
export abstract class IcaTemplate extends IcaLitElementBase {

    public mySymbol = 'fa-table-columns';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }

}