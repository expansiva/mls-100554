/// <mls shortName="icaFormsInputNumber" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { IActionLevels } from './_100554_icaGlobal';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';

@customElement('ica-forms-input-number-100554')
export abstract class IcaFormsInputNumber extends IcaLitElementBase {

    public mySymbol = 'fa-table-columns';

    public actions: IActionLevels = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }

    public async setActions(level: string) {
        if (level === '4') {
            await this.importAction('_100554_wcdToolboxItemActionMove', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionGroup', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionMenu', this.actions, this.level as any);
        }
        return;
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


