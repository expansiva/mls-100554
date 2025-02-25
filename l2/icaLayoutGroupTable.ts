/// <mls shortName="icaLayoutGroupTable" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement, property } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';

@customElement('ica-layout-group-table-100554')
export abstract class IcaLayoutGroupTable extends IcaLitElementBase {

    @property({ type: String }) type: string | undefined;

    public mySymbol = 'fa-t';

    public getActionsTags(): ActionTag[] {

        let rc: ActionTag[] = [
            { name: "margin" },
            { name: "padding" },
            { name: "menu"},
            { name: "size" },
            { name: "title" },
            
        ]
        return rc;

    }

    public setDefaultAttributes() {
		
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