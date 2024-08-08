/// <mls shortName="icaLayoutFlowRow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { ActionTag } from './_100554_icaGlobal';
import { IcaLitElementBase, IAllowCommand } from './_100554_icaLitElementBase';

@customElement('ica-layout-flow-row-100554')
export abstract class IcaLayoutFlowRow extends IcaLitElementBase {

    public mySymbol = 'fa-server';

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


    // ----------- IMPLEMENTATION ---------------

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        const activeInMe = this.querySelector('*[renderType="editactive"]');

        const elMychildren = document.createElement('span') as HTMLElement;
        elMychildren.innerHTML = this.internalInnerHTML;
        if (activeInMe && elMychildren.children.length <= 1) return { inside: false, before: false, after: false }
        const myScope = this.getMyScope();
        if (myScope !== scope) return { inside: false, before: false, after: false };
        const tag = target.tagName.toLocaleLowerCase();
        let inside = false;

        if (tag === 'ica-row-100554') inside = false;
        if (!this.internalInnerHTML || this.internalInnerHTML === '') inside = true;
        if (this.internalInnerHTML.indexOf('ica-column-100554') < 0) inside = true;
        if (this.internalInnerHTML.indexOf('ica-column-100554') >= 0 && tag === 'ica-column-100554') inside = true;

        const parent = this.getIcaParent(this);
        const insideFather = parent && parent.tagName.startsWith('ICA-') ? parent.allowCommand('move', scope, target) : { inside: true };
        const before = insideFather.inside;
        const after = insideFather.inside;
        return { inside, before, after }

    }

}


