/// <mls shortName="icaFormsSubmitSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-forms-submit-submit-100554')
export abstract class IcaFormsSubmitSubmit extends IcaLitElementBase {

    public mySymbol = 'fa-server';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
            { name: "title" },
        ]
    }

    public setDefaultAttributes() {
        this.setAttribute('text', `button`);
    }

    public changeStateHtml(html: string): void {
        console.info(html);
    }

    public changeStateStyle(style: string) :void {
        console.info(style);
    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        if (cmd === 'move') return this.commandMove(scope, target);
        return { inside: false, before: false, after: false };
    }


    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {
        return { inside: false, before: false, after: false };
    }

}


