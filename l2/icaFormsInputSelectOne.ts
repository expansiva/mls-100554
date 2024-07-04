/// <mls shortName="icaFormsInputSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { customElement } from 'lit/decorators.js';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';
import { IActionLevels } from './_100554_icaGlobal';

@customElement('ica-forms-input-select-one-100554')
export class IcaFormsInputSelectOne extends IcaLitElementBase {

	public mySymbol = 'fa-table-columns';

	public actions: IActionLevels = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }

	public async setActions(level: string) {
		if (level === '4') {
			await this.importAction('_100554_wcdToolboxItemActionMargin', this.actions, level);
			await this.importAction('_100554_wcdToolboxItemActionPadding', this.actions, level);
			await this.importAction('_100554_wcdToolboxItemActionMenu', this.actions, level);
		}
		if (level === '2') {
			await this.importAction('_100554_wcdToolboxItemActionEvents', this.actions, level);
		}
		return;
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



