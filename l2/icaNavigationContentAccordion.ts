/// <mls shortName="icaNavigationContentAccordion" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement, property } from 'lit/decorators.js';
import { ActionTag, IAllowCommand } from './_100554_icaTypes';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { IcaNavigationContentAccordionBase } from './_100554_icaNavigationContentAccordionBase';

@customElement('ica-navigation-content-accordion-100554')
export abstract class IcaNavigationContentAccordion extends IcaLitElementBase implements IcaNavigationContentAccordionBase {

    public mySymbol = 'fa-bars';

    public getActionsTags(): ActionTag[] {
        return [
            { name: "margin" },
            { name: "menu" },
            { name: "size" },
            { name: "title" },
        ]
    }

    public changeStateHtml(html: string): void {

    }

    public allowCommand(cmd: string, scope: HTMLElement, target: HTMLElement): IAllowCommand {
        if (cmd === 'move') return this.commandMove(scope, target);
        return { inside: false, before: false, after: false };
    }

    private commandMove(scope: HTMLElement, target: HTMLElement): IAllowCommand {

        return { inside: false, before: false, after: false }

    }

}