/// <mls shortName="icaLayoutFlowDivider" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-layout-flow-divider-100554')
export abstract class IcaLayoutFlowDivider extends IcaLitElementBase {

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

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        if (cmd === 'move') return this.commandMove(scope, target);
        return { inside: false, before: false, after: false };
    }


    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        return { inside: false, before: false, after: false }

    }

}
