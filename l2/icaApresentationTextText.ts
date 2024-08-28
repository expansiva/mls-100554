/// <mls shortName="icaApresentationTextText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-apresentation-text-text-100554')
export abstract class IcaFormsInputNumber extends IcaLitElementBase {

    public mySymbol = 'fa-t';

    public getActionsTags(): ActionTag[] {

        let isBlankLine = !this.getAttribute('text');
        if (isBlankLine) return [{ name: "add"},{ name: "edit", args:'{"tp":"edit", "attr":"text"}', position: 'p-m2' },{ name: "backButton"}];

        let rc: ActionTag[] = [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
            { name: "edit", args:'{"tp":"btn", "attr":"text"}' },
            { name: "title" },
        ]
        
        return rc;
        
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