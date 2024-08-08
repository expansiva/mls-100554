/// <mls shortName="icaFormsInputSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { customElement } from 'lit/decorators.js';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaGlobal';

@customElement('ica-forms-input-select-one-100554')
export class IcaFormsInputSelectOne extends IcaLitElementBase {

	public mySymbol = 'fa-table-columns';

	public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "padding" },
            { name: "menu" },
            { name: "size" },
            { name: "events" },
        ]
    }

	public changeStateHtml(html: string): void {

	}

	public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
		if (cmd === 'move') return this.commandMove(scope, target);
		return { inside: false, before: false, after: false };
	}

	private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {
		return { inside: false, before: false, after: false };
	}


}



