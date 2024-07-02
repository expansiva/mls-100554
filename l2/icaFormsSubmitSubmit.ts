/// <mls shortName="icaFormsSubmitSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { IActionLevels } from './_100554_icaGlobal';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';

@customElement('ica-forms-submit-submit-100554')
export abstract class IcaFormsSubmitSubmit extends IcaLitElementBase {

    public mySymbol = 'fa-server';

    public actions: IActionLevels = { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [] }

    public async setActions(level: string) {
        if (level === '4') {
            await this.importAction('_100554_wcdToolboxItemActionMargin', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionPadding', this.actions, this.level as any);
            await this.importAction('_100554_wcdToolboxItemActionMenu', this.actions, this.level as any);
        }
        if (level === '2') {
            await this.importAction('_100554_wcdToolboxItemActionEvents', this.actions, this.level as any);
        }
        return;
    }

    public changeStateHtml(html: string): void {

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


