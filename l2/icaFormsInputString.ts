/// <mls shortName="icaFormsInputString" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement, property } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-forms-input-string-100554')
export abstract class IcaFormsInputNumber extends IcaLitElementBase {

    @property({ type: String }) label: string | undefined;

    public mySymbol = 'fa-table-columns';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
            { name: "title" },
            { name: "attr" },
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

