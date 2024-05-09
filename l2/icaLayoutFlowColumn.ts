/// <mls shortName="icaLayoutFlowColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';
import { IActionLevels } from './_100554_icaGlobal';

@customElement('ica-layout-flow-column-100554')
export class IcaLayoutFlowColumn extends IcaLitElementBase {

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
        if (cmd === 'move') return this.commandMove(scope, target);
        return { inside: false, before: false, after: false };
    }

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        const activeInMe = this.querySelector('*[renderType="editactive"]');
        if (activeInMe && this.children.length <= 1) return { inside: false, before: false, after: false }
        const myScope = this.getMyScope();
        if (myScope !== scope) return { inside: false, before: false, after: false };
        const tag = target.tagName.toLocaleLowerCase();
        let inside = tag !== 'ica-row-100554' && tag !== 'ica-column-100554';
        if (activeInMe && this.children.length <= 1) inside = false;
        const parent = this.getIcaParent(this);
        const insideFather = parent && parent.tagName.startsWith('ICA-') ? parent.allowCommand('move', scope, target) : { inside: true };
        const before = insideFather.inside;
        const after = insideFather.inside;
        return { inside, before, after }

    }


}

